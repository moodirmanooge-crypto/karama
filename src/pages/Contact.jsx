import { useState } from "react";
import { Phone, Mail, MapPin } from "lucide-react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db, COLLECTIONS } from "../firebase";

export default function Contact() {
  const [form, setForm] = useState({ name: "", phone: "", message: "" });
  const [status, setStatus] = useState("idle");

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim() || !form.message.trim()) return;
    setStatus("saving");
    try {
      await addDoc(collection(db, COLLECTIONS.CONTACT_MESSAGES), {
        ...form,
        createdAt: serverTimestamp(),
      });
      setStatus("done");
      setForm({ name: "", phone: "", message: "" });
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-5 pb-16 pt-28 md:px-8">
      <p className="font-[var(--font-display)] text-sm tracking-wide text-gold-500">Nala Soo Xiriir</p>
      <h1 className="mt-3 font-[var(--font-display)] text-3xl font-semibold text-navy-900">Contact</h1>

      <div className="mt-10 grid gap-10 md:grid-cols-2">
        <div className="space-y-5">
          <div className="flex items-start gap-3">
            <Phone size={18} className="mt-0.5 text-gold-500" />
            <div>
              <p className="text-sm font-medium text-navy-900">Taleefan</p>
              <p className="text-sm text-navy-900/60">+252 61 8276993</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Mail size={18} className="mt-0.5 text-gold-500" />
            <div>
              <p className="text-sm font-medium text-navy-900">Email</p>
              <p className="text-sm text-navy-900/60">info@karaamo.so</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MapPin size={18} className="mt-0.5 text-gold-500" />
            <div>
              <p className="text-sm font-medium text-navy-900">Xarunta</p>
              <p className="text-sm text-navy-900/60">Muqdisho, Soomaaliya</p>
            </div>
          </div>
        </div>

        <form onSubmit={submit} className="space-y-4 rounded-sm border border-navy-900/10 bg-white p-6">
          {status === "done" ? (
            <p className="text-sm text-moss">Fariintaada waa la helay, waan kula soo xiriiri doonaa dhowaan.</p>
          ) : (
            <>
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
                <label className="text-xs font-medium text-navy-900/70">Lambarka</label>
                <input
                  value={form.phone}
                  onChange={update("phone")}
                  required
                  type="tel"
                  className="mt-1 w-full rounded-sm border border-navy-900/15 px-3 py-2.5 text-sm outline-none focus:border-gold-500"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-navy-900/70">Fariinta</label>
                <textarea
                  value={form.message}
                  onChange={update("message")}
                  required
                  rows={4}
                  className="mt-1 w-full rounded-sm border border-navy-900/15 px-3 py-2.5 text-sm outline-none focus:border-gold-500"
                />
              </div>
              {status === "error" && <p className="text-sm text-clay">Wax baa qaldamay, isku day mar kale.</p>}
              <button
                type="submit"
                disabled={status === "saving"}
                className="w-full rounded-sm bg-navy-900 py-2.5 text-sm font-medium text-cream hover:bg-gold-500 hover:text-navy-950 disabled:opacity-60"
              >
                {status === "saving" ? "Waa la diraayaa..." : "Dir Fariinta"}
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
