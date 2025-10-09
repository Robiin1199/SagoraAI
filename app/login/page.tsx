import Link from "next/link";
import { redirect } from "next/navigation";
import { SignInButton } from "@/components/sign-in-button";
import { auth } from "@/lib/auth";

export default async function LoginPage() {
  const session = await auth();
  if (session?.user?.organizationId) {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-primary-900 to-slate-900 px-4 py-16 text-center text-white">
      <div className="w-full max-w-md space-y-6">
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-[0.35em] text-white/60">Sagora</p>
          <h1 className="text-3xl font-semibold">Connectez-vous à votre cockpit financier</h1>
          <p className="text-sm text-white/70">
            Centralisez votre trésorerie, vos factures et vos KPIs clés pour piloter votre organisation.
          </p>
        </div>
        <SignInButton />
        <p className="text-xs text-white/50">
          En vous connectant vous acceptez nos <Link href="#" className="underline">CGU</Link>.
        </p>
      </div>
    </div>
  );
}
