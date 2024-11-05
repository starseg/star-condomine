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
import { deleteAction } from "@/lib/delete-action";
import { PencilLine, Trash } from "@phosphor-icons/react/dist/ssr";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { SkeletonTable } from "../_skeletons/skeleton-table";

export default function VehicleTable({
  lobby,
  member,
}: {
  lobby: string;
  member: string;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const { data: session } = useSession();
  const fetchData = async () => {
    if (session)
      try {
        let path = "vehicle/member/" + member;
        const response = await api.get(path);
        setVehicles(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Erro ao obter dados:", error);
      }
  };
  useEffect(() => {
    fetchData();
  }, [session]);

  const deleteVehicle = async (id: number) => {
    deleteAction(session, "veículo", `vehicle/${id}`, fetchData);
  };

  return (
    <>
      {isLoading ? (
        <SkeletonTable />
      ) : (
        <Table className="mt-4 border border-stone-800 rouded-lg">
          <TableHeader className="bg-stone-800 font-semibold">
            <TableRow>
              <TableHead>Tipo</TableHead>
              <TableHead>Placa</TableHead>
              <TableHead>Tag</TableHead>
              <TableHead>Marca</TableHead>
              <TableHead>Modelo</TableHead>
              <TableHead>Cor</TableHead>
              <TableHead>Observação</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vehicles.map((vehicle) => {
              return (
                <TableRow key={vehicle.vehicleId}>
                  <TableCell>{vehicle.vehicleType.description}</TableCell>
                  <TableCell>{vehicle.licensePlate}</TableCell>
                  <TableCell>{vehicle.tag}</TableCell>
                  <TableCell>{vehicle.brand}</TableCell>
                  <TableCell>{vehicle.model}</TableCell>
                  <TableCell>{vehicle.color}</TableCell>
                  <TableCell>
                    {vehicle.comments ? vehicle.comments : "Nenhuma"}
                  </TableCell>
                  <TableCell className="flex gap-4 text-2xl">
                    <Link
                      href={`/dashboard/actions/vehicle/update?id=${vehicle.vehicleId}&lobby=${lobby}`}
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
              <TableCell className="text-right" colSpan={8}>
                Total de registros: {vehicles.length}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      )}
    </>
  );
}
