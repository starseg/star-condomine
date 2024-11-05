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
import { SkeletonTable } from "../_skeletons/skeleton-table";
import { deleteAction } from "@/lib/delete-action";

export default function DeviceTable({ lobby }: { lobby: string }) {
  const [isLoading, setIsLoading] = useState(true);
  const [devices, setDevices] = useState<Device[]>([]);
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());
  const fetchData = async () => {
    if (session)
      try {
        let path;
        if (params.get("query")) {
          if (params.get("status")) {
            path = `/device/filtered/${lobby}?query=${params.get("query")}&status=${params.get("status")}`;
          } else {
            path = `/device/filtered/${lobby}?query=${params.get("query")}`;
          }
        } else if (params.get("status")) {
          path = `/device/filtered/${lobby}?status=${params.get("status")}`;
        } else {
          path = "/device/lobby/" + lobby;
        }
        const response = await api.get(path);
        setDevices(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Erro ao obter dados:", error);
      }
  };
  useEffect(() => {
    fetchData();
  }, [session, searchParams]);

  const deleteDevice = async (id: number) => {
    deleteAction(session, "dispositivo", `device/${id}`, fetchData);
  };

  return (
    <>
      {isLoading ? (
        <SkeletonTable />
      ) : (
        <Table className="border border-stone-800 rouded-lg">
          <TableHeader className="bg-stone-800 font-semibold">
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>IP</TableHead>
              <TableHead>Ramal</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Modelo</TableHead>
              <TableHead>Login</TableHead>
              <TableHead>Senha</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {devices.map((device) => (
              <TableRow key={device.deviceId}>
                <TableCell>{device.name}</TableCell>
                <TableCell>{device.ip}</TableCell>
                <TableCell>{device.ramal}</TableCell>
                <TableCell>{device.description}</TableCell>
                <TableCell>{device.deviceModel.model}</TableCell>
                <TableCell>{device.login}</TableCell>
                <TableCell>{device.password}</TableCell>
                {
                  device.status === "ACTIVE" ? (
                    <TableCell className="text-green-500">Ativo</TableCell>
                  ) : (
                    <TableCell className="text-red-500">Inativo</TableCell>
                  )
                }
                <TableCell className="flex gap-4 text-2xl">
                  <Link
                    href={`device/update?lobby=${device.lobbyId}&id=${device.deviceId}`}
                  >
                    <PencilLine />
                  </Link>
                  <button
                    onClick={() => deleteDevice(device.deviceId)}
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
              <TableCell className="text-right" colSpan={9}>
                Total de registros: {devices.length}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      )}
    </>
  );
}
