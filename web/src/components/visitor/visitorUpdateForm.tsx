"use client";
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
import { deleteFile, handleFileUpload } from "@/lib/firebase-upload";
import { setStringDate } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle, UserCircle } from "@phosphor-icons/react/dist/ssr";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  modifyObjectCommand,
  setUserFaceCommand,
} from "../control-id/device/commands";
import DefaultInput from "../form/inputDefault";
import InputImage from "../form/inputImage";
import MaskInput from "../form/inputMask";
import RadioInput from "../form/inputRadio";
import DefaultTextarea from "../form/textareaDefault";
import { Checkbox } from "../ui/checkbox";
import { resizeImage } from "../form/resizeImage";

const FormSchema = z.object({
  profileUrl: z.instanceof(File),
  documentUrl: z.instanceof(File),
  name: z.string().trim(),
  cpf: z.string(),
  rg: z.string(),
  phone: z.string(),
  type: z.string(),
  relation: z.string(),
  comments: z.string().optional(),
  startDate: z.string(),
  endDate: z.string(),
  status: z.enum(["ACTIVE", "INACTIVE"]),
});
interface Visitor {
  visitorId: number;
  profileUrl: string;
  documentUrl: string | null;
  name: string;
  rg: string;
  cpf: string;
  phone: string;
  startDate: string | null;
  endDate: string | null;
  status: "ACTIVE" | "INACTIVE" | undefined;
  relation: string;
  comments: string;
  createdAt: string;
  updatedAt: string;
  visitorTypeId: number;
  visitorType: {
    visitorTypeId: number;
    description: string;
  };
}
interface Values {
  profileUrl: File;
  documentUrl: File;
  name: string;
  rg: string;
  cpf: string;
  phone: string;
  startDate: string;
  endDate: string;
  status: "ACTIVE" | "INACTIVE" | undefined;
  relation: string;
  comments: string;
  type: string;
}

