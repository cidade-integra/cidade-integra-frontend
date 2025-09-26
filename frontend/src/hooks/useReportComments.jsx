import { useEffect, useState, useCallback } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  limit,
  startAfter,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase/config"; 
import {useCurrentUser} from "@/hooks/useCurrentUser";
import { useToast } from "@/hooks/use-toast";

export function useReportComments(reportId, pageSize = 5) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastDoc, setLastDoc] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const { toast } = useToast();
  const { user } = useCurrentUser();

  const REPORT_COLLECTION = "reports";
  const COMMENTS_SUBCOLLECTION = "comments";

  // Carrega a primeira página
  useEffect(() => {
    if (!reportId) return;
    setLoading(true);

    const commentsRef = collection(db, REPORT_COLLECTION, reportId, COMMENTS_SUBCOLLECTION);
    const q = query(commentsRef, orderBy("createdAt", "desc"), limit(pageSize + 1));

    getDocs(q)
      .then((snapshot) => {
        const fetchedComments = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setHasMore(fetchedComments.length > pageSize);
        setComments(fetchedComments.slice(0, pageSize));
        setLastDoc(snapshot.docs[Math.min(pageSize - 1, snapshot.docs.length - 1)]);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, [reportId, pageSize]);

  // Carrega mais comentários
  const loadMore = useCallback(async () => {
    if (!reportId || !lastDoc) return;
    setLoading(true);

    const commentsRef = collection(db, REPORT_COLLECTION, reportId, COMMENTS_SUBCOLLECTION);
    const q = query(
      commentsRef,
      orderBy("createdAt", "desc"),
      startAfter(lastDoc),
      limit(pageSize + 1)
    );

    try {
      const snapshot = await getDocs(q);
      const fetchedComments = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setHasMore(fetchedComments.length > pageSize);
      setComments((prev) => [...prev, ...fetchedComments.slice(0, pageSize)]);
      setLastDoc(snapshot.docs[Math.min(pageSize - 1, snapshot.docs.length - 1)]);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [reportId, lastDoc, pageSize]);

  const addComment = useCallback(
    async (message) => {

      try {
        if (!reportId) throw new Error("reportId não informado.");
        if (!user) throw new Error("Usuário não autenticado.");
        if (!message?.trim()) throw new Error("Comentário vazio.");

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
      } catch (err) {
        toast({
          title: "❌ Erro ao adicionar comentário",
          description: err.message,
          status: "error",
        });
        throw err;
      }
    },
    [reportId, user, toast]
  );

  return {
    comments,
    loading,
    error,
    addComment,
    loadMore,
    hasMore,
  };
}