"use client";

import { useMemo, useState } from "react";
import { TrendingDown, TrendingUp } from "lucide-react";

import type { BalanceSheet } from "@/lib/api/balance-sheet";
import { cn, formatCurrency } from "@/lib/utils";

type BalanceSheetExplorerProps = {
  data: BalanceSheet;
};

export function BalanceSheetExplorer({ data }: BalanceSheetExplorerProps) {
  const sortedYears = useMemo(
    () => [...data.years].sort((a, b) => b.year - a.year),
    [data.years]
  );

  const defaultYear = sortedYears[0]?.year;
  const [selectedYear, setSelectedYear] = useState<number | undefined>(defaultYear);

  const currentYear = useMemo(() => {
    if (!selectedYear) {
      return sortedYears[0];
    }

    return sortedYears.find((year) => year.year === selectedYear) ?? sortedYears[0];
  }, [selectedYear, sortedYears]);

  const comparisonYear = useMemo(() => {
    if (!currentYear) {
      return undefined;
    }

    const currentIndex = sortedYears.findIndex((year) => year.year === currentYear.year);
    return currentIndex >= 0 ? sortedYears[currentIndex + 1] : undefined;
  }, [currentYear, sortedYears]);

  if (!currentYear) {
    return null;
  }

  const totals = computeTotals(currentYear);
  const comparisonTotals = comparisonYear ? computeTotals(comparisonYear) : undefined;

  const yoyAssets =
    comparisonTotals && comparisonTotals.totalAssets > 0
      ? (totals.totalAssets - comparisonTotals.totalAssets) / comparisonTotals.totalAssets
      : undefined;

  const yoyEquity =
    comparisonTotals && comparisonTotals.totalEquity > 0
      ? (totals.totalEquity - comparisonTotals.totalEquity) / comparisonTotals.totalEquity
      : undefined;

  const metrics = buildMetrics(totals, currentYear.currency);

  return (
    <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
      <div className="rounded-3xl border border-white/60 bg-white/90 p-6 shadow-card dark:border-slate-800 dark:bg-slate-900/80">
        <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-primary-500">Bilan financier</p>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
              Actifs & passifs – {currentYear.year}
            </h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Vue synthétique des trois derniers exercices. Sélectionnez une année pour analyser la structure du bilan.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {sortedYears.map((year) => (
              <button
                key={year.year}
                type="button"
                onClick={() => setSelectedYear(year.year)}
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide transition",
                  selectedYear === year.year
                    ? "bg-primary-500 text-white shadow"
                    : "bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:bg-slate-700"
                )}
              >
                {year.year}
              </button>
            ))}
          </div>
        </header>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <BalanceSheetColumn
            title="Actif"
            groups={currentYear.assets}
            currency={currentYear.currency}
            totalLabel="Total Actif"
          />
          <BalanceSheetColumn
            title="Passif"
            groups={currentYear.liabilities}
            currency={currentYear.currency}
            totalLabel="Total Passif"
          />
        </div>
        <footer className="mt-6 flex flex-col gap-2 text-sm text-slate-500 dark:text-slate-400 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <span className="font-semibold text-slate-700 dark:text-slate-200">Actifs totaux</span>
            <span className="ml-2 font-medium text-slate-700 dark:text-slate-200">
              {formatCurrency(totals.totalAssets, currentYear.currency)}
            </span>
            {typeof yoyAssets === "number" && (
              <TrendPill value={yoyAssets} />
            )}
          </div>
          <div>
            <span className="font-semibold text-slate-700 dark:text-slate-200">Capitaux propres</span>
            <span className="ml-2 font-medium text-slate-700 dark:text-slate-200">
              {formatCurrency(totals.totalEquity, currentYear.currency)}
            </span>
            {typeof yoyEquity === "number" && (
              <TrendPill value={yoyEquity} />
            )}
          </div>
        </footer>
      </div>

      <div className="rounded-3xl border border-white/60 bg-white/90 p-6 shadow-card dark:border-slate-800 dark:bg-slate-900/80">
        <h4 className="text-lg font-semibold text-slate-900 dark:text-white">Lecture rapide</h4>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Analyse automatique des équilibres bilanciels pour l&apos;exercice sélectionné.
        </p>
        <div className="mt-5 grid gap-4">
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className="rounded-2xl border border-white/60 bg-white/80 px-4 py-3 text-sm shadow-inner dark:border-slate-800/70 dark:bg-slate-900/70"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-slate-600 dark:text-slate-300">{metric.label}</span>
                <span className="font-semibold text-slate-900 dark:text-white">{metric.value}</span>
              </div>
              <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">{metric.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

type BalanceSheetColumnProps = {
  title: string;
  groups: BalanceSheet["years"][number]["assets"];
  currency: string;
  totalLabel: string;
};

