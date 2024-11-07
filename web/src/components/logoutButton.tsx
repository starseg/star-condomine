"use client";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import api from "@/lib/axios";

export default function LogoutButton() {
  const router = useRouter();
  async function logout() {
    await signOut({
      redirect: false,
    });
    api.clearSessionCache();
    router.replace("/");
  }

  return (
    <button onClick={logout} className="flex justify-center items-center gap-2">
      <LogOut /> Sair
    </button>
  );
}
