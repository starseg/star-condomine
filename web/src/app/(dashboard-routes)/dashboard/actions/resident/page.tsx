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
  };
}) {
  const lobby = searchParams?.lobby || "";
  const control = searchParams?.c || "";

  const encryptedLobby = encrypt(Number(lobby));

  return (
    <>
      <Menu url={`/dashboard/actions?id=${lobby}`} />
      <section className="max-w-5xl mx-auto mb-24">
        <div className="flex justify-between mb-4">
          <h1 className="text-4xl text-center">Moradores</h1>
          <Search placeholder="Buscar..." pagination={false} />
        </div>
        <MemberTable lobby={lobby} />
        <div className="mt-6 flex gap-4 items-center">
          <Link
            href={`resident/new?lobby=${lobby}`}
            className={buttonVariants({ variant: "default" })}
          >
            <p className="flex gap-2 text-xl items-center">
              <FilePlus size={24} /> Registrar morador
            </p>
          </Link>
          <Link
            href={`resident/list?lobby=${lobby}`}
            className={buttonVariants({ variant: "default" })}
          >
            <p className="flex gap-2 text-xl items-center">
              <FileSearch size={24} /> Lista detalhada
            </p>
          </Link>
          <Link
            href={`access?lobby=${lobby}&c=${control}`}
            className={buttonVariants({ variant: "default" })}
          >
            <p className="flex gap-2 text-xl items-center">
              <FileSearch size={24} /> Acessos
            </p>
          </Link>
          <Link
            href={`resident/credentials/report?lobby=${lobby}`}
            className={buttonVariants({ variant: "default" })}
          >
            <p className="flex gap-2 text-xl items-center">
              <LockKey size={24} /> Credenciais
            </p>
          </Link>
          <CopyButton
            text={`https://starcondomine.starseg.com/guest/resident?lobby=${encryptedLobby}`}
          />
        </div>
      </section>
    </>
  );
}
