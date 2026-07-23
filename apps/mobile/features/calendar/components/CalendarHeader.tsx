import React, { memo } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CalendarHeaderProps } from "@/lib/interfaces";

function CalendarHeader({
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
      style={[
        styles.container,
        { paddingTop: insets.top, height: 64 + insets.top },
      ]}
    >
      {/* Left: Back/Menu + Month */}
      <View style={styles.leftGroup}>
        {onBackPress ? (
          <Pressable onPress={onBackPress} hitSlop={8} style={styles.iconBtn}>
            <Ionicons name="arrow-back" size={24} color="#d4e4fa" />
          </Pressable>
        ) : (
          <Pressable hitSlop={8} style={styles.iconBtn}>
            <MaterialCommunityIcons name="menu" size={24} color="#d4e4fa" />
          </Pressable>
        )}

        <View style={styles.monthGroup}>
          <Text style={styles.monthText}>{currentMonthName}</Text>
          <Text style={styles.yearText}>{currentYear}</Text>
          <Pressable onPress={onNextMonth} hitSlop={8} style={styles.smallBtn}>
            <Ionicons name="chevron-down" size={16} color="#d4e4fa" />
          </Pressable>
        </View>
      </View>

      {/* Center: month nav arrows */}
      <View style={styles.navGroup}>
        <Pressable onPress={onPrevMonth} hitSlop={8} style={styles.iconBtn}>
          <Ionicons name="chevron-back" size={20} color="#c6c6cb" />
        </Pressable>
        <Pressable onPress={onNextMonth} hitSlop={8} style={styles.iconBtn}>
          <Ionicons name="chevron-forward" size={20} color="#c6c6cb" />
        </Pressable>
      </View>

      {/* Right: actions */}
      <View style={styles.rightGroup}>
        <Pressable hitSlop={8} style={styles.iconBtn}>
          <Ionicons name="search" size={20} color="#c6c6cb" />
        </Pressable>

        {/* Today shortcut */}
        <Pressable
          onPress={onSelectToday}
          hitSlop={8}
          style={[styles.iconBtn, { position: "relative" }]}
        >
          <Ionicons name="calendar-outline" size={22} color="#c6c6cb" />
          <Text style={styles.todayNum}>{todayDate}</Text>
        </Pressable>

        {/* Tasks shortcut */}
        <Pressable onPress={onTasksPress} hitSlop={8} style={styles.iconBtn}>
          <MaterialCommunityIcons
            name="checkbox-marked-circle-outline"
            size={22}
            color="#c6c6cb"
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
    backgroundColor: "#051424",
  },
  leftGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  monthGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  monthText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#d4e4fa",
    fontFamily: "Inter",
  },
  yearText: {
    fontSize: 13,
    color: "#c6c6cb",
    fontFamily: "Inter",
    marginTop: 4,
    marginRight: 4,
  },
  navGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  rightGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconBtn: {
    padding: 8,
    borderRadius: 999,
  },
  smallBtn: {
    padding: 4,
    borderRadius: 999,
  },
  todayNum: {
    position: "absolute",
    top: 15,
    fontSize: 8,
    fontWeight: "700",
    color: "#d4e4fa",
  },
});

export default memo(CalendarHeader);
