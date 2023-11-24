import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import NextAuthSessionProvider from "@/providers/sessionProvider";
import { Nunito } from "next/font/google";

const nunito = Nunito({
  weight: '400',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Star Condomine",
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
      </head>
      <body className={cn(nunito.className, "dark")}>
        <NextAuthSessionProvider>{children}</NextAuthSessionProvider>
      </body>
    </html>
  );
}
