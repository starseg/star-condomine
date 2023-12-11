import List from "@/components/lobby/list";
import Search from "@/components/search";
import {
  DoorOpen,
  FilePlus,
  Smiley,
  SmileySad,
} from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

export default async function Dashboard() {
  return (
    <section className="max-w-5xl mx-auto mb-12">
      <div className="flex items-center justify-between mb-2 flex-wrap flex-col md:flex-row w-[90%] ml-[5%]">
        <h1 className="flex gap-2 items-center text-stone-50 text-4xl pb-4">
          <DoorOpen /> Portarias
        </h1>
        <Search placeholder="Buscar..." pagination={false} />
      </div>
      <List />
      <div className="flex items-start justify-between flex-wrap gap-4">
        <Link
          href={"dashboard/new"}
          className="flex items-center justify-center gap-2 rounded-md text-xl py-4 px-4 bg-stone-900 hover:bg-stone-800 transition-colors"
        >
          <FilePlus size={32} /> <p>Registrar nova</p>
        </Link>
        <div className="bg-stone-900 px-4 py-2 rounded-md flex items-center justify-center gap-4">
          <Smiley weight="fill" size={32} className="text-green-500" />
          <p>Funcionando</p>
          <SmileySad weight="fill" size={32} className="text-red-500" />
          <p>Com problemas</p>
        </div>
      </div>
    </section>
  );
}
