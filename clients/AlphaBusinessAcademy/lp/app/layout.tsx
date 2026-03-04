import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

export const runtime = 'edge';

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Alpha Business Academy — O Caminho do Dono | Imersão Presencial",
  description:
    "2 dias intensivos para donos de restaurantes, cafeterias e franquias que querem sair do operacional, montar um time que funciona sem eles e escalar com lucro de verdade.",
  keywords: [
    "alpha business academy",
    "imersão empresarial",
    "food service",
    "gestão de restaurantes",
    "escalar negócio",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
