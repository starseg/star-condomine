import { AccessForm } from "@/components/access/accessForm";
import { Menu } from "@/components/menu";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Registrar Acesso",
};
export default function AddAccess({
  searchParams,
}: {
  searchParams?: { lobby: string };
}) {
  return (
    <>
      <Menu url={`/dashboard/actions?id=${searchParams?.lobby}`} />
      <section className="flex flex-col justify-center items-center mb-12">
        <h1 className="text-4xl mt-2 mb-4">Registrar Acesso</h1>
        <AccessForm />
      </section>
    </>
  );
}
