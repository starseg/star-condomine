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
        <div className="flex justify-between mb-4">
          <h1 className="text-4xl text-center">
            Credenciais dos proprietários
          </h1>
          <Search placeholder="Buscar..." pagination={false} />
        </div>
        <div>
          <CredentialsFullTable />
        </div>
      </section>
    </>
  );
}
