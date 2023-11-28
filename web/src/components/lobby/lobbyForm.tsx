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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useRouter } from "next/navigation";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import api from "@/lib/axios";
import { useSession } from "next-auth/react";
import { searchCEP } from "@/lib/utils";
import { useState } from "react";
import Swal from "sweetalert2";
import { MaskedInput } from "../maskedInput";

const FormSchema = z.object({
  type: z.string(),
  cnpj: z.string(),
  name: z.string(),
  responsible: z.string(),
  telephone: z.string(),
  schedules: z.string(),
  procedures: z?.string(),
  datasheet: z?.unknown(),
  cep: z.string(),
  state: z.string().max(2),
  city: z.string(),
  neighborhood: z.string(),
  street: z.string(),
  number: z.string(),
  complement: z?.string(),
});

export function LobbyForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const [cep, setCep] = useState("");

  const [uf, setUf] = useState("");
  const [city, setCity] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [street, setStreet] = useState("");

  const handleBlur = async () => {
    const validacep = /^\d{5}-\d{3}$/;
    if (validacep.test(cep)) {
      const address = await searchCEP(cep);
      console.log(address);

      if (!address.erro) {
        if (address.uf != "") setUf(address.uf);
        if (address.localidade != "") setCity(address.localidade);
        if (address.bairro != "") setNeighborhood(address.bairro);
        if (address.logradouro != "") setStreet(address.logradouro);
      } else {
        Swal.fire({
          title: "CEP inválido",
          text: "O CEP informado não existe",
          icon: "warning",
        });
      }
    }
  };

  const { data: session } = useSession();
  const router = useRouter();
  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    console.log(data);
    return;
    try {
      const response = await api.post("lobby", data, {
        headers: {
          Authorization: `Bearer ${session?.token.user.token}`,
        },
      });
      console.log(response.data);
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
                <RadioGroup defaultValue="CONDOMINIUM">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem {...field} value="CONDOMINIUM" id="CONDOMINIUM" />
                    <Label htmlFor="CONDOMINIUM">Condomínio</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem {...field} value="COMPANY" id="COMPANY" />
                    <Label htmlFor="COMPANY">Empresa</Label>
                  </div>
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
                <Input type="file" />
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
                  {...field}
                  value={cep}
                  onChange={(e) => setCep(e.target.value)}
                  onBlur={handleBlur}
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
                  {...field}
                  onChange={(e) => setUf(e.target.value)}
                  value={uf}
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
                  {...field}
                  onChange={(e) => setCity(e.target.value)}
                  value={city}
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
                  {...field}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  value={neighborhood}
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
                  {...field}
                  onChange={(e) => setStreet(e.target.value)}
                  value={street}
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
