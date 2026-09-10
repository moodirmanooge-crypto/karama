import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { Phone, Mail } from "lucide-react";
import { db, COLLECTIONS } from "../../firebase";

export default function ContactMessagesList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, COLLECTIONS.CONTACT_MESSAGES), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  if (loading) return <p className="text-sm text-navy-900/50">Waa la soo raraayaa...</p>;
  if (items.length === 0) return <p className="text-sm text-navy-900/50">Weli ma jiraan fariimo.</p>;

  return (
    <div className="space-y-3">
      {items.map((it) => (
        <div key={it.id} className="rounded-sm border border-navy-900/10 bg-white p-4">
          <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
            <p className="min-w-0 break-words font-medium text-navy-900">{it.name}</p>
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
  );
}