"use client";
import { FilePlus } from "@phosphor-icons/react/dist/ssr";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Swal from "sweetalert2";

const showPermissionError = () => {
  Swal.fire({
    title: "Operação não permitida",
    text: "Sua permissão de usuário não realizar essa ação.",
    icon: "warning",
  });
};

export default function NewLobbyButton() {
  const { data: session } = useSession();
  if (session?.payload.user.type === "USER") {
    return (
      <button
        className="flex items-center justify-center gap-2 rounded-md text-xl py-4 px-4 bg-stone-900 hover:bg-stone-800 transition-colors"
        onClick={showPermissionError}
      >
        <FilePlus size={32} /> <p>Registrar nova</p>
      </button>
    );
  } else {
    return (
      <Link
        href={"dashboard/new"}
        className="flex items-center justify-center gap-2 rounded-md text-xl py-4 px-4 bg-stone-900 hover:bg-stone-800 transition-colors"
      >
        <FilePlus size={32} /> <p>Registrar nova</p>
      </Link>
    );
  }
}
