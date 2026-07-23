import React, { memo, useRef, useState, useEffect } from "react";
import { Animated, PanResponder, Text, View } from "react-native";
import { DraggableEventProps } from "@/lib/interfaces";
import { hourFloatToTimeStr } from "../utils/date-utils";

/** Renders a saved task as a draggable colored block in the day view */
function DraggableEvent({
  event,
  hourHeight,
  onDragEnd,
  onDragToggle,
}: DraggableEventProps) {
  const initialTop = event.startTime * hourHeight;
  const duration = event.endTime - event.startTime;
  const cardHeight = Math.max(duration * hourHeight - 4, 20);

  const panY = useRef(new Animated.Value(initialTop)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const [isDragging, setIsDragging] = useState(false);

  // Sync when event changes externally
  useEffect(() => {
    if (!isDragging) {
      Animated.spring(panY, {
        toValue: initialTop,
        useNativeDriver: false,
      }).start();
    }
  }, [event.startTime, initialTop, isDragging]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        setIsDragging(true);
        onDragToggle(true);
        Animated.timing(scale, {
          toValue: 1.03,
          duration: 150,
          useNativeDriver: false,
        }).start();
        panY.setOffset((panY as any)._value);
        panY.setValue(0);
      },
      onPanResponderMove: (_evt, gestureState) => {
        panY.setValue(gestureState.dy);
      },
      onPanResponderRelease: () => {
        setIsDragging(false);
        onDragToggle(false);
        panY.flattenOffset();

        const finalTop = (panY as any)._value;
        const rawHour = finalTop / hourHeight;
        // Snap to 15-min increments
        const snappedStart = Math.max(
          0,
          Math.min(24 - duration, Math.round(rawHour * 4) / 4),
        );
        const snappedTop = snappedStart * hourHeight;

        Animated.parallel([
          Animated.spring(panY, {
            toValue: snappedTop,
            useNativeDriver: false,
          }),
          Animated.timing(scale, {
            toValue: 1.0,
            duration: 150,
            useNativeDriver: false,
          }),
        ]).start(() => {
          onDragEnd(event.id, snappedStart, snappedStart + duration);
        });
      },
    }),
  ).current;

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={{
        position: "absolute",
        top: panY,
        left: 4,
        right: 4,
        height: cardHeight,
        transform: [{ scale }],
        zIndex: isDragging ? 999 : 10,
        backgroundColor: event.color + "30", // 30 = ~19% opacity
        borderLeftColor: event.color,
        borderLeftWidth: 3,
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 4,
        justifyContent: "center",
      }}
    >
      <Text
        className="text-xs font-bold text-on-surface font-inter"
        numberOfLines={1}
      >
        {event.title}
      </Text>
      {duration >= 1 && event.description ? (
        <Text
          className="text-[10px] text-on-surface-variant font-geist mt-0.5"
          numberOfLines={1}
        >
          {event.description}
        </Text>
      ) : null}
      <Text className="text-[9px] text-on-surface-variant/60 font-geist mt-0.5">
        {hourFloatToTimeStr(event.startTime)} –{" "}
        {hourFloatToTimeStr(event.endTime)}
      </Text>
    </Animated.View>
  );
}

export default memo(DraggableEvent);
