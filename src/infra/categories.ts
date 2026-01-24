import { addDoc, updateDoc, collection, doc, deleteDoc, writeBatch } from "firebase/firestore";
import { db } from "../utils/firebase";
import { Collection } from "../enums/firebase";
import { getDefaultCategories } from "../mocks/defaultMocks";

export async function createCategory(houseHoldId: string, name: string) {
  const ref = await addDoc(collection(
    db,
    Collection.Households,
    houseHoldId,
    Collection.Categories,
  ), {
    name: name.trim(),
  });

  return ref.id;
}

export async function updateCategory(houseHoldId: string, categoryId: string, newName: string) {
  const categoryRef = doc(
    db,
    Collection.Households,
    houseHoldId,
    Collection.Categories,
    categoryId,
  );
  return await updateDoc(categoryRef, {
    name: newName.trim(),
  });
}

export async function deleteCategory(houseHoldId: string, categoryId: string) {
  const categoryRef = doc(
    db,
    Collection.Households,
    houseHoldId,
    Collection.Categories,
    categoryId,
  );
  return await deleteDoc(categoryRef);
}

export async function loadDefaultCategories(houseHoldId: string) {
  const batch = writeBatch(db);
  const categoriesRef = collection(
    db,
    Collection.Households,
    houseHoldId,
    Collection.Categories,
  );

  const defaultCategories = getDefaultCategories();

  defaultCategories.forEach((category) => {
    const newCategoryRef = doc(categoriesRef);
    batch.set(newCategoryRef, {
      name: category.name.trim(),
    });
  });

  await batch.commit();
}
