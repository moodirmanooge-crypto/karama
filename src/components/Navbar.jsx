import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X, Lock, User } from "lucide-react";
import logo from "../assets/logo.png";
import { getUserSession } from "../lib/userSession";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
  { to: "/registration", label: "Registration" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const user = getUserSession();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        scrolled ? "bg-navy-900/95 backdrop-blur shadow-lg shadow-navy-950/20" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3 md:px-8">
        <NavLink to="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <img src={logo} alt="Karaamo Construction Company" className="h-11 w-11 rounded-full object-cover" />
          <span className="font-[var(--font-display)] text-lg font-semibold tracking-tight text-cream">
            KARAAMO
          </span>
        </NavLink>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              className={({ isActive }) =>
                `font-[var(--font-display)] text-sm tracking-wide transition-colors ${
                  isActive ? "text-gold-400" : "text-cream/80 hover:text-gold-300"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}

          <NavLink
            to={user ? "/dashboard" : "/login"}
            className="ml-2 flex items-center gap-1.5 rounded-sm border border-gold-400/40 px-3 py-1.5 text-xs font-medium text-gold-300 transition-colors hover:bg-gold-500 hover:text-navy-950"
          >
            <User size={13} /> {user ? "Dashboard" : "Login"}
          </NavLink>

          <NavLink
            to="/admin"
            title="Admin Login"
            aria-label="Admin Login"
            className="ml-1 border-l border-cream/15 pl-4 text-cream/30 transition-colors hover:text-gold-400"
          >
            <Lock size={15} />
          </NavLink>
        </div>

        <button
          className="text-cream md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Xir menu-ga" : "Fur menu-ga"}
          aria-expanded={open}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-gold-500/20 bg-navy-900 px-5 pb-4 md:hidden">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `block py-3 font-[var(--font-display)] text-sm ${
                  isActive ? "text-gold-400" : "text-cream/80"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
          <NavLink
            to={user ? "/dashboard" : "/login"}
            onClick={() => setOpen(false)}
            className="mt-2 flex items-center gap-1.5 border-t border-cream/10 pt-3 text-sm text-gold-300"
          >
            <User size={14} /> {user ? "Dashboard" : "Login"}
          </NavLink>
          <NavLink
            to="/admin"
            onClick={() => setOpen(false)}
            className="mt-2 flex items-center gap-1.5 text-xs text-cream/30"
          >
            <Lock size={12} /> Admin Login
          </NavLink>
        </div>
      )}
    </header>
  );
}