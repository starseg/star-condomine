import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import api from "@/lib/axios";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Button } from "../ui/button";

export default function CopyMemberToOtherLobby({ member }: { member: Member }) {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [selectedLobbyName, setSelectedLobbyName] = useState("");
  const [lobbies, setLobbies] = useState<Lobby[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (session)
        try {
          const response = await api.get("lobby");
          setLobbies(response.data);
        } catch (error) {
          console.error("Erro ao obter dados:", error);
        }
    };
    fetchData();
  }, [session]);

  async function sendData() {
    if (!value) {
      toast.error("Nenhuma portaria selecionada");
      return;
    }
    const info = {
      lobbyId: Number(value),
      type: member.type,
      profileUrl: member.profileUrl,
      documentUrl: member.documentUrl,
      name: member.name,
      rg: member.rg,
      cpf: member.cpf,
      email: member.email,
      comments: member.comments,
      status: member.status,
      faceAccess: member.faceAccess,
      biometricAccess: member.biometricAccess,
      remoteControlAccess: member.remoteControlAccess,
      passwordAccess: member.passwordAccess,
      address: member.address,
      addressTypeId: member.addressTypeId,
      accessPeriod: member.accessPeriod,
      position: member.position,
    };
    try {
      const newMember = await api.post("member", info);
      const telephones = member.telephone.map((telephone) => telephone.number);
      telephones.forEach(async (tel) => {
        const data = {
          number: tel,
          memberId: newMember.data.memberId,
        };
        await api.post("telephone", data);
      });
      setValue("");
      setSelectedLobbyName("");
      toast.success("Dados enviados!");
    } catch (error) {
      console.error("Erro ao enviar dados para a API:", error);
      throw error;
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          Copiar
          <span className="mx-1 font-semibold capitalize">
            {member.name.split(" ")[0].toLocaleLowerCase()}
          </span>
          para outra portaria
        </Button>
      </DialogTrigger>
      <DialogContent className="space-y-2">
        <DialogHeader>
          <DialogTitle>
            Selecione para qual portaria você deseja enviar
          </DialogTitle>
          <DialogDescription>
            Este usuário será duplicado para a portaria selecionada.
          </DialogDescription>
        </DialogHeader>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="justify-between"
            >
              {value
                ? lobbies.find((lobby) => lobby.lobbyId.toString() === value)
                    ?.name
                : "Selecione a portaria..."}
              <ChevronsUpDown className="opacity-50 ml-2 w-4 h-4 shrink-0" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0">
            <Command>
              <CommandInput placeholder="Buscar portaria..." />
              <CommandList>
                <CommandEmpty>Nenhuma portaria encontrada.</CommandEmpty>
                <CommandGroup>
                  {lobbies.map((lobby) => {
                    if (lobby.lobbyId !== member.lobbyId)
                      return (
                        <CommandItem
                          key={lobby.lobbyId}
                          value={lobby.lobbyId.toString()}
                          onSelect={(currentValue) => {
                            setValue(
                              currentValue === value ? "" : currentValue
                            );
                            setSelectedLobbyName(
                              currentValue === value ? "" : lobby.name
                            );
                            setOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              value === lobby.lobbyId.toString()
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {lobby.name}
                        </CommandItem>
                      );
                  })}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        <p>
          {member.name} - {member.cpf ? member.cpf : member.rg} <br />
          {selectedLobbyName &&
            `será cadastrado(a) na portaria ${selectedLobbyName}`}
        </p>
        <Button onClick={sendData}>Enviar dados</Button>
      </DialogContent>
    </Dialog>
  );
}
