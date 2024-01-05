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
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import api from "@/lib/axios";
import { useEffect, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "../ui/command";
import { useSearchParams } from "next/navigation";

const FormSchema = z.object({
  name: z.string(),
  ip: z.string(),
  ramal: z.string(),
  description: z.string(),
  model: z.number(),
});

export function DeviceForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      ip: "",
      ramal: "",
      description: "",
      model: 0,
    },
  });

  interface deviceModel {
    deviceModelId: number;
    model: string;
    brand: string;
    description: string;
  }

  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);

  const [deviceModel, setDeviceModel] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("device/models", {
          headers: {
            Authorization: `Bearer ${session?.token.user.token}`,
          },
        });
        setDeviceModel(response.data);
      } catch (error) {
        console.error("Erro ao obter dados:", error);
      }
    };

    fetchData();
  }, [session]);

  interface item {
    value: number;
    label: string;
  }
  let items: item[] = [];

  deviceModel.map((model: deviceModel) =>
    items.push({
      value: model.deviceModelId,
      label: model.model + " - " + model.brand,
    })
  );

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    const lobbyParam = params.get("lobby");
    const lobby = lobbyParam ? parseInt(lobbyParam, 10) : null;

    const info = {
      name: data.name,
      ip: data.ip,
      ramal: parseInt(data.ramal),
      description: data.description,
      deviceModelId: data.model,
      lobbyId: lobby,
    };
    // console.log(info);
    try {
      const response = await api.post("device", info, {
        headers: {
          Authorization: `Bearer ${session?.token.user.token}`,
        },
      });
      // console.log(response.data);
      router.push("/dashboard/actions/device?lobby=" + lobby);
    } catch (error) {
      console.error("Erro ao enviar dados para a API:", error);
      throw error;
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-3/4 lg:w-1/3 space-y-6"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Identificação do dispositivo"
                  autoComplete="off"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="ip"
          render={({ field }) => (
            <FormItem>
              <FormLabel>IP</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Digite o IP do dispositivo. Ex: 192.168.0.1"
                  autoComplete="off"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="ramal"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Número do ramal</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Digite o número do ramal"
                  autoComplete="off"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Digite a descrição do dispositivo"
                  autoComplete="off"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="model"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Modelo do dispositivo</FormLabel>
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
                        ? items.find((item) => item.value === field.value)
                            ?.label
                        : "Selecione um modelo"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="p-0">
                  <Command className="w-full">
                    <CommandInput placeholder="Buscar modelo..." />
                    <CommandEmpty>Nenhum item encontrado.</CommandEmpty>
                    <CommandGroup>
                      {items.map((item) => (
                        <CommandItem
                          value={item.label}
                          key={item.value}
                          onSelect={() => {
                            form.setValue("model", item.value);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              item.value === field.value
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {item.label}
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

        <Button type="submit" className="w-full text-lg">
          Registrar
        </Button>
      </form>
    </Form>
  );
}
