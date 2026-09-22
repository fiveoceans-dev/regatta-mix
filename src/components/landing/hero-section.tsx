import { ArrowDown, ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"

const sailingFormats = [
  {
    eyebrow: "ONE-ON-ONE / TACTICAL",
    title: "Match Racing",
    description: "Read the wind. Control the start. Outmaneuver your rival.",
    theme: "from-[#f3a46b] via-[#efc899] to-[#729bb5]",
    sea: "bg-[#264f68]",
    glow: "bg-[#fff0c7]/70",
  },
  {
    eyebrow: "MULTIPLAYER / HIGH INTENSITY",
    title: "Fleet Regatta",
    description: "A crowded start line, shifting lanes, and one clear winner.",
    theme: "from-[#4ca9dc] via-[#82c9e7] to-[#d5edf2]",
    sea: "bg-[#087da5]",
    glow: "bg-[#fff7cc]/90",
  },
  {
    eyebrow: "ENDURANCE / OPEN OCEAN",
    title: "Offshore Sailing",
    description: "Navigate changing weather and race beyond the horizon.",
    theme: "from-[#071426] via-[#0c2943] to-[#17516b]",
    sea: "bg-[#061825]",
    glow: "bg-[#b9d8ea]/20",
  },
]

export function HeroSection() {
  return (
    <main className="bg-slate-950 text-white">
      {sailingFormats.map((format, index) => (
        <section
          id={`sailing-format-${index + 1}`}
          key={format.title}
          className={`relative flex min-h-[calc(100svh-3.5rem)] snap-start items-end overflow-hidden bg-gradient-to-b ${format.theme}`}
        >
          <div className={`absolute -right-24 top-[16%] h-72 w-72 rounded-full blur-sm md:h-96 md:w-96 ${format.glow}`} />
          <div className={`absolute inset-x-0 bottom-0 h-[38%] ${format.sea}`} />
          <div className="absolute inset-x-0 bottom-[37%] h-px bg-white/45" />

          <div className="relative z-10 w-full px-6 pb-16 sm:px-10 md:px-16 md:pb-20 lg:px-24">
            <div className="max-w-3xl">
              <p className="mb-3 text-xs font-semibold tracking-[0.28em] text-white/80 md:text-sm">
                {format.eyebrow}
              </p>
              <h1 className="font-sans text-5xl font-semibold uppercase leading-[0.9] tracking-[-0.04em] text-white sm:text-6xl md:text-8xl lg:text-9xl">
                {format.title}
              </h1>
              <p className="mt-6 max-w-xl font-sans text-base text-white/85 md:text-lg">
                {format.description}
              </p>
              <Link
                to="/play"
                className="group mt-8 inline-flex min-w-52 items-center justify-between border border-white px-6 py-4 font-sans text-xs font-bold uppercase tracking-[0.18em] transition-colors duration-300 hover:bg-white hover:text-slate-950"
              >
                Explore racing
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {index === 0 && (
            <a
              href="#sailing-format-2"
              aria-label="Scroll to Fleet Regatta"
              className="absolute bottom-5 right-6 z-20 animate-bounce text-white/80 md:right-12"
            >
              <ArrowDown className="h-6 w-6" />
            </a>
          )}
        </section>
      ))}
    </main>
  )
}
