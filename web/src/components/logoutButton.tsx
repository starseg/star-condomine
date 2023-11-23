"use client";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
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
    <button onClick={logout} className="flex items-center justify-center gap-2">
      <LogOut /> Sair
    </button>
  );
}
