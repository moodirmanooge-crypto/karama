import { useState } from "react";
import { Link } from "react-router-dom";
import { collection, addDoc, getDocs, query, where, serverTimestamp } from "firebase/firestore";
import { db, COLLECTIONS } from "../firebase";

export default function Registration() {
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "", location: "", message: "" });
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name.trim() || !form.email.trim() || !form.password.trim() || !form.phone.trim() || !form.location.trim()) {
      return;
    }

    setStatus("saving");
    try {
      const dupCheck = query(collection(db, COLLECTIONS.REGISTRATIONS), where("email", "==", form.email.trim().toLowerCase()));
      const dupSnap = await getDocs(dupCheck);
      if (!dupSnap.empty) {
        setError("Email-kan horey ayaa loo isticmaalay. Fadlan isku day inaad Login gasho.");
        setStatus("error");
        return;
      }

      await addDoc(collection(db, COLLECTIONS.REGISTRATIONS), {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password.trim(),
        phone: form.phone.trim(),
        location: form.location.trim(),
        message: form.message.trim(),
        status: "pending",
        createdAt: serverTimestamp(),
      });
      setStatus("done");
    } catch (err) {
      console.error(err);
      setError("Wax baa qaldamay. Isku day mar kale.");
      setStatus("error");
    }
  };

  return (
    <div className="mx-auto max-w-lg px-5 pb-16 pt-28 md:px-8">
      <p className="font-[var(--font-display)] text-sm tracking-wide text-gold-500">Isdiiwaangeli</p>
      <h1 className="mt-3 font-[var(--font-display)] text-3xl font-semibold text-navy-900">Registration</h1>
      <p className="mt-3 text-sm text-navy-900/60">
        Isdiiwaangeli si aad account u yeelato. Marka lagu aqbalo, waxaad ku geli kartaa dashboard-kaaga adigoo
        isticmaalaya email-kaaga iyo password-kaaga.
      </p>

      <div className="mt-8 rounded-sm border border-navy-900/10 bg-white p-6">
        {status === "done" ? (
          <div>
            <p className="text-sm text-moss">
              Waad ku guulaysatay isdiiwaangelinta. Waxaan kula soo xiriiri doonaa dhowaan si aan codsigaaga u aqbalno.
            </p>
            <p className="mt-3 text-sm text-navy-900/70">
              Marka la aqbalo, ku gal{" "}
              <Link to="/login" className="font-medium text-gold-600 underline">
                dashboard-kaaga
              </Link>{" "}
              adigoo isticmaalaya email-kaaga iyo password-kaaga.
            </p>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-navy-900/70">Magacaaga</label>
              <input
                value={form.name}
                onChange={update("name")}
                required
                className="mt-1 w-full rounded-sm border border-navy-900/15 px-3 py-2.5 text-sm outline-none focus:border-gold-500"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-navy-900/70">Email</label>
              <input
                value={form.email}
                onChange={update("email")}
                required
                type="email"
                className="mt-1 w-full rounded-sm border border-navy-900/15 px-3 py-2.5 text-sm outline-none focus:border-gold-500"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-navy-900/70">Password</label>
              <input
                value={form.password}
                onChange={update("password")}
                required
                type="password"
                className="mt-1 w-full rounded-sm border border-navy-900/15 px-3 py-2.5 text-sm outline-none focus:border-gold-500"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-navy-900/70">Lambarka taleefanka</label>
              <input
                value={form.phone}
                onChange={update("phone")}
                required
                type="tel"
                className="mt-1 w-full rounded-sm border border-navy-900/15 px-3 py-2.5 text-sm outline-none focus:border-gold-500"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-navy-900/70">Meesha aad joogto</label>
              <input
                value={form.location}
                onChange={update("location")}
                required
                className="mt-1 w-full rounded-sm border border-navy-900/15 px-3 py-2.5 text-sm outline-none focus:border-gold-500"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-navy-900/70">Faahfaahin dheeraad ah (ikhtiyaari)</label>
              <textarea
                value={form.message}
                onChange={update("message")}
                rows={3}
                className="mt-1 w-full rounded-sm border border-navy-900/15 px-3 py-2.5 text-sm outline-none focus:border-gold-500"
              />
            </div>
            {error && <p className="text-sm text-clay">{error}</p>}
            <button
              type="submit"
              disabled={status === "saving"}
              className="w-full rounded-sm bg-gold-500 py-2.5 text-sm font-semibold text-navy-950 hover:bg-gold-400 disabled:opacity-60"
            >
              {status === "saving" ? "Waa la diraayaa..." : "Isdiiwaangeli"}
            </button>
            <p className="text-center text-xs text-navy-900/50">
              Horey account ma u yeelatay?{" "}
              <Link to="/login" className="font-medium text-gold-600 underline">
                Login
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}