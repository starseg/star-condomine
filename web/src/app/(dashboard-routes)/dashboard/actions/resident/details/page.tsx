import MemberDetails from "@/components/member/memberDetails";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Detalhes do morador",
};

export default async function Member({
  searchParams,
}: {
  searchParams?: {
    id?: string;
  };
}) {
  const id = searchParams?.id || "";
  return (
    <section className="max-w-5xl mx-auto mb-24">
      <h1 className="text-4xl mt-2 mb-4 text-center">Detalhes do morador</h1>
      <MemberDetails id={Number(id)} />
    </section>
  );
}
