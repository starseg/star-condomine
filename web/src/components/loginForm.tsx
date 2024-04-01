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
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { InputPassword } from "./input-password";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import Image from "next/image";

const FormSchema = z.object({
  username: z
    .string()
    .min(5, {
      message: "O nome deve ter no mínimo 5 caracteres",
    })
    .max(24),
  password: z
    .string()
    .min(8, {
      message: "A senha deve ter no mínimo 8 caracteres",
    })
    .max(24),
});

export function LoginForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    const result = await signIn("credentials", {
      username: data.username,
      password: data.password,
      redirect: false,
    });
    if (result?.error) {
      if (result.error == "CredentialsSignin") {
        setError("Login incorreto");
      } else if (result.error == "Request failed with status code 500") {
        setError("Usuário não encontrado ou inativo");
      } else {
        // console.log(result.error);
      }
      return;
    }
    router.replace("/dashboard");
  };

  return (
    <Card className="w-[300px] md:w-[400px] border-yellow-600">
      <CardHeader className="flex flex-col items-center mt-2">
        <Image
          src="/logo.svg"
          alt="Logo Star Condomine"
          width={276}
          height={37}
          priority={true}
        />
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent>
            <div className="grid w-full items-center gap-2">
              <div className="flex flex-col space-y-1.5">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Usuário</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Digite seu nome de usuário"
                          autoComplete="off"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Senha</FormLabel>
                      <FormControl>
                        <InputPassword
                          placeholder="Digite sua senha"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              Entrar
            </Button>
            {error && (
              <div className="w-full border border-red-500 text-red-500 p-2 rounded-md text-center text-sm">
                {error}
              </div>
            )}
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
