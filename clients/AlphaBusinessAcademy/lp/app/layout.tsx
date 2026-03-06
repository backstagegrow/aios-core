import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";


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

import { PopupProvider } from "./context/PopupContext";
import ApplicationModal from "./components/ui/ApplicationModal";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body className={inter.className}>
        <PopupProvider>
          {children}
          <ApplicationModal />
        </PopupProvider>
      </body>
    </html>
  );
}
