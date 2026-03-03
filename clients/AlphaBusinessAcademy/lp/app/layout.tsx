import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "O Caminho do Dono — Imersão Presencial | Alpha Business Academy",
  description:
    "Imersão presencial de 2 dias para empresários que querem sair do operacional e escalar com lucro. São Paulo, 21-22 de Março de 2026.",
  openGraph: {
    title: "O Caminho do Dono — Imersão Presencial",
    description:
      "2 dias para empresários que querem sair do operacional, montar um time que funciona e escalar com lucro de verdade.",
    type: "website",
    locale: "pt_BR",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
