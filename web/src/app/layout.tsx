import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import NextAuthSessionProvider from "@/providers/sessionProvider";
import { Nunito } from "next/font/google";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const nunito = Nunito({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s ⭐",
    default: "Star Condomine",
  },
  description: "Plataforma de controle de portarias online da Starseg",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="icon" href="favicon.ico" sizes="any" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#eab308" />
      </head>
      <body className={cn(nunito.className, "dark")}>
        <NextAuthSessionProvider>
          {children}
          <ToastContainer
            position="bottom-right"
            autoClose={2500}
            theme="colored"
          />
        </NextAuthSessionProvider>
      </body>
    </html>
  );
}
