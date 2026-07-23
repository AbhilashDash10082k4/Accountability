import React, { useRef, useEffect } from "react";
import { View, Pressable, PanResponder, GestureResponderEvent, Keyboard } from "react-native";
import { DayColumnProps } from "@/lib/interfaces";
import DraggableEvent from "./DraggableEvent";

/** DayColumn — 24-hour event grid.
 * - Single TAP on hour row → creates 2-hour draft block (opens popup immediately)
 * - LONG-PRESS + bidirectional pan → drag to define custom size, opens popup on release
 * - Draft top/bottom handle → resize start/end
 * - Draft body → move entire block
 * - DraggableEvent → move saved tasks */
export default function DayColumn({
  selectedDate,
  tasks,
  hourHeight,
  scrollEnabled,
  setScrollEnabled,
  onDraftCreate,
  draftStart,
  draftEnd,
  onDraftMove,
  onDragToggle,
  onEventMove,
}: DayColumnProps) {
  const hours = Array.from({ length: 24 }, (_, i) => i);

  // ─── Draft refs (kept in sync with state for use inside PanResponder) ─────
  const draftStartRef = useRef(draftStart);
  const draftEndRef = useRef(draftEnd);
  const dragStartRef = useRef(0);
  const dragTimeRef = useRef(0);

  useEffect(() => {
    draftStartRef.current = draftStart;
    draftEndRef.current = draftEnd;
  }, [draftStart, draftEnd]);

  // ─── Long-press bidirectional drag ────────────────────────────────────────
  const anchorHourRef = useRef(0);
  const isCreatingRef = useRef(false);

  const gridPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      // Only claim movement after long-press has activated isCreatingRef
      onMoveShouldSetPanResponder: () => isCreatingRef.current,
      onPanResponderMove: (_evt, gs) => {
        if (!isCreatingRef.current) return;
        const delta = gs.dy / hourHeight;
        const anchor = anchorHourRef.current;

        let newStart: number;
        let newEnd: number;

        if (gs.dy >= 0) {
          // Drag DOWN → start = anchor, extend end downward
          newEnd = Math.min(24, Math.round((anchor + Math.max(0.25, delta)) * 4) / 4);
          newStart = anchor;
        } else {
          // Drag UP → end = anchor+min, extend start upward
          newStart = Math.max(0, Math.round((anchor + Math.min(-0.25, delta)) * 4) / 4);
          newEnd = Math.max(newStart + 0.25, anchor);
        }

        onDraftMove(newStart, newEnd);
      },
      onPanResponderRelease: () => {
        if (!isCreatingRef.current) return;
        isCreatingRef.current = false;
        setScrollEnabled(true);
        onDragToggle(false);
      },
      onPanResponderTerminate: () => {
        isCreatingRef.current = false;
        setScrollEnabled(true);
        onDragToggle(false);
      },
    }),
  ).current;

  /** Long-press fires → activates drag-creation mode */
  const handleGridLongPress = (evt: GestureResponderEvent) => {
    Keyboard.dismiss();
    const y = evt.nativeEvent.locationY;
    const hour = Math.max(0, Math.min(23, Math.floor(y / hourHeight)));
    anchorHourRef.current = hour;
    isCreatingRef.current = true;
    setScrollEnabled(false);
    onDragToggle(true);
    // Show 1-hour draft immediately so user sees feedback
    onDraftMove(hour, Math.min(24, hour + 1));
  };

  /** Single tap on hour row → instant 2-hour draft (wait for resize or tap to open popup) */
  const handleHourTap = (hour: number) => {
    Keyboard.dismiss();
    if (isCreatingRef.current) return; // ignore if drag in progress
    const start = hour;
    const end = Math.min(24, hour + 2);
    onDraftMove(start, end);
  };

  // ─── Draft RESIZE — top handle (move start) ───────────────────────────────
  const topPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        Keyboard.dismiss();
        setScrollEnabled(false);
        onDragToggle(true);
        dragStartRef.current = draftStartRef.current ?? 0;
      },
      onPanResponderMove: (_evt, gs) => {
        const delta = gs.dy / hourHeight;
        const currentEnd = draftEndRef.current ?? 2;
        let newStart = Math.max(0, Math.min(currentEnd - 0.25, dragStartRef.current + delta));
        newStart = Math.round(newStart * 4) / 4;
        onDraftMove(newStart, currentEnd);
      },
      onPanResponderRelease: () => {
        setScrollEnabled(true);
        onDragToggle(false);
      },
    }),
  ).current;

  // ─── Draft RESIZE — bottom handle (move end) ──────────────────────────────
  const bottomPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        Keyboard.dismiss();
        setScrollEnabled(false);
        onDragToggle(true);
        dragStartRef.current = draftEndRef.current ?? 2;
      },
      onPanResponderMove: (_evt, gs) => {
        const delta = gs.dy / hourHeight;
        const currentStart = draftStartRef.current ?? 0;
        let newEnd = Math.max(currentStart + 0.25, Math.min(24, dragStartRef.current + delta));
        newEnd = Math.round(newEnd * 4) / 4;
        onDraftMove(currentStart, newEnd);
      },
      onPanResponderRelease: () => {
        setScrollEnabled(true);
        onDragToggle(false);
      },
    }),
  ).current;

  // ─── Draft MOVE — body drag ───────────────────────────────────────────────
  const bodyPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        Keyboard.dismiss();
        setScrollEnabled(false);
        onDragToggle(true);
        dragStartRef.current = draftStartRef.current ?? 0;
        dragTimeRef.current = (draftEndRef.current ?? 2) - (draftStartRef.current ?? 0);
      },
      onPanResponderMove: (_evt, gs) => {
        const delta = gs.dy / hourHeight;
        const duration = dragTimeRef.current;
        let newStart = Math.max(0, Math.min(24 - duration, dragStartRef.current + delta));
        newStart = Math.round(newStart * 4) / 4;
        onDraftMove(newStart, newStart + duration);
      },
      onPanResponderRelease: (_evt, gs) => {
        setScrollEnabled(true);
        onDragToggle(false);
        const isTap = Math.abs(gs.dx) < 5 && Math.abs(gs.dy) < 5;
        if (isTap && draftStartRef.current !== null && draftEndRef.current !== null) {
          onDraftCreate(draftStartRef.current, draftEndRef.current);
        }
      },
    }),
  ).current;

  // ─── "Now" line position ──────────────────────────────────────────────────
  const now = new Date();
  const isToday =
    selectedDate.getDate() === now.getDate() &&
    selectedDate.getMonth() === now.getMonth() &&
    selectedDate.getFullYear() === now.getFullYear();
  const nowTop = (now.getHours() + now.getMinutes() / 60) * hourHeight;

  return (
    <Pressable
      style={{ height: 24 * hourHeight }}
      className="relative"
      {...gridPanResponder.panHandlers}
      onLongPress={handleGridLongPress}
      delayLongPress={400}
      android_ripple={null}
    >
      {/* Hour row grid lines — each row is tappable */}
      {hours.map((h) => (
        <Pressable
          key={h}
          onPress={() => handleHourTap(h)}
          style={{ height: hourHeight }}
          className="border-b border-white/5"
          android_ripple={{ color: "rgba(68,226,205,0.06)" }}
        />
      ))}

      {/* Events + Draft overlay */}
      <View
        className="absolute inset-0"
        pointerEvents="box-none"
      >
        {/* Saved task events */}
        {tasks.map((evt) => (
          <DraggableEvent
            key={evt.id}
            event={evt}
            hourHeight={hourHeight}
            onDragToggle={(dragging) => {
              setScrollEnabled(!dragging);
              onDragToggle(dragging);
            }}
            onDragEnd={onEventMove}
          />
        ))}

        {/* Draft creation block */}
        {draftStart !== null && draftEnd !== null && (
          <>
            {/* Body — drag to move */}
            <View
              {...bodyPanResponder.panHandlers}
              style={{
                top: draftStart * hourHeight,
                height: Math.max((draftEnd - draftStart) * hourHeight, 20),
              }}
              className="absolute left-1 right-1 border-2 border-[#44e2cd] rounded-xl bg-[#44e2cd]/10 z-50"
            />
            {/* Top resize handle */}
            <View
              {...topPanResponder.panHandlers}
              style={{
                top: draftStart * hourHeight - 22,
              }}
              className="absolute left-[-5px] w-11 h-11 items-center justify-center z-[60]"
            >
              <View className="w-[18px] h-[18px] rounded-full bg-[#44e2cd] border-2 border-white" />
            </View>
            {/* Bottom resize handle */}
            <View
              {...bottomPanResponder.panHandlers}
              style={{
                top: draftEnd * hourHeight - 22,
              }}
              className="absolute right-[-5px] w-11 h-11 items-center justify-center z-[60]"
            >
              <View className="w-[18px] h-[18px] rounded-full bg-[#44e2cd] border-2 border-white" />
            </View>
          </>
        )}

        {/* Current time indicator */}
        {isToday && (
          <View
            style={{
              top: nowTop,
            }}
            className="absolute left-0 right-0 flex-row items-center z-30 pointer-events-none"
          >
            <View className="w-2.5 h-2.5 rounded-full bg-[#44e2cd] -ml-[5px]" />
            <View className="h-[1.5px] flex-1 bg-[#44e2cd] opacity-70" />
          </View>
        )}
      </View>
    </Pressable>
  );
}
