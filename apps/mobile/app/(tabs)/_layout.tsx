/**tab bar definition and all the screens — matches Stitch Tasks design */
import { Tabs } from "expo-router";
import { Platform, View, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useEffect } from "react";
import { useTaskStore } from "@/features/calendar/store/calendar-store";

const SURFACE_60 = "rgba(5, 20, 36, 0.92)";
const BORDER = "rgba(255,255,255,0.10)";
const ACTIVE_TINT = "#44e2cd"; // secondary
const INACTIVE_TINT = "rgba(198,198,203,0.55)"; // on-surface-variant/55

type TabIconProps = {
  name: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  color: string;
  size?: number;
  fill?: boolean;
};

function TabIcon({ name, color, size = 24, fill = false }: TabIconProps) {
  return <MaterialCommunityIcons name={name} size={size} color={color} />;
}

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const bottomPadding =
    insets.bottom > 0 ? insets.bottom : Platform.OS === "ios" ? 24 : 8;
  const tabBarHeight = 56 + bottomPadding;

  const fetchTasks = useTaskStore((state) => state.fetchTasks);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: ACTIVE_TINT,
        tabBarInactiveTintColor: INACTIVE_TINT,
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontFamily: "Geist-Regular",
          fontSize: 11,
          fontWeight: "500",
          letterSpacing: 0.4,
          marginTop: 2,
        },
        tabBarStyle: {
          backgroundColor: SURFACE_60,
          borderTopColor: BORDER,
          borderTopWidth: 1,
          height: tabBarHeight,
          paddingBottom: bottomPadding,
          paddingTop: 8,
          elevation: 0,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -8 },
          shadowOpacity: 0.15,
          shadowRadius: 24,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Calendar",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              name={focused ? "calendar-month" : "calendar-month-outline"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="habits"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="tasks"
        options={{
          title: "Tasks",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              name={focused ? "check-circle" : "check-circle-outline"}
              color={color}
              size={26}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="analytics"
        options={{
          title: "Analytics",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              name={focused ? "chart-line" : "chart-line"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              name={focused ? "account-circle" : "account-circle-outline"}
              color={color}
            />
          ),
        }}
      />
      {/* Hide old calendar tab from nav — still accessible via route if needed */}
      <Tabs.Screen
        name="calendar"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
