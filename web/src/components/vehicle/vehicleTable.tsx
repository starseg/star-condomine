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
import Swal from "sweetalert2";
import { SkeletonTable } from "../_skeletons/skeleton-table";
import { deleteAction } from "@/lib/delete-action";

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
  const [isLoading, setIsLoading] = useState(true);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const fetchData = async () => {
    try {
      let path;
      if (!params.get("query")) {
        path = "vehicle/lobby/" + lobby;
        // console.log(path);
      } else {
        path = `vehicle/filtered/${lobby}?query=${params.get("query")}`;
      }
      const response = await api.get(path, {
        headers: {
          Authorization: `Bearer ${session?.token.user.token}`,
        },
      });
      setVehicles(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Erro ao obter dados:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, [session, searchParams]);

  const deleteVehicle = async (id: number) => {
    deleteAction(session, "veículo", `vehicle/${id}`, fetchData);
  };

  return (
    <>
      {isLoading ? (
        <SkeletonTable />
      ) : (
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
                  <TableCell>{vehicle.member.name}</TableCell>
                  <TableCell>
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
      )}
    </>
  );
}
