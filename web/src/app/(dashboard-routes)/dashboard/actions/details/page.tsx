import LobbyDetails from "@/components/lobby/lobbyDetails";
import { Menu } from "@/components/menu";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Detalhes da portaria",
};

export default async function Device({
  searchParams,
}: {
  searchParams?: {
    lobby?: string;
  };
}) {
  const lobby = searchParams?.lobby || "";
  return (
    <>
      <Menu url={`/dashboard/actions?lobby=${lobby}`} />
      <section className="max-w-5xl mx-auto mb-24">
        <h1 className="text-4xl text-center">Detalhes da portaria</h1>
        <LobbyDetails lobby={lobby} />
      </section>
    </>
  );
}
