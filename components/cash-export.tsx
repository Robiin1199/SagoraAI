"use client";

import { useCallback, useMemo, useState } from "react";
import { Download, FileText } from "lucide-react";
import type { CashForecast, CashScenario, CashSnapshot } from "@/lib/api/cash";
import { formatCurrency } from "@/lib/utils";

const buttonBaseClasses =
  "inline-flex items-center gap-2 rounded-full border border-primary-200 bg-white/80 px-4 py-2 text-sm font-medium text-primary-700 shadow-sm transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-100 dark:hover:bg-slate-800";

type CashExportProps = {
  snapshot: CashSnapshot | null;
  forecast: CashForecast | null;
  scenarios: CashScenario[];
  lastUpdateLabel: string;
};

function escapeCsvValue(value: string) {
  if (value.includes(";") || value.includes("\"") || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }

  return value;
}

function buildCsvContent({
  snapshot,
  forecast,
  scenarios,
  currency,
  lastUpdateLabel
}: {
  snapshot: CashSnapshot | null;
  forecast: CashForecast | null;
  scenarios: CashScenario[];
  currency: string;
  lastUpdateLabel: string;
}) {
  const rows: string[][] = [["Section", "Label", "Valeur", "Détails"]];

  if (snapshot) {
    rows.push([
      "Synthèse",
      "Cash disponible",
      formatCurrency(snapshot.cashAvailable, currency),
      lastUpdateLabel
    ]);
    rows.push([
      "Synthèse",
      "Burn mensuel",
      formatCurrency(snapshot.burnRate, currency),
      snapshot.burnDelta30d ? `${snapshot.burnDelta30d.toFixed(1)} pts vs 30j` : ""
    ]);
    rows.push([
      "Synthèse",
      "Runway",
      `${snapshot.runwayMonths.toFixed(1)} mois`,
      snapshot.runwayDelta30d ? `${snapshot.runwayDelta30d.toFixed(1)} mois vs 30j` : ""
    ]);

    snapshot.alerts.forEach((alert) => {
      rows.push([
        "Alertes",
        alert.title,
        alert.description,
        alert.timestamp
      ]);
    });
  }

  if (forecast) {
    rows.push(["Prévision", "Horizon (jours)", `${forecast.horizonDays}`, ""]);
    forecast.points.forEach((point) => {
      rows.push([
        "Prévision",
        point.label,
        formatCurrency(point.value, currency),
        ""
      ]);
    });
  }

  if (scenarios.length) {
    scenarios.forEach((scenario) => {
      rows.push([
        "Scénarios",
        scenario.name,
        scenario.runwayLabel,
        `${scenario.deltaLabel} · ${scenario.riskNarrative}`
      ]);
    });
  }

  return rows.map((row) => row.map(escapeCsvValue).join(";")).join("\n");
}

function triggerDownload(filename: string, blob: Blob) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export function CashExportControls({ snapshot, forecast, scenarios, lastUpdateLabel }: CashExportProps) {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const exportCurrency = snapshot?.currency ?? forecast?.currency ?? "EUR";

  const csvPayload = useMemo(
    () =>
      buildCsvContent({
        snapshot,
        forecast,
        scenarios,
        currency: exportCurrency,
        lastUpdateLabel
      }),
    [snapshot, forecast, scenarios, exportCurrency, lastUpdateLabel]
  );

  const handleCsvExport = useCallback(() => {
    const blob = new Blob(["\uFEFF" + csvPayload], {
      type: "text/csv;charset=utf-8;"
    });

    triggerDownload("sagora-cockpit-cash.csv", blob);
  }, [csvPayload]);

  const handlePdfExport = useCallback(async () => {
    try {
      setIsGeneratingPdf(true);
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF();
      const now = new Date();

      doc.setFontSize(16);
      doc.text("Sagora – Export cockpit cash", 14, 18);
      doc.setFontSize(10);
      doc.text(`Généré le ${now.toLocaleString("fr-FR")}`, 14, 26);

      let y = 36;

      if (snapshot) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.text("Synthèse cash", 14, y);
        y += 8;
        doc.setFont("helvetica", "normal");
        doc.text(`Cash disponible : ${formatCurrency(snapshot.cashAvailable, exportCurrency)}`, 14, y);
        y += 6;
        doc.text(`Burn mensuel : ${formatCurrency(snapshot.burnRate, exportCurrency)}`, 14, y);
        y += 6;
        doc.text(`Runway : ${snapshot.runwayMonths.toFixed(1)} mois`, 14, y);
        y += 8;

        if (snapshot.alerts.length) {
          doc.setFont("helvetica", "bold");
          doc.text("Alertes actives", 14, y);
          y += 8;
          doc.setFont("helvetica", "normal");
          snapshot.alerts.forEach((alert) => {
            doc.text(`• ${alert.title} – ${alert.description} (${alert.timestamp})`, 14, y, { maxWidth: 180 });
            y += 6;
            if (y > 270) {
              doc.addPage();
              y = 20;
            }
          });
          y += 4;
        }
      }

      if (forecast) {
        if (y > 250) {
          doc.addPage();
          y = 20;
        }
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.text("Prévision 90 jours", 14, y);
        y += 8;
        doc.setFont("helvetica", "normal");
        doc.text(`Horizon : ${forecast.horizonDays} jours`, 14, y);
        y += 6;
        forecast.points.forEach((point) => {
          doc.text(`${point.label} : ${formatCurrency(point.value, exportCurrency)}`, 14, y);
          y += 6;
          if (y > 270) {
            doc.addPage();
            y = 20;
          }
        });
        y += 4;
      }

      if (scenarios.length) {
        if (y > 250) {
          doc.addPage();
          y = 20;
        }
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.text("Scénarios", 14, y);
        y += 8;
        doc.setFont("helvetica", "normal");
        scenarios.forEach((scenario) => {
          doc.text(`• ${scenario.name} – ${scenario.runwayLabel} (${scenario.deltaLabel})`, 14, y, { maxWidth: 180 });
          y += 6;
          doc.text(`  ${scenario.riskNarrative}`, 14, y, { maxWidth: 180 });
          y += 8;
          if (y > 270) {
            doc.addPage();
            y = 20;
          }
        });
      }

      doc.save("sagora-cockpit-cash.pdf");
    } catch (error) {
      console.error("Erreur lors de l'export PDF", error);
    } finally {
      setIsGeneratingPdf(false);
    }
  }, [snapshot, forecast, scenarios, exportCurrency]);

  const isDisabled = !snapshot && !forecast && scenarios.length === 0;

  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      <button
        type="button"
        className={buttonBaseClasses}
        onClick={handleCsvExport}
        disabled={isDisabled}
      >
        <Download className="h-4 w-4" />
        Export CSV
      </button>
      <button
        type="button"
        className={buttonBaseClasses}
        onClick={handlePdfExport}
        disabled={isDisabled || isGeneratingPdf}
      >
        <FileText className="h-4 w-4" />
        {isGeneratingPdf ? "Export..." : "Export PDF"}
      </button>
    </div>
  );
}
