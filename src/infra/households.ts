import { addDoc, arrayUnion, collection, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "../utils/firebase";
import { Collection } from "../enums/firebase";
import { loadDefaultCategories } from "./categories";
import { loadDefaultChores } from "./chore";

export async function createHousehold(userId: string, name: string) {
  const ref = await addDoc(collection(db, Collection.Households), {
    name,
    memberIds: [userId],
    createdAt: serverTimestamp(),
    createdBy: userId,
  });

  const householdId = ref.id;

  // Automatically load default categories and chores for new household
  await loadDefaultCategories(householdId);
  await loadDefaultChores(householdId);

  return householdId;
}

export async function updateHousehold(houseHoldId: string, newName: string) {
  const householdRef = doc(
    db,
    Collection.Households,
    houseHoldId,
  );
  return await updateDoc(householdRef, {
    name: newName.trim(),
  });
}

export async function addHouseholdMember(
  householdId: string,
  memberId: string
) {
  const householdRef = doc(db, Collection.Households, householdId);

  await updateDoc(householdRef, {
    memberIds: arrayUnion(memberId),
  });
}
