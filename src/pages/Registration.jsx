import { useState } from "react";
import { Link } from "react-router-dom";
import { collection, addDoc, getDocs, query, where, serverTimestamp } from "firebase/firestore";
import { db, COLLECTIONS } from "../firebase";
import logo from "../assets/logo.png";
import {
  User,
  Mail,
  Lock,
  Phone,
  MapPin,
  FileText,
  UserPlus,
  ChevronRight,
  HardHat,
  Users as UsersIcon,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";

const features = [
  {
    icon: HardHat,
    title: "Mashruucyo Kalsooni Leh",
    body: "Dhismo tayo leh oo casri ah",
  },
  {
    icon: UsersIcon,
    title: "Iskaashi Bulsho",
    body: "Wadajir baynu u dhisnaa",
  },
  {
    icon: TrendingUp,
    title: "Horumar Joogto ah",
    body: "Mustaqbal wanaagsan",
  },
];

function FieldIcon({ Icon }) {
  return <Icon size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-900/35" />;
}

const inputClass =
  "w-full rounded-xl border border-navy-900/15 bg-white py-2.5 pl-10 pr-3 text-sm outline-none transition-colors focus:border-gold-500";

export default function Registration() {
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "", location: "", message: "" });
  const [agreed, setAgreed] = useState(false);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name.trim() || !form.email.trim() || !form.password.trim() || !form.phone.trim() || !form.location.trim()) {
      return;
    }
    if (!agreed) {
      setError("Waa inaad ogolaataa Shuruudaha Adeegga si aad u isdiiwaangeliso.");
      return;
    }

    setStatus("saving");
    try {
      const dupCheck = query(collection(db, COLLECTIONS.REGISTRATIONS), where("email", "==", form.email.trim().toLowerCase()));
      const dupSnap = await getDocs(dupCheck);
      if (!dupSnap.empty) {
        setError("Email-kan horey ayaa loo isticmaalay. Fadlan isku day inaad Login gasho.");
        setStatus("error");
        return;
      }

      await addDoc(collection(db, COLLECTIONS.REGISTRATIONS), {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password.trim(),
        phone: form.phone.trim().startsWith("+252") ? form.phone.trim() : `+252 ${form.phone.trim()}`,
        location: form.location.trim(),
        message: form.message.trim(),
        status: "pending",
        createdAt: serverTimestamp(),
      });
      setStatus("done");
    } catch (err) {
      console.error(err);
      setError("Wax baa qaldamay. Isku day mar kale.");
      setStatus("error");
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Dhinaca bidix — hero-ga brand-ka */}
      <div className="relative overflow-hidden bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800 px-6 pb-14 pt-28 sm:px-10 lg:pt-32">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 top-16 h-72 w-72 rounded-full bg-gold-400/20 blur-3xl"
        />
        <div className="skyline-mask pointer-events-none absolute inset-x-0 bottom-0 h-48 opacity-20">
          <svg viewBox="0 0 800 200" className="h-full w-full" preserveAspectRatio="none">
            <rect x="40" y="70" width="60" height="130" fill="#C9A227" />
            <rect x="110" y="40" width="70" height="160" fill="#DCBF5F" />
            <rect x="190" y="90" width="50" height="110" fill="#8B6914" />
            <rect x="600" y="60" width="55" height="140" fill="#8B6914" />
            <rect x="665" y="100" width="45" height="100" fill="#C9A227" />
            <rect x="720" y="30" width="40" height="170" fill="#DCBF5F" />
          </svg>
        </div>

        <div className="relative mx-auto max-w-md">
          <img src={logo} alt="Karaamo Construction Company" className="mx-auto h-28 w-28 rounded-full object-cover sm:h-36 sm:w-36" />

          <h1 className="mt-8 text-center font-[var(--font-display)] text-3xl font-semibold leading-tight text-cream sm:text-4xl">
            Ku Soo Biir Qoyska <span className="text-gold-400">KARAAMO</span>
          </h1>
          <p className="mt-4 text-center text-sm leading-relaxed text-cream/60">
            Diiwaangeli si aad u hesho adeegyadeena, la socoto mashruucyada, uguna qayb qaadato dhisme mustaqbal
            wanaagsan.
          </p>

          <div className="mt-10 space-y-5">
            {features.map(({ icon: Icon, title, body }) => (
              <div key={title} className="flex items-center gap-4">
                <div className="gold-gradient flex h-11 w-11 shrink-0 items-center justify-center rounded-full">
                  <Icon size={19} className="text-navy-950" />
                </div>
                <div>
                  <p className="font-[var(--font-display)] text-sm font-semibold text-cream">{title}</p>
                  <p className="text-xs text-cream/50">{body}</p>
                </div>
              </div>
            ))}
          </div>

          <p
            className="mt-12 text-center text-2xl text-gold-300 sm:text-3xl"
            style={{ fontFamily: "Caveat, cursive" }}
          >
            Dhisme fican, Mustaqbal ifaya
          </p>
        </div>
      </div>

      {/* Dhinaca midig — form-ka isdiiwaangelinta */}
      <div className="flex items-center justify-center bg-cream-dim px-5 py-14 pt-28 sm:px-8 lg:pt-14">
        <div className="w-full max-w-md rounded-2xl border border-navy-900/5 bg-white p-6 shadow-xl shadow-navy-900/5 sm:p-8">
          {status === "done" ? (
            <div className="py-6 text-center">
              <div className="gold-gradient mx-auto flex h-14 w-14 items-center justify-center rounded-full">
                <CheckCircle2 size={26} className="text-navy-950" />
              </div>
              <p className="mt-5 font-[var(--font-display)] text-lg font-semibold text-navy-900">
                Isdiiwaangelintu waa la helay
              </p>
              <p className="mt-2 text-sm text-navy-900/60">
                Waxaan kula soo xiriiri doonaa dhowaan si aan codsigaaga u aqbalno. Marka la aqbalo, ku gal{" "}
                <Link to="/login" className="font-medium text-gold-600 underline">
                  dashboard-kaaga
                </Link>{" "}
                adigoo isticmaalaya email-kaaga iyo password-kaaga.
              </p>
            </div>
          ) : (
            <>
              <div className="gold-gradient mx-auto flex h-12 w-12 items-center justify-center rounded-full">
                <UserPlus size={20} className="text-navy-950" />
              </div>
              <h2 className="mt-4 text-center font-[var(--font-display)] text-2xl font-semibold text-navy-900">
                Diiwaangelin
              </h2>
              <p className="mt-1.5 text-center text-sm text-navy-900/50">
                Fadlan buuxi macluumaadka hoose si aad u sameysato account.
              </p>

              <form onSubmit={submit} className="mt-7 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-xs font-medium text-navy-900/70">Magacaaga</label>
                    <div className="relative mt-1">
                      <FieldIcon Icon={User} />
                      <input
                        value={form.name}
                        onChange={update("name")}
                        required
                        placeholder="Geli magacaaga"
                        className={inputClass}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-navy-900/70">Email</label>
                    <div className="relative mt-1">
                      <FieldIcon Icon={Mail} />
                      <input
                        value={form.email}
                        onChange={update("email")}
                        required
                        type="email"
                        placeholder="Geli email-kaaga"
                        className={inputClass}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-xs font-medium text-navy-900/70">Password</label>
                    <div className="relative mt-1">
                      <FieldIcon Icon={Lock} />
                      <input
                        value={form.password}
                        onChange={update("password")}
                        required
                        type="password"
                        placeholder="Abuur password"
                        className={inputClass}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-navy-900/70">Lambarka taleefanka</label>
                    <div className="mt-1 flex">
                      <span className="flex shrink-0 items-center gap-1 rounded-l-xl border border-r-0 border-navy-900/15 bg-cream-dim px-2.5 text-sm text-navy-900/60">
                        <Phone size={14} className="text-navy-900/40" /> +252
                      </span>
                      <input
                        value={form.phone}
                        onChange={update("phone")}
                        required
                        type="tel"
                        placeholder="61 234 5678"
                        className="w-full rounded-r-xl border border-navy-900/15 py-2.5 px-3 text-sm outline-none transition-colors focus:border-gold-500"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-navy-900/70">Meesha aad joogto</label>
                  <div className="relative mt-1">
                    <FieldIcon Icon={MapPin} />
                    <input
                      value={form.location}
                      onChange={update("location")}
                      required
                      placeholder="Geli magaalada / deegaanka"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-navy-900/70">Faahfaahin dheeraad ah (ikhtiyaari)</label>
                  <div className="relative mt-1">
                    <FileText size={17} className="pointer-events-none absolute left-3.5 top-3 text-navy-900/35" />
                    <textarea
                      value={form.message}
                      onChange={update("message")}
                      rows={3}
                      placeholder="Waxaad ku qori kartaa faahfaahin dheeraad ah..."
                      className="w-full resize-none rounded-xl border border-navy-900/15 bg-white py-2.5 pl-10 pr-3 text-sm outline-none transition-colors focus:border-gold-500"
                    />
                  </div>
                </div>

                <label className="flex items-start gap-2.5 text-xs text-navy-900/60">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="mt-0.5 h-4 w-4 shrink-0 rounded border-navy-900/25 accent-gold-500"
                  />
                  <span>
                    Waxaan aqbalayaa{" "}
                    <span className="font-medium text-gold-600 underline decoration-gold-400/50">Shuruudaha Adeegga</span>{" "}
                    iyo <span className="font-medium text-gold-600 underline decoration-gold-400/50">Siyaasadda Sirta ah</span>
                  </span>
                </label>

                {error && <p className="text-sm text-clay">{error}</p>}

                <button
                  type="submit"
                  disabled={status === "saving"}
                  className="gold-gradient flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-navy-950 transition-opacity hover:opacity-90 disabled:opacity-60"
                >
                  {status === "saving" ? (
                    "Waa la diraayaa..."
                  ) : (
                    <>
                      <UserPlus size={16} /> Isdiiwaangeli <ChevronRight size={16} />
                    </>
                  )}
                </button>

                <div className="flex items-center gap-3 pt-1">
                  <span className="h-px flex-1 bg-navy-900/10" />
                  <span className="text-xs text-navy-900/40">Ama</span>
                  <span className="h-px flex-1 bg-navy-900/10" />
                </div>

                <p className="text-center text-xs text-navy-900/50">
                  Horey account ma u leedahay?{" "}
                  <Link to="/login" className="font-medium text-gold-600 underline">
                    Login
                  </Link>
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}