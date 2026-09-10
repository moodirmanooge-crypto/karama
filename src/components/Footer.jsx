import { NavLink } from "react-router-dom";
import { Phone, Mail, MapPin } from "lucide-react";
import logo from "../assets/logo.png";

export default function Footer() {
  return (
    <footer className="bg-navy-950 text-cream/70">
      <div className="mx-auto max-w-6xl px-5 py-12 md:px-8">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2.5">
              <img src={logo} alt="Karaamo" className="h-10 w-10 rounded-full object-cover" />
              <span className="font-[var(--font-display)] text-base font-semibold text-cream">KARAAMO</span>
            </div>
            <p className="mt-3 max-w-xs text-sm leading-relaxed">
              Iskaashi Bulsho — Dhisme Mustaqbal Wanaagsan. Waxaan kaa caawinnaa inaad heshid dhul aamin ah oo ku habboon.
            </p>
          </div>

          <div>
            <p className="font-[var(--font-display)] text-sm text-gold-400">Xiriirradda</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li><NavLink to="/" className="hover:text-gold-300">Home</NavLink></li>
              <li><NavLink to="/about" className="hover:text-gold-300">About</NavLink></li>
              <li><NavLink to="/contact" className="hover:text-gold-300">Contact</NavLink></li>
              <li><NavLink to="/registration" className="hover:text-gold-300">Registration</NavLink></li>
            </ul>
          </div>

          <div>
            <p className="font-[var(--font-display)] text-sm text-gold-400">Nala soo xiriir</p>
            <ul className="mt-3 space-y-2.5 text-sm">
              <li className="flex items-center gap-2"><Phone size={15} className="text-gold-400" /> +252 61 8276993</li>
              <li className="flex items-center gap-2"><Mail size={15} className="text-gold-400" /> info@karaamo.so</li>
              <li className="flex items-center gap-2"><MapPin size={15} className="text-gold-400" /> Muqdisho, Soomaaliya</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-cream/10 pt-6 text-xs text-cream/50">
          © {new Date().getFullYear()} Karaamo Construction Company. Dhammaan xuquuqda way dhowran yihiin.
        </div>
      </div>
    </footer>
  );
}
