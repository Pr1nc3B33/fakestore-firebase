import { useEffect, useState } from "react";
import { useOrders } from "../hooks/useOrders";
import type { Order } from "../hooks/useOrders";
import { useSelector } from "react-redux";
import { selectUser } from "../store/authStore";
import "./OrderHistory.css";

const PLACEHOLDER = "https://via.placeholder.com/60x60?text=No+Image";

interface Props {
  orderId: string;
  setPage: (page: string) => void;
}

export default function OrderDetail({ orderId, setPage }: Props) {
  const user = useSelector(selectUser);
  const { getOrder } = useOrders(user?.uid ?? null);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const data = await getOrder(orderId);
      if (data) setOrder(data);
      setLoading(false);
    };
    fetch();
  }, [orderId]);

  if (loading) {
    return (
      <main className="orders-page">
        <div className="orders-container">
          <div className="orders-loading">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="order-skeleton" />
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="orders-page">
        <div className="orders-container">
          <p>Order not found.</p>
          <button className="back-btn" onClick={() => setPage("orders")}>
            ← Back to orders
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="orders-page">
      <div className="orders-container">
        <button className="back-btn" onClick={() => setPage("orders")}>
          ← Back to orders
        </button>

        <h1 className="orders-title">Order Details</h1>

        <div className="order-meta">
          <p><strong>Order ID:</strong> {order.id}</p>
          <p>
            <strong>Date:</strong>{" "}
            {new Date(order.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <p>
            <strong>Total:</strong> ${order.total.toFixed(2)}
          </p>
        </div>

        <div className="order-products">
          {order.products.map((product) => (
            <div key={product.id} className="order-product">
              <div className="order-product__img-wrap">
                <img
                  src={product.image}
                  alt={product.title}
                  className="order-product__img"
                  onError={(e) => { e.currentTarget.src = PLACEHOLDER; }}
                />
              </div>
              <div className="order-product__info">
                <h3 className="order-product__title">{product.title}</h3>
                <p className="order-product__qty">Qty: {product.count}</p>
              </div>
              <span className="order-product__price">
                ${(product.price * product.count).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        <div className="order-total-row">
          <span>Total</span>
          <strong>${order.total.toFixed(2)}</strong>
        </div>
      </div>
    </main>
  );
}