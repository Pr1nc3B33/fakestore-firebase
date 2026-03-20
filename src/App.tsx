import { useState, useEffect } from "react";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase/firebaseConfig";
import appStore from "./store/cartStore";
import { setUser, clearUser } from "./store/authStore";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Cart from "./components/Cart";
import Login from "./components/Login";
import Register from "./components/Register";
import OrderHistory from "./components/OrderHistory";
import OrderDetail from "./components/OrderDetail";
import Profile from "./components/Profile";
import ProductManager from "./components/ProductManager";


import "./App.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 2, refetchOnWindowFocus: false },
  },
});

export default function App() {
  const [page, setPage] = useState("login");
  const [selectedOrder, setSelectedOrder] = useState<string>("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        appStore.dispatch(setUser({ uid: user.uid, email: user.email }));
        setPage("home");
      } else {
        appStore.dispatch(clearUser());
        setPage("login");
      }
    });
    return () => unsubscribe();
  }, []);

  const renderPage = () => {
    switch (page) {
      case "home": return <Home />;
      case "cart": return <Cart />;
      case "login": return <Login setPage={setPage} />;
      case "register": return <Register setPage={setPage} />;
      case "profile": return <Profile setPage={setPage} />;      case "orders": return <OrderHistory setPage={setPage} setSelectedOrder={setSelectedOrder} />;
      case "orderDetail": return <OrderDetail orderId={selectedOrder} setPage={setPage} />;
      case "profile": return <Profile setPage={setPage} />;
      case "manage": return <ProductManager setPage={setPage} />;


      default: return <Home />;
    }
  };

  return (
    <Provider store={appStore}>
      <QueryClientProvider client={queryClient}>
        <div className="app">
          {page !== "login" && page !== "register" && (
            <Navbar page={page} setPage={setPage} />
          )}
          {renderPage()}
        </div>
      </QueryClientProvider>
    </Provider>
  );
}