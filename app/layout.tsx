import type { Metadata } from "next";
import { Archivo, Hanken_Grotesk, IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/toast/ToastProvider";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { MotionProvider } from "@/components/motion/Motion";
import { getSessionUser } from "@/lib/auth/session";

/* UI/body face — a refined grotesk (the Anthropic-navbar feel), replacing
   Archivo in all chrome. Archivo survives ONLY as the display face for the
   big wordmark moments (--font-display). */
const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-sans",
  display: "swap",
});

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["700", "800", "900"],
  variable: "--font-display",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
  display: "swap",
});

/* The desktop app's UI font — used wherever the site renders the app itself
   (the hero demo), so previews match the real product, not the marketing face. */
const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-app",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Lectern — An engine for your AI",
  description:
    "One cockpit for Claude Code and Antigravity. Lectern plans each task, routes it to the model best at it, and backs every session with a persistent brain of your repo and machine. Local-first, Linux-native.",
  metadataBase: new URL("https://getlectern.vercel.app"),
  openGraph: {
    title: "Lectern — An engine for your AI",
    description:
      "One engine under your coding agents. 're the V8. Multi-model orchestration and a persistent brain for the AI you already pay for — local-first, Linux-native.",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();
  return (
    <html lang="en" data-theme="dark" className={`${hanken.variable} ${archivo.variable} ${plexMono.variable} ${plexSans.variable}`}>
      <body>
        <AuthProvider user={user}>
          <MotionProvider>
            <ToastProvider>{children}</ToastProvider>
          </MotionProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
