import { useSelector } from "react-redux";
import { selectUser } from "../store/authStore";
import { useOrders } from "../hooks/useOrders";
import "./OrderHistory.css";

interface Props {
  setPage: (page: string) => void;
  setSelectedOrder: (id: string) => void;
}

export default function OrderHistory({ setPage, setSelectedOrder }: Props) {
  const user = useSelector(selectUser);
  const { orders, loading, error } = useOrders(user?.uid ?? null);

  const handleOrderClick = (orderId: string) => {
    setSelectedOrder(orderId);
    setPage("orderDetail");
  };

  if (loading) {
    return (
      <main className="orders-page">
        <div className="orders-container">
          <h1 className="orders-title">Order History</h1>
          <div className="orders-loading">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="order-skeleton" />
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="orders-page">
      <div className="orders-container">
        <h1 className="orders-title">Order History</h1>

        {error && <p className="orders-error">⚠️ {error}</p>}

        {orders.length === 0 && !loading && (
          <div className="orders-empty">
            <span className="orders-empty__icon">📦</span>
            <h2>No orders yet</h2>
            <p>Your completed orders will appear here.</p>
          </div>
        )}

        <div className="orders-list">
          {orders.map((order) => (
            <button
              key={order.id}
              className="order-card"
              onClick={() => handleOrderClick(order.id)}
            >
              <div className="order-card__left">
                <p className="order-card__id">Order #{order.id.slice(0, 8)}...</p>
                <p className="order-card__date">
                  {new Date(order.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <p className="order-card__items">
                  {order.products.reduce((sum, p) => sum + p.count, 0)} items
                </p>
              </div>
              <div className="order-card__right">
                <span className="order-card__total">
                  ${order.total.toFixed(2)}
                </span>
                <span className="order-card__arrow">→</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}