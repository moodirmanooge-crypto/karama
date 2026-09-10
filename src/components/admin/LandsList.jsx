import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query, deleteDoc, doc } from "firebase/firestore";
import { Trash2 } from "lucide-react";
import { db, COLLECTIONS } from "../../firebase";

export default function LandsList() {
  const [lands, setLands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, COLLECTIONS.LANDS), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setLands(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const remove = async (id) => {
    if (!confirm("Ma hubtaa inaad tirtirto dhulkan?")) return;
    await deleteDoc(doc(db, COLLECTIONS.LANDS, id));
  };

  if (loading) return <p className="text-sm text-navy-900/50">Waa la soo raraayaa...</p>;
  if (lands.length === 0) return <p className="text-sm text-navy-900/50">Weli lama darin dhul.</p>;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {lands.map((land) => (
        <div key={land.id} className="overflow-hidden rounded-sm border border-navy-900/10 bg-white">
          <div className="h-36 w-full bg-navy-800">
            {land.imageUrl && <img src={land.imageUrl} alt={land.title} className="h-full w-full object-cover" />}
          </div>
          <div className="p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <p className="font-[var(--font-display)] text-sm font-semibold text-navy-900 break-words">
                  {land.title || "Dhul aan magac lahayn"}
                </p>
                <p className="text-xs text-navy-900/50">{land.location}</p>
              </div>
              <button
                onClick={() => remove(land.id)}
                className="shrink-0 rounded-sm p-1.5 text-clay hover:bg-clay/10"
                aria-label="Tirtir"
              >
                <Trash2 size={16} />
              </button>
            </div>
            <p className="mt-2 font-[var(--font-display)] text-sm font-semibold text-gold-600">
              ${Number(land.price).toLocaleString("en-US")}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}