import { useState } from "react";
import { X } from "lucide-react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db, COLLECTIONS } from "../firebase";
import { getUserSession } from "../lib/userSession";

function generateOrderNumber() {
  return `KR-${Date.now().toString(36).toUpperCase()}`;
}

export default function RequestModal({ land, onClose }) {
  const user = getUserSession();
  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    location: user?.location || "",
  });
  const [status, setStatus] = useState("idle"); // idle | saving | done | error
  const [orderNumber, setOrderNumber] = useState("");

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim() || !form.location.trim()) return;
    setStatus("saving");
    try {
      const newOrderNumber = generateOrderNumber();
      await addDoc(collection(db, COLLECTIONS.LAND_REQUESTS), {
        landId: land.id,
        landTitle: land.title || "",
        landPrice: land.price || "",
        name: form.name.trim(),
        phone: form.phone.trim(),
        location: form.location.trim(),
        orderNumber: newOrderNumber,
        userId: user?.id || null,
        userEmail: user?.email || null,
        status: "pending",
        createdAt: serverTimestamp(),
      });
      setOrderNumber(newOrderNumber);
      setStatus("done");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-navy-950/70 p-4">
      <div className="relative w-full max-w-md rounded-sm bg-white p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-navy-900/50 hover:text-navy-900"
          aria-label="Xir"
        >
          <X size={20} />
        </button>

        {status === "done" ? (
          <div className="py-6 text-center">
            <p className="font-[var(--font-display)] text-lg font-semibold text-navy-900">
              Codsigaaga waa la helay
            </p>
            <p className="mt-2 text-sm text-navy-900/70">
              Waxaad codsatay <span className="font-medium">{land.title || "dhulkan"}</span>. Waxaan kula soo
              xiriiri doonaa {form.phone} dhowaan.
            </p>
            <p className="mt-3 inline-block rounded-sm bg-cream-dim px-3 py-1.5 font-mono text-xs text-navy-900/70">
              Order #: {orderNumber}
            </p>
            <button
              onClick={onClose}
              className="mt-5 block w-full rounded-sm bg-navy-900 py-2 text-sm text-cream hover:bg-gold-500 hover:text-navy-950"
            >
              Xir
            </button>
          </div>
        ) : (
          <>
            <h3 className="font-[var(--font-display)] text-lg font-semibold text-navy-900">
              Codso {land.title || "dhulkan"}
            </h3>
            <p className="mt-1 text-sm text-navy-900/60">
              Buuxi macluumaadkaaga, kooxdayadu way kula soo xiriiri doontaa.
            </p>

            <form onSubmit={submit} className="mt-5 space-y-4">
              <div>
                <label className="text-xs font-medium text-navy-900/70">Magacaaga</label>
                <input
                  value={form.name}
                  onChange={update("name")}
                  required
                  className="mt-1 w-full rounded-sm border border-navy-900/15 px-3 py-2.5 text-sm outline-none focus:border-gold-500"
                  placeholder="Magacaaga oo dhan"
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
                  placeholder="+252 6X XXX XXXX"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-navy-900/70">Meesha aad joogto</label>
                <input
                  value={form.location}
                  onChange={update("location")}
                  required
                  className="mt-1 w-full rounded-sm border border-navy-900/15 px-3 py-2.5 text-sm outline-none focus:border-gold-500"
                  placeholder="Degmada / Magaalada"
                />
              </div>

              {status === "error" && (
                <p className="text-sm text-clay">Wax baa qaldamay. Fadlan isku day mar kale.</p>
              )}

              <button
                type="submit"
                disabled={status === "saving"}
                className="w-full rounded-sm bg-gold-500 py-2.5 text-sm font-semibold text-navy-950 transition-colors hover:bg-gold-400 disabled:opacity-60"
              >
                {status === "saving" ? "Waa la diraayaa..." : "Submit"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}