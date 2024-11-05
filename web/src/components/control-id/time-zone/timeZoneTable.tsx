"use client";
import { SkeletonTable } from "@/components/_skeletons/skeleton-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useControliDUpdate } from "@/contexts/control-id-update-context";
import api from "@/lib/axios";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  createTimeZoneCommand,
  destroyObjectCommand,
} from "../device/commands";
import { SyncItem } from "../device/syncItem";
import TimeZoneUpdateForm from "./timeZoneUpdateForm";
import { DeleteDialog } from "@/components/deleteDialog";
import { toast } from "react-toastify";

export default function TimeZoneTable() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());
  const lobbyParam = params.get("lobby");
  const lobby = lobbyParam ? parseInt(lobbyParam, 10) : null;
  const { update } = useControliDUpdate();

  const [timeZones, setTimeZones] = useState<TimeZone[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const fetchData = async () => {
    if (session) {
      try {
        const response = await api.get(`timeZone/lobby/${lobby}`, {
          headers: {
            Authorization: `Bearer ${session.token.user.token}`,
          },
        });
        setTimeZones(response.data);

        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [session, update]);

  const [devices, setDevices] = useState<Device[]>([]);
  const fetchDevices = async () => {
    if (session)
      try {
        const response = await api.get(`device/lobby/${lobby}`, {
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
    fetchDevices();
  }, [session]);

  const deleteItem = async (id: number) => {
    // deleteAction(session, "horário", `timeZone/${id}`, fetchData);
    try {
      await api.delete(`timeZone/${id}`, {
        headers: {
          Authorization: `Bearer ${session?.token.user.token}`,
        },
      });
      fetchData();
      devices.map(async (device) => {
        await api.post(
          `/control-id/add-command?id=${device.name}`,
          destroyObjectCommand("time_zones", { time_zones: { id: id } })
        );
      });
      toast.success("Dado excluído com sucesso!", {
        theme: "colored",
      });
    } catch (error) {
      console.error("Erro excluir dado:", error);
    }
  };

  return (
    <>
      {isLoading ? (
        <SkeletonTable />
      ) : (
        <div className="w-full max-h-[60vh] overflow-auto">
          <Table className="border w-full">
            <TableHeader>
              <TableRow className="bg-secondary hover:bg-secondary">
                <TableHead>ID</TableHead>
                <TableHead>Horário</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {timeZones && timeZones.length > 0 ? (
                timeZones.map((timeZone) => (
                  <TableRow key={timeZone.timeZoneId}>
                    <TableCell>{timeZone.timeZoneId}</TableCell>
                    <TableCell>{timeZone.name}</TableCell>
                    <TableCell>
                      <DeleteDialog
                        module="horário"
                        confirmFunction={() => deleteItem(timeZone.timeZoneId)}
                      />
                      <TimeZoneUpdateForm
                        id={timeZone.timeZoneId}
                        name={timeZone.name}
                        lobby={lobby}
                      />
                      <SyncItem
                        lobby={lobby}
                        sendCommand={() =>
                          createTimeZoneCommand(
                            timeZone.timeZoneId,
                            timeZone.name
                          )
                        }
                      />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    rowSpan={2}
                    colSpan={10}
                    className="w-full text-center"
                  >
                    Nenhum dado encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </>
  );
}
