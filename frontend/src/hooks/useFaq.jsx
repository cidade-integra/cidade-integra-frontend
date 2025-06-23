import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config"; // ou "../config.jsx"

export const useFaq = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const snapshot = await getDocs(collection(db, "faq"));
        const allFaqs = [];

        snapshot.forEach((doc) => {
          const data = doc.data();
          const categoria = doc.id; // Ex: "account", "platform"
          const items = data.items || [];

          items.forEach((item) => {
            allFaqs.push({
              id: item.id,
              pergunta: item.question,
              resposta: item.answer,
              categoria: categoria,
            });
          });
        });

        setFaqs(allFaqs);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFaqs();
  }, []);

  return { faqs, loading, error };
};
