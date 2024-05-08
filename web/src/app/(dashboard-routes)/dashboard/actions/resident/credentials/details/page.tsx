import CredentialsTable from "@/components/member/credentialsTable";
import { Menu } from "@/components/menu";
import { buttonVariants } from "@/components/ui/button";
import { FilePlus } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

export default async function CredentialDetails({
  searchParams,
}: {
  searchParams?: {
    id?: string;
  };
}) {
  const id = searchParams?.id || "";
  return (
    <>
      <Menu />
      <section className="max-w-5xl mx-auto mb-24">
        <h1 className="text-4xl text-center mb-4">Tags e cartões</h1>
        <div className="max-h-[60vh] overflow-x-auto">
          <CredentialsTable />
        </div>
        <div className="mt-6 flex gap-4 items-center">
          <Link
            href={`new?id=${id}`}
            className={buttonVariants({ variant: "default" })}
          >
            <p className="flex gap-2 text-xl items-center">
              <FilePlus size={24} /> Registrar nova credencial
            </p>
          </Link>
        </div>
      </section>
    </>
  );
}
