import React from "react";
import { View, Text, Pressable } from "react-native";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CalendarHeaderProps } from "@/utils/interfaces";

export default function CalendarHeader({
  currentMonthName,
  currentYear,
  onPrevMonth,
  onNextMonth,
  onSelectToday,
  onBackPress,
  onTasksPress,
}: CalendarHeaderProps) {
  const todayDate = new Date().getDate();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{ paddingTop: insets.top, height: 64 + insets.top }}
      className="w-full flex-row justify-between items-center px-4 border-b border-white/5 bg-background"
    >
      {/* Left items: Back/Menu + Month selector */}
      <View className="flex-row items-center gap-3">
        {onBackPress ? (
          <Pressable
            onPress={onBackPress}
            hitSlop={8}
            className="p-2 rounded-full active:bg-white/10"
          >
            <Ionicons name="arrow-back" size={24} color="#d4e4fa" />
          </Pressable>
        ) : (
          <Pressable
            hitSlop={8}
            className="p-2 rounded-full active:bg-white/10"
          >
            <MaterialCommunityIcons name="menu" size={24} color="#d4e4fa" />
          </Pressable>
        )}

        <View className="flex-row items-center gap-1">
          <Text className="text-xl font-bold text-on-surface font-inter">
            {currentMonthName}
          </Text>
          <Text className="text-sm text-on-surface-variant font-inter mt-1 mr-1">
            {currentYear}
          </Text>
          <Pressable
            onPress={onNextMonth}
            hitSlop={8}
            className="p-1 rounded-full active:bg-white/10"
          >
            <Ionicons name="chevron-down" size={16} color="#d4e4fa" />
          </Pressable>
        </View>
      </View>

      {/* Center month adjust controls */}
      <View className="flex-row items-center gap-1">
        <Pressable
          onPress={onPrevMonth}
          hitSlop={8}
          className="p-2 rounded-full active:bg-white/10"
        >
          <Ionicons name="chevron-back" size={20} color="#c6c6cb" />
        </Pressable>
        <Pressable
          onPress={onNextMonth}
          hitSlop={8}
          className="p-2 rounded-full active:bg-white/10"
        >
          <Ionicons name="chevron-forward" size={20} color="#c6c6cb" />
        </Pressable>
      </View>

      {/* Right actions */}
      <View className="flex-row items-center gap-3">
        <Pressable
          hitSlop={8}
          className="p-2 rounded-full active:bg-white/10"
        >
          <Ionicons name="search" size={20} color="#c6c6cb" />
        </Pressable>

        {/* Go to Today Calendar icon */}
        <Pressable
          onPress={onSelectToday}
          hitSlop={8}
          className="p-2 rounded-full active:bg-white/10 items-center justify-center relative"
        >
          <Ionicons name="calendar-outline" size={22} color="#c6c6cb" />
          <Text
            className="absolute text-[8px] font-bold text-on-surface"
            style={{ top: 15 }}
          >
            {todayDate}
          </Text>
        </Pressable>

        {/* Tasks tab shortcut */}
        <Pressable
          onPress={onTasksPress}
          hitSlop={8}
          className="p-2 rounded-full active:bg-white/10"
        >
          <MaterialCommunityIcons
            name="checkbox-marked-circle-outline"
            size={22}
            color="#c6c6cb"
          />
        </Pressable>

        {/* Profile Avatar */}
        <View className="w-8 h-8 rounded-full overflow-hidden border border-white/10">
          <Image
            source="https://lh3.googleusercontent.com/aida-public/AB6AXuBdWKn5hE1zD5bhpjluWa6WQGip9mFfnFNG41vkYbNdrHMDRWi45hRf4VHdQccGR6rlepm2U6D8-RDLmkowBFkw6KbmjDeSQcSp714xGlDjdw_evVQxSbJvmcOQxcZn4iAbDhNLievGkmjex3b_qPOkpy-2mRLEcJ9Xgpxxv0B_s0rDKd3o1s1PN8k1roLxKiGqgY4JWvf9hVBVZRKh1v0PpHMyTO8kkEnTAudlWygGmXoTs0q_VPng0frUol3FOGQ-ThmNcdcfneC_"
            className="w-full h-full"
            contentFit="cover"
          />
        </View>
      </View>
    </View>
  );
}
