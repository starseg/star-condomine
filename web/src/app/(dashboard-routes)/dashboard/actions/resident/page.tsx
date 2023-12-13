import MemberTable from "@/components/member/memberTable";
import Search from "@/components/search";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Moradores",
};

export default async function Member({
  searchParams,
}: {
  searchParams?: {
    lobby?: string;
  };
}) {
  const lobby = searchParams?.lobby || "";

  return (
    <section className="max-w-5xl mx-auto mb-24">
      <h1 className="text-4xl mt-2 mb-4 text-center">Moradores</h1>
      <div className="flex justify-end mb-4">
        <Search placeholder="Buscar..." pagination={false} />
      </div>
      <div className="max-h-[60vh] overflow-x-auto">
        <MemberTable lobby={lobby} />
      </div>
    </section>
  );
}
