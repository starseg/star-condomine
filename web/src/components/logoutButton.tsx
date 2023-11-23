"use client";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const router = useRouter();
  async function logout() {
    await signOut({
      redirect: false,
    });
    router.replace("/");
  }

  return (
    <Button onClick={logout}>
      <LogOut /> Sair
    </Button>
  );
}
