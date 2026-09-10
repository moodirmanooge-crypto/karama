import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { LogIn } from "lucide-react";
import { db, COLLECTIONS } from "../firebase";
import { saveUserSession } from "../lib/userSession";

export default function UserLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email.trim() || !password.trim()) return;
    setLoading(true);
    try {
      const q = query(collection(db, COLLECTIONS.REGISTRATIONS), where("email", "==", email.trim().toLowerCase()));
      const snap = await getDocs(q);

      if (snap.empty) {
        setError("Email-ka ama password-ka waa khalad.");
        setLoading(false);
        return;
      }

      const regDoc = snap.docs[0];
      const data = regDoc.data();

      if (String(data.password) !== password) {
        setError("Email-ka ama password-ka waa khalad.");
        setLoading(false);
        return;
      }

      if (data.status === "rejected") {
        setError("Codsigaaga waa la diiday. Fadlan la xiriir maamulka KARAAMO.");
        setLoading(false);
        return;
      }

      if (data.status !== "accepted") {
        setError("Weli lama aqbalin codsigaaga. Fadlan sug ilaa maamulku ku aqbalo.");
        setLoading(false);
        return;
      }

      saveUserSession({
        id: regDoc.id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        location: data.location,
      });
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Wax baa qaldamay. Fadlan isku day mar kale.");
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-5 pt-28 md:px-8">
      <div className="rounded-sm border border-navy-900/10 bg-white p-8">
        <div className="flex flex-col items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-navy-900">
            <LogIn size={20} className="text-gold-400" />
          </div>
          <h1 className="mt-4 font-[var(--font-display)] text-xl font-semibold text-navy-900">Dashboard-kaaga</h1>
          <p className="mt-1 text-center text-xs text-navy-900/50">
            Isticmaal email-ka iyo password-ka aad ku isdiiwaangelisay.
          </p>
        </div>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <label className="text-xs font-medium text-navy-900/70">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              type="email"
              className="mt-1 w-full rounded-sm border border-navy-900/15 px-3 py-2.5 text-sm outline-none focus:border-gold-500"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-navy-900/70">Password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              type="password"
              className="mt-1 w-full rounded-sm border border-navy-900/15 px-3 py-2.5 text-sm outline-none focus:border-gold-500"
            />
          </div>

          {error && <p className="text-sm text-clay">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-sm bg-navy-900 py-2.5 text-sm font-medium text-cream hover:bg-gold-500 hover:text-navy-950 disabled:opacity-60"
          >
            {loading ? "Waa la hubinayaa..." : "Login"}
          </button>

          <p className="text-center text-xs text-navy-900/50">
            Weli ma isdiiwaangelin?{" "}
            <Link to="/registration" className="font-medium text-gold-600 underline">
              Isdiiwaangeli
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}