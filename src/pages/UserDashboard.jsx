import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { LogOut, Phone, MapPin, UserCircle2, ShieldCheck } from "lucide-react";
import { db, COLLECTIONS } from "../firebase";
import { clearUserSession, getUserSession } from "../lib/userSession";
import LandCard from "../components/LandCard";
import RequestModal from "../components/RequestModal";

function StatusBadge({ status }) {
  if (status === "accepted") {
    return <span className="rounded-full bg-moss/15 px-2.5 py-1 text-xs font-medium text-moss">La aqbalay</span>;
  }
  if (status === "rejected") {
    return <span className="rounded-full bg-clay/15 px-2.5 py-1 text-xs font-medium text-clay">La diiday</span>;
  }
  return <span className="rounded-full bg-gold-500/15 px-2.5 py-1 text-xs font-medium text-gold-600">Sugaya</span>;
}

export default function UserDashboard() {
  const user = getUserSession();
  const navigate = useNavigate();
  const [lands, setLands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLand, setSelectedLand] = useState(null);
  const [admins, setAdmins] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const q = query(collection(db, COLLECTIONS.LANDS), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setLands(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, COLLECTIONS.ADMIN), (snap) => {
      setAdmins(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!user?.id) return;
    const q = query(collection(db, COLLECTIONS.LAND_REQUESTS), where("userId", "==", user.id), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setOrders(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, [user?.id]);

  const logout = () => {
    clearUserSession();
    navigate("/login");
  };

  if (!user) return null;

  return (
    <div className="mx-auto max-w-6xl px-5 pb-16 pt-28 md:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-[var(--font-display)] text-sm tracking-wide text-gold-500">Soo dhawoow</p>
          <h1 className="mt-1 font-[var(--font-display)] text-2xl font-semibold text-navy-900">{user.name}</h1>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-2 rounded-sm border border-navy-900/15 px-4 py-2 text-sm text-navy-900/70 hover:text-clay"
        >
          <LogOut size={15} /> Ka bax
        </button>
      </div>

      <div className="mt-8 rounded-sm border border-navy-900/10 bg-white p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-[var(--font-display)] text-sm font-semibold text-navy-900">Xaaladda Codsigaaga</h2>
          <StatusBadge status="accepted" />
        </div>
        <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm text-navy-900/60">
          <span className="flex items-center gap-1.5"><Phone size={13} className="text-gold-500" /> {user.phone}</span>
          <span className="flex items-center gap-1.5"><MapPin size={13} className="text-gold-500" /> {user.location}</span>
        </div>
      </div>

      {orders.length > 0 && (
        <div className="mt-8">
          <h2 className="font-[var(--font-display)] text-lg font-semibold text-navy-900">Dalabyadaada</h2>
          <div className="mt-4 space-y-3">
            {orders.map((o) => (
              <div key={o.id} className="flex flex-wrap items-center justify-between gap-3 rounded-sm border border-navy-900/10 bg-white p-4">
                <div>
                  <p className="text-sm font-medium text-navy-900">{o.landTitle || "Dhul"}</p>
                  <p className="font-mono text-xs text-navy-900/50">Order #: {o.orderNumber || "—"}</p>
                </div>
                <StatusBadge status={o.status} />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 rounded-sm border border-navy-900/10 bg-white p-6">
        <h2 className="flex items-center gap-2 font-[var(--font-display)] text-sm font-semibold text-navy-900">
          <ShieldCheck size={16} className="text-gold-500" /> Maamulayaasha Website-ka
        </h2>
        <ul className="mt-4 flex flex-wrap gap-5">
          {admins.map((a) => (
            <li key={a.id} className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-cream-dim">
                {a.avatarUrl ? (
                  <img src={a.avatarUrl} alt={a.name || a.username} className="h-full w-full object-cover" />
                ) : (
                  <UserCircle2 size={18} className="text-navy-900/30" />
                )}
              </div>
              <p className="text-sm text-navy-900">{a.name || a.username}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-12">
        <h2 className="font-[var(--font-display)] text-2xl font-semibold text-navy-900">Dhulalka la heli karo</h2>
        <p className="mt-2 max-w-lg text-sm text-navy-900/60">
          Dooro dhulka kugu haboon, kadibna riix "Waan rabaa dhulkan" si aad u buuxiso codsigaaga.
        </p>

        {loading ? (
          <p className="mt-10 text-sm text-navy-900/50">Waa la soo raraayaa...</p>
        ) : lands.length === 0 ? (
          <div className="mt-10 rounded-sm border border-dashed border-navy-900/15 p-10 text-center text-sm text-navy-900/50">
            Hadda ma jiraan dhulal la soo bandhigay. Fadlan soo noqo dhowaan.
          </div>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {lands.map((land) => (
              <LandCard key={land.id} land={land} onAccept={setSelectedLand} />
            ))}
          </div>
        )}
      </div>

      {selectedLand && <RequestModal land={selectedLand} onClose={() => setSelectedLand(null)} />}
    </div>
  );
}