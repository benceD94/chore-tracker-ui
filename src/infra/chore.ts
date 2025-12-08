import { addDoc, updateDoc, collection, doc, deleteDoc, serverTimestamp, writeBatch } from "firebase/firestore";
import { db } from "../utils/firebase";
import { Collection } from "../enums/firebase";
import type { ChoreInput } from "../pages/Chores";

export async function createChore(householdId: string, value: ChoreInput) {
  const categoryRef = doc(
    db,
    Collection.Households,
    householdId,
    Collection.Categories,
    value.categoryId
  );
  const ref = await addDoc(collection(
    db,
    Collection.Households,
    householdId,
    Collection.Chores,
  ), {
    name: value.name.trim(),
    categoryRef,
    categoryName: value.categoryName.trim(),
    points: value.points,
  });

  return ref.id;
}

export async function updateChore(householdId: string, choreId: string, value: ChoreInput) {
  const categoryRef = doc(
    db,
    Collection.Households,
    householdId,
    Collection.Categories,
    value.categoryId
  );
  const choreRef = doc(
    db,
    Collection.Households,
    householdId,
    Collection.Chores,
    choreId,
  );
  return await updateDoc(choreRef, {
    name: value.name.trim(),
    categoryRef,
    categoryName: value.categoryName.trim(),
    points: value.points,
  });
}

export async function deleteChore(householdId: string, choreId: string) {
  const choreRef = doc(
    db,
    Collection.Households,
    householdId,
    Collection.Chores,
    choreId,
  );
  return await deleteDoc(choreRef);
}

export async function registerChoreDone(options: {
  householdId: string;
  choreId: string;
  userId: string;
  points: number;
}) {
  const { householdId, choreId, userId, points } = options;

  const registryCol = collection(db, Collection.Households, householdId, Collection.Registry);
  const choreRef = doc(db, Collection.Households, householdId, Collection.Chores, choreId);
  const userRef = doc(db, Collection.Users, userId);

  await addDoc(registryCol, {
    choreRef,
    userRef,
    points,
    completedAt: serverTimestamp(),
  });
}

export async function registerMultipleChoresDone(options: {
  householdId: string;
  userId: string;
  items: { choreId: string; points: number; times?: number }[]; // times = how many times this chore was done
}) {
  const { householdId, userId, items } = options;

  const registryColRef = collection(db, Collection.Households, householdId, Collection.Registry);
  const userRef = doc(db, Collection.Users, userId);
  const batch = writeBatch(db);

  items.forEach((item) => {
    const times = item.times ?? 1;
    const choreRef = doc(db, Collection.Households, householdId, Collection.Chores, item.choreId);

    for (let i = 0; i < times; i++) {
      const entryRef = doc(registryColRef);
      batch.set(entryRef, {
        choreRef,
        userRef,
        points: item.points,
        completedAt: serverTimestamp(),
      });
    }
  });

  await batch.commit();
}