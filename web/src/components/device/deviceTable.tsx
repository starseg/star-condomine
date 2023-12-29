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
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

interface Device {
  deviceId: number;
  name: string;
  ip: string;
  ramal: number;
  description: string;
  deviceModelId: number;
  lobbyId: number;
  deviceModel: {
    model: string;
  };
}

export default function DeviceTable({ lobby }: { lobby: string }) {
  const [devices, setDevices] = useState<Device[]>([]);
  const { data: session } = useSession();
  const fetchData = async () => {
    try {
      const response = await api.get("device/lobby/" + lobby, {
        headers: {
          Authorization: `Bearer ${session?.token.user.token}`,
        },
      });
      setDevices(response.data);
    } catch (error) {
      console.error("Erro ao obter dados:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, [session]);

  // console.log(devices);

  const deleteAction = async (id: number) => {
    console.log("device/" + id);
    try {
      await api.delete("device/" + id, {
        headers: {
          Authorization: `Bearer ${session?.token.user.token}`,
        },
      });
      fetchData();
      Swal.fire({
        title: "Excluído!",
        text: "Esse dispositivo acabou de ser apagado.",
        icon: "success",
      });
    } catch (error) {
      console.error("Erro excluir dado:", error);
    }
  };

  const deleteDevice = async (id: number) => {
    if (session?.payload.user.type === "USER") {
      Swal.fire({
        title: "Operação não permitida",
        text: "Sua permissão de usuário não permite exclusões",
        icon: "warning",
      });
    } else {
      Swal.fire({
        title: "Excluir dispositivo?",
        text: "Essa ação não poderá ser revertida!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#43C04F",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sim, excluir!",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          deleteAction(id);
        }
      });
    }
  };

  return (
    <Table className="border border-stone-800 rouded-lg">
      <TableHeader className="bg-stone-800 font-semibold">
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>IP</TableHead>
          <TableHead>Ramal</TableHead>
          <TableHead>Descrição</TableHead>
          <TableHead>Modelo</TableHead>
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
          <TableCell className="text-right" colSpan={6}>
            Total de registros: {devices.length}
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
