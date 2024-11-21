import VisitorTable from "@/components/visitor/visitorTable";
import { Menu } from "@/components/menu";
import Search from "@/components/search";
import { Metadata } from "next";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { FilePlus, FileSearch } from "@phosphor-icons/react/dist/ssr";
import CopyButton from "@/components/copyButton";
import { encrypt } from "@/lib/crypto";
import { Monitor } from "@/components/control-id/device/monitor";

export const metadata: Metadata = {
  title: "Visitantes",
};

export default async function Visitor({
  searchParams,
}: {
  searchParams?: {
    lobby?: string;
    c?: string;
    brand?: string;
  };
}) {
  const lobby = searchParams?.lobby || "";
  const control = searchParams?.c || "";
  const brand = searchParams?.brand || "";

  const encryptedLobby = encrypt(Number(lobby));

  return (
    <>
      <Menu url={`/dashboard/actions?lobby=${lobby}`} />
      <section className="mx-auto mb-24 px-2 max-w-5xl">
        <div className="flex md:flex-row flex-col justify-between mb-4">
          <h1 className="text-4xl text-center">Visitantes</h1>
          <Search
            placeholder="Buscar..."
            pagination={false}
            classname="md:w-1/2 lg:w-4/12 items-center"
          />
        </div>
        <VisitorTable lobby={lobby} />

        <div className="flex flex-wrap items-center gap-4 mt-4">
          <Link
            href={`visitor/new?lobby=${lobby}`}
            className={buttonVariants({ variant: "default" })}
          >
            <p className="flex items-center gap-2 text-xl">
              <FilePlus size={24} /> Registrar Visitante
            </p>
          </Link>
          <Link
            href={`scheduling?lobby=${lobby}&c=${control}`}
            className={buttonVariants({ variant: "default" })}
          >
            <p className="flex items-center gap-2 text-xl">
              <FileSearch size={24} /> Agendamentos
            </p>
          </Link>
          <Link
            href={`access?lobby=${lobby}&c=${control}`}
            className={buttonVariants({ variant: "default" })}
          >
            <p className="flex items-center gap-2 text-xl">
              <FileSearch size={24} /> Acessos
            </p>
          </Link>
          <Link
            href={`visitor/list?lobby=${lobby}`}
            className={buttonVariants({ variant: "default" })}
          >
            <p className="flex items-center gap-2 text-xl">
              <FileSearch size={24} /> Lista detalhada
            </p>
          </Link>
          <CopyButton
            text={`https://starcondomine.starseg.com/guest/visitor?lobby=${encryptedLobby}`}
          />
        </div>
        {brand === "Control-iD" && <Monitor />}
      </section>
    </>
  );
}
