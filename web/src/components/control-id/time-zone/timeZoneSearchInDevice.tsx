import { Button } from "@/components/ui/button";
import { Eye } from "@phosphor-icons/react/dist/ssr";

export function TimeZoneSearchInDevice() {
  return (
    <Button
      className="p-1 text-2xl aspect-square"
      title="Buscar nos dispositivos"
    >
      <Eye />
    </Button>
  );
}
