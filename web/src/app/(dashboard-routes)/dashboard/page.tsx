import List from "@/components/lobby/list";
import Search from "@/components/search";
import {
  DoorOpen,
  Gear,
  Smiley,
  SmileySad,
} from "@phosphor-icons/react/dist/ssr";
import { Menu } from "@/components/menu";
import NewLobbyButton from "@/components/lobby/newLobbyButton";
import FeedbackButton from "@/components/feedback/feedbackButton";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import UserData from "@/components/userData";

export default async function Dashboard() {
  return (
    <>
      <Menu url="bell" />
      <section className="max-w-5xl mx-auto mb-12">
        <UserData />
        <div className="flex items-center justify-between mb-2 flex-wrap flex-col md:flex-row w-[95%] ml-[5%]">
          <h1 className="flex gap-2 items-center text-stone-50 text-4xl">
            <DoorOpen /> Portarias
          </h1>
          <Search placeholder="Buscar..." pagination={false} classname="md:w-1/2 lg:w-4/12 items-center" />
        </div>
        <List />
        <div className="flex items-start justify-between flex-wrap gap-4">
          <NewLobbyButton />
          <div className="bg-stone-900 px-4 py-2 rounded-md flex items-center justify-center gap-4">
            <Smiley weight="fill" size={32} className="text-green-500" />
            <p>Funcionando</p>
            <SmileySad weight="fill" size={32} className="text-red-500" />
            <p>Com problemas</p>
          </div>
        </div>
        <h3 className="text-xl p-4">
          Configurações dos dispositivos de acesso
        </h3>
        <div className="px-4 flex gap-4">
          <Link href="controllers-config">
            <Button
              title="Configurações"
              className="flex gap-2 font-semibold border-primary"
              variant={"outline"}
            >
              <Gear size={24} /> Geral
            </Button>
          </Link>

          <Link href="control-id">
            <Button
              title="Configurações"
              className="flex gap-2 font-semibold border-red-500"
              variant={"outline"}
            >
              <Gear size={24} /> Control iD
            </Button>
          </Link>

          <Link href="intelbras">
            <Button
              title="Configurações"
              className="flex gap-2 font-semibold border-green-500"
              variant={"outline"}
            >
              <Gear size={24} /> Intelbras
            </Button>
          </Link>
        </div>
        <FeedbackButton />
      </section>
    </>
  );
}
