import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://saulo.dev"),
  title: "Saulo Duarte — Software Engineer",
  description: "Software Engineer focado em Golang, AWS e sistemas distribuídos.",
  keywords: ["Software Engineer", "Golang", "AWS", "Microservices", "Saulo Duarte"],
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  openGraph: { title: "Saulo Duarte — Software Engineer", description: "Sistemas distribuídos, construídos para operar.", url: "/pt", siteName: "saulo.dev", images: [{ url: "/og.png", width: 1200, height: 630, alt: "Saulo.dev — Goledge" }] },
  twitter: { card: "summary_large_image", title: "Saulo Duarte — Software Engineer", description: "Sistemas distribuídos, construídos para operar.", images: ["/og.png"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body className={`${geistSans.variable} ${geistMono.variable}`}>{children}</body></html>;
}
