import { addDoc, updateDoc, collection, doc, deleteDoc } from "firebase/firestore";
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