export function VisitorUpdateForm({
  preloadedValues,
  visitor,
  devices,
}: {
  preloadedValues: Values;
  visitor: Visitor;
  devices: Device[];
}) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: preloadedValues,
  });

  const { data: session } = useSession();
  const router = useRouter();

  interface VisitorTypes {
    visitorTypeId: number;
    description: string;
  }

  const [id, setId] = useState("");
  const [deviceList, setDeviceList] = useState<string[]>([]);

  const [visitorType, setVisitorType] = useState<VisitorTypes[]>([]);
  const fetchVisitorTypes = async () => {
    if (session)
      try {
        const response = await api.get("visitor/types");
        setVisitorType(response.data);
      } catch (error) {
        console.error("Erro ao obter dados:", error);
      }
  };

  useEffect(() => {
    fetchVisitorTypes();
  }, [session]);

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
          `visitor/find/${visitor.visitorId}/base64photo`
        );
        return response.data.base64;
      } catch (error) {
        console.error("Erro ao obter dados:", error);
      }
    return "";
  };

  const [removeFile, setRemoveFile] = useState(false);
  const [sendToDevice, setSendToDevice] = useState(false);
  const [isSending, setIsSendind] = useState(false);
  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setIsSendind(true);

    // FAZ O UPLOAD DA FOTO
    let file;
    if (removeFile) {
      file = "";
      if (visitor.profileUrl.length > 0) {
        deleteFile(visitor.profileUrl);
      }
    } else if (data.profileUrl instanceof File && data.profileUrl.size > 0) {
      const timestamp = new Date().toISOString();
      const fileExtension = data.profileUrl.name.split(".").pop();

      const imageFile = await resizeImage(data.profileUrl);

      file = await handleFileUpload(
        imageFile,
        `pessoas/foto-perfil-${timestamp}.${fileExtension}`
      );
    } else if (visitor?.profileUrl) file = visitor.profileUrl;
    else file = "";

    // FAZ O UPLOAD DO DOCUMENTO
    let document;
    if (removeFile) {
      document = "";
      if (visitor.documentUrl && visitor.documentUrl.length > 0) {
        deleteFile(visitor.documentUrl);
      }
    } else if (data.documentUrl instanceof File && data.documentUrl.size > 0) {
      const timestamp = new Date().toISOString();
      const fileExtension = data.documentUrl.name.split(".").pop();
      document = await handleFileUpload(
        data.documentUrl,
        `pessoas/foto-perfil-visita-${timestamp}.${fileExtension}`
      );
    } else if (visitor?.documentUrl) document = visitor.documentUrl;
    else document = "";

    // REGISTRA O visitante
    try {
      const info = {
        profileUrl: file,
        documentUrl: document,
        name: data.name,
        cpf: data.cpf,
        rg: data.rg,
        phone: data.phone,
        visitorTypeId: Number(data.type),
        relation: data.relation,
        comments: data.comments,
        status: data.status,
        startDate: setStringDate(data.startDate),
        endDate: setStringDate(data.endDate),
      };
      await api.put("visitor/" + visitor.visitorId, info);

      if (sendToDevice) {
        if (deviceList.length > 0) {
          const startDateObject = new Date(data.startDate);
          startDateObject.setHours(startDateObject.getHours() - 3);

          const endDateObject = new Date(data.endDate);
          endDateObject.setHours(endDateObject.getHours() - 3);

          const startDateTimestamp = ~~(startDateObject.getTime() / 1000);
          const endDateTimestamp = ~~(endDateObject.getTime() / 1000);

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
                  user_type_id: 1,
                  begin_time: startDateTimestamp,
                  end_time: endDateTimestamp,
                },
                {
                  users: { id: visitor.visitorId + 10000 }, // where
                }
              )
            );
            const timestamp = ~~(Date.now() / 1000);
            await api.post(
              `/control-id/add-command?id=${device}`,
              setUserFaceCommand(visitor.visitorId + 10000, base64, timestamp)
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
          {visitor.profileUrl.length > 0 ? (
            <div className="flex flex-col justify-center items-center">
              <img src={visitor.profileUrl} alt="Foto de perfil" width={80} />
              <p className="mt-2 text-center text-sm">Foto atual</p>
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
            <InputImage
              control={form.control}
              name="profileUrl"
              isFacial={true}
            />

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
          label="Nome completo"
          placeholder="Digite o nome e sobrenome do visitante"
        />

        <DefaultInput
          control={form.control}
          name="cpf"
          label="CPF/CNPJ"
          placeholder="Digite o CPF ou CNPJ do visitante"
        />

        <DefaultInput
          control={form.control}
          name="rg"
          label="RG"
          placeholder="Digite o RG do visitante"
        />

        <MaskInput
          control={form.control}
          mask="(99) 99999-9999"
          name="phone"
          label="Telefone"
          placeholder="Digite o telefone do visitante"
        />

        <RadioInput
          control={form.control}
          name="type"
          label="Tipo de visitante"
          object={visitorType}
          idExtractor={(item) => item.visitorTypeId}
          descriptionExtractor={(item) => item.description}
        />

        <DefaultInput
          control={form.control}
          name="relation"
          label="Relação / Empresa"
          placeholder="Qual é a relação desse visitante com a portaria?"
        />

        <div className="flex justify-center items-center gap-4">
          {visitor.documentUrl && visitor.documentUrl.length > 0 ? (
            <div className="flex flex-col justify-center items-center">
              <img src={visitor.documentUrl} alt="Foto de perfil" width={80} />
              <p className="mt-2 text-center text-sm">Foto atual</p>
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

        <RadioInput
          control={form.control}
          name="status"
          label="Status"
          object={status}
          idExtractor={(item) => item.value}
          descriptionExtractor={(item) => item.label}
        />

        <DefaultTextarea
          control={form.control}
          name="comments"
          label="Observações"
          placeholder="Alguma informação adicional..."
        />

        <div className="flex gap-2">
          <DefaultInput
            control={form.control}
            name="startDate"
            label="Liberado a partir de:"
            type="datetime-local"
            placeholder="Data e hora"
          />
          <DefaultInput
            control={form.control}
            name="endDate"
            label="até:"
            type="datetime-local"
            placeholder="Data e hora"
          />
        </div>
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
