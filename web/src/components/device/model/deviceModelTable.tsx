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
import {
  Check,
  Checks,
  PencilLine,
  Trash,
  X,
} from "@phosphor-icons/react/dist/ssr";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { SkeletonTable } from "@/components/_skeletons/skeleton-table";
import { deleteAction } from "@/lib/delete-action";

export default function DeviceModelTable() {
  const [isLoading, setIsLoading] = useState(true);
  const [deviceModels, setDeviceModels] = useState<DeviceModel[]>([]);
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const fetchData = async () => {
    if (session)
      try {
        const response = await api.get("deviceModel", {
          headers: {
            Authorization: `Bearer ${session?.token.user.token}`,
          },
        });
        setDeviceModels(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Erro ao obter dados:", error);
      }
  };
  useEffect(() => {
    fetchData();
  }, [session, searchParams]);

  const deleteDeviceModel = async (id: number) => {
    deleteAction(session, "modelo", `deviceModel/${id}`, fetchData);
  };

  return (
    <>
      {isLoading ? (
        <SkeletonTable />
      ) : (
        <Table className="border border-stone-800 rouded-lg">
          <TableHeader className="bg-stone-800 font-semibold">
            <TableRow>
              <TableHead>Modelo</TableHead>
              <TableHead>Marca</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Facial</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="uppercase">
            {deviceModels.map((model) => (
              <TableRow key={model.deviceModelId}>
                <TableCell>{model.model}</TableCell>
                <TableCell>{model.brand}</TableCell>
                <TableCell>{model.description}</TableCell>
                <TableCell className="text-xl">
                  {model.isFacial === "true" ? (
                    <Check className="text-green-500" />
                  ) : (
                    <X className="text-red-400" />
                  )}
                </TableCell>
                <TableCell className="flex gap-4 text-2xl">
                  <Link href={`deviceModel/update?id=${model.deviceModelId}`}>
                    <PencilLine />
                  </Link>
                  <button
                    onClick={() => deleteDeviceModel(model.deviceModelId)}
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
                Total de registros: {deviceModels.length}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      )}
    </>
  );
}
