"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import api from "@/lib/axios";
import { useSearchParams } from "next/navigation";
import { decrypt } from "@/lib/crypto";
import { EmployeeForm } from "../components/employeeForm";

export default function GuestNewEmployee() {
  const [code, setCode] = useState("");
  const [auth, setAuth] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [lobbyCode, setLobbyCode] = useState(0);
  const [error, setError] = useState("");

  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());
  const lobby = params.get("lobby") || "";
  const lobbyId = decrypt(lobby);

  const authenticate = (code: string) => {
    setIsValidating(true);
    if (lobbyCode === Number(code)) {
      setAuth(true);
    } else {
      setError("Código inválido.");
    }
    setIsValidating(false);
  };
  const fetchLobbyCode = async () => {
    const key1 = Number(process.env.NEXT_PUBLIC_LOBBY_CODE_KEY_1);
    const key2 = Number(process.env.NEXT_PUBLIC_LOBBY_CODE_KEY_2);
    try {
      const response = await api.get(`guest/lobby/${lobbyId}`);
      const code = (Number(response.data) + key2) / key1;
      setLobbyCode(code);
    } catch (error) {
      console.error("Erro ao obter dados:", error);
    }
  };
  useEffect(() => {
    fetchLobbyCode();
  }, []);
  return (
    <>
      <section className="flex flex-col justify-center items-center mb-12">
        <Image
          src="/portaria-online.png"
          alt="Robozinho da portaria online da starseg"
          width={278}
          height={224}
          priority={true}
          className="my-4"
        />
        <h1 className="text-2xl mt-2 mb-4 px-4 text-center">
          Cadastre-se no sistema de portarias da Star Seg
        </h1>

        {auth ? (
          <EmployeeForm />
        ) : (
          <Card className="w-[350px] flex flex-col items-center justify-center">
            <CardHeader>
              <CardDescription className="text-center">
                Para continuar, insira o código de segurança que foi informado
                pela empresa.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="name">Código</Label>
                  <InputOTP
                    maxLength={6}
                    value={code}
                    onChange={(value) => setCode(value)}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <Button
                className="text-lg"
                onClick={() => authenticate(code)}
                disabled={isValidating || code.length < 6}
              >
                {isValidating ? "Verificando..." : "Verificar"}
              </Button>
              <span className="font-semibold text-red-400">{error}</span>
            </CardFooter>
          </Card>
        )}
      </section>
    </>
  );
}
