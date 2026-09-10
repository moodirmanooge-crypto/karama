import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Phone,
  Mail,
  MapPin,
  Send,
  ArrowRight,
  Handshake,
  MessageCircle,
  ListFilter,
  FileText,
  CheckCircle2,
  ShieldCheck,
  Users as UsersIcon,
  TrendingUp,
} from "lucide-react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db, COLLECTIONS } from "../firebase";

const infoCards = [
  {
    icon: Phone,
    label: "Taleefan",
    value: "+252 61 8276993",
    hint: "Nagala soo xiriir wixii faahfaahin ah",
  },
  {
    icon: Mail,
    label: "Email",
    value: "info@karaamo.so",
    hint: "Waxaad noogu soo diri kartaa email",
  },
  {
    icon: MapPin,
    label: "Xarunta",
    value: "Muqdisho, Soomaaliya",
    hint: "Naga soo booqo xarunteena",
  },
];

const socialLinks = [
  { label: "f", bg: "bg-[#1877F2]" },
  { label: "X", bg: "bg-navy-950" },
  { label: "in", bg: "bg-[#0A66C2]" },
  { label: "YT", bg: "bg-[#FF0000]" },
  { icon: MessageCircle, bg: "bg-[#25D366]" },
];

const bottomFeatures = [
  { icon: ShieldCheck, title: "Kalsooni", body: "Trusted Partner" },
  { icon: UsersIcon, title: "Iskaashi", body: "Community Focus" },
  { icon: TrendingUp, title: "Mustaqbal", body: "Better Tomorrow" },
];

const topics = ["Su'aal Guud", "Iibsiga Dhul", "Iskaashi Ganacsi", "Wax Kale"];

