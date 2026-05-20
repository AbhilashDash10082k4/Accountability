import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Todo {
  id: number;
  text: string;
  //   createdAt: number;
  completed: boolean; //requires ample proof
}
interface TodoState {
  todos: Todo[];
  addTodo: (text: string) => void; //should be added with appropriate duration (hourly)
  toggleTodo: (id: number) => void; //requires proof
}
export const useTodos = create<TodoState>()(
  //persist middleware stores state on AsyncStorage and rehydrates the UI with the stored data on restart
  persist(
    (set) => ({
      todos: [],
      addTodo: (text) =>
        set((state) => ({
          todos: [...state.todos, { id: Date.now(), text, completed: false }],
        })),
      toggleTodo: (id) =>
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo,
          ),
        })),
    }),
    {
      name: "todo-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => {
        todos: state.todos;
      },
    },
  ),
);
