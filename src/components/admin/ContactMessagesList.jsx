import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query, writeBatch, doc } from "firebase/firestore";
import { Phone, Mail, CheckCheck } from "lucide-react";
import { db, COLLECTIONS } from "../../firebase";

export default function ContactMessagesList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);

  useEffect(() => {
    const q = query(collection(db, COLLECTIONS.CONTACT_MESSAGES), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const unread = items.filter((it) => !it.read);

  const markAllRead = async () => {
    if (unread.length === 0) return;
    setMarking(true);
    try {
      const batch = writeBatch(db);
      unread.forEach((it) => {
        batch.update(doc(db, COLLECTIONS.CONTACT_MESSAGES, it.id), { read: true });
      });
      await batch.commit();
    } catch (err) {
      console.error(err);
    } finally {
      setMarking(false);
    }
  };

  if (loading) return <p className="text-sm text-navy-900/50">Waa la soo raraayaa...</p>;
  if (items.length === 0) return <p className="text-sm text-navy-900/50">Weli ma jiraan fariimo.</p>;

  return (
    <div>
      {unread.length > 0 && (
        <div className="mb-4 flex items-center justify-between rounded-sm bg-gold-500/10 px-4 py-2.5">
          <p className="text-sm text-gold-700">
            {unread.length} fariin{unread.length > 1 ? "" : ""} oo cusub oo aan la akhriyin.
          </p>
          <button
            onClick={markAllRead}
            disabled={marking}
            className="flex items-center gap-1.5 rounded-sm bg-navy-900 px-3 py-1.5 text-xs font-medium text-cream hover:bg-gold-500 hover:text-navy-950 disabled:opacity-60"
          >
            <CheckCheck size={13} /> {marking ? "Waa la calaamadeynayaa..." : "Calaamadee dhammaan sida la akhriyay"}
          </button>
        </div>
      )}

      <div className="space-y-3">
        {items.map((it) => (
          <div
            key={it.id}
            className={`rounded-sm border p-4 ${
              it.read ? "border-navy-900/10 bg-white" : "border-gold-500/30 bg-gold-500/5"
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
              <p className="flex min-w-0 items-center gap-2 break-words font-medium text-navy-900">
                {!it.read && <span className="h-2 w-2 shrink-0 rounded-full bg-gold-500" aria-label="Cusub" />}
                {it.name}
              </p>
              {it.subject && (
                <span className="shrink-0 rounded-full bg-gold-500/15 px-2.5 py-1 text-xs font-medium text-gold-600">
                  {it.subject}
                </span>
              )}
            </div>
            <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-navy-900/50">
              <span className="flex items-center gap-1.5"><Phone size={12} className="text-gold-500" /> {it.phone}</span>
              {it.email && (
                <span className="flex items-center gap-1.5"><Mail size={12} className="text-gold-500" /> {it.email}</span>
              )}
            </div>
            <p className="mt-2 text-sm text-navy-900/70">{it.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}