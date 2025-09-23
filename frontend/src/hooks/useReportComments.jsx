import { useEffect, useState, useCallback } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase/config"; 
import {useCurrentUser} from "@/hooks/useCurrentUser";

export function useReportComments(reportId) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { user } = useCurrentUser();

  const REPORT_COLLECTION = "reports";
  const COMMENTS_SUBCOLLECTION = "comments";

  useEffect(() => {
    if (!reportId) return;

    setLoading(true);

    const commentsRef = collection(db, REPORT_COLLECTION, reportId, COMMENTS_SUBCOLLECTION);
    const q = query(commentsRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetchedComments = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setComments(fetchedComments);
        setLoading(false);
      },
      (err) => {
        console.error("Erro ao carregar comentários:", err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [reportId]);

  const addComment = useCallback(
    async (message) => {
      if (!reportId) throw new Error("reportId não informado.");
      if (!user) throw new Error("Usuário não autenticado.");
      if (!message?.trim()) throw new Error("Comentário vazio.");

      console.log(user)

      const commentData = {
        author: user.displayName || "Usuário",
        authorId: user.uid,
        message: message.trim(),
        createdAt: serverTimestamp(),
        avatarColor: user.role === "admin" ? "verde-escuro" : "gray",
        role: user.role || "user",
      };

      const commentsRef = collection(db, REPORT_COLLECTION, reportId, COMMENTS_SUBCOLLECTION);
      await addDoc(commentsRef, commentData);
    },
    [reportId, user]
  );

  return {
    comments,
    loading,
    error,
    addComment,
  };
}