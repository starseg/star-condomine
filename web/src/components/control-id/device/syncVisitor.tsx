import DefaultInput from "@/components/form/inputDefault";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import api from "@/lib/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowsClockwise, PlusCircle } from "@phosphor-icons/react/dist/ssr";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createUserCommand, setUserFaceCommand } from "./commands";
import { format } from "date-fns";

const FormSchema = z.object({
  startTime: z.string(),
  endTime: z.string(),
});

export function SyncVisitor({
  visitor,
  devices,
}: {
  visitor: Visitor;
  devices: Device[];
}) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      startTime: visitor.startDate
        ? format(new Date(visitor.startDate), "yyyy-MM-dd'T'HH:mm")
        : "",
      endTime: visitor.endDate
        ? format(new Date(visitor.endDate), "yyyy-MM-dd'T'HH:mm")
        : "",
    },
  });
  const { data: session } = useSession();
  const [id, setId] = useState("");
  const [deviceList, setDeviceList] = useState<string[]>([]);

  const getBase64Photo = async () => {
    if (session)
      try {
        const response = await api.get(
          `visitor/find/${visitor.visitorId}/base64photo`,
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

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    await getBase64Photo(); // get user photo (base64)
    if (deviceList.length > 0) {
      const startDateObject = new Date(data.startTime);
      startDateObject.setHours(startDateObject.getHours() - 3);

      const endDateObject = new Date(data.endTime);
      endDateObject.setHours(endDateObject.getHours() - 3);

      const startDateTimestamp = ~~(startDateObject.getTime() / 1000);
      const endDateTimestamp = ~~(endDateObject.getTime() / 1000);

      deviceList.map(async (device) => {
        const base64: string = await getBase64Photo();
        // create user
        await api.post(
          `/control-id/add-command?id=${device}`,
          createUserCommand(
            visitor.visitorId + 10000,
            visitor.name,
            visitor?.cpf || visitor?.rg,
            1,
            startDateTimestamp,
            endDateTimestamp
          )
        );
        const timestamp = ~~(Date.now() / 1000);
        await api.post(
          `/control-id/add-command?id=${device}`,
          setUserFaceCommand(visitor.visitorId + 10000, base64, timestamp)
        );
      });
      let realStartDate = "";
      if (data.startTime !== "") {
        const dateObject = new Date(data.startTime);
        dateObject.setHours(dateObject.getHours() + 3);
        realStartDate = format(dateObject, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
      }
      let realEndDate = "";
      if (data.startTime !== "") {
        const dateObject = new Date(data.endTime);
        dateObject.setHours(dateObject.getHours() + 3);
        realEndDate = format(dateObject, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
      }
      await api.put(
        `visitor/${visitor.visitorId}`,
        {
          startDate: realStartDate,
          endDate: realEndDate,
        },
        {
          headers: {
            Authorization: `Bearer ${session?.token.user.token}`,
          },
        }
      );
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="p-1 text-2xl aspect-square"
          variant={"ghost"}
          title="Sincronizar visitante"
        >
          <ArrowsClockwise />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sincronizar visitante</DialogTitle>
          <DialogDescription>
            Escolha o(s) dispositivo(s) para onde você deseja enviar e clique no
            (+).
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-2"
          >
            <div className="flex gap-2">
              <DefaultInput
                control={form.control}
                name="startTime"
                label="Liberado a partir de:"
                type="datetime-local"
                placeholder="Data e hora"
              />
              <DefaultInput
                control={form.control}
                name="endTime"
                label="até:"
                type="datetime-local"
                placeholder="Data e hora"
              />
            </div>
            {/* SELECT DEVICES */}
            <div className="flex flex-wrap gap-2">
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
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Cancelar
                </Button>
              </DialogClose>

              <DialogClose asChild>
                <Button
                  type="submit"
                  title="sincronizar"
                  disabled={deviceList.length === 0}
                >
                  Confirmar
                </Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
