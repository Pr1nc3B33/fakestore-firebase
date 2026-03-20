import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useDispatch } from "react-redux";
import { setUser } from "../store/authStore";
import "./Login.css";

interface Props {
  setPage: (page: string) => void;
}

export default function Register({ setPage }: Props) {
  const { register, error, loading } = useAuth();
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = await register(email, password, name);
    if (user) {
      dispatch(setUser({ uid: user.uid, email: user.email }));
      setPage("home");
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Create account</h1>
        <p className="auth-sub">Start shopping today</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {error && <p className="auth-error">{error}</p>}

          <button className="auth-btn" type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account?{" "}
          <button className="auth-link" onClick={() => setPage("login")}>
            Sign in
          </button>
        </p>
      </div>
    </main>
  );
}