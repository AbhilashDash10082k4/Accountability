import React, { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "@/lib/supabase";
import { getApiUrl } from "@/lib/constants";

export default function ProfileScreen() {
  const router = useRouter();

  const [fiveYearGoal, setFiveYearGoal] = useState("");
  const [oneYearGoal, setOneYearGoal] = useState("");
  const [monthlyGoal, setMonthlyGoal] = useState("");
  const [pathCommitment, setPathCommitment] = useState("");

  const [userName, setUserName] = useState("User");
  const [userEmail, setUserEmail] = useState("");
  const [userAvatar, setUserAvatar] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const loadGoals = async () => {
      try {
        const { data: authData } = await supabase.auth.getUser();
        const userId = authData.user?.id;
        if (!userId) return;

        // Set user info
        if (authData.user?.user_metadata) {
          setUserName(authData.user.user_metadata.full_name || authData.user.user_metadata.name || "User");
          setUserAvatar(authData.user.user_metadata.avatar_url || "");
        }
        setUserEmail(authData.user?.email || "");

        const res = await fetch(getApiUrl(`/api/goals?userId=${userId}`));
        const json = await res.json();
        
        if (json.data) {
          if (json.data.fiveYearGoal) setFiveYearGoal(json.data.fiveYearGoal);
          if (json.data.oneYearGoal) setOneYearGoal(json.data.oneYearGoal);
          if (json.data.monthlyGoal) setMonthlyGoal(json.data.monthlyGoal);
          if (json.data.pathCommitment) setPathCommitment(json.data.pathCommitment);
        }
      } catch (e) {
        console.error("Failed to load goals", e);
      }
    };
    loadGoals();
  }, []);

  const saveGoals = async () => {
    try {
      // Optimistic visual feedback (already in state)
      Alert.alert("Success", "Goals saved successfully.");
      
      const { data: authData } = await supabase.auth.getUser();
      const userId = authData.user?.id;
      if (!userId) return;

      await fetch(getApiUrl("/api/goals"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          fiveYearGoal,
          oneYearGoal,
          monthlyGoal,
          pathCommitment
        }),
      });
      setIsEditing(false);
    } catch (e) {
      Alert.alert("Error", "Failed to save goals");
    }
  };

  const confirmSignOut = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Sign Out", style: "destructive", onPress: handleSignOut }
    ]);
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert("Error signing out", error.message);
    } else {
      router.replace("/");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#051424]">
      <ScrollView contentContainerClassName="p-5 pb-10">
        
        {/* Header Section (Tinder-style) */}
        <View className="flex-row items-center justify-between mb-8 mt-2">
          <View className="flex-row items-center flex-1">
            {userAvatar ? (
              <Image 
                source={{ uri: userAvatar }} 
                className="w-20 h-20 rounded-full bg-[#1c3c60]" 
              />
            ) : (
              <View className="w-20 h-20 rounded-full bg-[#1c3c60] items-center justify-center">
                <Text className="text-[#44e2cd] text-3xl font-bold">
                  {userName.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
            <View className="ml-4 flex-1">
              <View className="flex-row items-center mb-2">
                <Text className="text-[#d4e4fa] text-xl font-bold" numberOfLines={1}>{userName}</Text>
                <MaterialCommunityIcons name="check-decagram" size={20} color="#44e2cd" className="ml-1" />
              </View>
              
              {!isEditing && (
                <TouchableOpacity 
                  onPress={() => setIsEditing(true)}
                  className="bg-[#1c3c60] rounded-full px-4 py-1.5 self-start flex-row items-center"
                >
                  <MaterialCommunityIcons name="pencil" size={14} color="#d4e4fa" />
                  <Text className="text-[#d4e4fa] font-semibold text-sm ml-1">Edit Goals</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
          
          <TouchableOpacity 
            className="w-12 h-12 rounded-full bg-[#1c3c60] items-center justify-center shadow-sm ml-2"
            onPress={confirmSignOut}
          >
            <MaterialCommunityIcons name="cog" size={24} color="#d4e4fa" />
          </TouchableOpacity>
        </View>

        {/* Info Card (Optional if email needed, but omitted here to focus on goals like the big card) */}

        {/* Goals Big Card */}
        <View className="bg-[#1c3c60] rounded-3xl p-6 shadow-sm">
          <View className="flex-row items-center justify-between mb-6">
            <View className="flex-row items-center">
              <MaterialCommunityIcons name="target" size={24} color="#d4e4fa" />
              <Text className="text-[#d4e4fa] text-xl font-bold ml-2">Your Goals</Text>
            </View>
            {!isEditing && (
              <TouchableOpacity onPress={() => setIsEditing(true)}>
                <Text className="text-[#44e2cd] font-bold">Edit</Text>
              </TouchableOpacity>
            )}
          </View>

          {isEditing ? (
            <View>
              <Text className="text-[#a4c4ea] text-base font-semibold mb-2">5-Year Goal</Text>
              <TextInput
                className="bg-[#051424] text-[#d4e4fa] rounded-xl p-4 text-base mb-5 min-h-[80px] text-left align-top"
                placeholder="Where do you see yourself in 5 years?"
                placeholderTextColor="#6484a4"
                value={fiveYearGoal}
                onChangeText={setFiveYearGoal}
                multiline
              />

              <Text className="text-[#a4c4ea] text-base font-semibold mb-2">1-Year Goal</Text>
              <TextInput
                className="bg-[#051424] text-[#d4e4fa] rounded-xl p-4 text-base mb-5 min-h-[80px] text-left align-top"
                placeholder="What do you want to achieve this year?"
                placeholderTextColor="#6484a4"
                value={oneYearGoal}
                onChangeText={setOneYearGoal}
                multiline
              />

              <Text className="text-[#a4c4ea] text-base font-semibold mb-2">Monthly Goal</Text>
              <TextInput
                className="bg-[#051424] text-[#d4e4fa] rounded-xl p-4 text-base mb-5 min-h-[80px] text-left align-top"
                placeholder="What is your focus for this month?"
                placeholderTextColor="#6484a4"
                value={monthlyGoal}
                onChangeText={setMonthlyGoal}
                multiline
              />

              <Text className="text-[#a4c4ea] text-base font-semibold mb-2">Commitment Path</Text>
              <TextInput
                className="bg-[#051424] text-[#d4e4fa] rounded-xl p-4 text-base mb-5 min-h-[80px] text-left align-top"
                placeholder="What path will you take? What is your commitment?"
                placeholderTextColor="#6484a4"
                value={pathCommitment}
                onChangeText={setPathCommitment}
                multiline
              />

              <TouchableOpacity 
                className="bg-[#44e2cd] p-4 rounded-full items-center mt-3 shadow-md" 
                onPress={saveGoals}
              >
                <Text className="text-[#051424] text-base font-bold">Save Goals</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View>
              <View className="mb-5">
                <Text className="text-[#a4c4ea] text-sm font-semibold mb-1">5-Year Goal</Text>
                <Text className="text-[#d4e4fa] text-base leading-6">{fiveYearGoal || "Not set"}</Text>
              </View>
              <View className="h-px bg-[#051424] mb-5" />
              
              <View className="mb-5">
                <Text className="text-[#a4c4ea] text-sm font-semibold mb-1">1-Year Goal</Text>
                <Text className="text-[#d4e4fa] text-base leading-6">{oneYearGoal || "Not set"}</Text>
              </View>
              <View className="h-px bg-[#051424] mb-5" />
              
              <View className="mb-5">
                <Text className="text-[#a4c4ea] text-sm font-semibold mb-1">Monthly Goal</Text>
                <Text className="text-[#d4e4fa] text-base leading-6">{monthlyGoal || "Not set"}</Text>
              </View>
              <View className="h-px bg-[#051424] mb-5" />
              
              <View className="mb-2">
                <Text className="text-[#a4c4ea] text-sm font-semibold mb-1">Commitment Path</Text>
                <Text className="text-[#d4e4fa] text-base leading-6">{pathCommitment || "Not set"}</Text>
              </View>
            </View>
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
