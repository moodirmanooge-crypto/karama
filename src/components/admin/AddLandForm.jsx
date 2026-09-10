import { useState } from "react";
import { ImagePlus, Loader2 } from "lucide-react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db, storage, COLLECTIONS } from "../../firebase";

export default function AddLandForm({ onAdded }) {
  const [form, setForm] = useState({ title: "", price: "", location: "", description: "" });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | uploading | saving | done | error
  const [error, setError] = useState("");

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const pickFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!file || !form.price.trim() || !form.description.trim()) {
      setError("Fadlan buuxi sawirka, qiimaha, iyo sharaxaadda.");
      return;
    }

    try {
      setStatus("uploading");
      const path = `karama-lands/${Date.now()}_${file.name}`;
      const storageRef = ref(storage, path);
      await uploadBytes(storageRef, file);
      const imageUrl = await getDownloadURL(storageRef);

      setStatus("saving");
      await addDoc(collection(db, COLLECTIONS.LANDS), {
        title: form.title.trim(),
        price: form.price.trim(),
        location: form.location.trim(),
        description: form.description.trim(),
        imageUrl,
        createdAt: serverTimestamp(),
      });

      setStatus("done");
      setForm({ title: "", price: "", location: "", description: "" });
      setFile(null);
      setPreview(null);
      onAdded?.();
      setTimeout(() => setStatus("idle"), 2000);
    } catch (err) {
      console.error(err);
      setError("Wax baa qaldamay markii la soo gelinayay dhulka. Isku day mar kale.");
      setStatus("error");
    }
  };

  const busy = status === "uploading" || status === "saving";

  return (
    <form onSubmit={submit} className="max-w-xl space-y-5 rounded-sm border border-navy-900/10 bg-white p-6">
      <h3 className="font-[var(--font-display)] text-lg font-semibold text-navy-900">Ku dar Dhul Cusub</h3>

      <div>
        <label className="text-xs font-medium text-navy-900/70">Sawirka dhulka</label>
        <label className="mt-1 flex h-40 cursor-pointer items-center justify-center overflow-hidden rounded-sm border border-dashed border-navy-900/20 bg-cream-dim">
          {preview ? (
            <img src={preview} alt="Preview" className="h-full w-full object-cover" />
          ) : (
            <span className="flex flex-col items-center gap-2 text-navy-900/40">
              <ImagePlus size={22} />
              <span className="text-xs">Riix si aad sawir u soo dooratid</span>
            </span>
          )}
          <input type="file" accept="image/*" onChange={pickFile} className="hidden" />
        </label>
      </div>

      <div>
        <label className="text-xs font-medium text-navy-900/70">Magaca dhulka (ikhtiyaari)</label>
        <input
          value={form.title}
          onChange={update("title")}
          className="mt-1 w-full rounded-sm border border-navy-900/15 px-3 py-2.5 text-sm outline-none focus:border-gold-500"
          placeholder="Tusaale: Dhul Xaafada Wadajir"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="text-xs font-medium text-navy-900/70">Qiimaha ($)</label>
          <input
            value={form.price}
            onChange={update("price")}
            required
            type="number"
            min="0"
            className="mt-1 w-full rounded-sm border border-navy-900/15 px-3 py-2.5 text-sm outline-none focus:border-gold-500"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-navy-900/70">Goobta</label>
          <input
            value={form.location}
            onChange={update("location")}
            className="mt-1 w-full rounded-sm border border-navy-900/15 px-3 py-2.5 text-sm outline-none focus:border-gold-500"
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-medium text-navy-900/70">Sharaxaad</label>
        <textarea
          value={form.description}
          onChange={update("description")}
          required
          rows={4}
          className="mt-1 w-full rounded-sm border border-navy-900/15 px-3 py-2.5 text-sm outline-none focus:border-gold-500"
        />
      </div>

      {error && <p className="text-sm text-clay">{error}</p>}
      {status === "done" && <p className="text-sm text-moss">Dhulka waa lagu daray guul ah!</p>}

      <button
        type="submit"
        disabled={busy}
        className="flex w-full items-center justify-center gap-2 rounded-sm bg-navy-900 py-2.5 text-sm font-medium text-cream hover:bg-gold-500 hover:text-navy-950 disabled:opacity-60"
      >
        {busy && <Loader2 size={16} className="animate-spin" />}
        {status === "uploading" ? "Sawirka waa la soo gelinayaa..." : status === "saving" ? "Waa la kaydinayaa..." : "Ku dar Dhulka"}
      </button>
    </form>
  );
}