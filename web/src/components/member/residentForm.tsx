"use client";

import * as z from "zod";
import api from "@/lib/axios";
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
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "../ui/textarea";
import { MaskedInput } from "../maskedInput";
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
import { PlusCircle, Trash } from "@phosphor-icons/react/dist/ssr";
import { handleFileUpload } from "@/lib/firebase-upload";
import InputImage from "../form/inputImage";

const FormSchema = z.object({
  profileUrl: z.instanceof(File),
  name: z.string().min(5).trim(),
  cpf: z.string(),
  rg: z.string(),
  email: z.string(),
  addressType: z.number(),
  address: z.string().min(1),
  comments: z.string(),

  faceAccess: z.boolean().default(false),
  biometricAccess: z.boolean().default(false),
  remoteControlAccess: z.boolean().default(false),
  passwordAccess: z.string(),

  telephone: z.string(),
  tag: z.string(),
  card: z.string(),
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
      faceAccess: false,
      biometricAccess: false,
      remoteControlAccess: false,
      passwordAccess: "",
      comments: "",
      telephone: "",
      tag: "",
      card: "",
    },
  });

  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);

  const [addressType, setAddressType] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      if (session)
        try {
          const response = await api.get("member/address", {
            headers: {
              Authorization: `Bearer ${session?.token.user.token}`,
            },
          });
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

  // BUSCA OS TIPOS DE TAG
  interface ITagTypes {
    tagTypeId: number;
    description: string;
  }
  const [tagTypes, setTagTypes] = useState<ITagTypes[]>([]);
  const fetchTagTypes = async () => {
    try {
      const types = await api.get("tag/types", {
        headers: {
          Authorization: `Bearer ${session?.token.user.token}`,
        },
      });
      setTagTypes(types.data);
    } catch (error) {
      console.error("Erro ao obter dados:", error);
    }
  };
  fetchTagTypes();
  // RETORNA O ID DO TIPO DA TAG
  let tag = 0;
  let card = 0;
  tagTypes.forEach((type) => {
    if (type.description === "Tag") tag = type.tagTypeId;
    if (type.description === "Cartão") card = type.tagTypeId;
  });

  const [phoneNumber, setPhoneNumber] = useState<string[]>([]);
  const addTelephone = (value: string) => {
    setPhoneNumber((prev) => [...prev, value]);
    form.setValue("telephone", "");
  };
  const deleteTelephone = (value: string) => {
    setPhoneNumber(phoneNumber.filter((item) => item !== value));
  };

  const [tagNumber, setTagNumber] = useState<string[]>([]);
  const addTag = (value: string) => {
    setTagNumber((prev) => [...prev, value]);
    form.setValue("tag", "");
  };

  const [cardNumber, setCardNumber] = useState<string[]>([]);
  const addCard = (value: string) => {
    setCardNumber((prev) => [...prev, value]);
    form.setValue("card", "");
  };

  const deleteTag = (type: string, value: string) => {
    if (type === "tag") {
      setTagNumber(tagNumber.filter((item) => item !== value));
    } else {
      setCardNumber(cardNumber.filter((item) => item !== value));
    }
  };

  const [isSending, setIsSendind] = useState(false);
  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setIsSendind(true);
    // PEGA O ID DA PORTARIA
    const lobbyParam = params.get("lobby");
    const lobby = lobbyParam ? parseInt(lobbyParam, 10) : null;

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
        faceAccess: data.faceAccess.toString(),
        biometricAccess: data.biometricAccess.toString(),
        remoteControlAccess: data.remoteControlAccess.toString(),
        passwordAccess: data.passwordAccess,
        comments: data.comments,
        lobbyId: lobby,
      };
      const response = await api.post("member", info, {
        headers: {
          Authorization: `Bearer ${session?.token.user.token}`,
        },
      });

      // REGISTRA OS NÚMEROS DE TELEFONE
      if (phoneNumber[0] != "") {
        try {
          for (let i = 0; i < phoneNumber.length; i++) {
            await api.post(
              "telephone",
              {
                number: phoneNumber[i],
                memberId: response.data.memberId,
              },
              {
                headers: {
                  Authorization: `Bearer ${session?.token.user.token}`,
                },
              }
            );
          }
        } catch (error) {
          console.error("(Telefone) Erro ao enviar dados para a API:", error);
          throw error;
        }
      }

      // REGISTRA TAGS DO MORADOR
      if (tagNumber[0] != "") {
        try {
          for (let i = 0; i < tagNumber.length; i++) {
            await api.post(
              "tag",
              {
                value: tagNumber[i],
                tagTypeId: tag,
                memberId: response.data.memberId,
              },
              {
                headers: {
                  Authorization: `Bearer ${session?.token.user.token}`,
                },
              }
            );
          }
        } catch (error) {
          console.error("(Tag) Erro ao enviar dados para a API:", error);
          throw error;
        }
      }

      // REGISTRA CARTÕES DO MORADOR
      if (cardNumber[0] != "") {
        try {
          for (let i = 0; i < cardNumber.length; i++) {
            await api.post(
              "tag",
              {
                value: cardNumber[i],
                tagTypeId: card,
                memberId: response.data.memberId,
              },
              {
                headers: {
                  Authorization: `Bearer ${session?.token.user.token}`,
                },
              }
            );
          }
        } catch (error) {
          console.error("(Cartão) Erro ao enviar dados para a API:", error);
          throw error;
        }
      }

      router.back();
    } catch (error) {
      console.error("Erro ao enviar dados para a API:", error);
      throw error;
    } finally {
      setIsSendind(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-3/4 lg:w-[40%] 2xl:w-1/3 space-y-6"
      >
        <InputImage control={form.control} name="profileUrl" />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Digite o nome do morador"
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
                  placeholder="Digite o CPF do morador"
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
                  placeholder="Digite o RG do morador"
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
                  placeholder="Digite o email do morador"
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
                    placeholder="Digite o número do telefone"
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
                          : "Selecione o tipo do endereço"}
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
                  placeholder="Digite o endereço do morador"
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
          name="faceAccess"
          render={({ field }) => (
            <div className="flex flex-col gap-4">
              <FormLabel>Formas de acesso</FormLabel>
              <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="font-normal">Facial</FormLabel>
                <FormMessage />
              </FormItem>
            </div>
          )}
        />
        <FormField
          control={form.control}
          name="biometricAccess"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-2 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel className="font-normal">Biometria</FormLabel>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="remoteControlAccess"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-2 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel className="font-normal">Controle remoto</FormLabel>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tag"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tag</FormLabel>
              <FormControl>
                <div className="flex w-full items-center space-x-2">
                  <Input
                    type="text"
                    placeholder="Número da tag"
                    autoComplete="off"
                    {...field}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="aspect-square p-1"
                    onClick={() => addTag(field.value)}
                  >
                    <PlusCircle size={"32px"} />
                  </Button>
                </div>
              </FormControl>
              <div className="flex gap-2 flex-wrap">
                {tagNumber.map((num, index) => {
                  return (
                    <div
                      key={index}
                      className="text-lg p-2 mt-2 rounded-md bg-muted flex justify-between items-center gap-2"
                    >
                      <p>{num}</p>
                      <Button
                        type="button"
                        variant="outline"
                        className="aspect-square p-1"
                        onClick={() => deleteTag("tag", num)}
                      >
                        <Trash size={"24px"} />
                      </Button>
                    </div>
                  );
                })}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="card"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cartão</FormLabel>
              <FormControl>
                <div className="flex w-full items-center space-x-2">
                  <Input
                    type="text"
                    placeholder="Número do cartão"
                    autoComplete="off"
                    {...field}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="aspect-square p-1"
                    onClick={() => addCard(field.value)}
                  >
                    <PlusCircle size={"32px"} />
                  </Button>
                </div>
              </FormControl>
              <div className="flex gap-2 flex-wrap">
                {cardNumber.map((num, index) => {
                  return (
                    <div
                      key={index}
                      className="text-lg p-2 mt-2 rounded-md bg-muted flex justify-between items-center gap-2"
                    >
                      <p>{num}</p>
                      <Button
                        type="button"
                        variant="outline"
                        className="aspect-square p-1"
                        onClick={() => deleteTag("card", num)}
                      >
                        <Trash size={"24px"} />
                      </Button>
                    </div>
                  );
                })}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="passwordAccess"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Senha numérica"
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
          name="comments"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observações</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Alguma informação adicional..."
                  autoComplete="off"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full text-lg" disabled={isSending}>
          {isSending ? "Registrando..." : "Registrar"}
        </Button>
      </form>
    </Form>
  );
}
