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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MaskedInput } from "../maskedInput";
import { useEffect, useState } from "react";
import { PlusCircle, Trash } from "@phosphor-icons/react/dist/ssr";
import { handleFileUpload } from "@/lib/firebase-upload";
import InputImage from "../form/inputImage";
import DefaultInput from "../form/inputDefault";
import MaskInput from "../form/inputMask";
import DefaultCombobox from "../form/comboboxDefault";
import DefaultCheckbox from "../form/checkboxDefault";
import DefaultTextarea from "../form/textareaDefault";
import { resizeImage } from "../form/resizeImage";

const FormSchema = z.object({
  profileUrl: z.instanceof(File),
  documentUrl: z.instanceof(File),
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
      documentUrl: new File([], ""),
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
  const params = new URLSearchParams(searchParams.toString());

  const [addressType, setAddressType] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      if (session)
        try {
          const response = await api.get("member/address",);
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
    if (session)
      try {
        const types = await api.get("tag/types");
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

      const imageFile = await resizeImage(data.profileUrl);

      file = await handleFileUpload(
        imageFile,
        `pessoas/foto-perfil-${timestamp}.${fileExtension}`
      );
    } else file = "";

    // FAZ O UPLOAD DO DOCUMENTO
    let document;
    if (data.documentUrl instanceof File && data.documentUrl.size > 0) {
      const timestamp = new Date().toISOString();
      const fileExtension = data.documentUrl.name.split(".").pop();
      document = await handleFileUpload(
        data.documentUrl,
        `pessoas/foto-documento-proprietario-${timestamp}.${fileExtension}`
      );
    } else document = "";

    // REGISTRA O MORADOR
    try {
      const info = {
        type: "RESIDENT",
        profileUrl: file,
        documentUrl: document,
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
      const response = await api.post("member", info);

      // REGISTRA OS NÚMEROS DE TELEFONE
      if (phoneNumber[0] != "") {
        try {
          for (let i = 0; i < phoneNumber.length; i++) {
            await api.post(
              "telephone",
              {
                number: phoneNumber[i],
                memberId: response.data.memberId,
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
        className="space-y-6 w-3/4 lg:w-[40%] 2xl:w-1/3"
      >
        <div>
          <p className="mb-1 text-sm">Foto de perfil</p>
          <InputImage control={form.control} name="profileUrl" />
        </div>

        <DefaultInput
          control={form.control}
          name="name"
          label="Nome completo"
          placeholder="Digite o nome completo do morador"
        />

        <MaskInput
          control={form.control}
          mask="999.999.999/99"
          name="cpf"
          label="CPF"
          placeholder="Digite o CPF do morador"
        />

        <DefaultInput
          control={form.control}
          name="rg"
          label="RG"
          placeholder="Digite o RG do morador"
        />

        <DefaultInput
          control={form.control}
          type="email"
          name="email"
          label="E-mail"
          placeholder="Digite o e-mail do morador"
        />

        <FormField
          control={form.control}
          name="telephone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefone</FormLabel>
              <FormControl>
                <div className="flex items-center space-x-2 w-full">
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
                    className="p-1 aspect-square"
                    onClick={() => addTelephone(field.value)}
                  >
                    <PlusCircle size={"32px"} />
                  </Button>
                </div>
              </FormControl>
              <div className="flex flex-wrap gap-2">
                {phoneNumber.map((telephone, index) => {
                  return (
                    <div
                      key={index}
                      className="flex justify-between items-center gap-2 bg-muted mt-2 px-4 py-2 rounded-md text-lg"
                    >
                      <p>{telephone}</p>
                      <Button
                        type="button"
                        variant="outline"
                        className="p-1 aspect-square"
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

        <DefaultCombobox
          control={form.control}
          name="addressType"
          label="Tipo de endereço"
          object={items}
          selectLabel="Selecione o tipo do endereço"
          searchLabel="Buscar tipo..."
          onSelect={(value: number) => {
            form.setValue("addressType", value);
          }}
        />

        <DefaultInput
          control={form.control}
          name="address"
          label="Descrição do endereço"
          placeholder="Digite o endereço do morador"
        />

        <DefaultCheckbox
          control={form.control}
          name="faceAccess"
          title="Formas de acesso"
          label="Facial"
        />

        <DefaultCheckbox
          control={form.control}
          name="biometricAccess"
          label="Biometria"
        />

        <DefaultCheckbox
          control={form.control}
          name="remoteControlAccess"
          label="Controle remoto"
        />

        <FormField
          control={form.control}
          name="tag"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tag</FormLabel>
              <FormControl>
                <div className="flex items-center space-x-2 w-full">
                  <Input
                    type="text"
                    placeholder="Número da tag"
                    autoComplete="off"
                    {...field}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="p-1 aspect-square"
                    onClick={() => addTag(field.value)}
                  >
                    <PlusCircle size={"32px"} />
                  </Button>
                </div>
              </FormControl>
              <div className="flex flex-wrap gap-2">
                {tagNumber.map((num, index) => {
                  return (
                    <div
                      key={index}
                      className="flex justify-between items-center gap-2 bg-muted mt-2 p-2 rounded-md text-lg"
                    >
                      <p>{num}</p>
                      <Button
                        type="button"
                        variant="outline"
                        className="p-1 aspect-square"
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
                <div className="flex items-center space-x-2 w-full">
                  <Input
                    type="text"
                    placeholder="Número do cartão"
                    autoComplete="off"
                    {...field}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="p-1 aspect-square"
                    onClick={() => addCard(field.value)}
                  >
                    <PlusCircle size={"32px"} />
                  </Button>
                </div>
              </FormControl>
              <div className="flex flex-wrap gap-2">
                {cardNumber.map((num, index) => {
                  return (
                    <div
                      key={index}
                      className="flex justify-between items-center gap-2 bg-muted mt-2 p-2 rounded-md text-lg"
                    >
                      <p>{num}</p>
                      <Button
                        type="button"
                        variant="outline"
                        className="p-1 aspect-square"
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

        <DefaultInput
          control={form.control}
          name="passwordAccess"
          label="Senha"
          placeholder="Senha numérica"
        />

        <div>
          <p className="mb-1 text-sm">Documento com foto (RG/CPF ou CNH)</p>
          <InputImage control={form.control} name="documentUrl" />
        </div>

        <DefaultTextarea
          control={form.control}
          name="comments"
          label="Observações"
          placeholder="Alguma informação adicional..."
        />

        <Button type="submit" className="w-full text-lg" disabled={isSending}>
          {isSending ? "Registrando..." : "Registrar"}
        </Button>
      </form>
    </Form>
  );
}
