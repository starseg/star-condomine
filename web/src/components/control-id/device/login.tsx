"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import api from "@/lib/axios";
import { useSession } from "next-auth/react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import axios from "axios";

const FormSchema = z.object({
  device: z.number(),
});

export default function Login() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      device: 0,
    },
  });

  const [status, setStatus] = useState("Sem conexão");
  const [devices, setDevices] = useState<Device[]>([]);

  async function login(id: number) {
    const device = devices.find((device) => device.deviceId === id);
    const session = localStorage.getItem("session");
    // se já tiver uma sessão, verifica se é válida
    if (session) {
      try {
        const response = await axios.post(
          `http://${device?.ip}/session_is_valid.fcgi?session=${session}`
        );
        if (response.data.session_is_valid) {
          setStatus(`Conectado a ${device?.ip}`);
          localStorage.setItem("device_ip", device ? device.ip : "0.0.0.0");
          localStorage.setItem("device_id", device ? device.name : "");
          return;
        }
      } catch (error) {
        setStatus("Erro ao tentar conectar");
      }
    }
    // se não houver sessão ou ela não for validada, faz o login
    if (status !== `Conectado`) {
      try {
        const response = await axios.post(`http://${device?.ip}/login.fcgi`, {
          login: device?.login || "",
          password: device?.password || "",
        });

        if (response.status === 200) {
          const session = response.data.session;
          localStorage.setItem("session", session);
          localStorage.setItem("device_ip", device?.ip || "0.0.0.0");
          localStorage.setItem("device_id", device ? device.name : "");
          setStatus(`Conectado a ${device?.ip}`);
        } else {
          setStatus("Tentando conectar...");
        }
      } catch (error) {
        setStatus("Erro ao tentar conectar");
      }
    }
  }

  const { data: session } = useSession();
  const fetchDevices = async () => {
    if (session)
      try {
        const response = await api.get("device");
        setDevices(response.data);
      } catch (error) {
        console.error("Erro ao obter dados:", error);
      }
  };

  useEffect(() => {
    fetchDevices();
  }, [session]);

  const [isSending, setIsSendind] = useState(false);
  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setIsSendind(true);
    login(data.device);
    setIsSendind(false);
  };

  return (
    <div className="space-y-4 w-3/4 lg:w-[40%] 2xl:w-1/3">
      <Badge className="mt-2 max-w-fit text-md">{status}</Badge>
      <Form {...form}>
        <form
          className="flex items-end gap-2"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="device"
            render={({ field }) => (
              <FormItem className="flex flex-col w-3/4">
                <FormLabel>Dispositivo</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "justify-between",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value
                          ? devices.find(
                            (device) => device.deviceId === field.value
                          )?.ip
                          : "Selecione um dispositivo"}
                        <ChevronsUpDown className="opacity-50 ml-2 w-4 h-4 shrink-0" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="p-0 max-h-[60vh] overflow-x-auto">
                    <Command className="w-full">
                      <CommandInput placeholder="Buscar dispositivo..." />
                      <CommandEmpty>Nenhum item encontrado.</CommandEmpty>
                      <CommandGroup>
                        {devices.map((device) => (
                          <CommandItem
                            value={device.ip}
                            key={device.deviceId}
                            onSelect={() => {
                              form.setValue("device", device.deviceId);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                device.deviceId === field.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {device.ip} - {device.lobby.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-1/4 text-lg" disabled={isSending}>
            {isSending ? "Conectando..." : "Conectar"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
