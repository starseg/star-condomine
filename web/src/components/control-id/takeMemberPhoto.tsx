import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import api from "@/lib/axios";
import { base64ToFile } from "@/lib/utils";
import { ArrowsClockwise, Camera, X } from "@phosphor-icons/react/dist/ssr";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Button } from "../ui/button";
import { takePhotoCommand } from "./device/commands";
import { useSearchParams } from "next/navigation";

interface TakeMemberPhotoProps {
  savePhoto: (file: File) => void;
  sendBase64Photo: (file: string) => void;
}

export function TakeMemberPhoto({
  savePhoto,
  sendBase64Photo,
}: TakeMemberPhotoProps) {
  const [deviceId, setDeviceId] = useState("");
  const [userImage, setUserImage] = useState("");
  const [isLoadPhotoButtonDisabled, setIsLoadPhotoButtonDisabled] =
    useState(false);
  const [savedPhoto, setSavedPhoto] = useState(false);
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const lobbyParam = params.get("lobby");
  const lobby = lobbyParam ? parseInt(lobbyParam, 10) : null;

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

  interface item {
    value: number;
    label: string;
  }
  let items: item[] = [];
  devices.map((device: Device) =>
    items.push({
      value: device.deviceId,
      label: device.ip + " - " + device.name + " - " + device.lobby.name,
    })
  );

  async function sendCommand() {
    try {
      setIsLoadPhotoButtonDisabled(true);
      await api.post(
        `/control-id/add-command?id=${deviceId}`,
        takePhotoCommand
      );
      toast.success(
        "Comando executado, a foto será tirada automaticamente em 5 segundos",
        {
          theme: "colored",
        }
      );
      setTimeout(() => {
        setIsLoadPhotoButtonDisabled(false);
      }, 12000);
    } catch (error) {
      console.error("Erro ao obter dados:", error);
    }
  }

  // let userFile: File;
  const [userFile, setUserFile] = useState<File>();
  async function fetchResults(): Promise<void> {
    try {
      const response = await api.get("/control-id/results");
      // console.log(response.data);
      if (response.data.length > 0) {
        const image = JSON.parse(
          response.data[response.data.length - 1].response
        );
        const timestamp = new Date().toISOString().replace(" ", "_");
        setUserFile(base64ToFile(image.user_image, `user_photo_${timestamp}`));

        const reader = new FileReader();
        reader.onloadend = () => {
          setUserImage(reader.result as string);
        };
        if (userFile) reader.readAsDataURL(userFile);
      }
    } catch (error) {
      console.error("Error fetching results:", error);
    }
  }

  function sendPhoto() {
    if (userFile) {
      savePhoto(userFile);
      sendBase64Photo(userImage);
      setSavedPhoto(true);
      // console.log(userFile);
    } else {
      console.log("Error sending photo");
    }
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant={"outline"}
          className="flex flex-col justify-center items-center h-full"
        >
          <Camera size={22} />
          {savedPhoto ? (
            <p className="text-green-500">Foto salva</p>
          ) : (
            <p>Tirar foto</p>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side={"right"} className="space-y-4">
        <SheetHeader className="mx-auto w-full max-w-lg">
          <SheetTitle>Tirar foto pela leitora</SheetTitle>
        </SheetHeader>
        <Select value={deviceId} onValueChange={setDeviceId}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione um dispositivo" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {devices.map((device) => (
                <SelectItem key={device.deviceId} value={device.name}>
                  {device.ip} - {device.name} - {device.lobby.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <div className="flex flex-col gap-4">
          <Button
            onClick={sendCommand}
            disabled={deviceId === ""}
            className="flex gap-2 w-full"
          >
            <Camera />
            <p>Capturar imagem</p>
          </Button>
          <Button
            onClick={fetchResults}
            className="flex gap-2 w-full"
            disabled={isLoadPhotoButtonDisabled}
          >
            <ArrowsClockwise />
            {isLoadPhotoButtonDisabled ? (
              <p>Aguarde...</p>
            ) : (
              <p>Carregar foto</p>
            )}
          </Button>
          <p className="text-sm text-stone-300">
            Espere 10 segundos para carregar uma foto após capturá-la, pois o
            processo de comunicação com o dispositivo demora um pouco
          </p>
        </div>
        {userImage && (
          <div className="flex flex-col justify-center items-center gap-4 mt-8">
            <img src={userImage} alt="Imagem do usuário" />
            <div className="flex gap-4">
              <SheetClose asChild>
                <Button onClick={() => sendPhoto()}>Salvar</Button>
              </SheetClose>
              <Button variant={"outline"} onClick={() => setUserImage("")}>
                <X /> Remover Foto
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
