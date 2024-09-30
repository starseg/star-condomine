import { SkeletonTable } from "@/components/_skeletons/skeleton-table";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TableHeader, TableRow, TableHead, TableBody, TableCell, Table } from "@/components/ui/table";
import { useControliDUpdate } from "@/contexts/control-id-update-context";
import api from "@/lib/axios";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { listAccessRulesCommand, listLogsCommand } from "../device/commands";

export function AccessLogs() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const lobbyParam = params.get("lobby");
  const lobby = lobbyParam ? parseInt(lobbyParam, 10) : null;

  const [serialId, setSerialId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function searchAccessLogs() {
    setIsLoading(true);
    await api.post(`/control-id/add-command?id=${serialId}`, listLogsCommand);
    await new Promise((resolve) => {
      setTimeout(async () => {
        fetchResults()
        resolve(true);
      }, 5000);
    });
    setIsLoading(false);
  }


  async function fetchResults() {
    const response = await api.get("/control-id/results");
    const lastResult = response.data[response.data.length - 1].body.response;
    const accessLogs = JSON.parse(lastResult);
    console.log(accessLogs);
  };

  useEffect(() => {
    if (serialId) {
      searchAccessLogs();
    }
  }, [serialId]);

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


  return (
    <>
      {isLoading ? (
        <SkeletonTable />
      ) : (
        <div className="flex flex-col gap-6 justify-between mt-2 w-full">
          <div className="flex justify-between items-center pb-2 w-full">
            <h2 className="text-xl">Registros</h2>
            <Select value={serialId} onValueChange={setSerialId}>
              <SelectTrigger className="w-fit">
                <SelectValue placeholder="Selecione um dispositivo" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {devices.map((device) => (
                    <SelectItem key={device.deviceId} value={device.name}>
                      {device.ip} - {device.description} - {device.lobby.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="w-full max-h-[60vh] overflow-auto">
            <Table className="border w-full">
              <TableHeader>
                <TableRow className="bg-secondary hover:bg-secondary">
                  <TableHead>ID</TableHead>
                  <TableHead>Horário</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* {timeZones && timeZones.length > 0 ? (
                  timeZones.map((timeZone) => (
                    <TableRow key={timeZone.timeZoneId}>
                      <TableCell>{timeZone.timeZoneId}</TableCell>
                      <TableCell>{timeZone.name}</TableCell>
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
                )} */}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </>
  );
}