import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import type { User } from "firebase/auth";
import { db } from "../utils/firebase";
import { Collection } from "../enums/firebase";

export async function ensureUserProfile(user: User) {
  const userRef = doc(db, Collection.Users, user.uid);
  const snap = await getDoc(userRef);

  if (!snap.exists()) {
    await setDoc(userRef, {
      displayName: user.displayName ?? user.email ?? "Unknown user",
      photoURL: user.photoURL ?? null,
      createdAt: serverTimestamp(),
    });
  } else {
    await setDoc(
      userRef,
      {
        displayName: user.displayName ?? user.email ?? snap.data().displayName,
        photoURL: user.photoURL ?? snap.data().photoURL ?? null,
      },
      { merge: true }
    );
  }
}
