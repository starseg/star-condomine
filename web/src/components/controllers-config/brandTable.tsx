"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import api from "@/lib/axios";
import { PencilLine, Trash } from "@phosphor-icons/react/dist/ssr";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { SkeletonTable } from "@/components/_skeletons/skeleton-table";
import { deleteAction } from "@/lib/delete-action";

export default function BrandTable() {
  const [isLoading, setIsLoading] = useState(true);
  const [brands, setBrands] = useState<Brand[]>([]);
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const fetchData = async () => {
    if (session)
      try {
        const response = await api.get("brand", {
          headers: {
            Authorization: `Bearer ${session?.token.user.token}`,
          },
        });
        setBrands(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Erro ao obter dados:", error);
      }
  };
  useEffect(() => {
    fetchData();
  }, [session, searchParams]);

  const deleteBrand = async (id: number) => {
    deleteAction(session, "marca", `brand/${id}`, fetchData);
  };

  return (
    <>
      {isLoading ? (
        <SkeletonTable />
      ) : (
        <Table className="border border-stone-800 rouded-lg">
          <TableHeader className="bg-stone-800 font-semibold">
            <TableRow>
              <TableHead>Logo</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {brands.map((brand) => (
              <TableRow key={brand.controllerBrandId}>
                <TableCell>
                  {brand.iconUrl && (
                    <img src={brand.iconUrl} alt="Logo" className="w-32" />
                  )}
                </TableCell>
                <TableCell>{brand.name}</TableCell>
                <TableCell className="flex gap-4 text-2xl">
                  <Link
                    href={`controllers-config/brand/update?id=${brand.controllerBrandId}`}
                  >
                    <PencilLine />
                  </Link>
                  <button
                    onClick={() => deleteBrand(brand.controllerBrandId)}
                    title="Excluir"
                  >
                    <Trash />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell className="text-right" colSpan={6}>
                Total de registros: {brands.length}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      )}
    </>
  );
}
