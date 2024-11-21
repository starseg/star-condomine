import { Monitor } from "@/components/control-id/device/monitor";
import CopyButton from "@/components/copyButton";
import MemberTable from "@/components/member/memberTable";
import { Menu } from "@/components/menu";
import Search from "@/components/search";
import { buttonVariants } from "@/components/ui/button";
import { encrypt } from "@/lib/crypto";
import { FilePlus, FileSearch, LockKey } from "@phosphor-icons/react/dist/ssr";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Moradores",
};

export default async function Member({
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
          <h1 className="text-4xl text-center">Moradores</h1>
          <Search
            placeholder="Buscar..."
            pagination={false}
            classname="md:w-1/2 lg:w-4/12 items-center"
          />
        </div>
        <MemberTable lobby={lobby} />
        <div className="flex flex-wrap items-center gap-4 mt-6">
          <Link
            href={`resident/new?lobby=${lobby}`}
            className={buttonVariants({ variant: "default" })}
          >
            <p className="flex items-center gap-2 text-xl">
              <FilePlus size={24} /> Registrar morador
            </p>
          </Link>
          <Link
            href={`resident/list?lobby=${lobby}`}
            className={buttonVariants({ variant: "default" })}
          >
            <p className="flex items-center gap-2 text-xl">
              <FileSearch size={24} /> Lista detalhada
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
            href={`resident/credentials/report?lobby=${lobby}`}
            className={buttonVariants({ variant: "default" })}
          >
            <p className="flex items-center gap-2 text-xl">
              <LockKey size={24} /> Credenciais
            </p>
          </Link>
          <CopyButton
            text={`https://starcondomine.starseg.com/guest/resident?lobby=${encryptedLobby}`}
          />
          {brand === "Control-iD" && <Monitor />}
        </div>
      </section>
    </>
  );
}
