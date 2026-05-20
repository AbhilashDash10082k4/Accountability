import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useTodos } from "@/state/store";
import "../global.css";
export default function App() {
  const [input, setInput] = useState("");
  const { todos, addTodo, toggleTodo } = useTodos();

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={input}
        onChangeText={setInput}
        placeholder="Enter a task"
      />
      <View className="flex-1 items-center justify-center bg-amber-800">
        <Text className="text-xl font-bold text-blue-500">
          Welcome to Nativewind!
        </Text>
      </View>
      <Button
        title="Add Todo"
        onPress={() => {
          addTodo(input);
          setInput("");
        }}
      />
      {todos.map((todo) => (
        <TouchableOpacity key={todo.id} onPress={() => toggleTodo(todo.id)}>
          <Text
            style={[
              styles.todo,
              { textDecorationLine: todo.completed ? "line-through" : "none" },
            ]}
          >
            {todo.text}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  input: { borderWidth: 1, padding: 10, marginBottom: 10 },
  todo: { fontSize: 18, marginVertical: 5 },
});
