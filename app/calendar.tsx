import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  ActivityIndicator,
  Animated,
} from "react-native";
import { Image } from "expo-image";
import { BlurView } from "expo-blur";
import { Stack, useRouter } from "expo-router";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import * as Calendar from "expo-calendar";
import "../global.css";

interface TimelineEvent {
  id: string;
  title: string;
  time: string;
  duration?: string;
  description?: string;
  type: "habit" | "deadline" | "deep-work" | "completed" | "device";
  location?: string;
  iconName?: string;
}

export default function CalendarScreen() {
  const router = useRouter();
  const [isWeekly, setIsWeekly] = useState(true);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [deviceEvents, setDeviceEvents] = useState<TimelineEvent[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(false);

  // Mock initial events from Stitch Design
  const mockEvents: TimelineEvent[] = [
    {
      id: "mock-1",
      title: "Morning Meditation",
      time: "08:00",
      duration: "Daily habit • 20 mins",
      type: "habit",
      iconName: "meditation",
    },
    {
      id: "mock-2",
      title: "Complete Q4 Strategy",
      time: "10:00",
      description: "High priority project for the board review.",
      type: "deadline",
      location: "Strategic Planning Room",
    },
    {
      id: "mock-3",
      title: "Deep Work Session",
      time: "12:00",
      description: "Focus: Core Product UI Refinement",
      type: "deep-work",
      iconName: "shield-star",
    },
    {
      id: "mock-4",
      title: "Standup Meeting",
      time: "14:00",
      type: "completed",
      iconName: "check-circle",
    },
  ];

  useEffect(() => {
    (async () => {
      setLoadingEvents(true);
      try {
        const { status } = await Calendar.requestCalendarPermissionsAsync();
        setHasPermission(status === "granted");

        if (status === "granted") {
          const calendars = await Calendar.getCalendarsAsync(
            Calendar.EntityTypes.EVENT,
          );
          const calendarIds = calendars.map((cal) => cal.id);

          if (calendarIds.length > 0) {
            const start = new Date();
            start.setHours(0, 0, 0, 0);
            const end = new Date();
            end.setHours(23, 59, 59, 999);

            const events = await Calendar.getEventsAsync(
              calendarIds,
              start,
              end,
            );

            const mappedEvents: TimelineEvent[] = events.map((evt) => {
              const startDate = new Date(evt.startDate);
              const hours = String(startDate.getHours()).padStart(2, "0");
              const minutes = String(startDate.getMinutes()).padStart(2, "0");
              return {
                id: evt.id,
                title: evt.title,
                time: `${hours}:${minutes}`,
                description: evt.notes || "Device calendar event",
                location: evt.location,
                type: "device",
                iconName: "calendar-clock",
              };
            });

            setDeviceEvents(mappedEvents);
          }
        }
      } catch (err) {
        console.warn("Failed to read expo-calendar:", err);
      } finally {
        setLoadingEvents(false);
      }
    })();
  }, []);

  // Combine device calendar events with mock ones, sorting by time
  const allEvents = [...deviceEvents, ...mockEvents].sort((a, b) => {
    return a.time.localeCompare(b.time);
  });

  return (
    <View className="flex-1 bg-background text-on-surface">
      <Stack.Screen options={{ headerShown: false }} />

      {/* Top App Bar Header */}
      <View className="absolute top-0 z-50 w-full flex-row justify-between items-center px-6 h-16 border-b border-white/5 bg-surface/40">
        <BlurView tint="dark" intensity={50} className="absolute inset-0" />

        <View className="flex-row items-center gap-4 relative z-10">
          <Pressable className="p-1 active:opacity-75">
            <MaterialCommunityIcons name="menu" size={24} color="#c6c6cc" />
          </Pressable>
          <Text className="text-xl font-bold tracking-tight text-on-surface font-inter">
            Accountable
          </Text>
        </View>

        <View className="flex-row items-center gap-4 relative z-10">
          <Pressable className="p-1 active:opacity-75">
            <Ionicons name="search" size={20} color="#c6c6cb" />
          </Pressable>
          <View className="w-8 h-8 rounded-full overflow-hidden border border-white/10">
            <Image
              source="https://lh3.googleusercontent.com/aida-public/AB6AXuBdWKn5hE1zD5bhpjluWa6WQGip9mFfnFNG41vkYbNdrHMDRWi45hRf4VHdQccGR6rlepm2U6D8-RDLmkowBFkw6KbmjDeSQcSp714xGlDjdw_evVQxSbJvmcOQxcZn4iAbDhNLievGkmjex3b_qPOkpy-2mRLEcJ9Xgpxxv0B_s0rDKd3o1s1PN8k1roLxKiGqgY4JWvf9hVBVZRKh1v0PpHMyTO8kkEnTAudlWygGmXoTs0q_VPng0frUol3FOGQ-ThmNcdcfneC_"
              className="w-full h-full"
              contentFit="cover"
            />
          </View>
        </View>
      </View>

      {/* Main Timeline Scroll */}
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerClassName="pt-20 pb-[100px] px-5"
        showsVerticalScrollIndicator={false}
        className="flex-grow w-full z-10"
      >
        {/* Header Title & Weekly/Monthly Toggle */}
        <View className="mb-6 flex-row justify-between items-end">
          <View>
            <Text className="text-2xl font-bold text-on-surface font-inter">
              September 2024
            </Text>
            <Text className="text-sm text-on-surface-variant font-inter mt-0.5">
              You have {allEvents.length} focus blocks today
            </Text>
          </View>

          {/* Weekly/Monthly Toggle */}
          <View className="flex-row p-1 rounded-full bg-white/5 border border-white/10">
            <Pressable
              onPress={() => setIsWeekly(true)}
              className={`px-4 py-1.5 rounded-full ${
                isWeekly ? "bg-secondary-container" : ""
              }`}
            >
              <Text
                className={`text-xs font-semibold font-geist ${
                  isWeekly
                    ? "text-on-secondary-container"
                    : "text-on-surface-variant"
                }`}
              >
                Weekly
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setIsWeekly(false)}
              className={`px-4 py-1.5 rounded-full ${
                !isWeekly ? "bg-secondary-container" : ""
              }`}
            >
              <Text
                className={`text-xs font-semibold font-geist ${
                  !isWeekly
                    ? "text-on-secondary-container"
                    : "text-on-surface-variant"
                }`}
              >
                Monthly
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Horizontal Calendar Week strip */}
        {isWeekly && (
          <View className="flex-row justify-between gap-1.5 mb-8">
            {/* Mon */}
            <View className="flex-grow items-center py-3 rounded-2xl bg-white/5 opacity-50">
              <Text className="text-[11px] font-semibold text-on-surface-variant font-geist">
                MON
              </Text>
              <Text className="text-lg font-medium text-on-surface font-inter mt-1">
                09
              </Text>
            </View>

            {/* Active Tue */}
            <View className="flex-grow items-center py-3 rounded-2xl bg-secondary shadow shadow-secondary">
              <Text className="text-[11px] font-semibold text-on-secondary-fixed font-geist opacity-80">
                TUE
              </Text>
              <Text className="text-lg font-bold text-on-secondary-fixed font-inter mt-1">
                10
              </Text>
              <View className="w-1.5 h-1.5 bg-on-secondary-fixed rounded-full mt-1.5" />
            </View>

            {/* Wed */}
            <View className="flex-grow items-center py-3 rounded-2xl bg-white/5">
              <Text className="text-[11px] font-semibold text-on-surface-variant font-geist">
                WED
              </Text>
              <Text className="text-lg font-medium text-on-surface font-inter mt-1">
                11
              </Text>
            </View>

            {/* Thu */}
            <View className="flex-grow items-center py-3 rounded-2xl bg-white/5">
              <Text className="text-[11px] font-semibold text-on-surface-variant font-geist">
                THU
              </Text>
              <Text className="text-lg font-medium text-on-surface font-inter mt-1">
                12
              </Text>
            </View>

            {/* Fri */}
            <View className="flex-grow items-center py-3 rounded-2xl bg-white/5">
              <Text className="text-[11px] font-semibold text-on-surface-variant font-geist">
                FRI
              </Text>
              <Text className="text-lg font-medium text-on-surface font-inter mt-1">
                13
              </Text>
            </View>

            {/* Sat */}
            <View className="flex-grow items-center py-3 rounded-2xl bg-white/5">
              <Text className="text-[11px] font-semibold text-on-surface-variant font-geist">
                SAT
              </Text>
              <Text className="text-lg font-medium text-on-surface font-inter mt-1">
                14
              </Text>
            </View>
          </View>
        )}

        {/* Timeline Event list */}
        <View className="relative">
          {/* Vertical Timeline center line */}
          <View className="absolute top-0 bottom-0 w-[1px] bg-white/10 left-[52px]" />

          {loadingEvents ? (
            <ActivityIndicator size="small" color="#44e2cd" className="py-8" />
          ) : (
            allEvents.map((evt, idx) => {
              const isNowIndicatorVisible = idx === 2; // Inject Now line before deep work

              return (
                <View key={evt.id}>
                  {/* Inject Now Line at 11:15 */}
                  {isNowIndicatorVisible && (
                    <View className="flex-row items-center gap-4 mb-6 relative">
                      <View className="w-10 items-end">
                        <Text className="text-xs font-bold text-secondary font-geist">
                          11:15
                        </Text>
                      </View>

                      {/* Pulse Circle indicator */}
                      <View className="flex-1 flex-row items-center relative h-6">
                        <View className="absolute w-[11px] h-[11px] bg-secondary rounded-full -left-[6px] shadow shadow-secondary" />
                        <View className="h-[2px] w-full bg-secondary shadow shadow-secondary" />
                      </View>
                    </View>
                  )}

                  {/* Standard Timeline Slot */}
                  <View className="flex-row gap-4 mb-6 relative">
                    {/* Left Time label */}
                    <View className="w-10 items-end justify-start pt-1">
                      <Text
                        className={`text-xs font-semibold font-geist ${
                          evt.type === "deadline"
                            ? "text-on-surface font-bold"
                            : "text-on-surface-variant/60"
                        }`}
                      >
                        {evt.time}
                      </Text>
                    </View>

                    {/* Timeline card contents */}
                    <View className="flex-grow">
                      <Pressable
                        className={`rounded-2xl p-4 overflow-hidden border border-white/10 bg-white/5 ${
                          evt.type === "completed" ? "opacity-40 grayscale" : ""
                        } ${
                          evt.type === "habit"
                            ? "border-l-4 border-l-secondary"
                            : evt.type === "deep-work"
                              ? "border-l-4 border-l-tertiary"
                              : evt.type === "device"
                                ? "border-l-4 border-l-primary"
                                : ""
                        }`}
                      >
                        <View className="flex-row justify-between items-start mb-1">
                          <Text
                            className={`text-[17px] font-semibold text-on-surface font-inter ${
                              evt.type === "completed" ? "line-through" : ""
                            } ${
                              evt.type === "deadline"
                                ? "text-secondary font-bold"
                                : ""
                            }`}
                          >
                            {evt.title}
                          </Text>

                          {evt.iconName && (
                            <MaterialCommunityIcons
                              name={evt.iconName as any}
                              size={18}
                              color={
                                evt.type === "habit"
                                  ? "#44e2cd"
                                  : evt.type === "completed"
                                    ? "#c6c6cb"
                                    : "#bdc2ff"
                              }
                            />
                          )}

                          {evt.type === "deadline" && (
                            <View className="px-2 py-0.5 rounded border bg-secondary/10 border-secondary/20">
                              <Text className="text-[10px] font-bold text-secondary font-geist">
                                DEADLINE
                              </Text>
                            </View>
                          )}
                        </View>

                        {evt.duration && (
                          <Text className="text-xs text-on-surface-variant/80 font-inter">
                            {evt.duration}
                          </Text>
                        )}

                        {evt.description && (
                          <Text className="text-xs text-on-surface-variant/80 font-inter mt-1">
                            {evt.description}
                          </Text>
                        )}

                        {evt.location && (
                          <View className="flex-row items-center gap-1 mt-3">
                            <Ionicons
                              name="location-outline"
                              size={12}
                              color="#c6c6cb"
                            />
                            <Text className="text-xs text-on-surface-variant font-geist">
                              {evt.location}
                            </Text>
                          </View>
                        )}
                      </Pressable>
                    </View>
                  </View>
                </View>
              );
            })
          )}
        </View>
      </ScrollView>

      {/* Floating Add Action Button */}
      <Pressable className="fixed bottom-24 right-6 w-14 h-14 bg-secondary-container rounded-2xl shadow-2xl items-center justify-center z-40 active:scale-95 shadow-black/40">
        <Ionicons name="add" size={32} color="#00201c" />
      </Pressable>

      {/* Bottom Navigation Bar */}
      <View className="absolute bottom-0 left-0 w-full z-50 rounded-t-xl border-t h-20 px-4 flex-row justify-around items-center bg-background/60 border-t-white/10">
        <BlurView tint="dark" intensity={100} className="absolute inset-0" />

        <Pressable
          onPress={() => router.push("/")}
          className="items-center justify-center w-16 h-12 active:opacity-75"
        >
          <MaterialCommunityIcons
            name="home-outline"
            size={24}
            color="rgba(255, 255, 255, 0.4)"
          />
          <Text className="text-[10px] font-semibold text-on-surface-variant/40 mt-1 font-geist">
            Home
          </Text>
        </Pressable>

        <Pressable
          onPress={() => router.push("/calendar")}
          className="items-center justify-center w-16 h-12 active:opacity-75"
        >
          <MaterialCommunityIcons
            name="calendar-month-outline"
            size={24}
            color="rgba(255, 255, 255, 0.4)"
          />
          <Text className="text-[10px] font-semibold text-on-surface-variant/40 mt-1 font-geist">
            Habits
          </Text>
        </Pressable>

        <Pressable
          onPress={() => router.push("/todo")}
          className="items-center justify-center w-16 h-12 scale-110 active:opacity-75"
        >
          <MaterialCommunityIcons
            name="check-circle"
            size={24}
            color="#44e2cd"
          />
          <Text className="text-[10px] font-semibold text-secondary mt-1 font-geist">
            Tasks
          </Text>
        </Pressable>

        <Pressable className="items-center justify-center w-16 h-12 active:opacity-75">
          <MaterialCommunityIcons
            name="handshake-outline"
            size={24}
            color="rgba(255, 255, 255, 0.4)"
          />
          <Text className="text-[10px] font-semibold text-on-surface-variant/40 mt-1 font-geist">
            Partners
          </Text>
        </Pressable>

        <Pressable className="items-center justify-center w-16 h-12 active:opacity-75">
          <MaterialCommunityIcons
            name="account-outline"
            size={24}
            color="rgba(255, 255, 255, 0.4)"
          />
          <Text className="text-[10px] font-semibold text-on-surface-variant/40 mt-1 font-geist">
            Profile
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
