const roadmap = [
  {
    title: "V1 – Pilotage Cash",
    items: ["Connexion PSD2", "Prévision 90 jours", "Alertes seuils"]
  },
  {
    title: "V2 – Collaboration",
    items: ["Workflows validation", "Relances automatisées", "Export reporting"]
  },
  {
    title: "V3 – Intelligence",
    items: ["Scoring client", "Simulation dettes", "Assistants IA contextuels"]
  }
];

export function Roadmap() {
  return (
    <section className="rounded-3xl border border-white/60 bg-white/90 p-6 shadow-card dark:border-slate-800 dark:bg-slate-900/80">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-primary-500">Roadmap produit</p>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">3 itérations pour élargir la couverture</h2>
        </div>
        <span className="rounded-full bg-primary-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary-600">
          Rolling 90 jours
        </span>
      </header>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {roadmap.map((step) => (
          <article key={step.title} className="rounded-3xl border border-white/60 bg-white/70 p-5 dark:border-slate-800/60 dark:bg-slate-900/70">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{step.title}</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-500 dark:text-slate-400">
              {step.items.map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary-500" />
                  {item}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
