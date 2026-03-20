import { useSelector, useDispatch } from "react-redux";
import { selectCartCount } from "../store/cartStore";
import { selectUser, clearUser } from "../store/authStore";
import { useAuth } from "../hooks/useAuth";
import "./Navbar.css";

export default function Navbar({ page, setPage }) {
  const count = useSelector(selectCartCount);
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    dispatch(clearUser());
    setPage("login");
  };

  return (
    <header className="navbar">
      <div className="navbar__inner">
        <button className="navbar__logo" onClick={() => setPage("home")}>
          <span className="logo-icon">🛒</span>
          <span className="logo-text">FakeStore</span>
        </button>
        <nav className="navbar__nav">
          <button
            className={`nav-link ${page === "home" ? "nav-link--active" : ""}`}
            onClick={() => setPage("home")}
          >
            Shop
          </button>
          <button
            className={`nav-link ${page === "profile" ? "nav-link--active" : ""}`}
            onClick={() => setPage("profile")}
          >
            Profile
          </button>
          <button
            className={`nav-link ${page === "orders" ? "nav-link--active" : ""}`}
            onClick={() => setPage("orders")}
          >
            Orders
          </button>
          <button
            className={`nav-link nav-link--cart ${page === "cart" ? "nav-link--active" : ""}`}
            onClick={() => setPage("cart")}
          >
            Cart
            {count > 0 && <span className="cart-badge">{count}</span>}
          </button>
          {user && (
            <>
              <button className="nav-link nav-link--logout" onClick={handleLogout}>
                Logout
              </button>
              <button className={`nav-link ${page === "manage" ? "nav-link--active" : ""}`} onClick={() => setPage("manage")}>Manage</button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}