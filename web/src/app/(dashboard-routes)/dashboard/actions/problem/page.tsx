import ProblemTable from "@/components/problem/problemTable";
import { Menu } from "@/components/menu";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Problemas da portaria",
};

export default async function Problems({
  searchParams,
}: {
  searchParams?: {
    lobby?: string;
  };
}) {
  const lobby = searchParams?.lobby || "";
  return (
    <>
      <Menu url={`/dashboard/actions?id=${lobby}`} />
      <section className="max-w-5xl mx-auto mb-24">
        <h1 className="text-4xl mt-2 mb-4 text-center">
          Problemas da portaria
        </h1>
        <ProblemTable lobby={lobby} />
      </section>
    </>
  );
}
