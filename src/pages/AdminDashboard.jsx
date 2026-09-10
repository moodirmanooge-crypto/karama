import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle, LayoutGrid, Users, ClipboardList, MessageSquare, Settings, LogOut, UserCircle2 } from "lucide-react";
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
  const navigate = useNavigate();
  const admin = getAdminSession();

  const logout = () => {
    clearAdminSession();
    navigate("/admin");
  };

  return (
    <div className="flex min-h-screen bg-cream-dim">
      <aside className="flex w-60 flex-col bg-navy-950 text-cream">
        <div className="flex items-center gap-2.5 px-5 py-6">
          <img src={logo} alt="Karaamo" className="h-9 w-9 rounded-full object-cover" />
          <div>
            <p className="font-[var(--font-display)] text-sm font-semibold">KARAAMO</p>
            <p className="text-xs text-cream/40">Admin Dashboard</p>
          </div>
        </div>

        <nav className="mt-4 flex-1 space-y-1 px-3">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActive(id)}
              className={`flex w-full items-center gap-3 rounded-sm px-3 py-2.5 text-left text-sm transition-colors ${
                active === id ? "bg-gold-500 text-navy-950 font-medium" : "text-cream/70 hover:bg-navy-800"
              }`}
            >
              <Icon size={16} /> {label}
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

      <main className="flex-1 overflow-y-auto p-8">
        <h1 className="font-[var(--font-display)] text-2xl font-semibold text-navy-900">
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