import React, { useState, useRef } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  Animated,
  Dimensions,
} from "react-native";
import { Image } from "expo-image";
import { BlurView } from "expo-blur";
import { Stack, useRouter } from "expo-router";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import "../global.css";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

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
        router.push("/todo");
      });
    }, 1800);
  };

  return (
    <View className="flex-1 bg-background justify-center items-center">
      <Stack.Screen options={{ headerShown: false }} />

      {/* Subtle Background Image with Overlay */}
      <View style={StyleSheet.absoluteFillObject} className="z-0">
        <Image
          source="https://lh3.googleusercontent.com/aida-public/AB6AXuC-fafc1zq9EJSKIHybUJ2ygUbnt-mij0dvlDdJbCs1MCQwk_kaieLiwPsyeZD0Ipb6IHqIcq8JjIfbrKAFiak7s8aFwtxlRHN6yJgdFmQ2bcO7Buay9lSlykH8g1R4JrF3upWfBRE2PEuabvmRSPgTEmhDyyecha4n2SSktglvk3XyuYT8X3rzSbAWHvXskl0cq10X162cOhjPPT5dp5G0JOeID_zj52DZ2eyuGmLwo1o7CSuu74cOWNNnDciV1mPMlIBLWHgpNLHJ"
          style={StyleSheet.absoluteFillObject}
          contentFit="cover"
          className="opacity-30"
        />
        {/* Deep Charcoal Dark Overlay */}
        <View
          style={StyleSheet.absoluteFillObject}
          className="bg-background/80"
        />

        {/* Glow effect in background */}
        <View
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-30"
          style={{
            backgroundColor: "#44e2cd",
            filter: "blur(80px)",
          }}
        />
      </View>

      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingVertical: 40,
        }}
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
          <View
            className="w-full rounded-[32px] overflow-hidden"
            style={{
              borderWidth: 1,
              borderColor: "rgba(255, 255, 255, 0.08)",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.37,
              shadowRadius: 32,
            }}
          >
            <BlurView
              tint="dark"
              intensity={90}
              className="p-8 items-center text-center"
            >
              <Text
                className="text-on-surface font-semibold text-center mb-4 font-inter"
                style={{
                  fontSize: 32,
                  lineHeight: 40,
                  letterSpacing: -0.64,
                }}
              >
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
                  className={`w-full h-14 bg-secondary rounded-xl flex-row items-center justify-center gap-2 transition-all ${
                    isPressed ? "opacity-90" : "opacity-100"
                  }`}
                  style={{
                    shadowColor: "#44e2cd",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.2,
                    shadowRadius: 8,
                  }}
                >
                  <Text className="text-on-secondary-fixed text-lg font-semibold font-inter">
                    Get Started
                  </Text>
                  <Ionicons name="arrow-forward" size={20} color="#00201c" />
                </Pressable>
              </Animated.View>

              {/* Secondary Action */}
              <Pressable
                onPress={() => router.push("/todo")}
                className="mt-6 active:opacity-75"
              >
                <Text className="text-xs font-semibold tracking-[0.96px] text-on-surface-variant/60 uppercase font-geist">
                  Sign In To Existing Account
                </Text>
              </Pressable>
            </BlurView>
          </View>

          {/* Minimalist Progress Indicators */}
          <View className="mt-8 flex-row items-center gap-1.5">
            <View
              className="w-6 h-1.5 rounded-full bg-secondary"
              style={{
                shadowColor: "#44e2cd",
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.4,
                shadowRadius: 8,
              }}
            />
            <View className="w-1.5 h-1.5 rounded-full bg-surface-variant/50" />
            <View className="w-1.5 h-1.5 rounded-full bg-surface-variant/50" />
            <View className="w-1.5 h-1.5 rounded-full bg-surface-variant/50" />
          </View>
        </View>
      </ScrollView>

      {/* Bottom Notification */}
      {showToast && (
        <Animated.View
          style={{
            position: "absolute",
            bottom: 32,
            alignSelf: "center",
            opacity: toastOpacity,
            transform: [{ translateY: toastTranslateY }],
            borderRadius: 9999,
            overflow: "hidden",
            borderWidth: 1,
            borderColor: "rgba(255, 255, 255, 0.08)",
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
