import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Animated,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { auth } from "../../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function Login() {
  const router = useRouter();

  // Auto-filled credentials for testing
  const [email, setEmail] = useState("test@example.com");
  const [password, setPassword] = useState("123456");

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 700, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter email and password");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth,email.trim(), password);
      router.replace("/home");
    } catch (error) {
      Alert.alert("Login failed", error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <Animated.View
        style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
      >
        <Text style={styles.title}>WELCOME BACK</Text>

        <TextInput
          placeholder="Email"
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
          placeholderTextColor="#aaa"
        />

        <TextInput
          placeholder="Password"
          style={styles.input}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          placeholderTextColor="#aaa"
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>LOGIN</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/auth/register")}>
          <Text style={styles.linkText}>Don't have an account? Register</Text>
        </TouchableOpacity>
      </Animated.View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  content: {
    backgroundColor: "#111",
    borderRadius: 20,
    padding: 35,
    shadowColor: "#0ff",
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 12,
  },
  title: {
    fontSize: 42,
    fontWeight: "900",
    color: "#04c35c",
    marginBottom: 30,
    textAlign: "center",
    letterSpacing: 2,
    fontFamily: Platform.OS === "ios" ? "Arial Black" : "sans-serif-condensed",
  },
  input: {
    backgroundColor: "#222",
    padding: 18,
    borderRadius: 12,
    marginBottom: 18,
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    fontFamily: Platform.OS === "ios" ? "Helvetica" : "sans-serif",
  },
  button: {
    backgroundColor: "#04c35c",
    paddingVertical: 20,
    borderRadius: 12,
    marginBottom: 15,
    alignItems: "center",
    shadowColor: "#04c35c",
    shadowOpacity: 0.8,
    shadowRadius: 15,
    elevation: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 22,
    letterSpacing: 1.5,
    fontFamily: Platform.OS === "ios" ? "Arial Black" : "sans-serif-condensed",
  },
  linkText: {
    color: "#bbb",
    textAlign: "center",
    marginTop: 12,
    fontSize: 16,
    fontWeight: "500",
    fontFamily: Platform.OS === "ios" ? "Helvetica" : "sans-serif",
  },
});
