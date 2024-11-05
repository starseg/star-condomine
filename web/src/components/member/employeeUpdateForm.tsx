"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { deleteFile, handleFileUpload } from "@/lib/firebase-upload";
import { zodResolver } from "@hookform/resolvers/zod";
import { Image, PlusCircle, UserCircle } from "@phosphor-icons/react/dist/ssr";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  modifyObjectCommand,
  setUserFaceCommand,
} from "../control-id/device/commands";
import DefaultCheckbox from "../form/checkboxDefault";
import DefaultInput from "../form/inputDefault";
import InputImage from "../form/inputImage";
import MaskInput from "../form/inputMask";
import RadioInput from "../form/inputRadio";
import DefaultTextarea from "../form/textareaDefault";
import { resizeImage } from "../form/resizeImage";

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

  status: z.enum(["ACTIVE", "INACTIVE"]),
});

interface Member {
  memberId: number;
  type: string;
  profileUrl: string;
  documentUrl: string | null;
  name: string;
  rg: string;
  cpf: string;
  email: string;
  comments: string;
  status: "ACTIVE" | "INACTIVE" | undefined;
  faceAccess: string;
  biometricAccess: string;
  remoteControlAccess: string;
  passwordAccess: string;
  addressTypeId: number;
  address: string;
  accessPeriod: string;
  position: string;
  createdAt: string;
  updatedAt: string;
  lobbyId: number;
}
interface Values {
  profileUrl: File;
  documentUrl: File;
  name: string;
  cpf: string;
  rg: string;
  position: string;
  accessPeriod: string;
  comments: string;
  faceAccess: boolean;
  biometricAccess: boolean;
  remoteControlAccess: boolean;
  passwordAccess: string;
  status: "ACTIVE" | "INACTIVE" | undefined;
}

