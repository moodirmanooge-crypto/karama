import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, onSnapshot } from "firebase/firestore";
import {
  PlusCircle,
  LayoutGrid,
  Users,
  ClipboardList,
  MessageSquare,
  Settings,
  LogOut,
  UserCircle2,
  Menu,
  X,
} from "lucide-react";
import { db, COLLECTIONS } from "../firebase";
import { clearAdminSession, getAdminSession } from "../lib/adminSession";
import AddLandForm from "../components/admin/AddLandForm";
import LandsList from "../components/admin/LandsList";
import RequestsList from "../components/admin/RequestsList";
import RegistrationsList from "../components/admin/RegistrationsList";
import ContactMessagesList from "../components/admin/ContactMessagesList";
import AdminSettings from "../components/admin/AdminSettings";
import logo from "../assets/logo.png";

const tabs = [
  { id: "add", label: "Ku dar Dhul", icon: PlusCircle },
  { id: "lands", label: "Dhulalka", icon: LayoutGrid },
  { id: "requests", label: "Codsadayaasha", icon: Users },
  { id: "registrations", label: "Isdiiwaangelinno", icon: ClipboardList },
  { id: "contact", label: "Fariimaha", icon: MessageSquare },
  { id: "settings", label: "Dejinta", icon: Settings },
];

export default function AdminDashboard() {
  const [active, setActive] = useState("add");
  const [refreshKey, setRefreshKey] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const navigate = useNavigate();
  const admin = getAdminSession();

  useEffect(() => {
    const unsub = onSnapshot(collection(db, COLLECTIONS.CONTACT_MESSAGES), (snap) => {
      setUnreadMessages(snap.docs.filter((d) => !d.data().read).length);
    });
    return () => unsub();
  }, []);

  const logout = () => {
    clearAdminSession();
    navigate("/admin");
  };

  const selectTab = (id) => {
    setActive(id);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-cream-dim md:flex">
      {/* Mobile top bar */}
      <div className="sticky top-0 z-30 flex items-center justify-between bg-navy-950 px-4 py-3 text-cream md:hidden">
        <div className="flex items-center gap-2.5">
          <img src={logo} alt="Karaamo" className="h-8 w-8 rounded-full object-cover" />
          <span className="font-[var(--font-display)] text-sm font-semibold">KARAAMO</span>
        </div>
        <button
          onClick={() => setSidebarOpen(true)}
          aria-label="Fur menu-ga"
          className="rounded-sm p-1.5 text-cream/80 hover:bg-navy-800"
        >
          <Menu size={22} />
        </button>
      </div>

      {/* Backdrop (mobile only, shown when sidebar is open) */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-navy-950/60 md:hidden"
        />
      )}

      {/* Sidebar: overlay drawer on mobile, static column on desktop */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 max-w-[80vw] flex-col bg-navy-950 text-cream transition-transform duration-200 md:static md:z-auto md:w-60 md:max-w-none md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-6">
          <div className="flex items-center gap-2.5">
            <img src={logo} alt="Karaamo" className="h-9 w-9 rounded-full object-cover" />
            <div>
              <p className="font-[var(--font-display)] text-sm font-semibold">KARAAMO</p>
              <p className="text-xs text-cream/40">Admin Dashboard</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            aria-label="Xir menu-ga"
            className="text-cream/60 md:hidden"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="mt-4 flex-1 space-y-1 overflow-y-auto px-3">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => selectTab(id)}
              className={`flex w-full items-center justify-between gap-3 rounded-sm px-3 py-2.5 text-left text-sm transition-colors ${
                active === id ? "bg-gold-500 text-navy-950 font-medium" : "text-cream/70 hover:bg-navy-800"
              }`}
            >
              <span className="flex items-center gap-3">
                <Icon size={16} /> {label}
              </span>
              {id === "contact" && unreadMessages > 0 && (
                <span
                  className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-xs font-semibold ${
                    active === id ? "bg-navy-950 text-gold-400" : "bg-clay text-cream"
                  }`}
                >
                  {unreadMessages}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="border-t border-cream/10 px-5 py-4">
          {admin?.username && (
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-navy-800">
                {admin.avatarUrl ? (
                  <img src={admin.avatarUrl} alt={admin.username} className="h-full w-full object-cover" />
                ) : (
                  <UserCircle2 size={18} className="text-cream/40" />
                )}
              </div>
              <p className="text-xs text-cream/50">{admin.name || admin.username}</p>
            </div>
          )}
          <button
            onClick={logout}
            className="mt-3 flex items-center gap-2 text-sm text-cream/70 hover:text-clay"
          >
            <LogOut size={15} /> Ka bax
          </button>
        </div>
      </aside>

      <main className="min-w-0 flex-1 overflow-y-auto p-4 md:p-8">
        <h1 className="font-[var(--font-display)] text-xl font-semibold text-navy-900 md:text-2xl">
          {tabs.find((t) => t.id === active)?.label}
        </h1>

        <div className="mt-6">
          {active === "add" && <AddLandForm onAdded={() => setRefreshKey((k) => k + 1)} />}
          {active === "lands" && <LandsList key={refreshKey} />}
          {active === "requests" && <RequestsList />}
          {active === "registrations" && <RegistrationsList />}
          {active === "contact" && <ContactMessagesList />}
          {active === "settings" && <AdminSettings onProfileUpdate={() => setRefreshKey((k) => k + 1)} />}
        </div>
      </main>
    </div>
  );
}