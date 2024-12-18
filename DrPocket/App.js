import React, { useState } from "react";
import { Text, View, StyleSheet, TextInput, Button, ActivityIndicator } from "react-native";
import axios from "axios";

export default function Index() {
  const [inputText, setInputText] = useState("");
  const [responseText, setResponseText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleQuery = async () => {
    if (!inputText.trim()) {
      setResponseText("Please enter your question or issue.");
      return;
    }

    setLoading(true);
    setResponseText("");

    try {
      const apiKey = "your-cohere-api-key";
      const endpoint = "https://api.cohere.ai/v1/generate";

      const payload = {
        model: "command-xlarge-nightly",
        prompt: `You are Dr. Pocket, an AI health assistant. Respond concisely to health-related questions. Question: ${inputText} Answer:`,
        max_tokens: 150,
        temperature: 0.7,
        k: 0,
        p: 0.75,
        stop_sequences: ["\n"],
      };

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      };

      const response = await axios.post(endpoint, payload, { headers });
      const aiResponse =
        response.data.generations?.[0]?.text.trim() || "Sorry, no response received.";
      setResponseText(aiResponse);
    } catch (error) {
      console.error(error);
      setResponseText("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dr. Pocket</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your health query..."
        value={inputText}
        onChangeText={setInputText}
      />
      <Button title="Ask Dr. Pocket" onPress={handleQuery} />
      {loading && <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />}
      {responseText ? <Text style={styles.response}>{responseText}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#007AFF",
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginBottom: 20,
    backgroundColor: "#fff",
  },
  response: {
    marginTop: 20,
    fontSize: 16,
    textAlign: "center",
    color: "#333",
  },
  loader: {
    marginTop: 20,
  },
});
