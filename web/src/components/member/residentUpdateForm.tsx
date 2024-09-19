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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { MaskedInput } from "../maskedInput";
import { useEffect, useState } from "react";
import { PlusCircle, Trash, UserCircle } from "@phosphor-icons/react/dist/ssr";
import { deleteFile, handleFileUpload } from "@/lib/firebase-upload";
import InputImage from "../form/inputImage";
import DefaultInput from "../form/inputDefault";
import MaskInput from "../form/inputMask";
import DefaultCombobox from "../form/comboboxDefault";
import DefaultCheckbox from "../form/checkboxDefault";
import DefaultTextarea from "../form/textareaDefault";
import RadioInput from "../form/inputRadio";
import {
  modifyObjectCommand,
  setUserFaceCommand,
} from "../control-id/device/commands";

const FormSchema = z.object({
  profileUrl: z.instanceof(File),
  documentUrl: z.instanceof(File),
  name: z.string().min(5).trim(),
  cpf: z.string(),
  rg: z.string(),
  email: z.string(),
  telephone: z.string(),
  addressType: z.number(),
  address: z.string().min(1),
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
  addressType: {
    addressTypeId: number;
    description: string;
  };
  address: string;
  accessPeriod: Date;
  telephone: {
    telephoneId: number;
    number: string;
  }[];
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
  email: string;
  addressType: number;
  address: string;
  comments: string;
  faceAccess: boolean;
  biometricAccess: boolean;
  remoteControlAccess: boolean;
  passwordAccess: string;
  telephone: string;
  status: "ACTIVE" | "INACTIVE" | undefined;
}
interface Telephone {
  telephoneId: number;
  number: string;
}
interface item {
  value: number;
  label: string;
}
interface IAddressType {
  addressTypeId: number;
  description: string;
}

export function ResidentUpdateForm({
  preloadedValues,
  member,
  phones,
  devices,
}: {
  preloadedValues: Values;
  member: Member;
  phones: Telephone[];
  devices: Device[];
}) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: preloadedValues,
  });

  let items: item[] = [];

  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);

  const [addressType, setAddressType] = useState([]);
  const [phoneNumber, setPhoneNumber] = useState<string[]>([]);
  let numbers: string[] = [];
  useEffect(() => {
    phones.forEach((phone: Telephone) => {
      if (!numbers.includes(phone.number)) {
        numbers.push(phone.number);
        setPhoneNumber((prev) => [...prev, phone.number]);
      }
    });
  }, []);

  const fetchAddressData = async () => {
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

  useEffect(() => {
    fetchAddressData();
  }, [session]);

  addressType.map((type: IAddressType) =>
    items.push({
      value: type.addressTypeId,
      label: type.description,
    })
  );

  const addTelephone = (value: string) => {
    if (!phoneNumber.includes(value)) {
      setPhoneNumber([...phoneNumber, value]);
    }
    form.setValue("telephone", "");
  };
  const deleteTelephone = (value: string) => {
    setPhoneNumber(phoneNumber.filter((item) => item !== value));
  };

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
      file = await handleFileUpload(
        data.profileUrl,
        `pessoas/foto-perfil-${timestamp}.${fileExtension}`
      );
    } else if (member?.profileUrl) file = member.profileUrl;
    else file = "";

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

    // REGISTRA O MORADOR
    try {
      const info = {
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
        status: data.status,
      };
      const response = await api.put("member/" + params.get("id"), info, {
        headers: {
          Authorization: `Bearer ${session?.token.user.token}`,
        },
      });

      // REGISTRA OS NÚMEROS DE TELEFONE
      try {
        const res = await api.delete("telephone/member/" + params.get("id"), {
          headers: {
            Authorization: `Bearer ${session?.token.user.token}`,
          },
        });

        if (res) {
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
              console.error(
                "(Telefone) Erro ao enviar dados para a API:",
                error
              );
              throw error;
            }
          }
        }

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
      } catch (error) {
        console.error("(Tel) Erro ao enviar dados para a API:", error);
        throw error;
      } finally {
        setIsSendind(false);
      }

      router.back();
    } catch (error) {
      console.error("Erro ao enviar dados para a API:", error);
      throw error;
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
        <DefaultInput
          control={form.control}
          name="passwordAccess"
          label="Senha"
          placeholder="Senha numérica"
        />

        <div className="flex justify-center items-center gap-4">
          {member.documentUrl && member.documentUrl.length > 0 ? (
            <div className="flex flex-col justify-center items-center">
              <img src={member.documentUrl} alt="Foto de perfil" width={80} />
              <p className="mt-2 text-center text-sm">Foto atual</p>
              {/* {member.documentUrl} */}
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
