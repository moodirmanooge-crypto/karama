import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query, deleteDoc, updateDoc, doc } from "firebase/firestore";
import { Trash2, Pencil } from "lucide-react";
import { db, COLLECTIONS } from "../../firebase";

export default function LandsList() {
  const [lands, setLands] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", price: "", description: "" });
  const [editStatus, setEditStatus] = useState("idle"); // idle | saving | error
  const [editError, setEditError] = useState("");

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

  const startEdit = (land) => {
    setEditingId(land.id);
    setEditForm({
      title: land.title || "",
      price: land.price || "",
      description: land.description || "",
    });
    setEditError("");
    setEditStatus("idle");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ title: "", price: "", description: "" });
    setEditError("");
  };

  const saveEdit = async (id) => {
    if (!editForm.price.toString().trim() || !editForm.description.trim()) {
      setEditError("Qiimaha iyo sharaxaadda lama bannayn karo.");
      return;
    }
    setEditStatus("saving");
    setEditError("");
    try {
      await updateDoc(doc(db, COLLECTIONS.LANDS, id), {
        title: editForm.title.trim(),
        price: editForm.price.toString().trim(),
        description: editForm.description.trim(),
      });
      cancelEdit();
    } catch (err) {
      console.error(err);
      setEditError("Wax baa qaldamay. Isku day mar kale.");
      setEditStatus("error");
    }
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
            {editingId === land.id ? (
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-navy-900/70">Magaca dhulka</label>
                  <input
                    value={editForm.title}
                    onChange={(e) => setEditForm((f) => ({ ...f, title: e.target.value }))}
                    className="mt-1 w-full rounded-sm border border-navy-900/15 px-2.5 py-2 text-sm outline-none focus:border-gold-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-navy-900/70">Qiimaha ($)</label>
                  <input
                    value={editForm.price}
                    onChange={(e) => setEditForm((f) => ({ ...f, price: e.target.value }))}
                    type="number"
                    min="0"
                    className="mt-1 w-full rounded-sm border border-navy-900/15 px-2.5 py-2 text-sm outline-none focus:border-gold-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-navy-900/70">Sharaxaad</label>
                  <textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))}
                    rows={3}
                    className="mt-1 w-full rounded-sm border border-navy-900/15 px-2.5 py-2 text-sm outline-none focus:border-gold-500"
                  />
                </div>
                {editError && <p className="text-sm text-clay">{editError}</p>}
                <div className="flex gap-2">
                  <button
                    onClick={() => saveEdit(land.id)}
                    disabled={editStatus === "saving"}
                    className="rounded-sm bg-navy-900 px-4 py-2 text-xs font-medium text-cream hover:bg-gold-500 hover:text-navy-950 disabled:opacity-60"
                  >
                    {editStatus === "saving" ? "Waa la kaydinayaa..." : "Kaydi"}
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="rounded-sm border border-navy-900/15 px-4 py-2 text-xs font-medium text-navy-900/60"
                  >
                    Jooji
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="font-[var(--font-display)] text-sm font-semibold text-navy-900 break-words">
                      {land.title || "Dhul aan magac lahayn"}
                    </p>
                    <p className="text-xs text-navy-900/50">{land.location}</p>
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <button
                      onClick={() => startEdit(land)}
                      className="rounded-sm p-1.5 text-navy-900/50 hover:bg-navy-900/5 hover:text-navy-900"
                      aria-label="Wax ka beddel"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => remove(land.id)}
                      className="rounded-sm p-1.5 text-clay hover:bg-clay/10"
                      aria-label="Tirtir"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                {land.description && (
                  <p className="mt-1.5 line-clamp-2 text-xs text-navy-900/60">{land.description}</p>
                )}
                <p className="mt-2 font-[var(--font-display)] text-sm font-semibold text-gold-600">
                  ${Number(land.price).toLocaleString("en-US")}
                </p>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}