import { addDoc, arrayUnion, collection, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "../utils/firebase";
import { Collection } from "../enums/firebase";

export async function createHousehold(userId: string, name: string) {
  const ref = await addDoc(collection(db, Collection.Households), {
    name,
    memberIds: [userId],
    createdAt: serverTimestamp(),
    createdBy: userId,
  });

  return ref.id;
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
