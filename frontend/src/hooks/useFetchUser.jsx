import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/config";

export function useFetchUser(userId) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) {
      setUser(null);
      setLoading(false);
      return;
    };

    setLoading(true);
    setError(null);

    const docRef = doc(db, "users", userId);

    const unsubscribe = onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          setUser({
            uid: docSnap.id,
            ...docSnap.data(),
          });
          setError(null);
        } else {
          setUser(null);
          setError("Usuário não encontrado.");
        }
        setLoading(false);
      },
      (err) => {
        console.error("Erro ao escutar usuário em tempo real:", err);
        setError("Erro ao buscar o usuário.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  return { user, loading, error };
}
