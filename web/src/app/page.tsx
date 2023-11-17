"use client";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
 
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { InputForm } from "@/components/loginForm";

export default function Home() {
  return (
    <main className="dark flex min-h-screen flex-col items-center justify-center p-24 bg-stone-950">
      <h1 className="text-stone-50 text-4xl pb-8">Entrar na plataforma</h1>
      <InputForm/>
    </main>
  );
}
