import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query, doc, updateDoc } from "firebase/firestore";
import { Check, Phone, MapPin } from "lucide-react";
import { db, COLLECTIONS } from "../../firebase";

function StatusBadge({ status }) {
  const isAccepted = status === "accepted";
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
        isAccepted ? "bg-moss/15 text-moss" : "bg-gold-500/15 text-gold-600"
      }`}
    >
      {isAccepted ? "La aqbalay" : "Sugaya"}
    </span>
  );
}

export default function RequestsList() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, COLLECTIONS.LAND_REQUESTS), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setRequests(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const accept = async (id) => {
    await updateDoc(doc(db, COLLECTIONS.LAND_REQUESTS, id), { status: "accepted" });
  };

  if (loading) return <p className="text-sm text-navy-900/50">Waa la soo raraayaa...</p>;
  if (requests.length === 0) return <p className="text-sm text-navy-900/50">Weli ma jiraan codsadayaal.</p>;

  return (
    <div className="overflow-x-auto rounded-sm border border-navy-900/10 bg-white">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="bg-cream-dim text-xs uppercase tracking-wide text-navy-900/50">
          <tr>
            <th className="px-4 py-3 font-medium">Order #</th>
            <th className="px-4 py-3 font-medium">Magaca</th>
            <th className="px-4 py-3 font-medium">Xiriirka</th>
            <th className="px-4 py-3 font-medium">Dhulka</th>
            <th className="px-4 py-3 font-medium">Xaalada</th>
            <th className="px-4 py-3 font-medium"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-navy-900/5">
          {requests.map((r) => (
            <tr key={r.id}>
              <td className="px-4 py-3 font-mono text-xs text-navy-900/60">{r.orderNumber || "—"}</td>
              <td className="px-4 py-3 font-medium text-navy-900">{r.name}</td>
              <td className="px-4 py-3 text-navy-900/70">
                <span className="flex items-center gap-1.5"><Phone size={13} className="text-gold-500" /> {r.phone}</span>
                <span className="mt-0.5 flex items-center gap-1.5 text-xs text-navy-900/50">
                  <MapPin size={12} className="text-gold-500" /> {r.location}
                </span>
              </td>
              <td className="px-4 py-3 text-navy-900/70">{r.landTitle || "—"}</td>
              <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
              <td className="px-4 py-3 text-right">
                {r.status !== "accepted" && (
                  <button
                    onClick={() => accept(r.id)}
                    className="flex items-center gap-1.5 rounded-sm bg-navy-900 px-3 py-1.5 text-xs font-medium text-cream hover:bg-gold-500 hover:text-navy-950"
                  >
                    <Check size={13} /> Aqbal
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}