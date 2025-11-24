import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";

export default function Trip() {
  const { pickup, drop, distanceKm, fare } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Trip Details</Text>

      <Text style={styles.text}>Pickup: {pickup}</Text>
      <Text style={styles.text}>Drop: {drop}</Text>
      <Text style={styles.text}>Distance: {distanceKm} km</Text>
      <Text style={styles.text}>Fare: ₹{fare}</Text>

      <Text style={styles.text}>Driver Assigned 🚗</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: "#04c35c",
    fontSize: 28,
    marginBottom: 20,
    fontWeight: "bold",
  },
  text: {
    color: "#fff",
    fontSize: 18,
    marginBottom: 10,
  },
});