function BalanceSheetColumn({ title, groups, currency, totalLabel }: BalanceSheetColumnProps) {
  const total = groups.reduce((sum, group) => sum + sumGroup(group), 0);

  return (
    <div>
      <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300">{title}</h4>
      <div className="mt-3 space-y-3">
        {groups.map((group) => (
          <div
            key={group.id}
            className="rounded-2xl border border-white/60 bg-white/80 p-4 shadow-inner dark:border-slate-800/70 dark:bg-slate-900/70"
          >
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
              <span>{group.label}</span>
              <span>{formatCurrency(sumGroup(group), currency)}</span>
            </div>
            <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
              {group.items.map((item) => (
                <li key={item.label} className="flex items-center justify-between">
                  <span>{item.label}</span>
                  <span className="font-medium text-slate-700 dark:text-slate-200">
                    {formatCurrency(item.amount, currency)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between rounded-2xl border border-primary-500/20 bg-primary-500/10 px-4 py-2 text-sm font-semibold text-primary-600">
        <span>{totalLabel}</span>
        <span>{formatCurrency(total, currency)}</span>
      </div>
    </div>
  );
}

function computeTotals(year: BalanceSheet["years"][number]) {
  const sumByType = (types: Array<BalanceSheet["years"][number]["assets"][number]["type"]>) =>
    year.assets
      .filter((group) => types.includes(group.type))
      .reduce((sum, group) => sum + sumGroup(group), 0);

  const sumLiabilitiesByType = (
    types: Array<BalanceSheet["years"][number]["liabilities"][number]["type"]>
  ) =>
    year.liabilities
      .filter((group) => types.includes(group.type))
      .reduce((sum, group) => sum + sumGroup(group), 0);

  const totalAssets = year.assets.reduce((sum, group) => sum + sumGroup(group), 0);
  const totalLiabilities = year.liabilities.reduce((sum, group) => sum + sumGroup(group), 0);

  const currentAssets = sumByType(["CURRENT_ASSET", "CASH"]);
  const cash = sumByType(["CASH"]);
  const currentLiabilities = sumLiabilitiesByType(["CURRENT_LIABILITY"]);
  const totalEquity = sumLiabilitiesByType(["EQUITY"]);
  const financialDebt = sumLiabilitiesByType(["NON_CURRENT_LIABILITY"]);

  const workingCapital = currentAssets - currentLiabilities;
  const liquidityRatio = currentLiabilities > 0 ? currentAssets / currentLiabilities : undefined;
  const netDebt = financialDebt - cash;
  const equityRatio = totalAssets > 0 ? totalEquity / totalAssets : undefined;

  return {
    totalAssets,
    totalLiabilities,
    currentAssets,
    currentLiabilities,
    totalEquity,
    financialDebt,
    cash,
    workingCapital,
    liquidityRatio,
    netDebt,
    equityRatio
  };
}

function buildMetrics(totals: ReturnType<typeof computeTotals>, currency: string) {
  const metrics: Array<{ label: string; value: string; description: string }> = [];

  metrics.push({
    label: "Fonds de roulement",
    value: formatCurrency(totals.workingCapital, currency),
    description: "Actifs court terme moins dettes court terme (incluant trésorerie)."
  });

  metrics.push({
    label: "Trésorerie nette",
    value: formatCurrency(totals.cash - totals.financialDebt, currency),
    description: "Trésorerie disponible diminuée des dettes financières long terme."
  });

  metrics.push({
    label: "Ratio de liquidité générale",
    value:
      typeof totals.liquidityRatio === "number"
        ? `${totals.liquidityRatio.toFixed(2)}x`
        : "--",
    description: "Capacité à couvrir les dettes court terme par les actifs courants."
  });

  metrics.push({
    label: "Poids capitaux propres",
    value:
      typeof totals.equityRatio === "number"
        ? `${(totals.equityRatio * 100).toFixed(1)}%`
        : "--",
    description: "Capitaux propres rapportés au total actif." 
  });

  metrics.push({
    label: "Dettes financières",
    value: formatCurrency(totals.financialDebt, currency),
    description: "Encours bancaire et obligations de location consolidés."
  });

  return metrics;
}

function sumGroup(group: BalanceSheet["years"][number]["assets"][number]) {
  return group.items.reduce((sum, item) => sum + item.amount, 0);
}

type TrendPillProps = {
  value: number;
};

function TrendPill({ value }: TrendPillProps) {
  const positive = value >= 0;

  return (
    <span
      className={cn(
        "ml-3 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold",
        positive
          ? "bg-success/10 text-success"
          : "bg-danger/10 text-danger"
      )}
    >
      {positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
      {(value * 100).toFixed(1)}%
    </span>
  );
}

