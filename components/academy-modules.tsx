import { BookOpen, GraduationCap, Play } from "lucide-react";

const modules = [
  {
    title: "Cash 101",
    duration: "12 min",
    description: "Comprendre le calcul du runway, du cash burn et les leviers tactiques rapides.",
    icon: Play
  },
  {
    title: "Optimiser le BFR",
    duration: "9 min",
    description: "Cartographier DSO/DPO/DIO et mettre en place un plan d’actions trimestriel.",
    icon: BookOpen
  },
  {
    title: "Financements court terme",
    duration: "7 min",
    description: "Panorama factoring, affacturage inversé et lignes RCF pour PME.",
    icon: GraduationCap
  }
];

export function AcademyModules() {
  return (
    <section className="rounded-3xl border border-white/60 bg-gradient-to-br from-white/95 via-white/90 to-primary-50/80 p-8 shadow-card dark:border-slate-800 dark:from-slate-900/90 dark:via-slate-900/70 dark:to-slate-900/70">
      <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-primary-500">Academy</p>
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Sprints pédagogiques pour l’équipe finance</h2>
        </div>
        <button className="mt-4 inline-flex items-center justify-center gap-2 rounded-full bg-primary-600 px-6 py-2 text-sm font-semibold text-white shadow-lg shadow-primary-900/30 transition hover:-translate-y-0.5 hover:bg-primary-500 md:mt-0">
          Explorer la librairie
        </button>
      </header>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {modules.map((module) => {
          const Icon = module.icon;
          return (
            <article key={module.title} className="flex flex-col gap-3 rounded-3xl border border-white/60 bg-white/70 p-5 backdrop-blur dark:border-slate-800/70 dark:bg-slate-900/70">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-500/15 text-primary-600 dark:bg-primary-500/20 dark:text-primary-200">
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{module.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{module.description}</p>
              </div>
              <span className="text-xs font-medium uppercase tracking-wide text-primary-500">{module.duration}</span>
            </article>
          );
        })}
      </div>
    </section>
  );
}
