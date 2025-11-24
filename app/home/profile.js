import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { getAuth } from "firebase/auth";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";

export default function Profile() {
  const [totalBookings, setTotalBookings] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [email, setEmail] = useState("");
  const auth = getAuth();

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    setEmail(user.email);

    const bookingsRef = collection(db, "USER", user.uid, "Bookings");

    const unsubscribe = onSnapshot(bookingsRef, (snapshot) => {
      let count = 0;
      let amount = 0;
      snapshot.forEach(doc => {
        count += 1;
        amount += doc.data().fare || 0;
      });
      setTotalBookings(count);
      setTotalAmount(amount);
    });

    return () => unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Profile</Text>

      <Text style={styles.label}>Email</Text>
      <Text style={styles.info}>{email}</Text>

      <Text style={styles.label}>Total Bookings</Text>
      <Text style={styles.info}>{totalBookings}</Text>

      <Text style={styles.label}>Total Amount Spent</Text>
      <Text style={styles.info}>₹{totalAmount}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingHorizontal: 20,
    paddingTop: 60,
    alignItems: "flex-start",
  },
  title: {
    fontSize: 28,
    color: "#04c35c",
    fontWeight: "bold",
    marginBottom: 30,
  },
  label: {
    fontSize: 18,
    color: "#0ff",
    marginBottom: 5,
  },
  info: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "600",
    marginBottom: 20,
  },
});
