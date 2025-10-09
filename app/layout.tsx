import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter } from "next/font/google";
import "../styles/globals.css";
import "@uploadthing/react/styles.css";
import { ThemeProvider } from "next-themes";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sagora Cockpit – MVP",
  description: "Cockpit financier pour PME : cash, BFR, alertes et recommandations actionnables.",
  metadataBase: new URL("https://sagoraai.vercel.app"),
  openGraph: {
    title: "Sagora Cockpit – MVP",
    description: "Pilotez votre trésorerie et votre BFR en un coup d’œil.",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Sagora Cockpit – MVP",
    description: "Pilotez votre trésorerie et votre BFR en un coup d’œil."
  }
};

export default function RootLayout({
  children
}: {
  children: ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={cn(inter.className, "min-h-screen bg-transparent antialiased")}> 
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
