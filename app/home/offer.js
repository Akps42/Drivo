import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

export default function Offers() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>🔥 Best Offers</Text>
      <Text style={styles.offer}>• 20% OFF on first ride</Text>
      <Text style={styles.offer}>• 10% Cashback on UPI</Text>
      <Text style={styles.offer}>• Night discount -5%</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", padding: 30 },
  title: { color: "#04c35c", fontSize: 28, marginBottom: 20 },
  offer: { color: "#fff", fontSize: 18, marginBottom: 10 },
});
