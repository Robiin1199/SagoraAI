"use client";

import { useState } from "react";
import type { AppFileRouter } from "@/app/api/uploadthing/core";
import { UploadButton } from "@uploadthing/react";

export function InvoiceUpload() {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="rounded-3xl border border-dashed border-primary-500/40 bg-white/70 p-6 shadow-inner dark:border-primary-500/20 dark:bg-slate-900/70">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Importer vos factures</h3>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">
        Déposez un fichier CSV exporté de votre outil de facturation. Nous normalisons automatiquement les colonnes.
      </p>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <UploadButton<AppFileRouter, "invoices">
          endpoint="invoices"
          className="ut-button:bg-primary-600 ut-button:text-white ut-button:rounded-full ut-button:px-4 ut-button:py-2 ut-button:font-semibold"
          onClientUploadComplete={(res) => {
            setError(null);
            const imported = res?.[0]?.serverData?.imported ?? 0;
            setMessage(`Import terminé : ${imported} facture${imported > 1 ? "s" : ""}. Les KPIs vont se rafraîchir.`);
            setTimeout(() => window.location.reload(), 2000);
          }}
          onUploadError={(err) => {
            setMessage(null);
            setError(err.message ?? "Une erreur est survenue pendant l'upload.");
          }}
        />
        <span className="text-xs text-slate-400">Format attendu : UTF-8, séparateur virgule ou point-virgule.</span>
      </div>
      {message && <p className="mt-3 text-sm text-emerald-600 dark:text-emerald-400">{message}</p>}
      {error && <p className="mt-3 text-sm text-danger">{error}</p>}
    </div>
  );
}
