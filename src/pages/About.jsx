import { ShieldCheck, Handshake, Building2 } from "lucide-react";
import logo from "../assets/logo.png";

const values = [
  {
    icon: ShieldCheck,
    title: "Aamin",
    body: "Dhammaan dhulalka lagu soo bandhigo waxaa la hubiyaa ka hor inta aan la soo dhigin, si aadan u lumin lacagtaada.",
  },
  {
    icon: Handshake,
    title: "Iskaashi Bulsho",
    body: "Waxaan ka shaqeynaa bulshada dhexdeeda, annagoo la shaqeynayna dad iyo maalgashadayaal aan ku kalsoon nahay.",
  },
  {
    icon: Building2,
    title: "Mustaqbal Wanaagsan",
    body: "Ujeedadeenu waa in aan gacan ka geysano dhismaha guryo iyo bulsho horumarsan.",
  },
];

export default function About() {
  return (
    <div className="pt-24">
      <section className="mx-auto max-w-6xl px-5 py-14 md:px-8">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div>
            <p className="font-[var(--font-display)] text-sm tracking-wide text-gold-500">Nagu Saabsan</p>
            <h1 className="mt-3 font-[var(--font-display)] text-3xl font-semibold text-navy-900 md:text-4xl">
              KARAAMO Construction Company
            </h1>
            <p className="mt-5 text-sm leading-relaxed text-navy-900/70">
              KARAAMO waa shirkad ka shaqeysa dhismaha iyo iibinta dhulalka, iyadoo ujeedadeedu tahay in ay bulshada
              siiso fursad ay ku helaan dhul aamin ah oo mustaqbal dhis ah. Waxaan xiriir dhow la leenahay
              maalgashadayaasha, dadka rabo in ay guryo dhistaan, iyo hay'adaha dhismaha.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-navy-900/70">
              Habka aan u shaqeyno waa mid fudud oo la kalsoon yahay: soo bandhig dhulka, codso, kadibna waxaan kula
              soo xiriirnaa si aan wax kuugu dhamaystirno.
            </p>
          </div>
          <div className="flex justify-center">
            <img src={logo} alt="Karaamo Construction Company" className="w-64 md:w-80" />
          </div>
        </div>
      </section>

      <section className="bg-navy-900 py-16">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <div className="grid gap-8 md:grid-cols-3">
            {values.map(({ icon: Icon, title, body }) => (
              <div key={title} className="rounded-sm border border-gold-500/20 bg-navy-800/60 p-6">
                <Icon size={24} className="text-gold-400" />
                <h3 className="mt-4 font-[var(--font-display)] text-lg font-semibold text-cream">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-cream/60">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
