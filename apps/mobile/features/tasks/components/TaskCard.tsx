import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Task } from "@/lib/interfaces";
import { hourFloatToTimeStr } from "@/features/calendar/utils/date-utils";
import ProofTypeSelector from "./ProofTypeSelector";

/* ---------- status styling lookup ---------- */
type StatusKey = Task["status"];
const STATUS_MAP: Record<StatusKey, { text: string; colorCls: string; bgCls: string }> = {
  PENDING: {
    text: "Pending",
    colorCls: "text-on-surface-variant/60",
    bgCls: "bg-white/5 border-white/5",
  },
  IN_PROGRESS: {
    text: "In Progress",
    colorCls: "text-amber-400",
    bgCls: "bg-amber-500/10 border-amber-500/20",
  },
  PROOF_PENDING: {
    text: "Proof Needed",
    colorCls: "text-orange-400",
    bgCls: "bg-orange-500/10 border-orange-500/20",
  },
  VERIFICATION_PENDING: {
    text: "Verifying",
    colorCls: "text-cyan-400",
    bgCls: "bg-cyan-500/10 border-cyan-500/20",
  },
  COMPLETED: {
    text: "Completed",
    colorCls: "text-emerald-400",
    bgCls: "bg-emerald-500/10 border-emerald-500/20",
  },
  FAILED: {
    text: "Failed",
    colorCls: "text-rose-400",
    bgCls: "bg-rose-500/10 border-rose-500/20",
  },
};

interface TaskCardProps {
  task: Task;
  isCarriedForward?: boolean;
  onStart: (id: string) => void;
  onSubmitProof: (
    id: string,
    type: "text" | "url" | "image" | "video",
    data: string,
  ) => void;
}

export default function TaskCard({
  task,
  isCarriedForward = false,
  onStart,
  onSubmitProof,
}: TaskCardProps) {
  const [showProof, setShowProof] = useState(false);
  const [proofType, setProofType] = useState<"text" | "url" | "image" | "video">("text");
  const [proofData, setProofData] = useState("");

  const status = STATUS_MAP[task.status] ?? STATUS_MAP.PENDING;
  const durationMin = ((task.endTime - task.startTime) * 60).toFixed(0);

  const handleSubmit = () => {
    if (!proofData.trim()) return;
    onSubmitProof(task.id, proofType, proofData.trim());
    setProofData("");
    setShowProof(false);
  };

  const placeholders: Record<string, string> = {
    text: "Enter a text summary of your work...",
    url: "Enter repository commit URL, live site, etc.",
    image: "Enter screenshot file path or description...",
    video: "Enter video recording file path or description...",
  };

  return (
    <View className="w-full mb-4 p-5 rounded-2xl bg-[#0b1c2e] border border-white/5">
      {/* Header */}
      <View className="flex-row justify-between items-start mb-2">
        <View className="flex-1 pr-3">
          <Text className="text-base font-bold text-on-surface font-inter">
            {task.title}
          </Text>
          {isCarriedForward && (
            <View className="mt-1 self-start px-2 py-0.5 rounded bg-rose-500/20 border border-rose-500/30">
              <Text className="text-[9px] font-bold text-rose-400 uppercase tracking-wider">
                Carried Forward ({task.date})
              </Text>
            </View>
          )}
        </View>
        <View className={`px-3 py-1.5 rounded-full border ${status.bgCls}`}>
          <Text className={`text-[11px] font-bold font-geist ${status.colorCls}`}>
            {status.text}
          </Text>
        </View>
      </View>

      {/* Description */}
      {task.description ? (
        <Text className="text-[13px] text-on-surface-variant/80 font-geist mb-3">
          {task.description}
        </Text>
      ) : null}

      {/* Time */}
      <View className="flex-row items-center gap-2 mb-4">
        <Ionicons name="time-outline" size={14} color="rgba(198,198,203,0.55)" />
        <Text className="text-[11px] text-on-surface-variant/60 font-geist">
          {hourFloatToTimeStr(task.startTime)} – {hourFloatToTimeStr(task.endTime)} ({durationMin} min)
        </Text>
      </View>

      {/* Pending → Start button */}
      {task.status === "PENDING" && (
        <Pressable
          onPress={() => onStart(task.id)}
          className="w-full py-3 rounded-xl bg-amber-500/25 border border-amber-500/30 items-center active:bg-amber-500/40"
        >
          <Text className="text-[13px] font-bold text-amber-400">Start Task</Text>
        </Pressable>
      )}

      {/* In Progress → Show proof CTA or panel */}
      {task.status === "IN_PROGRESS" && !showProof && (
        <Pressable
          onPress={() => setShowProof(true)}
          className="w-full py-3 rounded-xl bg-cyan-500/25 border border-cyan-500/30 items-center active:bg-cyan-500/40"
        >
          <Text className="text-[13px] font-bold text-cyan-400">Submit Proof of Completion</Text>
        </Pressable>
      )}

      {task.status === "IN_PROGRESS" && showProof && (
        <View className="mt-2 pt-4 border-t border-white/5">
          <Text className="text-[11px] font-bold text-on-surface/80 mb-2">
            Select Proof Type:
          </Text>
          <ProofTypeSelector activeType={proofType} onSelect={setProofType} />

          <TextInput
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-on-surface text-[13px] font-geist mb-4"
            placeholder={placeholders[proofType]}
            placeholderTextColor="rgba(255,255,255,0.25)"
            value={proofData}
            onChangeText={setProofData}
          />

          <View className="flex-row gap-2">
            <Pressable
              onPress={() => setShowProof(false)}
              className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 items-center active:bg-white/10"
            >
              <Text className="text-[13px] font-bold text-on-surface-variant">Cancel</Text>
            </Pressable>
            <Pressable
              onPress={handleSubmit}
              disabled={!proofData.trim()}
              className={`flex-[2] py-3 rounded-xl items-center justify-center ${
                proofData.trim() ? "bg-[#e0a96d]" : "bg-white/10 opacity-50"
              }`}
            >
              <Text
                className={`text-[13px] font-bold ${
                  proofData.trim() ? "text-background" : "text-on-surface-variant/40"
                }`}
              >
                Submit
              </Text>
            </Pressable>
          </View>
        </View>
      )}

      {/* Verification Pending Loader */}
      {task.status === "VERIFICATION_PENDING" && (
        <View className="w-full p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/15 flex-row items-center gap-3">
          <ActivityIndicator size="small" color="#22d3ee" />
          <View className="flex-1">
            <Text className="text-[11px] font-bold text-cyan-400 font-inter">
              Running Verification Engine...
            </Text>
            <Text className="text-[10px] text-cyan-400/80 font-geist mt-0.5">
              Analyzing submitted {task.proofType} proof.
            </Text>
          </View>
        </View>
      )}

      {/* Completed */}
      {task.status === "COMPLETED" && (
        <View className="w-full p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/15">
          <View className="flex-row items-center gap-2 mb-2">
            <Ionicons name="checkmark-circle" size={16} color="#34d399" />
            <Text className="text-[11px] font-bold text-emerald-400 font-inter">
              Proof Verified
            </Text>
          </View>
          <Text className="text-[11px] text-emerald-400/80 font-geist italic">
            Type: {task.proofType}
          </Text>
          <Text className="text-[11px] text-on-surface-variant/70 font-geist mt-1">
            Data: {task.proofData}
          </Text>
        </View>
      )}
    </View>
  );
}
