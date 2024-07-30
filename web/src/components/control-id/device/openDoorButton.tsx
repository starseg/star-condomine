"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";

import api from "@/lib/axios";
import { LockKeyOpen } from "@phosphor-icons/react/dist/ssr";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { openDoorCommand } from "./commands";

export function OpenDoorButton() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const lobby = params.get("id");

  const [devices, setDevices] = useState<Device[]>([]);
  const fetchDevices = async () => {
    if (session)
      try {
        const response = await api.get(`device/lobby/${lobby}`, {
          headers: {
            Authorization: `Bearer ${session?.token.user.token}`,
          },
        });
        setDevices(response.data);
      } catch (error) {
        console.error("Erro ao obter dados:", error);
      }
  };

  useEffect(() => {
    fetchDevices();
  }, [session]);

  async function openDoor(id: string) {
    await api.post(`/control-id/add-command?id=${id}`, openDoorCommand);
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="rounded-full bg-primary p-2 text-stone-950 hover:bg-primary/80 transition-colors">
        <LockKeyOpen size={32} />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Abrir porta</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {devices.map((device) => {
          return (
            <DropdownMenuItem
              key={device.deviceId}
              onClick={() => openDoor(device.name)}
            >
              {device.description}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
