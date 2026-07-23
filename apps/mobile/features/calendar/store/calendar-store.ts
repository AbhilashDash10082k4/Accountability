import { create } from "zustand";
import { getApiUrl } from "@/lib/constants";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "@/lib/supabase";
import { Task } from "@/lib/interfaces";
import { generateTaskColor, generateTaskId } from "../utils/task-utils";
import { toDateKey } from "../utils/date-utils";
/*selectedDate
currentMonth
viewMode
tasks
loading 
actions-setSelectedDate()

setCurrentMonth()

setViewMode()

fetchTasks()

createTask()

updateTask()

deleteTask()

moveTask()*/
interface TaskStoreState {
  tasks: Task[];
  userId: string | null; // cached — avoid getUser() per action
  selectedDate: string; // "YYYY-MM-DD"
  viewMode: "month" | "day";
  setUserId: (id: string | null) => void;
  setSelectedDate: (date: string) => void;
  setViewMode: (mode: "month" | "day") => void;
  addTask: (
    task: Omit<Task, "id" | "color" | "status"> & { status?: Task["status"] },
  ) => void;
  updateTask: (id: string, partial: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  moveTask: (id: string, newStart: number, newEnd: number) => void;
  submitProof: (
    id: string,
    proofType: "text" | "image" | "video" | "url",
    proofData: string,
  ) => void;
  fetchTasks: () => Promise<void>;
}

export const useTaskStore = create<TaskStoreState>()(
  persist(
    (set, get) => ({
      tasks: [],
      userId: null,
      selectedDate: toDateKey(new Date()),
      viewMode: "month",

      setUserId: (id) => set({ userId: id }),
      setSelectedDate: (date) => set({ selectedDate: date }),
      setViewMode: (mode) => set({ viewMode: mode }),

      addTask: async (task) => {
        const optimisticId = generateTaskId();
        const optimisticTask = {
          ...task,
          id: optimisticId,
          color: generateTaskColor(),
          status: task.status || "PENDING",
        };
        
        // Optimistic update
        set((state) => ({
          tasks: [...state.tasks, optimisticTask],
        }));

        try {
          // Use cached userId — avoids SecureStore read on every task add
          let userId = get().userId;
          if (!userId) {
            const { data: authData } = await supabase.auth.getUser();
            userId = authData.user?.id ?? null;
            if (userId) set({ userId });
          }
          if (!userId) return;

          const res = await fetch(getApiUrl("/api/createTask"), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              title: task.title,
              description: task.description || "",
              startTime: new Date(task.startTime).toISOString(),
              endTime: new Date(task.endTime).toISOString(),
              userId,
            }),
          });
          const json = await res.json();
          if (json.data && json.data.id) {
            // Replace optimistic ID with real DB ID
            set((state) => ({
              tasks: state.tasks.map((t) =>
                t.id === optimisticId ? { ...t, id: json.data.id } : t
              ),
            }));
          }
        } catch (e) {
          console.error("Failed to sync task to backend", e);
        }
      },

      updateTask: (id, partial) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, ...partial } : t,
          ),
        })),

      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
        })),

      moveTask: (id, newStart, newEnd) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, startTime: newStart, endTime: newEnd } : t,
          ),
        })),

      submitProof: (id, proofType, proofData) => {
        // Set to VERIFICATION_PENDING first
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id
              ? {
                  ...t,
                  status: "VERIFICATION_PENDING",
                  proofType,
                  proofData,
                }
              : t,
          ),
        }));

        // Simulate verification engine running asynchronously
        setTimeout(() => {
          set((state) => {
            const task = state.tasks.find((t) => t.id === id);
            // Only complete if it's still verification pending (not deleted or modified)
            if (task && task.status === "VERIFICATION_PENDING") {
              return {
                tasks: state.tasks.map((t) =>
                  t.id === id
                    ? {
                        ...t,
                        status: "COMPLETED",
                        verifiedAt: new Date().toISOString(),
                      }
                    : t,
                ),
              };
            }
            return state;
          });
        }, 2000);
      },

      fetchTasks: async () => {
        try {
          // Use cached userId — avoids SecureStore read on every fetch
          let userId = get().userId;
          if (!userId) {
            const { data: authData } = await supabase.auth.getUser();
            userId = authData.user?.id ?? null;
            if (userId) set({ userId });
          }
          if (!userId) return;

          const res = await fetch(getApiUrl(`/api/tasks?userId=${userId}`));
          const json = await res.json();
          if (json.data) {
            set({
              tasks: json.data.map((t: any) => ({
                id: t.id,
                title: t.title,
                description: t.description,
                startTime: new Date(t.startTime).getTime(),
                endTime: new Date(t.endTime).getTime(),
                color: generateTaskColor(), // Or fetch from DB if stored
                status: t.status,
              })),
            });
          }
        } catch (e) {
          console.error("Failed to fetch tasks", e);
        }
      },
    }),
    {
      name: "calendar-task-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ tasks: state.tasks }),
      // userId is NOT persisted — re-hydrated from auth on first action
    },
  ),
);
