import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db, COLLECTIONS } from "../firebase";
import LandCard from "../components/LandCard";
import RequestModal from "../components/RequestModal";

export default function Home() {
  const [lands, setLands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLand, setSelectedLand] = useState(null);

  useEffect(() => {
    const q = query(collection(db, COLLECTIONS.LANDS), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(
      q,
      (snap) => {
        setLands(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setLoading(false);
      },
      (err) => {
        console.error(err);
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

  return (
    <div>
      <section className="relative overflow-hidden bg-navy-900 pt-28">
        <div className="skyline-mask pointer-events-none absolute inset-x-0 bottom-0 h-64 opacity-30 md:h-80">
          <svg viewBox="0 0 800 200" className="h-full w-full" preserveAspectRatio="none">
            <rect x="40" y="70" width="60" height="130" fill="#C9A227" />
            <rect x="110" y="40" width="70" height="160" fill="#DCBF5F" />
            <rect x="190" y="90" width="50" height="110" fill="#8B6914" />
            <rect x="600" y="60" width="55" height="140" fill="#8B6914" />
            <rect x="665" y="100" width="45" height="100" fill="#C9A227" />
            <rect x="720" y="30" width="40" height="170" fill="#DCBF5F" />
          </svg>
        </div>

        <div className="relative mx-auto max-w-6xl px-5 pb-24 pt-8 md:px-8 md:pb-32 md:pt-16">
          <p className="font-[var(--font-display)] text-sm tracking-wide text-gold-400">
            Iskaashi Bulsho · Dhisme Mustaqbal Wanaagsan
          </p>
          <h1 className="mt-4 max-w-xl font-[var(--font-display)] text-4xl font-semibold leading-tight text-cream md:text-5xl">
            Hel dhulkaaga oo aamin ah, si fudud oo la kalsoon yahay.
          </h1>
          <p className="mt-5 max-w-md text-cream/70">
            KARAAMO waxay kuu soo bandhigtaa dhulal la hubiyay oo kaa caawin doona in aad dhisto mustaqbalkaaga —
            xagaaga oo aan wax dhib ah lahayn.
          </p>
          <a
            href="#lands"
            className="mt-8 inline-block rounded-sm bg-gold-500 px-7 py-3 text-sm font-semibold text-navy-950 transition-colors hover:bg-gold-400"
          >
            Eeg Dhulalka
          </a>
        </div>
      </section>

      <section id="lands" className="mx-auto max-w-6xl px-5 py-16 md:px-8">
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
      </section>

      {selectedLand && <RequestModal land={selectedLand} onClose={() => setSelectedLand(null)} />}
    </div>
  );
}
