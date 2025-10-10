"use client";

import { useCallback, useMemo, useState } from "react";
import { Download, FileText } from "lucide-react";
import type { CashForecast, CashScenario, CashSnapshot } from "@/lib/api/cash";
import {
  buildCashExportSummary,
  generateCashCsvContent,
  getCsvBlob,
  isCashExportEmpty
} from "@/lib/export/cash";

const buttonBaseClasses =
  "inline-flex items-center gap-2 rounded-full border border-primary-200 bg-white/80 px-4 py-2 text-sm font-medium text-primary-700 shadow-sm transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-100 dark:hover:bg-slate-800";

type CashExportProps = {
  snapshot: CashSnapshot | null;
  forecast: CashForecast | null;
  scenarios: CashScenario[];
  lastUpdateLabel: string;
};

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

  const summarySections = useMemo(
    () =>
      buildCashExportSummary({
        snapshot,
        forecast,
        scenarios,
        currency: exportCurrency,
        lastUpdateLabel
      }),
    [snapshot, forecast, scenarios, exportCurrency, lastUpdateLabel]
  );

  const csvPayload = useMemo(
    () => generateCashCsvContent(summarySections),
    [summarySections]
  );

  const handleCsvExport = useCallback(() => {
    const blob = getCsvBlob(csvPayload);
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

      summarySections.forEach((section, index) => {
        if (!section.items.length) {
          return;
        }

        if (y > 250) {
          doc.addPage();
          y = 20;
        }

        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.text(section.title, 14, y);
        y += 8;

        doc.setFont("helvetica", "normal");
        section.items.forEach((item) => {
          const detailsParts = item.details?.split(" · ") ?? [];
          const [primaryDetail, ...narrativeParts] = detailsParts;
          const detailSuffix = primaryDetail ? ` (${primaryDetail})` : item.details && !primaryDetail ? ` (${item.details})` : "";

          doc.text(`• ${item.label} – ${item.value}${detailSuffix}`, 14, y, { maxWidth: 180 });
          y += 6;

          if (narrativeParts.length) {
            const narrative = narrativeParts.join(" · ");
            if (narrative) {
              doc.text(`  ${narrative}`, 14, y, { maxWidth: 180 });
              y += 6;
            }
          }

          if (y > 270) {
            doc.addPage();
            y = 20;
          }
        });

        if (index < summarySections.length - 1) {
          y += 2;
        }
      });

      doc.save("sagora-cockpit-cash.pdf");
    } catch (error) {
      console.error("Erreur lors de l'export PDF", error);
    } finally {
      setIsGeneratingPdf(false);
    }
  }, [summarySections]);

  const isDisabled = isCashExportEmpty(summarySections);

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
