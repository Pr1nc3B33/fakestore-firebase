import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

export interface Product {
  id: string;
  title: string;
  price: number;
  category: string;
  description: string;
  image: string;
  rating: { rate: number; count: number };
}

export const useProducts = (category: string) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const snapshot = await getDocs(collection(db, "products"));
      const all = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Product[];

      const filtered =
        category && category !== "all"
          ? all.filter((p) => p.category === category)
          : all;

      setProducts(filtered);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [category]);

  const addProduct = async (product: Omit<Product, "id">) => {
    try {
      const docRef = await addDoc(collection(db, "products"), product);
      setProducts((prev) => [...prev, { id: docRef.id, ...product }]);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    try {
      await updateDoc(doc(db, "products", id), updates);
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
      );
    } catch (err: any) {
      setError(err.message);
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await deleteDoc(doc(db, "products", id));
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err: any) {
      setError(err.message);
    }
  };

  return {
    products,
    loading,
    error,
    refetch: fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct,
  };
};