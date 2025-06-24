import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/firebase/config";
import { getAuth } from "firebase/auth";

export async function logAudit({
  reportId,
  action,
  oldStatus,
  newStatus,
  comment,
}) {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) return;

  await addDoc(collection(db, "auditlogs"), {
    timestamp: serverTimestamp(),
    userId: user.uid,
    userDisplayName: user.displayName || "Desconhecido",
    reportId,
    action,
    oldStatus,
    newStatus,
    comment: comment || null,
    userAgent: navigator.userAgent,
  });
}
