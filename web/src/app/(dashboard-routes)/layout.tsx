import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { nextAuthOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Painel",
};

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(nextAuthOptions);
  // como usar dados da session: {session?.user?.name}
  if (!session) {
    redirect("/");
  }
  return (
    <>
      <main>{children}</main>
    </>
  );
}