export function EmployeeUpdateForm({
  preloadedValues,
  member,
  devices,
}: {
  preloadedValues: Values;
  member: Member;
  devices: Device[];
}) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: preloadedValues,
  });

  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());

  const status = [
    {
      value: "ACTIVE",
      label: "Ativo",
    },
    {
      value: "INACTIVE",
      label: "Inativo",
    },
  ];

  const [id, setId] = useState("");
  const [deviceList, setDeviceList] = useState<string[]>([]);
  const [sendToDevice, setSendToDevice] = useState(false);

  function addDevice() {
    const isSetDevice = deviceList.find((device) => device === id);
    if (id !== "" && !isSetDevice) setDeviceList((prev) => [...prev, id]);
  }

  function removeDeviceFromList(device: string) {
    setDeviceList(deviceList.filter((item) => item !== device));
  }

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

  const [removeFile, setRemoveFile] = useState(false);
  const [isSending, setIsSendind] = useState(false);
  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setIsSendind(true);

    // FAZ O UPLOAD DA FOTO
    let file;
    if (removeFile) {
      file = "";
      if (member.profileUrl.length > 0) {
        deleteFile(member.profileUrl);
      }
    } else if (data.profileUrl instanceof File && data.profileUrl.size > 0) {
      const timestamp = new Date().toISOString();
      const fileExtension = data.profileUrl.name.split(".").pop();

      const imageFile = await resizeImage(data.profileUrl);

      file = await handleFileUpload(
        imageFile,
        `pessoas/foto-perfil-${timestamp}.${fileExtension}`
      );
    } else if (member?.profileUrl) file = member.profileUrl;
    else file = "";

    console.log(data.profileUrl);

    // FAZ O UPLOAD DO DOCUMENTO
    let document;
    if (removeFile) {
      document = "";
      if (member.documentUrl && member.documentUrl.length > 0) {
        deleteFile(member.documentUrl);
      }
    } else if (data.documentUrl instanceof File && data.documentUrl.size > 0) {
      const timestamp = new Date().toISOString();
      const fileExtension = data.documentUrl.name.split(".").pop();
      document = await handleFileUpload(
        data.documentUrl,
        `pessoas/foto-perfil-${timestamp}.${fileExtension}`
      );
    } else if (member?.documentUrl) document = member.documentUrl;
    else document = "";

    // REGISTRA O FUNCIONARIO
    try {
      const info = {
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
        status: data.status,
      };
      await api.put("member/" + params.get("id"), info, {
        headers: {
          Authorization: `Bearer ${session?.token.user.token}`,
        },
      });

      if (sendToDevice) {
        if (deviceList.length > 0) {
          const base64 = await getBase64Photo();
          deviceList.map(async (device) => {
            // update visitor
            await api.post(
              `/control-id/add-command?id=${device}`,
              modifyObjectCommand(
                "users",
                {
                  name: data.name,
                  registration: data?.cpf || data?.rg,
                },
                {
                  users: { id: member.memberId }, // where
                }
              )
            );
            const timestamp = ~~(Date.now() / 1000);
            await api.post(
              `/control-id/add-command?id=${device}`,
              setUserFaceCommand(member.memberId, base64, timestamp)
            );
          });
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
        <div className="flex justify-center items-center gap-4">
          {member.profileUrl.length > 0 ? (
            <div className="flex flex-col justify-center items-center">
              <img src={member.profileUrl} alt="Foto de perfil" width={80} />
              <p className="mt-2 text-center text-sm">Foto atual</p>
              {/* {member.profileUrl} */}
            </div>
          ) : (
            <div className="flex flex-col justify-center items-center">
              <UserCircle className="w-20 h-20" />
              <p className="mt-2 text-center text-sm">
                Nenhuma foto <br /> cadastrada
              </p>
            </div>
          )}
          <div className="w-10/12">
            <InputImage control={form.control} name="profileUrl" />
            <div className="flex items-center space-x-2 mt-2">
              <Checkbox
                id="check"
                onClick={() => {
                  setRemoveFile(!removeFile);
                }}
              />
              <label
                htmlFor="check"
                className="peer-disabled:opacity-70 font-medium text-sm leading-none peer-disabled:cursor-not-allowed"
              >
                Remover foto - {removeFile ? "sim" : "não"}
              </label>
            </div>
          </div>
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
          <p>Documento</p>
          <div className="flex justify-center items-center gap-4">
            {member.documentUrl && member.documentUrl.length > 0 ? (
              <div className="flex flex-col justify-center items-center">
                <img src={member.documentUrl} alt="Foto de perfil" width={80} />
                <p className="mt-2 text-center text-sm">Foto atual</p>
                {/* {member.documentUrl} */}
              </div>
            ) : (
              <div className="flex flex-col justify-center items-center">
                <Image className="w-16 h-16" />
                <p className="mt-2 text-center text-xs">Nenhuma foto</p>
              </div>
            )}
            <div className="w-10/12">
              <InputImage control={form.control} name="documentUrl" />

              <div className="flex items-center space-x-2 mt-2">
                <Checkbox
                  id="check"
                  onClick={() => {
                    setRemoveFile(!removeFile);
                  }}
                />
                <label
                  htmlFor="check"
                  className="peer-disabled:opacity-70 font-medium text-sm leading-none peer-disabled:cursor-not-allowed"
                >
                  Remover foto - {removeFile ? "sim" : "não"}
                </label>
              </div>
            </div>
          </div>
        </div>

        <RadioInput
          control={form.control}
          name="status"
          label="Status"
          object={status}
          idExtractor={(item) => item.value}
          descriptionExtractor={(item) => item.label}
        />

        <div className="flex items-center space-x-2 mt-2">
          <Checkbox
            onClick={() => {
              setSendToDevice(!sendToDevice);
            }}
          />
          <label
            htmlFor="check"
            className="peer-disabled:opacity-70 font-medium text-sm leading-none peer-disabled:cursor-not-allowed"
          >
            Enviar atualização para os dispositivos
          </label>
        </div>
        {sendToDevice && (
          <div className="flex flex-col gap-2">
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
                type="button"
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
          </div>
        )}

        <Button type="submit" className="w-full text-lg" disabled={isSending}>
          {isSending ? "Atualizando..." : "Atualizar"}
        </Button>
      </form>
    </Form>
  );
}
