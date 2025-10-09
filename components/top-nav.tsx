"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { ShieldCheck, SignalHigh } from "lucide-react";
import { AuthControls } from "@/components/auth-controls";

export function TopNav() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-gradient-to-r from-primary-600/90 to-primary-700/90 py-3 shadow-xl shadow-primary-900/20 backdrop-blur dark:border-slate-800">
      <div className="relative mx-auto flex w-full max-w-6xl items-center justify-between px-6">
        <Link href="#" className="flex items-center gap-2 text-white">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 shadow-card">
            <SignalHigh className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm uppercase tracking-widest text-white/70">Sagora</p>
            <h1 className="text-xl font-semibold leading-none">Cockpit Financier</h1>
          </div>
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-medium text-white/80 md:flex">
          <a href="#overview" className="transition hover:text-white">
            Synthèse
          </a>
          <a href="#cash" className="transition hover:text-white">
            Cash & Runway
          </a>
          <a href="#bfr" className="transition hover:text-white">
            BFR & Retards
          </a>
          <a href="#actions" className="transition hover:text-white">
            Actions
          </a>
          <a href="#academy" className="transition hover:text-white">
            Academy
          </a>
        </nav>
        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs uppercase tracking-wide text-white/70 md:flex">
            <ShieldCheck className="h-3.5 w-3.5" />
            SSO Entreprise activé
          </div>
          <ThemeToggle />
          <AuthControls />
        </div>
      </div>
    </header>
  );
}
