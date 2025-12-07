import { addDoc, collection, serverTimestamp } from "firebase/firestore";
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
