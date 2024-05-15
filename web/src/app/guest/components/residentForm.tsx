"use client";

import * as z from "zod";
import api from "@/lib/axios";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "@/firebase";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MaskedInput } from "@/components/maskedInput";
import { useEffect, useState } from "react";
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
import { PlusCircle, Trash } from "@phosphor-icons/react/dist/ssr";
import { handleFileUpload } from "@/lib/firebase-upload";
import { decrypt } from "@/lib/crypto";

const FormSchema = z.object({
  profileUrl: z.instanceof(File),
  name: z.string().min(5, {
    message: "Digite seu nome completo",
  }),
  cpf: z.string().min(11, {
    message: "Preencha o CPF corretamente",
  }),
  rg: z.string().min(8, {
    message: "Preencha o RG corretamente",
  }),
  email: z.string().email({ message: "Preencha o e-mail corretamente" }),
  addressType: z.number().positive({ message: "Selecione o tipo" }),
  address: z.string().min(1, {
    message: "Digite o endereço",
  }),
  telephone: z.string(),
});

export function ResidentForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      profileUrl: new File([], ""),
      name: "",
      cpf: "",
      rg: "",
      email: "",
      addressType: 0,
      address: "",
      telephone: "",
    },
  });

  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);

  const [addressType, setAddressType] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("guest/address");
        setAddressType(response.data);
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

  interface IAddressType {
    addressTypeId: number;
    description: string;
  }

  addressType.map((type: IAddressType) =>
    items.push({
      value: type.addressTypeId,
      label: type.description,
    })
  );

  const [phoneNumber, setPhoneNumber] = useState<string[]>([]);
  const addTelephone = (value: string) => {
    setPhoneNumber((prev) => [...prev, value]);
    form.setValue("telephone", "");
  };
  const deleteTelephone = (value: string) => {
    setPhoneNumber(phoneNumber.filter((item) => item !== value));
  };

  const [isSendind, setIsSending] = useState(false);
  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setIsSending(true);
    // PEGA O ID DA PORTARIA
    const lobby = params.get("lobby") || "";

    // FAZ O UPLOAD DA FOTO
    let file;
    if (data.profileUrl instanceof File && data.profileUrl.size > 0) {
      const timestamp = new Date().toISOString();
      const fileExtension = data.profileUrl.name.split(".").pop();
      file = await handleFileUpload(
        data.profileUrl,
        `pessoas/foto-perfil-${timestamp}.${fileExtension}`
      );
    } else file = "";

    // REGISTRA O MORADOR
    try {
      const info = {
        type: "RESIDENT",
        profileUrl: file,
        name: data.name,
        cpf: data.cpf,
        rg: data.rg,
        email: data.email,
        addressTypeId: data.addressType,
        address: data.address,
        lobbyId: decrypt(lobby),
      };
      const response = await api.post("guest/member", info);
      // console.log(response.data);

      // REGISTRA OS NÚMEROS DE TELEFONE
      if (phoneNumber[0] != "") {
        try {
          for (let i = 0; i < phoneNumber.length; i++) {
            await api.post("guest/telephone", {
              number: phoneNumber[i],
              memberId: response.data.memberId,
            });
          }
        } catch (error) {
          console.error("(Telefone) Erro ao enviar dados para a API:", error);
          throw error;
        }
      }

      router.push("resident/success?lobby=" + lobby);
    } catch (error) {
      console.error("Erro ao enviar dados para a API:", error);
      throw error;
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="px-4 w-full md:w-3/4 lg:w-1/2 2xl:w-1/3 space-y-6"
      >
        <FormField
          control={form.control}
          name="profileUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Foto</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    field.onChange(e.target.files ? e.target.files[0] : null)
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Digite seu nome"
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
          name="cpf"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CPF</FormLabel>
              <FormControl>
                <MaskedInput
                  mask="999.999.999/99"
                  placeholder="Digite seu CPF"
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
          name="rg"
          render={({ field }) => (
            <FormItem>
              <FormLabel>RG</FormLabel>
              <FormControl>
                <Input
                  placeholder="Digite seu RG"
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
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-mail</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Digite seu e-mail"
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
          name="telephone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefone</FormLabel>
              <FormControl>
                <div className="flex w-full items-center space-x-2">
                  <MaskedInput
                    mask="(99) 99999-9999"
                    type="text"
                    placeholder="Digite o número do seu telefone"
                    autoComplete="off"
                    {...field}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="aspect-square p-1"
                    onClick={() => addTelephone(field.value)}
                  >
                    <PlusCircle size={"32px"} />
                  </Button>
                </div>
              </FormControl>
              <div className="flex gap-2 flex-wrap">
                {phoneNumber.map((telephone, index) => {
                  return (
                    <div
                      key={index}
                      className="text-lg py-2 px-4 mt-2 rounded-md bg-muted flex justify-between items-center gap-2"
                    >
                      <p>{telephone}</p>
                      <Button
                        type="button"
                        variant="outline"
                        className="aspect-square p-1"
                        onClick={() => deleteTelephone(telephone)}
                      >
                        <Trash size={"24px"} />
                      </Button>
                    </div>
                  );
                })}
              </div>
              <FormMessage />
              <FormDescription>
                Clique no ícone de "+" para adicionar o telefone. Pode ser
                inserido mais de um, caso você tenha.
              </FormDescription>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="addressType"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Tipo de endereço</FormLabel>
              <FormControl>
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
                          : "Selecione o tipo do seu endereço"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="p-0 max-h-[60vh] overflow-x-auto">
                    <Command className="w-full">
                      <CommandInput placeholder="Buscar tipo..." />
                      <CommandEmpty>Nenhum item encontrado.</CommandEmpty>
                      <CommandGroup>
                        {items.map((item) => (
                          <CommandItem
                            value={item.label}
                            key={item.value}
                            onSelect={() => {
                              form.setValue("addressType", item.value);
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
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição do endereço</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Digite seu endereço"
                  autoComplete="off"
                  {...field}
                />
              </FormControl>
              <FormMessage />
              <FormDescription>
                Exemplo: Selecionei o tipo "LOTE", e coloco na descrição o
                número dele "01".
              </FormDescription>
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full text-lg" disabled={isSendind}>
          Cadastrar
        </Button>
        <p className="my-2">
          Lembre-se de conferir todos os dados antes de enviar!
        </p>
      </form>
    </Form>
  );
}
