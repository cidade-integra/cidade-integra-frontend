import {
  collection,
  query,
  orderBy,
  limit,
  getDoc,
  getDocs,
  startAfter,
  doc,
  updateDoc,
  deleteDoc,
  Timestamp,
  addDoc,
  increment,
  where,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { useState } from "react";
import { useUploadImageReport } from "./useUploadImageReport";
import { logAudit } from "@/utils/logAudit";

const REPORT_COLLECTION = "reports";

export function useReport() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const reportsRef = collection(db, REPORT_COLLECTION);

  // criar denúncia
  const createReport = async (report) => {
    setLoading(true);
    setError(null);

    try {
      const now = Timestamp.now();
      let imagemUrlSupabase = null;

      // se houver imagem, faz upload no Supabase
      if (report.imagemFile && report.userId) {
        const uploadResult = await useUploadImageReport(
          report.imagemFile,
          report.userId
        );

        if (!uploadResult.success) {
          throw new Error(
            uploadResult.error || "Falha ao fazer upload da imagem."
          );
        }

        imagemUrlSupabase = uploadResult.url;
      }

      // monta o objeto da denúncia
      const reportData = {
        ...report,
        imagemUrl: imagemUrlSupabase || null,
        createdAt: now,
        updatedAt: now,
        status: "pending",
        resolvedAt: null,
      };

      delete reportData.imagemFile; // remover o File do objeto antes de salvar no Firestore

      const docRef = await addDoc(reportsRef, reportData);

      // atualiza contador de denúncias do usuário, se aplicável
      if (report.userId) {
        const userRef = doc(db, "users", report.userId);
        await updateDoc(userRef, {
          reportCount: increment(1),
        });
      }

      return docRef.id;
    } catch (err) {
      console.error("Erro ao criar denúncia:", err);
      setError(err.message || "Erro desconhecido ao criar denúncia.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // buscar denúncia por ID
  const getReportById = async (id) => {
    setLoading(true);
    setError(null);

    try {
      const docSnap = await getDoc(doc(db, REPORT_COLLECTION, id));
      if (docSnap.exists()) {
        return { reportId: docSnap.id, ...docSnap.data() };
      }
      return null;
    } catch (err) {
      setError(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // buscar todas as denúncias
  const getAllReports = async (userId) => {
    setLoading(true);
    setError(null);

    try {
      let q = query(reportsRef, orderBy("createdAt", "desc"));
      if (userId) {
        q = query(
          reportsRef,
          where("userId", "==", userId),
          orderBy("createdAt", "desc")
        );
      }

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        reportId: doc.id,
        ...doc.data(),
      }));
    } catch (err) {
      setError(err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // buscar as primeiras denúncias
  const getInitialReports = async (verifyLimitCount, limitCount) => {
    try {
      const qVerify = query(
        collection(db, REPORT_COLLECTION),
        orderBy("createdAt", "desc"),
        limit(verifyLimitCount)
      );
      const snapshotVerify = await getDocs(qVerify);

      const verify = snapshotVerify.docs.map((doc) => ({
        reportId: doc.id,
        ...doc.data(),
      }));

      const qReports = query(
        collection(db, REPORT_COLLECTION),
        orderBy("createdAt", "desc"),
        limit(limitCount)
      );
      const snapshot = await getDocs(qReports);

      const reports = snapshot.docs.map((doc) => ({
        reportId: doc.id,
        ...doc.data(),
      }));

      const lastVisible = snapshot.docs[snapshot.docs.length - 1] ?? null;

      return { verify, reports, lastVisible };
    } catch (err) {
      throw err;
    }
  };

  // buscar mais denúncias
  const getMoreReports = async (lastDoc, verifyLimitCount, limitCount) => {
    try {
      const qMoreVerify = query(
        collection(db, REPORT_COLLECTION),
        orderBy("createdAt", "desc"),
        startAfter(lastDoc),
        limit(verifyLimitCount)
      );
      const snapshotVerify = await getDocs(qMoreVerify);

      const verify = snapshotVerify.docs.map((doc) => ({
        reportId: doc.id,
        ...doc.data(),
      }));

      const qMoreReports = query(
        collection(db, REPORT_COLLECTION),
        orderBy("createdAt", "desc"),
        startAfter(lastDoc),
        limit(limitCount)
      );
      const snapshot = await getDocs(qMoreReports);

      const reports = snapshot.docs.map((doc) => ({
        reportId: doc.id,
        ...doc.data(),
      }));

      const newLastVisible = snapshot.docs[snapshot.docs.length - 1] ?? null;

      return { verify, reports, lastVisible: newLastVisible };
    } catch (err) {
      throw err;
    }
  };

  // atualizar denúncia
  const updateReport = async (id, updates) => {
    setLoading(true);
    setError(null);

    try {
      await updateDoc(doc(db, REPORT_COLLECTION, id), {
        ...updates,
        updatedAt: Timestamp.now(),
      });
      return true;
    } catch (err) {
      setError(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // deletar denúncia
  const deleteReport = async (id) => {
    setLoading(true);
    setError(null);

    try {
      await deleteDoc(doc(db, REPORT_COLLECTION, id));
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // atualizar o status da denúncia
  const updateStatus = async (reportId, newStatus, comment = null) => {
    setLoading(true);
    setError(null);

    try {
      const reportRef = doc(db, REPORT_COLLECTION, reportId);
      const snapshot = await getDoc(reportRef);
      const reportData = snapshot.data();

      const oldStatus = reportData?.status || "unknown";

      const update = {
        status: newStatus,
        updatedAt: Timestamp.now(),
      };

      if (newStatus === "resolved") {
        update.resolvedAt = Timestamp.now();
      }

      await updateDoc(reportRef, update);

      await logAudit({
        reportId,
        action: "status_change",
        oldStatus,
        newStatus,
        comment,
      });
    } catch (err) {
      console.error("Erro ao atualizar o status:", err);
      setError("Ocorreu um erro ao atualizar o status da denúncia.");
    } finally {
      setLoading(false);
    }
  };

  // funções para atualizar o status de cada denúncia
  const markAsResolved = (id, comment) => updateStatus(id, "resolved", comment);
  const markAsInReview = (id, comment) => updateStatus(id, "review", comment);
  const markAsRejected = (id, comment) => updateStatus(id, "rejected", comment);

  return {
    loading,
    error,
    createReport,
    getReportById,
    getAllReports,
    updateReport,
    deleteReport,
    markAsResolved,
    markAsInReview,
    markAsRejected,
    getInitialReports,
    getMoreReports,
  };
}
