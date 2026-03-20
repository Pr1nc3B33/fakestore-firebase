import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { deleteUser } from "firebase/auth";
import { db, auth } from "../firebase/firebaseConfig";
import { selectUser, clearUser } from "../store/authStore";
import "./Profile.css";

interface Props {
  setPage: (page: string) => void;
}

interface UserProfile {
  name: string;
  email: string;
  address: string;
}

export default function Profile({ setPage }: Props) {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    email: "",
    address: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      try {
        const snapshot = await getDoc(doc(db, "users", user.uid));
        if (snapshot.exists()) {
          setProfile(snapshot.data() as UserProfile);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setError(null);
    try {
      await updateDoc(doc(db, "users", user.uid), {
        name: profile.name,
        address: profile.address,
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!user) return;
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This cannot be undone."
    );
    if (!confirmed) return;
    try {
      await deleteDoc(doc(db, "users", user.uid));
      await deleteUser(auth.currentUser!);
      dispatch(clearUser());
      setPage("login");
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <main className="profile-page">
        <div className="profile-container">
          <div className="profile-skeleton" />
        </div>
      </main>
    );
  }

  return (
    <main className="profile-page">
      <div className="profile-container">
        <h1 className="profile-title">Your Profile</h1>

        {success && (
          <div className="profile-success">
            ✓ Profile updated successfully
          </div>
        )}

        {error && <p className="profile-error">⚠️ {error}</p>}

        <form className="profile-form" onSubmit={handleUpdate}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              value={profile.name}
              onChange={(e) =>
                setProfile((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="Your name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={profile.email}
              disabled
              className="input--disabled"
            />
            <p className="input-hint">Email cannot be changed</p>
          </div>

          <div className="form-group">
            <label htmlFor="address">Address</label>
            <input
              id="address"
              type="text"
              value={profile.address}
              onChange={(e) =>
                setProfile((prev) => ({ ...prev, address: e.target.value }))
              }
              placeholder="Your address"
            />
          </div>

          <button className="profile-btn" type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save changes"}
          </button>
        </form>

        <div className="danger-zone">
          <h2 className="danger-zone__title">Danger Zone</h2>
          <p className="danger-zone__desc">
            Deleting your account is permanent and cannot be undone.
          </p>
          <button className="danger-btn" onClick={handleDelete}>
            Delete account
          </button>
        </div>
      </div>
    </main>
  );
}