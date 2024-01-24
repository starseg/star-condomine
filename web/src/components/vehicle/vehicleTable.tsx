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

interface Vehicle {
  vehicleId: number;
  licensePlate: string;
  brand: string;
  model: string;
  color: string;
  tag: string;
  comments: string;
  vehicleType: {
    vehicleTypeId: number;
    description: string;
  };
  member: {
    memberId: number;
    name: string;
  };
}

export default function VehicleTable({ lobby }: { lobby: string }) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const { data: session } = useSession();
  const fetchData = async () => {
    try {
      let path = "vehicle";
      const response = await api.get(path, {
        headers: {
          Authorization: `Bearer ${session?.token.user.token}`,
        },
      });
      setVehicles(response.data);
    } catch (error) {
      console.error("Erro ao obter dados:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, [session]);

  const deleteAction = async (id: number) => {
    try {
      await api.delete("vehicle/" + id, {
        headers: {
          Authorization: `Bearer ${session?.token.user.token}`,
        },
      });
      fetchData();
      Swal.fire({
        title: "Excluído!",
        text: "Esse veículo acabou de ser apagado.",
        icon: "success",
      });
    } catch (error) {
      console.error("Erro excluir dado:", error);
    }
  };

  const deleteVehicle = async (id: number) => {
    if (session?.payload.user.type === "USER") {
      Swal.fire({
        title: "Operação não permitida",
        text: "Sua permissão de usuário não permite exclusões",
        icon: "warning",
      });
    } else {
      Swal.fire({
        title: "Excluir veículo?",
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
          <TableHead>Tipo</TableHead>
          <TableHead>Placa</TableHead>
          <TableHead>Tag</TableHead>
          <TableHead>Marca</TableHead>
          <TableHead>Modelo</TableHead>
          <TableHead>Cor</TableHead>
          <TableHead>Proprietário</TableHead>
          <TableHead>Observação</TableHead>
          <TableHead>Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="uppercase">
        {vehicles.map((vehicle) => {
          return (
            <TableRow key={vehicle.vehicleId}>
              <TableCell>{vehicle.vehicleType.description}</TableCell>
              <TableCell>{vehicle.licensePlate}</TableCell>
              <TableCell>{vehicle.tag}</TableCell>
              <TableCell>{vehicle.brand}</TableCell>
              <TableCell>{vehicle.model}</TableCell>
              <TableCell>{vehicle.color}</TableCell>
              <TableCell className="max-w-[20ch] overflow-hidden text-ellipsis whitespace-nowrap hover:overflow-auto hover:max-w-full">
                {vehicle.member.name}
              </TableCell>
              <TableCell className="max-w-[20ch] overflow-hidden text-ellipsis whitespace-nowrap hover:overflow-auto hover:max-w-full">
                {vehicle.comments ? vehicle.comments : "Nenhuma"}
              </TableCell>
              <TableCell className="flex gap-4 text-2xl">
                <Link
                  href={`vehicle/update?id=${vehicle.vehicleId}&lobby=${lobby}`}
                >
                  <PencilLine />
                </Link>
                <button
                  onClick={() => deleteVehicle(vehicle.vehicleId)}
                  title="Excluir"
                >
                  <Trash />
                </button>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell className="text-right" colSpan={9}>
            Total de registros: {vehicles.length}
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
