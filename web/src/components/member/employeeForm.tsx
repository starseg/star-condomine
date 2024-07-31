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
import { useEffect, useState } from "react";
import { PlusCircle } from "@phosphor-icons/react/dist/ssr";
import { handleFileUpload } from "@/lib/firebase-upload";
import InputImage from "../form/inputImage";
import MaskInput from "../form/inputMask";
import DefaultTextarea from "../form/textareaDefault";
import DefaultCheckbox from "../form/checkboxDefault";
import DefaultInput from "../form/inputDefault";
import {
  createUserCommand,
  createUserGroupRelationCommand,
  setUserFaceCommand,
} from "../control-id/device/commands";
import DefaultCombobox from "../form/comboboxDefault";

const FormSchema = z.object({
  profileUrl: z.instanceof(File),
  documentUrl: z.instanceof(File),
  name: z.string().min(5).trim(),
  cpf: z.string(),
  rg: z.string(),
  position: z.string().min(2),
  accessPeriod: z.string(),
  comments: z.string(),

  faceAccess: z.boolean().default(false),
  biometricAccess: z.boolean().default(false),
  remoteControlAccess: z.boolean().default(false),
  passwordAccess: z.string(),

  tag: z.string(),
  card: z.string(),

  sendToFacial: z.boolean().default(false),
  groupId: z.number(),
});

