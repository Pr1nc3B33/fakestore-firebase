import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

export const useCategories = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const snapshot = await getDocs(collection(db, "products"));
        const all = snapshot.docs.map((doc) => doc.data().category);
        const unique = [...new Set(all)];
        setData(unique);
      } catch {
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
  }, []);

  return { data, isLoading };
};