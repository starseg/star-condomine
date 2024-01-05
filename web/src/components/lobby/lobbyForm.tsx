"use client";

import * as z from "zod";
import Swal from "sweetalert2";
import api from "@/lib/axios";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "@/firebase";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "../ui/textarea";
import { searchCEP } from "@/lib/utils";
import { MaskedInput } from "../maskedInput";

const FormSchema = z.object({
  type: z.enum(["CONDOMINIUM", "COMPANY"]),
  cnpj: z.string().min(18),
  name: z.string().min(5),
  responsible: z.string().min(5),
  telephone: z.string().min(10),
  schedules: z.string().min(3),
  procedures: z.string().optional(),
  cep: z.string().min(9),
  state: z.string().min(2).max(2),
  city: z.string().min(2),
  neighborhood: z.string().min(2),
  street: z.string().min(2),
  number: z.string().min(1),
  complement: z.string().optional(),
  datasheet: z.instanceof(File).optional(),
});

export function LobbyForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      type: "CONDOMINIUM",
      cnpj: "",
      name: "",
      responsible: "",
      telephone: "",
      schedules: "",
      procedures: "",
      cep: "",
      state: "",
      city: "",
      neighborhood: "",
      street: "",
      number: "",
      complement: "",
      datasheet: new File([], ""),
    },
  });

  const handleBlur = async (cep: string) => {
    const validacep = /^\d{5}-\d{3}$/;
    if (validacep.test(cep)) {
      const address = await searchCEP(cep);
      // console.log(address);

      if (!address.erro) {
        if (address.uf != "") form.setValue("state", address.uf);
        if (address.localidade != "") form.setValue("city", address.localidade);
        if (address.bairro != "") form.setValue("neighborhood", address.bairro);
        if (address.logradouro != "")
          form.setValue("street", address.logradouro);
      } else {
        Swal.fire({
          title: "CEP inválido",
          text: "O CEP informado não existe",
          icon: "warning",
        });
      }
    }
  };

  type UploadFunction = (file: File) => Promise<string>;

  // Função para fazer upload de um arquivo para o Firebase Storage
  const uploadFile: UploadFunction = async (file) => {
    initializeApp(firebaseConfig);
    const storage = getStorage();

    const timestamp = new Date().toISOString();
    const fileName = `portarias/ficha-tecnica-${timestamp}.pdf`;

    const fileRef = ref(storage, fileName);

    try {
      await uploadBytes(fileRef, file).then((snapshot) => {
        // console.log("Uploaded file!");
      });
      const downloadURL = await getDownloadURL(fileRef);
      // console.log("Arquivo enviado com sucesso. URL de download:", downloadURL);

      return downloadURL;
    } catch (error) {
      console.error("Erro ao enviar o arquivo:", error);
      throw error;
    }
  };

  const handleFileUpload = async (file: File) => {
    try {
      const url = await uploadFile(file);
      // console.log("URL do arquivo:", url);
      return url;
    } catch (error) {
      console.error("Erro durante o upload:", error);
    }
  };

  const { data: session } = useSession();
  const router = useRouter();
  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    let file;
    if (data.datasheet instanceof File && data.datasheet.size > 0)
      file = await handleFileUpload(data.datasheet);
    else file = "";
    try {
      const info = {
        type: data.type,
        cnpj: data.cnpj,
        name: data.name,
        responsible: data.responsible,
        telephone: data.telephone,
        schedules: data.schedules,
        procedures: data.procedures,
        cep: data.cep,
        state: data.state,
        city: data.city,
        neighborhood: data.neighborhood,
        street: data.street,
        number: data.number,
        complement: data.complement,
        datasheet: file,
      };
      const response = await api.post("lobby", info, {
        headers: {
          Authorization: `Bearer ${session?.token.user.token}`,
        },
      });
      // console.log(response.data);
      router.push("/dashboard");
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
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de portaria</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="CONDOMINIUM" />
                    </FormControl>
                    <FormLabel className="font-normal">Condomínio</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="COMPANY" />
                    </FormControl>
                    <FormLabel className="font-normal">Empresa</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="cnpj"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CNPJ</FormLabel>
              <FormControl>
                <MaskedInput
                  mask="99.999.999/9999-99"
                  placeholder="Digite o CNPJ da empresa"
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Digite o nome da empresa"
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
          name="responsible"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Responsável</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Digite o nome do responsável da empresa"
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
                <MaskedInput
                  mask="(99) 99999-9999"
                  type="text"
                  placeholder="Digite o telefone da empresa"
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
          name="schedules"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Horários</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Quais são os horários do monitoramento?"
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
          name="procedures"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Procedimentos gerais</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Quais são os procedimentos a seguir com essa portaria?"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="datasheet"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ficha técnica</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept=".pdf"
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
          name="cep"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CEP</FormLabel>
              <FormControl>
                <MaskedInput
                  mask="99999-999"
                  type="text"
                  placeholder="Digite o CEP da portaria"
                  autoComplete="off"
                  {...field}
                  onBlur={() => handleBlur(field.value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="state"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estado</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Digite o Estado da portaria"
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
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cidade</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Digite a cidade da portaria"
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
          name="neighborhood"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bairro</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Digite o bairro da portaria"
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
          name="street"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rua</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Digite a rua da portaria"
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
          name="number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Número</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Digite o número da portaria"
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
          name="complement"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Complemento</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Alguma informação adicional do endereço"
                  autoComplete="off"
                  {...field}
                />
              </FormControl>
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
