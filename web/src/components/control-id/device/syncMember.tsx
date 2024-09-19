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
import { useState } from "react";
import { useSession } from "next-auth/react";
import { ArrowsClockwise, PlusCircle } from "@phosphor-icons/react/dist/ssr";
import { createUserCommand, setUserFaceCommand } from "./commands";

export function SyncMember({
  member,
  devices,
}: {
  member: Member;
  devices: Device[];
}) {
  const { data: session } = useSession();
  const [id, setId] = useState("");
  const [deviceList, setDeviceList] = useState<string[]>([]);

  const getBase64Photo = async () => {
    if (session)
      try {
        const response = await api.get(
          `member/find/${member.memberId}/base64photo`,
          {
            headers: {
              Authorization: `Bearer ${session?.token.user.token}`,
            },
          }
        );
        return response.data.base64;
      } catch (error) {
        console.error("Erro ao obter dados:", error);
      }
    return "";
  };

  function addDevice() {
    const isSetDevice = deviceList.find((device) => device === id);
    if (id !== "" && !isSetDevice) setDeviceList((prev) => [...prev, id]);
  }

  function removeDeviceFromList(device: string) {
    setDeviceList(deviceList.filter((item) => item !== device));
  }

  async function synchronize() {
    const base64: string = await getBase64Photo(); // get user photo (base64)
    if (deviceList.length > 0) {
      deviceList.map(async (device) => {
        const timestamp = ~~(Date.now() / 1000);
        // create user
        await api.post(
          `/control-id/add-command?id=${device}`,
          createUserCommand(
            member.memberId,
            member.name,
            member?.cpf || member?.rg
          )
        );

        await api.post(
          `/control-id/add-command?id=${device}`,
          setUserFaceCommand(member.memberId, base64, timestamp)
        );
      });
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          className="p-1 text-2xl aspect-square"
          variant={"ghost"}
          title="Sincronizar membro"
        >
          <ArrowsClockwise />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Sincronizar membro</AlertDialogTitle>
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
          <div className="flex gap-2">
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
          <AlertDialogAction
            onClick={synchronize}
            disabled={deviceList.length === 0}
          >
            Confirmar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
