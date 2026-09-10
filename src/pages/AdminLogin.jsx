import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { Lock } from "lucide-react";
import { db, COLLECTIONS } from "../firebase";
import { saveAdminSession } from "../lib/adminSession";
import logo from "../assets/logo.png";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!username.trim() || !password.trim()) return;
    setLoading(true);
    try {
      const q = query(collection(db, COLLECTIONS.ADMIN), where("username", "==", username.trim()));
      const snap = await getDocs(q);

      if (snap.empty) {
        setError("Username-ka ama password-ka waa khalad.");
        setLoading(false);
        return;
      }

      const adminDoc = snap.docs[0];
      const data = adminDoc.data();

      if (String(data.password) !== password) {
        setError("Username-ka ama password-ka waa khalad.");
        setLoading(false);
        return;
      }

      if (data.blocked) {
        setError("Account-kaaga waa la xidhay. La xiriir super admin-ka.");
        setLoading(false);
        return;
      }

      saveAdminSession({
        id: adminDoc.id,
        name: data.name || "",
        username: data.username,
        role: data.role || "admin",
        avatarUrl: data.avatarUrl || "",
      });
      navigate("/admin/dashboard");
    } catch (err) {
      console.error(err);
      setError("Wax baa qaldamay. Fadlan isku day mar kale.");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-navy-950 px-5">
      <div className="w-full max-w-sm rounded-sm border border-gold-500/20 bg-navy-900 p-8">
        <div className="flex flex-col items-center">
          <img src={logo} alt="Karaamo" className="h-16 w-16 rounded-full object-cover" />
          <p className="mt-4 flex items-center gap-1.5 font-[var(--font-display)] text-sm tracking-wide text-gold-400">
            <Lock size={14} /> Admin Login
          </p>
        </div>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <label className="text-xs font-medium text-cream/60">Username</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="mt-1 w-full rounded-sm border border-cream/15 bg-navy-800 px-3 py-2.5 text-sm text-cream outline-none focus:border-gold-500"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-cream/60">Password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              type="password"
              className="mt-1 w-full rounded-sm border border-cream/15 bg-navy-800 px-3 py-2.5 text-sm text-cream outline-none focus:border-gold-500"
            />
          </div>

          {error && <p className="text-sm text-clay">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-sm bg-gold-500 py-2.5 text-sm font-semibold text-navy-950 hover:bg-gold-400 disabled:opacity-60"
          >
            {loading ? "Waa la hubinayaa..." : "Gal"}
          </button>
        </form>
      </div>
    </div>
  );
}