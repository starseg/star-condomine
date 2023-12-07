import { LobbyUpdateForm } from "@/components/lobby/lobbyUpdateForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Atualizar portaria",
};
export default function UpdateDevice() {
  return (
    <section className="flex flex-col justify-center items-center mb-12">
      <h1 className="text-4xl mt-2 mb-4">Atualizar portaria</h1>
      <LobbyUpdateForm/>
    </section>
  );
}
