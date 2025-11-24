import { useEffect } from "react";
import { useRouter } from "expo-router";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default function Index() {
  const router = useRouter();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // run after layout mounts
      setTimeout(() => {
        if (user) router.replace("/home");
        else router.replace("/auth/login");
      }, 0);
    });

    return unsubscribe;
  }, []);

  return null;
}
