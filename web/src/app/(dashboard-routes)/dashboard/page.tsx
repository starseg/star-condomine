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
      <section className="mx-auto mb-12 px-2 max-w-5xl">
        <UserData />
        <div className="flex md:flex-row flex-col flex-wrap justify-between items-center mb-2 md:ml-[5%] md:w-[95%]">
          <h1 className="flex items-center gap-2 mb-2 md:mb-0 text-4xl text-stone-50">
            <DoorOpen /> Portarias
          </h1>
          <Search
            placeholder="Buscar..."
            pagination={false}
            classname="md:w-1/2 lg:w-4/12 items-center"
          />
        </div>
        <List />
        <div className="flex flex-wrap justify-between items-start gap-4">
          <NewLobbyButton />
          <div className="flex justify-center items-center gap-4 bg-stone-900 px-4 py-2 rounded-md">
            <Smiley weight="fill" size={32} className="text-green-500" />
            <p>Funcionando</p>
            <SmileySad weight="fill" size={32} className="text-red-500" />
            <p>Com problemas</p>
          </div>
        </div>
        {/* <h3 className="p-4 text-xl">
          Configurações dos dispositivos de acesso
        </h3> */}
        <div className="flex justify-center md:justify-start gap-4 mt-2 px-4">
          <Link href="controllers-config">
            <Button
              title="Configurações"
              className="flex gap-2 border-primary/80 font-semibold"
              variant={"outline"}
            >
              <Gear size={24} /> Configurações das leitoras
            </Button>
          </Link>

          {/* <Link href="control-id">
            <Button
              title="Configurações"
              className="flex gap-2 border-red-500 font-semibold"
              variant={"outline"}
            >
              <Gear size={24} /> Control iD
            </Button>
          </Link>

          <Link href="intelbras">
            <Button
              title="Configurações"
              className="flex gap-2 border-green-500 font-semibold"
              variant={"outline"}
            >
              <Gear size={24} /> Intelbras
            </Button>
          </Link> */}
        </div>
        <FeedbackButton />
      </section>
    </>
  );
}