const fieldInputClass =
  "w-full rounded-xl border border-navy-900/15 bg-white py-2.5 pl-10 pr-3 text-sm outline-none transition-colors focus:border-gold-500";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [status, setStatus] = useState("idle");

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.phone.trim() || !form.message.trim()) return;
    setStatus("saving");
    try {
      await addDoc(collection(db, COLLECTIONS.CONTACT_MESSAGES), {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        subject: form.subject,
        message: form.message.trim(),
        read: false,
        createdAt: serverTimestamp(),
      });
      setStatus("done");
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <div>
      <div className="grid lg:grid-cols-2">
        {/* Dhinaca bidix — macluumaadka xiriirka */}
        <div className="px-5 pb-14 pt-28 sm:px-10 lg:pt-32">
          <div className="mx-auto max-w-lg">
            <p className="flex items-center gap-2 font-[var(--font-display)] text-xs font-semibold uppercase tracking-widest text-gold-500">
              <span className="h-px w-6 bg-gold-500" /> Nala Soo Xiriir
            </p>
            <h1 className="mt-4 font-[var(--font-display)] text-4xl font-semibold leading-tight text-navy-900 sm:text-5xl">
              Contact <span className="text-gold-500">Us</span>
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-navy-900/60">
              Waxaan diyaar u nahay inaan ka jawaabno su'aalahaaga, soo jeedintaada iyo baahiyahaaga dhisme.
            </p>

            <div className="mt-8 space-y-3">
              {infoCards.map(({ icon: Icon, label, value, hint }) => (
                <div key={label} className="flex items-center gap-4 rounded-xl border border-navy-900/5 bg-white p-4 shadow-sm shadow-navy-900/5">
                  <div className="gold-gradient flex h-12 w-12 shrink-0 items-center justify-center rounded-full">
                    <Icon size={19} className="text-navy-950" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-navy-900/50">{label}</p>
                    <p className="truncate font-[var(--font-display)] text-sm font-semibold text-navy-900">{value}</p>
                    <p className="truncate text-xs text-navy-900/40">{hint}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link
              to="/about"
              className="mt-6 flex items-center justify-between gap-4 rounded-xl bg-navy-950 p-4 transition-colors hover:bg-navy-900"
            >
              <span className="flex items-center gap-3">
                <Handshake size={20} className="shrink-0 text-gold-400" />
                <span className="font-[var(--font-display)] text-sm font-semibold text-cream">
                  Iskaashi Bulsho
                  <br />
                  Dhisme Mustaqbal Wanaagsan
                </span>
              </span>
              <span className="gold-gradient flex h-9 w-9 shrink-0 items-center justify-center rounded-full">
                <ArrowRight size={16} className="text-navy-950" />
              </span>
            </Link>

            <div className="mt-8">
              <p className="text-xs font-medium text-navy-900/50">Follow Us</p>
              <div className="mt-3 flex gap-2.5">
                {socialLinks.map(({ icon: Icon, label, bg }, i) => (
                  <span
                    key={i}
                    className={`flex h-9 w-9 items-center justify-center rounded-full ${bg} text-xs font-bold text-white`}
                  >
                    {Icon ? <Icon size={16} /> : label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Dhinaca midig — form-ka xiriirka, ku dul yaal artwork navy ah */}
        <div className="relative overflow-hidden bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800 px-5 pb-14 pt-10 sm:px-10 lg:flex lg:items-center lg:pt-28">
          <div
            aria-hidden
            className="pointer-events-none absolute -left-16 top-10 h-64 w-64 rounded-full bg-gold-400/15 blur-3xl"
          />
          <div className="skyline-mask pointer-events-none absolute inset-x-0 bottom-0 h-40 opacity-20">
            <svg viewBox="0 0 800 200" className="h-full w-full" preserveAspectRatio="none">
              <rect x="60" y="80" width="55" height="120" fill="#DCBF5F" />
              <rect x="130" y="50" width="65" height="150" fill="#8B6914" />
              <rect x="620" y="70" width="50" height="130" fill="#C9A227" />
              <rect x="690" y="30" width="45" height="170" fill="#DCBF5F" />
            </svg>
          </div>
          <p
            aria-hidden
            className="pointer-events-none absolute bottom-6 left-8 hidden text-2xl text-gold-300/70 sm:block"
            style={{ fontFamily: "Caveat, cursive" }}
          >
            Dhisme Fican, Mustaqbal Ifaya
          </p>

          <div className="relative mx-auto w-full max-w-md rounded-2xl border border-navy-900/5 bg-white p-6 shadow-xl shadow-navy-950/30 sm:p-8">
            {status === "done" ? (
              <div className="py-6 text-center">
                <div className="gold-gradient mx-auto flex h-14 w-14 items-center justify-center rounded-full">
                  <CheckCircle2 size={26} className="text-navy-950" />
                </div>
                <p className="mt-5 font-[var(--font-display)] text-lg font-semibold text-navy-900">
                  Fariintaada waa la helay
                </p>
                <p className="mt-2 text-sm text-navy-900/60">Waan kula soo xiriiri doonaa dhowaan.</p>
              </div>
            ) : (
              <>
                <div className="gold-gradient flex h-11 w-11 items-center justify-center rounded-full">
                  <Mail size={18} className="text-navy-950" />
                </div>
                <p className="mt-4 font-[var(--font-display)] text-xs font-semibold uppercase tracking-widest text-gold-500">
                  Send Us a Message
                </p>
                <h2 className="mt-1 font-[var(--font-display)] text-2xl font-semibold text-navy-900">
                  Nagala Soo Xiriir
                </h2>
                <p className="mt-1.5 text-sm text-navy-900/50">
                  Fadlan buuxi foomka hoose, waxaan kugula soo xiriiri doonaa inta ugu dhakhsaha badan.
                </p>

                <form onSubmit={submit} className="mt-6 space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="text-xs font-medium text-navy-900/70">Magacaaga</label>
                      <div className="relative mt-1">
                        <UsersIcon size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-900/35" />
                        <input
                          value={form.name}
                          onChange={update("name")}
                          required
                          placeholder="Geli magacaaga"
                          className={fieldInputClass}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-navy-900/70">Email-kaaga</label>
                      <div className="relative mt-1">
                        <Mail size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-900/35" />
                        <input
                          value={form.email}
                          onChange={update("email")}
                          required
                          type="email"
                          placeholder="Geli email-kaaga"
                          className={fieldInputClass}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="text-xs font-medium text-navy-900/70">Lambarka Taleefanka</label>
                      <div className="relative mt-1">
                        <Phone size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-900/35" />
                        <input
                          value={form.phone}
                          onChange={update("phone")}
                          required
                          type="tel"
                          placeholder="+252 61 234 5678"
                          className={fieldInputClass}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-navy-900/70">Mowduuca</label>
                      <div className="relative mt-1">
                        <ListFilter size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-900/35" />
                        <select
                          value={form.subject}
                          onChange={update("subject")}
                          className={`${fieldInputClass} appearance-none`}
                        >
                          <option value="">Dooro mowduuca</option>
                          {topics.map((t) => (
                            <option key={t} value={t}>
                              {t}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-navy-900/70">Fariintaada</label>
                    <div className="relative mt-1">
                      <FileText size={16} className="pointer-events-none absolute left-3.5 top-3 text-navy-900/35" />
                      <textarea
                        value={form.message}
                        onChange={update("message")}
                        required
                        rows={4}
                        placeholder="Halkan ku qor fariintaada..."
                        className="w-full resize-none rounded-xl border border-navy-900/15 bg-white py-2.5 pl-10 pr-3 text-sm outline-none transition-colors focus:border-gold-500"
                      />
                    </div>
                  </div>

                  {status === "error" && <p className="text-sm text-clay">Wax baa qaldamay, isku day mar kale.</p>}

                  <button
                    type="submit"
                    disabled={status === "saving"}
                    className="gold-gradient flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-navy-950 transition-opacity hover:opacity-90 disabled:opacity-60"
                  >
                    {status === "saving" ? (
                      "Waa la diraayaa..."
                    ) : (
                      <>
                        <Send size={15} /> Dir Fariinta <ArrowRight size={15} />
                      </>
                    )}
                  </button>

                  <p className="flex items-center justify-center gap-1.5 text-center text-xs text-navy-900/45">
                    <CheckCircle2 size={13} className="shrink-0 text-gold-500" />
                    Macluumaadkaaga waa ammaan oo lama wadaagi doono cid kale.
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Bar-ka hoose */}
      <div className="bg-navy-950">
        <div className="mx-auto grid max-w-6xl gap-6 px-5 py-8 sm:grid-cols-3 sm:px-8">
          {bottomFeatures.map(({ icon: Icon, title, body }) => (
            <div key={title} className="flex items-center gap-3">
              <div className="gold-gradient flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
                <Icon size={17} className="text-navy-950" />
              </div>
              <div>
                <p className="font-[var(--font-display)] text-sm font-semibold text-cream">{title}</p>
                <p className="text-xs text-cream/50">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}