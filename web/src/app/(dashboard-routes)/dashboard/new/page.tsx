import { LobbyForm } from "@/components/lobby/lobbyForm";


export default function NewLobby() {
  return (
    <section className="flex flex-col justify-center items-center mb-12">
      <h1 className="text-4xl mt-2 mb-4">Registrar Portaria</h1>
      <LobbyForm/>
    </section>
  )
}