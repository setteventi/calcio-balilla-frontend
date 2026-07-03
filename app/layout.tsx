import type { Metadata, Viewport } from "next";
import { Bebas_Neue, Space_Mono } from "next/font/google";
import "./globals.css";

const bebas = Bebas_Neue({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
});

const spaceMono = Space_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Calcio Balilla Tracker",
  description: "Risultati, classifiche e statistiche del gruppo",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Balilla",
  },
  // App privata per un gruppo chiuso di amici: nessuna indicizzazione pubblica.
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#0b0f0d",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" className={`${bebas.variable} ${spaceMono.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-felt text-bone antialiased">
        {children}
      </body>
    </html>
  );
}
