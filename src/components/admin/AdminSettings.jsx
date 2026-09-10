import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  doc,
  updateDoc,
  addDoc,
  deleteDoc,
  getDocs,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { UserCircle2, Loader2, UserPlus, ShieldCheck, Lock, Unlock, Pencil, Trash2 } from "lucide-react";
import { db, storage, COLLECTIONS } from "../../firebase";
import { saveAdminSession, getAdminSession } from "../../lib/adminSession";

function roleLabel(role) {
  return role === "superadmin" ? "Super Admin" : "Admin";
}

export default function AdminSettings({ onProfileUpdate }) {
  const session = getAdminSession();
  const [liveRole, setLiveRole] = useState(session?.role);
  const isSuperAdmin = liveRole === "superadmin";

  // Profile-ka admin-ka haatan soo galay
  const [profile, setProfile] = useState({ name: "", username: "", password: "", avatarUrl: "" });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [profileStatus, setProfileStatus] = useState("idle"); // idle | saving | done | error
  const [profileError, setProfileError] = useState("");

  // Liiska dhammaan admin-ada
  const [admins, setAdmins] = useState([]);

  // Form-ka admin cusub (super admin kaliya ayaa arka)
  const [newAdmin, setNewAdmin] = useState({ name: "", username: "", password: "", role: "admin" });
  const [addStatus, setAddStatus] = useState("idle");
  const [addError, setAddError] = useState("");

  useEffect(() => {
    if (!session?.id) return;
    const unsubAdmins = onSnapshot(query(collection(db, COLLECTIONS.ADMIN), orderBy("username")), (snap) => {
      setAdmins(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      const me = snap.docs.find((d) => d.id === session.id);
      if (me) {
        const data = me.data();
        setProfile((p) => ({ ...p, name: data.name || "", username: data.username || "", avatarUrl: data.avatarUrl || "" }));
        // Role-ka waa la cusboonaysiiyaa si toos ah haddii Firestore laga beddelo,
        // adiga oo aan u baahnayn inaad logout gareyso.
        const freshRole = data.role || "admin";
        setLiveRole(freshRole);
        saveAdminSession({ ...session, role: freshRole });
      }
    });
    return () => unsubAdmins();
  }, [session?.id]);

  const pickAvatar = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setAvatarFile(f);
    setAvatarPreview(URL.createObjectURL(f));
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    setProfileError("");
    if (!profile.username.trim()) {
      setProfileError("Username-ka lama tirtiri karo.");
      return;
    }
    setProfileStatus("saving");
    try {
      let avatarUrl = profile.avatarUrl;
      if (avatarFile) {
        const path = `karama-admins/${session.id}_${Date.now()}_${avatarFile.name}`;
        const storageRef = ref(storage, path);
        await uploadBytes(storageRef, avatarFile);
        avatarUrl = await getDownloadURL(storageRef);
      }

      const updates = { name: profile.name.trim(), username: profile.username.trim(), avatarUrl };
      if (profile.password.trim()) {
        updates.password = profile.password.trim();
      }

      await updateDoc(doc(db, COLLECTIONS.ADMIN, session.id), updates);

      saveAdminSession({ ...session, name: updates.name, username: updates.username, avatarUrl });
      setProfile((p) => ({ ...p, avatarUrl, password: "" }));
      setAvatarFile(null);
      setProfileStatus("done");
      onProfileUpdate?.();
      setTimeout(() => setProfileStatus("idle"), 2000);
    } catch (err) {
      console.error(err);
      setProfileError("Wax baa qaldamay. Isku day mar kale.");
      setProfileStatus("error");
    }
  };

  const addAdmin = async (e) => {
    e.preventDefault();
    setAddError("");
    if (!newAdmin.username.trim() || !newAdmin.password.trim()) return;

    setAddStatus("saving");
    try {
      const dupCheck = query(collection(db, COLLECTIONS.ADMIN), where("username", "==", newAdmin.username.trim()));
      const dupSnap = await getDocs(dupCheck);
      if (!dupSnap.empty) {
        setAddError("Username-kan horey ayaa loo isticmaalay.");
        setAddStatus("error");
        return;
      }

      await addDoc(collection(db, COLLECTIONS.ADMIN), {
        name: newAdmin.name.trim(),
        username: newAdmin.username.trim(),
        password: newAdmin.password.trim(),
        role: newAdmin.role,
        blocked: false,
        createdAt: serverTimestamp(),
      });

      setNewAdmin({ name: "", username: "", password: "", role: "admin" });
      setAddStatus("done");
      setTimeout(() => setAddStatus("idle"), 2000);
    } catch (err) {
      console.error(err);
      setAddError("Wax baa qaldamay. Isku day mar kale.");
      setAddStatus("error");
    }
  };

  const toggleBlock = async (adminId, currentlyBlocked) => {
    await updateDoc(doc(db, COLLECTIONS.ADMIN, adminId), { blocked: !currentlyBlocked });
  };

  // Wax ka beddelka admin-yada kale (role/password) — Super Admin kaliya
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ role: "admin", password: "" });
  const [editStatus, setEditStatus] = useState("idle");
  const [editError, setEditError] = useState("");

  const startEdit = (admin) => {
    setEditingId(admin.id);
    setEditForm({ role: admin.role === "superadmin" ? "superadmin" : "admin", password: "" });
    setEditError("");
    setEditStatus("idle");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ role: "admin", password: "" });
    setEditError("");
  };

  const saveEdit = async (adminId) => {
    setEditStatus("saving");
    setEditError("");
    try {
      const updates = { role: editForm.role };
      if (editForm.password.trim()) {
        updates.password = editForm.password.trim();
      }
      await updateDoc(doc(db, COLLECTIONS.ADMIN, adminId), updates);
      setEditingId(null);
      setEditForm({ role: "admin", password: "" });
      setEditStatus("idle");
    } catch (err) {
      console.error(err);
      setEditError("Wax baa qaldamay. Isku day mar kale.");
      setEditStatus("error");
    }
  };

  const deleteAdmin = async (adminId, label) => {
    if (!confirm(`Ma hubtaa inaad tirtirto admin-ka "${label}"? Tallaabadan lama soo celin karo.`)) return;
    await deleteDoc(doc(db, COLLECTIONS.ADMIN, adminId));
    if (editingId === adminId) cancelEdit();
  };

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* Profile-ka shakhsiga ah */}
      <form onSubmit={saveProfile} className="space-y-5 rounded-sm border border-navy-900/10 bg-white p-6">
        <h3 className="font-[var(--font-display)] text-lg font-semibold text-navy-900">Profile-kaaga</h3>

        <div className="flex items-center gap-4">
          <label className="flex h-16 w-16 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-dashed border-navy-900/20 bg-cream-dim">
            {avatarPreview || profile.avatarUrl ? (
              <img src={avatarPreview || profile.avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
            ) : (
              <UserCircle2 size={28} className="text-navy-900/30" />
            )}
            <input type="file" accept="image/*" onChange={pickAvatar} className="hidden" />
          </label>
          <div>
            <p className="text-xs text-navy-900/50">Riix sawirka si aad u beddesho sawirkaaga.</p>
            <p className="mt-1 text-xs font-medium text-gold-600">{roleLabel(liveRole)}</p>
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-navy-900/70">Magaca oo dhan</label>
          <input
            value={profile.name}
            onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
            required
            placeholder="Tusaale: Maxamed Cali"
            className="mt-1 w-full rounded-sm border border-navy-900/15 px-3 py-2.5 text-sm outline-none focus:border-gold-500"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-navy-900/70">Username</label>
          <input
            value={profile.username}
            onChange={(e) => setProfile((p) => ({ ...p, username: e.target.value }))}
            required
            className="mt-1 w-full rounded-sm border border-navy-900/15 px-3 py-2.5 text-sm outline-none focus:border-gold-500"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-navy-900/70">Password cusub (ka bannee haddii aadan beddelin)</label>
          <input
            value={profile.password}
            onChange={(e) => setProfile((p) => ({ ...p, password: e.target.value }))}
            type="password"
            className="mt-1 w-full rounded-sm border border-navy-900/15 px-3 py-2.5 text-sm outline-none focus:border-gold-500"
            placeholder="••••••"
          />
        </div>

        {profileError && <p className="text-sm text-clay">{profileError}</p>}
        {profileStatus === "done" && <p className="text-sm text-moss">Isbadalada waa la kaydiyay!</p>}

        <button
          type="submit"
          disabled={profileStatus === "saving"}
          className="flex items-center gap-2 rounded-sm bg-navy-900 px-5 py-2.5 text-sm font-medium text-cream hover:bg-gold-500 hover:text-navy-950 disabled:opacity-60"
        >
          {profileStatus === "saving" && <Loader2 size={15} className="animate-spin" />}
          Kaydi Isbadalada
        </button>
      </form>

      {/* Maamulka admin-ada */}
      <div className="space-y-6">
        {isSuperAdmin && (
          <form onSubmit={addAdmin} className="space-y-4 rounded-sm border border-navy-900/10 bg-white p-6">
            <h3 className="flex items-center gap-2 font-[var(--font-display)] text-lg font-semibold text-navy-900">
              <UserPlus size={18} className="text-gold-500" /> Ku dar Admin Cusub
            </h3>
            <div>
              <label className="text-xs font-medium text-navy-900/70">Magaca oo dhan</label>
              <input
                value={newAdmin.name}
                onChange={(e) => setNewAdmin((a) => ({ ...a, name: e.target.value }))}
                required
                className="mt-1 w-full rounded-sm border border-navy-900/15 px-3 py-2.5 text-sm outline-none focus:border-gold-500"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-navy-900/70">Username</label>
              <input
                value={newAdmin.username}
                onChange={(e) => setNewAdmin((a) => ({ ...a, username: e.target.value }))}
                required
                className="mt-1 w-full rounded-sm border border-navy-900/15 px-3 py-2.5 text-sm outline-none focus:border-gold-500"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-navy-900/70">Password</label>
              <input
                value={newAdmin.password}
                onChange={(e) => setNewAdmin((a) => ({ ...a, password: e.target.value }))}
                required
                type="password"
                className="mt-1 w-full rounded-sm border border-navy-900/15 px-3 py-2.5 text-sm outline-none focus:border-gold-500"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-navy-900/70">Nooca</label>
              <select
                value={newAdmin.role}
                onChange={(e) => setNewAdmin((a) => ({ ...a, role: e.target.value }))}
                className="mt-1 w-full rounded-sm border border-navy-900/15 bg-white px-3 py-2.5 text-sm outline-none focus:border-gold-500"
              >
                <option value="admin">Admin caadi ah</option>
                <option value="superadmin">Super Admin</option>
              </select>
            </div>
            {addError && <p className="text-sm text-clay">{addError}</p>}
            {addStatus === "done" && <p className="text-sm text-moss">Admin-ka cusub waa la daray!</p>}
            <button
              type="submit"
              disabled={addStatus === "saving"}
              className="w-full rounded-sm bg-gold-500 py-2.5 text-sm font-semibold text-navy-950 hover:bg-gold-400 disabled:opacity-60"
            >
              {addStatus === "saving" ? "Waa la daraayaa..." : "Ku dar Admin"}
            </button>
          </form>
        )}

        <div className="rounded-sm border border-navy-900/10 bg-white p-6">
          <h3 className="flex items-center gap-2 font-[var(--font-display)] text-sm font-semibold text-navy-900">
            <ShieldCheck size={16} className="text-gold-500" /> Dhammaan Maamulayaasha ({admins.length})
          </h3>
          <ul className="mt-4 space-y-3">
            {admins.map((a) => (
              <li key={a.id} className="rounded-sm border border-navy-900/5 p-2">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-cream-dim">
                      {a.avatarUrl ? (
                        <img src={a.avatarUrl} alt={a.username} className="h-full w-full object-cover" />
                      ) : (
                        <UserCircle2 size={18} className="text-navy-900/30" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-navy-900">
                        {a.name || a.username} {a.id === session?.id && <span className="text-xs text-navy-900/40">(adiga)</span>}
                      </p>
                      <p className="text-xs text-navy-900/50">
                        {roleLabel(a.role)}
                        {a.blocked && <span className="ml-1.5 text-clay">· Waa la xidhay</span>}
                      </p>
                    </div>
                  </div>

                  {isSuperAdmin && a.id !== session?.id && (
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => (editingId === a.id ? cancelEdit() : startEdit(a))}
                        title="Wax ka beddel"
                        className="flex items-center gap-1.5 rounded-sm bg-navy-900/5 px-2.5 py-1.5 text-xs font-medium text-navy-900/70 hover:bg-navy-900/10"
                      >
                        <Pencil size={13} /> <span className="hidden sm:inline">Wax ka beddel</span>
                      </button>
                      <button
                        onClick={() => toggleBlock(a.id, a.blocked)}
                        title={a.blocked ? "Fur account-ka" : "Xir account-ka"}
                        className={`flex items-center gap-1.5 rounded-sm px-2.5 py-1.5 text-xs font-medium ${
                          a.blocked
                            ? "bg-moss/10 text-moss hover:bg-moss/15"
                            : "bg-clay/10 text-clay hover:bg-clay/15"
                        }`}
                      >
                        {a.blocked ? <Unlock size={13} /> : <Lock size={13} />}
                        {a.blocked ? "Fur" : "Xir"}
                      </button>
                      <button
                        onClick={() => deleteAdmin(a.id, a.name || a.username)}
                        title="Tirtir"
                        className="flex items-center gap-1.5 rounded-sm bg-clay/10 px-2.5 py-1.5 text-xs font-medium text-clay hover:bg-clay/15"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  )}
                </div>

                {editingId === a.id && (
                  <div className="mt-3 space-y-3 border-t border-navy-900/5 pt-3">
                    <div>
                      <label className="text-xs font-medium text-navy-900/70">Nooca</label>
                      <select
                        value={editForm.role}
                        onChange={(e) => setEditForm((f) => ({ ...f, role: e.target.value }))}
                        className="mt-1 w-full rounded-sm border border-navy-900/15 bg-white px-3 py-2 text-sm outline-none focus:border-gold-500"
                      >
                        <option value="admin">Admin caadi ah</option>
                        <option value="superadmin">Super Admin</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-navy-900/70">Password cusub (ikhtiyaari)</label>
                      <input
                        value={editForm.password}
                        onChange={(e) => setEditForm((f) => ({ ...f, password: e.target.value }))}
                        type="password"
                        placeholder="••••••"
                        className="mt-1 w-full rounded-sm border border-navy-900/15 px-3 py-2 text-sm outline-none focus:border-gold-500"
                      />
                    </div>
                    {editError && <p className="text-sm text-clay">{editError}</p>}
                    <div className="flex gap-2">
                      <button
                        onClick={() => saveEdit(a.id)}
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
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}