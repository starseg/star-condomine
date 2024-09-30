import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import api from "@/lib/axios";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { ArrowsClockwise, PlusCircle } from "@phosphor-icons/react/dist/ssr";

export function SyncItem({
  lobby,
  sendCommand,
  sendCommand2,
  triggerLabel,
}: {
  lobby: number | null;
  sendCommand: () => void;
  sendCommand2?: () => void;
  triggerLabel?: string;
}) {
  const { data: session } = useSession();
  const [devices, setDevices] = useState<Device[]>([]);
  const [id, setId] = useState("");
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

  const [deviceList, setDeviceList] = useState<string[]>([]);
  function addDevice() {
    const isSetDevice = deviceList.find((device) => device === id);
    if (id !== "" && !isSetDevice) setDeviceList((prev) => [...prev, id]);
  }

  function removeDeviceFromList(device: string) {
    setDeviceList(deviceList.filter((item) => item !== device));
  }

  function sync() {
    if (deviceList.length > 0) {
      deviceList.map(async (device) => {
        await api.post(`/control-id/add-command?id=${device}`, sendCommand());
        if (sendCommand2 !== undefined) {
          await api.post(
            `/control-id/add-command?id=${device}`,
            sendCommand2()
          );
        }
      });
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          className="p-1 text-2xl aspect-square"
          variant={"ghost"}
          title="Sincronizar"
        >
          <ArrowsClockwise />
          {triggerLabel && <p className="ml-2 text-base">{triggerLabel}</p>}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Sincronizar dado</AlertDialogTitle>
          <AlertDialogDescription>
            Escolha o(s) dispositivo(s) para onde você deseja enviar e clique no
            (+).
          </AlertDialogDescription>
          <div className="flex gap-2">
            <Select value={id} onValueChange={setId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um dispositivo" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {devices.map((device) => (
                    <SelectItem key={device.deviceId} value={device.name}>
                      {device.ip} - {device.name} - {device.description}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <Button
              variant={"outline"}
              onClick={addDevice}
              className="p-0 text-2xl aspect-square"
              title="Adicionar"
            >
              <PlusCircle />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {deviceList.map((device) => (
              <p
                key={device}
                className="bg-stone-800 hover:bg-stone-950 p-1 border hover:border-red-700 rounded cursor-pointer"
                onClick={() => removeDeviceFromList(device)}
              >
                {device}
              </p>
            ))}
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={sync} disabled={deviceList.length === 0}>
            Confirmar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
