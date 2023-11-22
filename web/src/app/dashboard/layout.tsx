import BackButton from "@/components/backButton";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Início",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header>
        <BackButton url="/"/>
      </header>
      <main>{children}</main>
    </>
  );
}
