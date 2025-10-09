"use client";

import { useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { LogIn, LogOut, Loader2, UserCircle2, UserPlus } from "lucide-react";
import { useAuth } from "@/components/auth-provider";

type AuthMode = "login" | "signup";

type FormState = {
  email: string;
  password: string;
  accountName: string;
};

const INITIAL_FORM_STATE: FormState = {
  email: "",
  password: "",
  accountName: ""
};

export function AuthControls() {
  const { user, loading, login, signUp, logout } = useAuth();
  const [mode, setMode] = useState<AuthMode | null>(null);
  const [formState, setFormState] = useState<FormState>(INITIAL_FORM_STATE);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const title = useMemo(() => {
    if (mode === "signup") {
      return "Créer un compte";
    }

    if (mode === "login") {
      return "Se connecter";
    }

    return "";
  }, [mode]);

  const submitLabel = useMemo(() => {
    if (mode === "signup") {
      return "Créer mon compte";
    }

    if (mode === "login") {
      return "Connexion";
    }

    return "";
  }, [mode]);

  const toggleMode = (nextMode: AuthMode) => {
    setError(null);
    setFormState(INITIAL_FORM_STATE);
    setMode((current) => (current === nextMode ? null : nextMode));
  };

  const handleChange = (field: keyof FormState) => (event: ChangeEvent<HTMLInputElement>) => {
    setFormState((prev) => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!mode) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      if (mode === "signup") {
        await signUp(formState);
      } else {
        await login({ email: formState.email, password: formState.password });
      }

      setFormState(INITIAL_FORM_STATE);
      setMode(null);
    } catch (submissionError) {
      if (submissionError instanceof Error) {
        setError(submissionError.message);
      } else {
        setError("Une erreur inattendue est survenue.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return null;
  }

  if (user) {
    return (
      <div className="flex items-center gap-3 text-xs font-medium text-white/80">
        <div className="hidden items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 md:flex">
          <UserCircle2 className="h-4 w-4" />
          <span className="truncate max-w-[120px]">{user.accountName}</span>
        </div>
        <button
          type="button"
          onClick={logout}
          className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-white/20"
        >
          <LogOut className="h-3.5 w-3.5" />
          Déconnexion
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-white">
        <button
          type="button"
          onClick={() => toggleMode("login")}
          className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-1 transition hover:bg-white/20"
        >
          <LogIn className="h-3.5 w-3.5" />
          Connexion
        </button>
        <button
          type="button"
          onClick={() => toggleMode("signup")}
          className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-primary-500/20 px-3 py-1 transition hover:bg-primary-500/40"
        >
          <UserPlus className="h-3.5 w-3.5" />
          Créer un compte
        </button>
      </div>

      {mode && (
        <div className="absolute right-0 top-12 z-50 w-80 rounded-3xl border border-white/30 bg-white/95 p-5 text-slate-700 shadow-2xl backdrop-blur dark:border-slate-700 dark:bg-slate-900/95 dark:text-slate-200">
          <div className="flex items-center gap-2 text-sm font-semibold text-primary-600 dark:text-primary-300">
            {mode === "signup" ? <UserPlus className="h-4 w-4" /> : <LogIn className="h-4 w-4" />}
            {title}
          </div>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            {mode === "signup"
              ? "Créez un accès démo (données stockées localement sur cet appareil)."
              : "Reconnectez-vous sur cet appareil : aucune donnée n'est envoyée côté serveur."}
          </p>

          <form onSubmit={handleSubmit} className="mt-4 grid gap-3">
            <label className="grid gap-1 text-xs font-medium">
              <span>Email</span>
              <input
                type="email"
                required
                value={formState.email}
                onChange={handleChange("email")}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-primary-400"
              />
            </label>
            {mode === "signup" && (
              <label className="grid gap-1 text-xs font-medium">
                <span>Nom du compte</span>
                <input
                  type="text"
                  required
                  value={formState.accountName}
                  onChange={handleChange("accountName")}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-primary-400"
                />
              </label>
            )}
            <label className="grid gap-1 text-xs font-medium">
              <span>Mot de passe</span>
              <input
                type="password"
                required
                value={formState.password}
                onChange={handleChange("password")}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-primary-400"
              />
            </label>

            {error && (
              <div className="rounded-xl border border-danger/20 bg-danger/10 px-3 py-2 text-xs text-danger">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {submitLabel}
            </button>
          </form>

          <button
            type="button"
            onClick={() => toggleMode(mode === "signup" ? "login" : "signup")}
            className="mt-3 text-xs font-medium text-primary-600 transition hover:text-primary-700 dark:text-primary-300 dark:hover:text-primary-200"
          >
            {mode === "signup" ? "Vous avez déjà un compte ?" : "Besoin de créer un compte ?"}
          </button>
        </div>
      )}
    </div>
  );
}
