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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

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
        <Table className="max-h-[60vh] overflow-y-auto overflow-x-hidden">
          <TableHeader className="bg-stone-800 font-semibold">
            <TableRow>
              <TableHead>Tipo</TableHead>
              <TableHead>Placa</TableHead>
              <TableHead>Tag</TableHead>
              <TableHead>Marca - Modelo - Cor</TableHead>
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
                  <TableCell>
                    {vehicle.brand} {vehicle.model} {vehicle.color}
                  </TableCell>
                  <TableCell>{vehicle.member.name}</TableCell>
                  <TableCell>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button className="max-w-[15ch] text-ellipsis overflow-hidden whitespace-nowrap">
                            {vehicle.comments ? vehicle.comments : "Nenhuma"}
                          </button>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-[300px] border-primary bg-stone-800 p-4 break-words">
                          <p>
                            {vehicle.comments ? vehicle.comments : "Nenhuma"}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
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
