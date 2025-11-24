import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Alert } from "react-native";
import { getAuth } from "firebase/auth";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";

export default function History() {
  const [rides, setRides] = useState([]);
  const auth = getAuth();

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const bookingsRef = collection(db, "USER", user.uid, "Bookings");
    const q = query(bookingsRef, orderBy("timestamp", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRides(data);
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Ride History</Text>
      {rides.length === 0 && <Text style={styles.text}>No rides found.</Text>}
      {rides.map((ride) => (
        <Text key={ride.id} style={styles.text}>
          • {ride.pickup} → {ride.drop} (₹{ride.fare})
        </Text>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", padding: 30 },
  title: { color: "#04c35c", fontSize: 28, marginBottom: 20 },
  text: { color: "#fff", fontSize: 18, marginBottom: 10 },
});
