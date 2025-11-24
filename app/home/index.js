import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { getAuth, signOut } from "firebase/auth";

export default function HomePage() {
  const router = useRouter();
  const auth = getAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace("/login");
    } catch (error) {
      Alert.alert("Logout Error", error.message);
    }
  };

  const Card = ({ icon, label, color, route }) => (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[styles.card, { borderColor: color }]}
      onPress={() => router.push(route)}
    >
      <Ionicons name={icon} size={40} color={color} />
      <Text style={styles.cardText}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Drivo</Text>
      <Text style={styles.subtitle}>Your ride, reinvented.</Text>

      <View style={styles.menuWrapper}>
        <Card
          icon="car-sport-outline"
          label="Book Ride"
          color="#04c35c"
          route="/home/bookride"
        />
        <Card
          icon="person-circle-outline"
          label="Profile"
          color="#0ff"
          route="/home/profile"
        />
        <Card
          icon="time-outline"
          label="Ride History"
          color="#ff6f61"
          route="/home/history"
        />
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingTop: 90,
    alignItems: "center",
  },
  title: {
    fontSize: 38,
    color: "#04c35c",
    fontWeight: "bold",
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 18,
    color: "#aaa",
    marginBottom: 40,
  },
  menuWrapper: {
    width: "90%",
  },
  card: {
    backgroundColor: "rgba(20,20,20,0.8)",
    padding: 25,
    borderRadius: 15,
    marginBottom: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    borderWidth: 1.3,
    shadowColor: "#04c35c",
    shadowOpacity: 0.4,
    shadowRadius: 14,
    elevation: 10,
  },
  cardText: {
    fontSize: 22,
    fontWeight: "600",
    color: "#fff",
  },
  logoutButton: {
    marginTop: 25,
    backgroundColor: "#ff3333",
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 12,
  },
  logoutText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
