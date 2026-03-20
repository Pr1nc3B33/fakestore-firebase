import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

export interface Order {
  id: string;
  userId: string;
  products: {
    id: string;
    title: string;
    price: number;
    image: string;
    count: number;
  }[];
  total: number;
  createdAt: string;
}

export const useOrders = (userId: string | null) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const q = query(
        collection(db, "orders"),
        where("userId", "==", userId)
      );
      const snapshot = await getDocs(q);
      const fetched = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Order[];

      // Sort by date newest first
      fetched.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setOrders(fetched);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const placeOrder = async (
    products: Order["products"],
    total: number
  ) => {
    if (!userId) return;
    try {
      const order = {
        userId,
        products,
        total,
        createdAt: new Date().toISOString(),
      };
      const docRef = await addDoc(collection(db, "orders"), order);
      setOrders((prev) => [{ id: docRef.id, ...order }, ...prev]);
      return docRef.id;
    } catch (err: any) {
      setError(err.message);
    }
  };

  const getOrder = async (orderId: string) => {
    try {
      const snapshot = await getDoc(doc(db, "orders", orderId));
      if (snapshot.exists()) {
        return { id: snapshot.id, ...snapshot.data() } as Order;
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [userId]);

  return { orders, loading, error, placeOrder, getOrder, fetchOrders };
};