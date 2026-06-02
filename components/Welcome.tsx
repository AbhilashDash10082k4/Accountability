import React, { useState, useRef } from "react";
import { View, Text, Pressable, ScrollView, Animated } from "react-native";
import { Image } from "expo-image";
import { BlurView } from "expo-blur";
import { Stack, useRouter } from "expo-router";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import "../global.css";

export default function WelcomeScreen() {
  const router = useRouter();
  const [showToast, setShowToast] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  // Animation values

  const toastOpacity = useRef(new Animated.Value(0)).current;
  const toastTranslateY = useRef(new Animated.Value(20)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  // Pulse animation for button when processing
  const startPulse = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(buttonScale, {
          toValue: 0.96,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(buttonScale, {
          toValue: 1.0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  };

  const stopPulse = () => {
    buttonScale.setValue(1);
  };

  const handleGetStarted = () => {
    if (showToast) return;

    setShowToast(true);
    startPulse();

    // Animate Toast In
    Animated.parallel([
      Animated.timing(toastOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(toastTranslateY, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();

    // Wait and navigate
    setTimeout(() => {
      // Animate Toast Out
      Animated.parallel([
        Animated.timing(toastOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(toastTranslateY, {
          toValue: 20,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setShowToast(false);
        stopPulse();
        router.push("/calendar");
      });
    }, 1800);
  };

  return (
    <View className="flex-1 bg-background justify-center items-center">
      <Stack.Screen options={{ headerShown: false }} />

      {/* Subtle Background Image with Overlay */}
      <View className="absolute inset-0 z-0">
        <Image
          source="https://lh3.googleusercontent.com/aida-public/AB6AXuC-fafc1zq9EJSKIHybUJ2ygUbnt-mij0dvlDdJbCs1MCQwk_kaieLiwPsyeZD0Ipb6IHqIcq8JjIfbrKAFiak7s8aFwtxlRHN6yJgdFmQ2bcO7Buay9lSlykH8g1R4JrF3upWfBRE2PEuabvmRSPgTEmhDyyecha4n2SSktglvk3XyuYT8X3rzSbAWHvXskl0cq10X162cOhjPPT5dp5G0JOeID_zj52DZ2eyuGmLwo1o7CSuu74cOWNNnDciV1mPMlIBLWHgpNLHJ"
          contentFit="cover"
          className="absolute inset-0 opacity-30"
        />
        {/* Deep Charcoal Dark Overlay */}
        <View className="absolute inset-0 bg-background/80" />

        {/* Glow effect in background */}
        <View className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-secondary/10 opacity-30" />
      </View>

      <ScrollView
        contentContainerClassName="flex-grow justify-center items-center py-10"
        showsVerticalScrollIndicator={false}
        className="relative z-10 w-full"
      >
        <View className="w-full max-w-[420px] px-6 items-center">
          {/* App Logo & Identity */}
          <View className="mb-8 items-center">
            <View className="w-16 h-16 rounded-2xl bg-secondary-container/20 border border-secondary/20 items-center justify-center mb-3">
              <MaterialCommunityIcons
                name="source-branch"
                size={32}
                color="#44e2cd"
              />
            </View>
            <Text className="text-2xl font-bold tracking-tight text-on-surface font-inter">
              Accountable
            </Text>
          </View>

          {/* Glassmorphic Welcome Card */}
          <View className="w-full rounded-[32px] overflow-hidden border border-white/10 shadow-2xl shadow-black/50">
            <BlurView
              tint="dark"
              intensity={90}
              className="p-8 items-center text-center"
            >
              <Text className="text-on-surface font-semibold text-center mb-4 font-inter text-[32px] leading-[40px] tracking-[-0.64px]">
                Master Your Focus.
              </Text>

              <Text className="text-base text-on-surface-variant/80 text-center mb-8 font-inter leading-6 max-w-[280px]">
                The high-performance workspace for your habits and goals.
              </Text>

              {/* CTA Primary Button */}
              <Animated.View
                style={{ width: "100%", transform: [{ scale: buttonScale }] }}
              >
                <Pressable
                  onPress={handleGetStarted}
                  onPressIn={() => setIsPressed(true)}
                  onPressOut={() => setIsPressed(false)}
                  className={`w-full h-14 bg-secondary rounded-xl flex-row items-center justify-center gap-2 transition-all shadow shadow-secondary ${
                    isPressed ? "opacity-90" : "opacity-100"
                  }`}
                >
                  <Text className="text-on-secondary-fixed text-lg font-semibold font-inter">
                    Get Started
                  </Text>
                  <Ionicons name="arrow-forward" size={20} color="#00201c" />
                </Pressable>
              </Animated.View>

              {/* Secondary Action */}
              <Pressable
                onPress={() => router.push("/calendar")}
                className="mt-6 active:opacity-75"
              >
                <Text className="text-xs font-semibold tracking-[0.96px] text-on-surface-variant/60 uppercase font-geist">
                  Sign In To Existing Account
                </Text>
              </Pressable>
            </BlurView>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Notification */}
      {showToast && (
        <Animated.View
          className="absolute bottom-8 self-center rounded-full overflow-hidden border border-white/10"
          style={{
            opacity: toastOpacity,
            transform: [{ translateY: toastTranslateY }],
          }}
        >
          <BlurView
            tint="dark"
            intensity={100}
            className="px-6 py-3 items-center"
          >
            <Text className="text-xs font-semibold text-secondary font-geist">
              Entering Deep Focus Mode...
            </Text>
          </BlurView>
        </Animated.View>
      )}
    </View>
  );
}
