import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Alert,
} from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import { Picker } from "@react-native-picker/picker";  // <- import Picker here
import { useRouter } from "expo-router";
import {
  doc,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../../firebase";

export default function BookRide() {
  const router = useRouter();

  const locations = [
    { name: "New Delhi", latitude: 28.6139, longitude: 77.209, ratePerKm: 10 },
    { name: "India Gate", latitude: 28.6129, longitude: 77.2295, ratePerKm: 12 },
    { name: "Connaught Place", latitude: 28.6304, longitude: 77.2177, ratePerKm: 11 },
    { name: "Karol Bagh", latitude: 28.651, longitude: 77.19, ratePerKm: 9 },
    { name: "Airport", latitude: 28.5562, longitude: 77.1, ratePerKm: 15 },
  ];

  const [pickup, setPickup] = useState("New Delhi");
  const [drop, setDrop] = useState("India Gate");

  const pickupCoords = locations.find((l) => l.name === pickup);
  const dropCoords = locations.find((l) => l.name === drop);

  const calculateDistanceKm = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  const calculateFare = () => {
    if (!pickupCoords || !dropCoords) return 0;

    const distance = calculateDistanceKm(
      pickupCoords.latitude,
      pickupCoords.longitude,
      dropCoords.latitude,
      dropCoords.longitude
    );

    const avgRate = (pickupCoords.ratePerKm + dropCoords.ratePerKm) / 2;

    return Math.round(distance * avgRate);
  };

  const fare = calculateFare();

  const drivers = [
    { id: 1, latitude: 28.615, longitude: 77.21 },
    { id: 2, latitude: 28.61, longitude: 77.205 },
    { id: 3, latitude: 28.617, longitude: 77.215 },
    { id: 4, latitude: 28.614, longitude: 77.22 },
  ];

  const auth = getAuth();

  const handleBookRide = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert("Error", "User not logged in");
        return;
      }

      const userDocRef = doc(db, "Users", user.uid);
      const bookingsCollectionRef = collection(userDocRef, "Bookings");

      await addDoc(bookingsCollectionRef, {
        pickup,
        drop,
        fare,
        timestamp: serverTimestamp(),
      });

      Alert.alert("Success", "Ride booked successfully!");
      router.push("/home/trip");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: pickupCoords?.latitude || 28.6139,
          longitude: pickupCoords?.longitude || 77.209,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {pickupCoords && <Marker coordinate={pickupCoords} title="Pickup" pinColor="blue" />}
        {dropCoords && <Marker coordinate={dropCoords} title="Drop" pinColor="red" />}
        {drivers.map((driver) => (
          <Marker
            key={driver.id}
            coordinate={{ latitude: driver.latitude, longitude: driver.longitude }}
            title={`Driver ${driver.id}`}
            pinColor="green"
          />
        ))}
        {pickupCoords && dropCoords && (
          <Polyline coordinates={[pickupCoords, dropCoords]} strokeColor="#04c35c" strokeWidth={4} />
        )}
      </MapView>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.inputWrapper}
      >
        <ScrollView contentContainerStyle={styles.inputContainer}>
          <Text style={{ color: "#fff", marginBottom: 5, fontWeight: "bold" }}>
            Pickup Location
          </Text>
          <Picker
            selectedValue={pickup}
            onValueChange={(itemValue) => setPickup(itemValue)}
            style={styles.picker}
            dropdownIconColor="#0ff"
          >
            {locations.map((loc) => (
              <Picker.Item key={loc.name} label={loc.name} value={loc.name} />
            ))}
          </Picker>

          <Text style={{ color: "#fff", marginBottom: 5, fontWeight: "bold", marginTop: 20 }}>
            Drop Location
          </Text>
          <Picker
            selectedValue={drop}
            onValueChange={(itemValue) => setDrop(itemValue)}
            style={styles.picker}
            dropdownIconColor="#0ff"
          >
            {locations.map((loc) => (
              <Picker.Item key={loc.name} label={loc.name} value={loc.name} />
            ))}
          </Picker>

          <Text
            style={{
              color: "#0ff",
              fontSize: 20,
              textAlign: "center",
              marginVertical: 15,
            }}
          >
            Estimated Fare: ₹{fare}
          </Text>

          <TouchableOpacity style={styles.button} onPress={handleBookRide}>
            <Text style={styles.buttonText}>Book Ride</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#0ff" }]}
            onPress={() => router.push("/home/profile")}
          >
            <Text style={styles.buttonText}>View Profile</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  inputWrapper: { position: "absolute", top: 50, left: 0, right: 0 },
  inputContainer: {
    paddingHorizontal: 20,
    paddingVertical: 25,
    backgroundColor: "#111",
    marginHorizontal: 20,
    borderRadius: 15,
    shadowColor: "#0ff",
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 10,
  },
  picker: {
    backgroundColor: "#222",
    color: "#fff",
  },
  button: {
    backgroundColor: "#04c35c",
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 18,
  },
});
