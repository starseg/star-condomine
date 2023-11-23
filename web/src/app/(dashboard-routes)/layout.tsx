import BackButton from "@/components/backButton";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { nextAuthOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Início",
};

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(nextAuthOptions);
  if (!session) {
    redirect("/");
  }
  return (
    <>
      <header>
        <BackButton url="/" />
      </header>
      <main>{children}</main>
    </>
  );
}
