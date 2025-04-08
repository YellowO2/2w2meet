import { ref } from "vue";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import type { User } from "../../../shared/User";

const auth = getAuth();
const currentUser = ref<User | null>(null);
const loading = ref(true);

// Initialize the auth state listener
onAuthStateChanged(auth, async (firebaseUser) => {
  loading.value = true;

  if (firebaseUser) {
    // User is signed in
    const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));

    if (userDoc.exists()) {
      // Get user data from Firestore
      currentUser.value = userDoc.data() as User;
    } else {
      // Create new user in Firestore
      const newUser: User = {
        id: firebaseUser.uid,
        email: firebaseUser.email || "",
        displayName:
          firebaseUser.displayName ||
          firebaseUser.email?.split("@")[0] ||
          "User",
        photoURL: firebaseUser.photoURL || "",
        events: [],
      };

      await setDoc(doc(db, "users", firebaseUser.uid), newUser);
      currentUser.value = newUser;
    }
  } else {
    // User is signed out
    currentUser.value = null;
  }

  loading.value = false;
});

export const useAuth = () => {
  const registerUser = async (
    email: string,
    password: string,
    displayName: string
  ) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Update the display name
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: displayName,
        });
      }

      // Create user in Firestore
      const newUser: User = {
        id: userCredential.user.uid,
        email: email,
        displayName: displayName,
        photoURL: "",
        events: [],
      };

      await setDoc(doc(db, "users", userCredential.user.uid), newUser);

      return { user: userCredential.user };
    } catch (error: any) {
      return { error: error.message };
    }
  };

  const loginUser = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      return { user: userCredential.user };
    } catch (error: any) {
      return { error: error.message };
    }
  };

  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();

      // Add these scopes to request email and profile info
      provider.addScope("https://www.googleapis.com/auth/userinfo.email");
      provider.addScope("https://www.googleapis.com/auth/userinfo.profile");

      // Set custom parameters for the Google popup
      provider.setCustomParameters({
        prompt: "select_account",
      });

      const userCredential = await signInWithPopup(auth, provider);

      // Make sure the user data is created/updated in Firestore
      if (userCredential.user) {
        const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));

        if (!userDoc.exists()) {
          // Create new user in Firestore
          const newUser: User = {
            id: userCredential.user.uid,
            email: userCredential.user.email || "",
            displayName:
              userCredential.user.displayName ||
              userCredential.user.email?.split("@")[0] ||
              "User",
            photoURL: userCredential.user.photoURL || "",
            events: [],
          };

          await setDoc(doc(db, "users", userCredential.user.uid), newUser);
        }
      }

      return { user: userCredential.user };
    } catch (error: any) {
      console.error("Google Sign In Error:", error);
      return { error: error.message };
    }
  };

  const logoutUser = async () => {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error: any) {
      return { error: error.message };
    }
  };

  const addEventToUser = async (eventId: string) => {
    if (!currentUser.value) return { error: "No user logged in" };

    try {
      // Update local state
      if (!currentUser.value.events.includes(eventId)) {
        currentUser.value.events.push(eventId);
      }

      // Update Firestore
      await setDoc(doc(db, "users", currentUser.value.id), currentUser.value);

      return { success: true };
    } catch (error: any) {
      return { error: error.message };
    }
  };

  return {
    currentUser,
    loading,
    registerUser,
    loginUser,
    loginWithGoogle,
    logoutUser,
    addEventToUser,
  };
};
