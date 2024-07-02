import MemberGroupForm from "@/components/control-id/member-group/memberGroupForm";
import MemberGroupTable from "@/components/control-id/member-group/memberGroupTable";
import { Menu } from "@/components/menu";
import { Button } from "@/components/ui/button";
import { ControliDUpdateProvider } from "@/contexts/control-id-update-context";
import { ArrowsClockwise } from "@phosphor-icons/react/dist/ssr";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Configurações Control iD",
};

export default async function ControliDConfig({
  searchParams,
}: {
  searchParams?: {
    lobby?: string;
  };
}) {
  const lobby = searchParams?.lobby || "";
  return (
    <ControliDUpdateProvider>
      <Menu url={`/dashboard/actions?id=${lobby}`} />
      <section className="max-w-5xl mx-auto mb-24">
        <h1 className="text-4xl text-center mb-2">Configurações Control iD</h1>
        <div className="w-full flex justify-between items-end mt-4 pb-2">
          <h2 className="text-xl">Membros x Grupos</h2>
          <MemberGroupForm />
        </div>
        <MemberGroupTable />
        <div className="mt-4">
          <Button className="flex items-center gap-2">
            <ArrowsClockwise size={22} /> Sincronizar
          </Button>
        </div>
      </section>
    </ControliDUpdateProvider>
  );
}
