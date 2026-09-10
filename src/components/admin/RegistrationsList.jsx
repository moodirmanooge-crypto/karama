import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query, doc, updateDoc } from "firebase/firestore";
import { Phone, MapPin, Check, X } from "lucide-react";
import { db, COLLECTIONS } from "../../firebase";

function StatusBadge({ status }) {
  if (status === "accepted") {
    return <span className="rounded-full bg-moss/15 px-2.5 py-1 text-xs font-medium text-moss">La aqbalay</span>;
  }
  if (status === "rejected") {
    return <span className="rounded-full bg-clay/15 px-2.5 py-1 text-xs font-medium text-clay">La diiday</span>;
  }
  return <span className="rounded-full bg-gold-500/15 px-2.5 py-1 text-xs font-medium text-gold-600">Sugaya</span>;
}

export default function RegistrationsList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, COLLECTIONS.REGISTRATIONS), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const setStatus = async (id, status) => {
    await updateDoc(doc(db, COLLECTIONS.REGISTRATIONS, id), { status });
  };

  if (loading) return <p className="text-sm text-navy-900/50">Waa la soo raraayaa...</p>;
  if (items.length === 0) return <p className="text-sm text-navy-900/50">Weli ma jiraan isdiiwaangelinno.</p>;

  return (
    <div className="space-y-3">
      {items.map((it) => (
        <div key={it.id} className="rounded-sm border border-navy-900/10 bg-white p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-medium text-navy-900">{it.name}</p>
              <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-navy-900/60">
                <span className="flex items-center gap-1.5"><Phone size={12} className="text-gold-500" /> {it.phone}</span>
                <span className="flex items-center gap-1.5"><MapPin size={12} className="text-gold-500" /> {it.location}</span>
              </div>
            </div>
            <StatusBadge status={it.status} />
          </div>

          {it.message && <p className="mt-2 text-sm text-navy-900/70">{it.message}</p>}

          {it.status !== "accepted" && it.status !== "rejected" && (
            <div className="mt-3 flex gap-2">
              <button
                onClick={() => setStatus(it.id, "accepted")}
                className="flex items-center gap-1.5 rounded-sm bg-navy-900 px-3 py-1.5 text-xs font-medium text-cream hover:bg-gold-500 hover:text-navy-950"
              >
                <Check size={13} /> Aqbal
              </button>
              <button
                onClick={() => setStatus(it.id, "rejected")}
                className="flex items-center gap-1.5 rounded-sm border border-clay/30 px-3 py-1.5 text-xs font-medium text-clay hover:bg-clay/10"
              >
                <X size={13} /> Diid
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}