export function EmployeeForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      profileUrl: new File([], ""),
      documentUrl: new File([], ""),
      name: "",
      cpf: "",
      rg: "",
      position: "",
      accessPeriod: "",
      faceAccess: false,
      biometricAccess: false,
      remoteControlAccess: false,
      passwordAccess: "",
      comments: "",
      tag: "",
      card: "",
      sendToFacial: false,
      groupId: 0,
    },
  });

  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  // PEGA O ID DA PORTARIA
  const lobbyParam = params.get("lobby");
  const lobby = lobbyParam ? parseInt(lobbyParam, 10) : null;

  // BUSCA OS TIPOS DE TAG
  interface ITagTypes {
    tagTypeId: number;
    description: string;
  }
  const [tagTypes, setTagTypes] = useState<ITagTypes[]>([]);
  const fetchTagTypes = async () => {
    if (session)
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
  // RETORNA O ID DO TIPO DA TAG
  let tag = 0;
  let card = 0;
  tagTypes.forEach((type) => {
    if (type.description === "Tag") tag = type.tagTypeId;
    if (type.description === "Cartão") card = type.tagTypeId;
  });

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

  const [lobbyData, setLobbyData] = useState<Lobby>();
  async function fetchLobbyData() {
    if (session)
      try {
        const getLobby = await api.get(`/lobby/find/${lobby}`, {
          headers: {
            Authorization: `Bearer ${session?.token.user.token}`,
          },
        });
        setLobbyData(getLobby.data);
      } catch (error) {
        console.error("Erro ao obter dados:", error);
      }
  }

  const [groups, setGroups] = useState<Group[]>([]);
  const fetchGroups = async () => {
    if (session)
      try {
        const response = await api.get("group", {
          headers: {
            Authorization: `Bearer ${session?.token.user.token}`,
          },
        });
        setGroups(response.data);
      } catch (error) {
        console.error("Erro ao obter dados:", error);
      }
  };

  interface item {
    value: number;
    label: string;
  }
  let groupItems: item[] = [];

  groups.map((group: Group) =>
    groupItems.push({
      value: group.groupId,
      label: group.name,
    })
  );

  useEffect(() => {
    fetchTagTypes();
    fetchLobbyData();
    fetchGroups();
  }, [session]);

  async function sendControliDCommand(command: object): Promise<void> {
    try {
      if (lobbyData && lobbyData.ControllerBrand.name === "Control iD") {
        lobbyData.device.map(async (device) => {
          await api.post(`/control-id/add-command?id=${device.name}`, command);
        });
      } else {
        console.log("Não é uma portaria com Control iD");
      }
    } catch (error) {
      console.error("Error sending command:", error);
    }
  }

  const [isSending, setIsSendind] = useState(false);
  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setIsSendind(true);
    // FAZ O UPLOAD DA FOTO
    let file;
    let base64image: string = "";
    if (data.profileUrl instanceof File && data.profileUrl.size > 0) {
      const timestamp = new Date().toISOString();
      const fileExtension = data.profileUrl.name.split(".").pop();
      file = await handleFileUpload(
        data.profileUrl,
        `pessoas/foto-perfil-${timestamp}.${fileExtension}`
      );
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        base64image = result.split("data:image/jpeg;base64,")[1];
      };
      reader.readAsDataURL(data.profileUrl);
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

    // REGISTRA O funcionário
    try {
      const info = {
        type: "EMPLOYEE",
        profileUrl: file,
        documentUrl: document,
        name: data.name,
        cpf: data.cpf,
        rg: data.rg,
        position: data.position,
        accessPeriod: data.accessPeriod,
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

      // REGISTRA TAGS DO FUNCIONARIO
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
      // REGISTRA CARTÕES DO FUNCIONARIO
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

      if (data.sendToFacial) {
        const timestamp = ~~(Date.now() / 1000);
        await sendControliDCommand(
          createUserCommand(response.data.memberId, data.name)
        );
        // console.log(base64image);
        if (base64image) {
          await sendControliDCommand(
            setUserFaceCommand(base64image, response.data.memberId, timestamp)
          );
        }

        if (data.groupId !== 0) {
          const info = {
            memberId: response.data.memberId,
            groupId: data.groupId,
          };
          await api.post(`memberGroup`, info, {
            headers: {
              Authorization: `Bearer ${session?.token.user.token}`,
            },
          });
          await sendControliDCommand(
            createUserGroupRelationCommand(response.data.memberId, data.groupId)
          );
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
        <div>
          <p className="mb-1 text-sm">Foto de perfil</p>
          <InputImage control={form.control} name="profileUrl" />
        </div>

        <DefaultInput
          control={form.control}
          name="name"
          label="Nome"
          placeholder="Digite o nome do funcionário"
        />

        <MaskInput
          control={form.control}
          mask="999.999.999/99"
          name="cpf"
          label="CPF"
          placeholder="Digite o CPF do funcionário"
        />

        <DefaultInput
          control={form.control}
          name="rg"
          label="RG"
          placeholder="Digite o RG do funcionário"
        />

        <DefaultInput
          control={form.control}
          name="position"
          label="Cargo"
          placeholder="Digite o cargo do funcionário"
        />

        <DefaultTextarea
          control={form.control}
          name="accessPeriod"
          label="Período de acesso"
          placeholder="Descreva os dias da semana e os horários"
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
                {tagNumber.map((num, index) => (
                  <p
                    key={index}
                    className="text-normal p-2 mt-2 rounded-md bg-muted"
                  >
                    {num}
                  </p>
                ))}
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
                {cardNumber.map((num, index) => (
                  <p
                    key={index}
                    className="text-normal p-2 mt-2 rounded-md bg-muted"
                  >
                    {num}
                  </p>
                ))}
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

        <DefaultTextarea
          control={form.control}
          name="comments"
          label="Observações"
          placeholder="Alguma informação adicional..."
        />

        <div>
          <p className="mb-1 text-sm">Documento com foto (RG/CPF ou CNH)</p>
          <InputImage control={form.control} name="documentUrl" />
        </div>

        <DefaultCheckbox
          control={form.control}
          name="sendToFacial"
          label="Cadastrar nos dispositivos de reconhecimento facial (fase de testes)"
        />

        {form.getValues("sendToFacial") === true && (
          <div>
            <DefaultCombobox
              control={form.control}
              name="groupId"
              label="Grupo de acesso"
              object={groupItems}
              selectLabel="Selecione o grupo relacionado"
              searchLabel="Buscar grupo..."
              onSelect={(value: number) => {
                form.setValue("groupId", value);
              }}
            />
          </div>
        )}

        <Button type="submit" className="w-full text-lg" disabled={isSending}>
          {isSending ? "Registrando..." : "Registrar"}
        </Button>
      </form>
    </Form>
  );
}
