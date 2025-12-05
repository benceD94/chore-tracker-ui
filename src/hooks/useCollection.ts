import { useEffect, useState } from "react";
import {
  onSnapshot,
  Query,
  type DocumentData,
  FirestoreError,
} from "firebase/firestore";

export function useCollection<T = DocumentData>(
  query: Query<T> | null
): {
  data: (T & { id: string })[] | null;
  loading: boolean;
  error: FirestoreError | null;
} {
  const [data, setData] = useState<(T & { id: string })[] | null>(null);
  const [loading, setLoading] = useState<boolean>(!!query);
  const [error, setError] = useState<FirestoreError | null>(null);

  useEffect(() => {
    if (!query) {
      setData(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsub = onSnapshot(
      query,
      (snapshot) => {
        const docs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as T),
        }));
        setData(docs);
        setLoading(false);
      },
      (err) => {
        console.error("Firestore subscribe error:", err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsub();
  }, [query]);

  return { data, loading, error };
}
