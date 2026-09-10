import { MapPin } from "lucide-react";

function formatPrice(value) {
  const n = Number(value);
  if (Number.isNaN(n)) return value;
  return n.toLocaleString("en-US");
}

export default function LandCard({ land, onAccept }) {
  return (
    <div className="stake-corners group overflow-hidden rounded-sm border border-navy-900/10 bg-white shadow-sm transition-shadow hover:shadow-xl hover:shadow-navy-900/10">
      <div className="relative h-52 w-full overflow-hidden bg-navy-800">
        {land.imageUrl ? (
          <img
            src={land.imageUrl}
            alt={land.title || "Dhul"}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-cream/40">Sawir ma jiro</div>
        )}
        <div className="gold-gradient absolute bottom-0 left-0 px-3 py-1.5 font-[var(--font-display)] text-sm font-semibold text-navy-950">
          ${formatPrice(land.price)}
        </div>
      </div>

      <div className="p-5">
        {land.title && (
          <h3 className="font-[var(--font-display)] text-lg font-semibold text-navy-900">{land.title}</h3>
        )}
        {land.location && (
          <p className="mt-1 flex items-center gap-1.5 text-xs text-navy-900/60">
            <MapPin size={13} className="text-gold-500" /> {land.location}
          </p>
        )}
        <p className="mt-2.5 line-clamp-3 text-sm leading-relaxed text-navy-900/70">{land.description}</p>

        <button
          onClick={() => onAccept(land)}
          className="mt-4 w-full rounded-sm bg-navy-900 py-2.5 text-sm font-medium text-cream transition-colors hover:bg-gold-500 hover:text-navy-950"
        >
          Waan rabaa dhulkan
        </button>
      </div>
    </div>
  );
}
