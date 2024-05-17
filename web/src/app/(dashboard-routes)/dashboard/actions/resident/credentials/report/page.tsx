import CredentialsFullTable from "@/components/member/credentialsFullTable";
import { Menu } from "@/components/menu";
import Search from "@/components/search";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Credenciais dos moradores",
};

export default async function CredentialsReport() {
  return (
    <>
      <Menu />
      <section className="max-w-5xl mx-auto mb-24">
        <h1 className="text-4xl text-center mb-2">
          Credenciais dos proprietários
        </h1>
        <div className="flex justify-end mb-4">
          {/* <Search placeholder="Buscar..." pagination={false} /> */}
        </div>
        <div className="max-h-[60vh] overflow-x-auto">
          <CredentialsFullTable />
        </div>
      </section>
    </>
  );
}
