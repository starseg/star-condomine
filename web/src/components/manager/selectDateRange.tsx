import { Funnel } from "@phosphor-icons/react/dist/ssr";
import { ManagerDatePicker } from "./managerDatePicker";

export function SelectDateRange() {
  return (
    <div className="right-4 bottom-4 z-50 fixed border-white bg-stone-800 p-4 border rounded-xl">
      <p className="flex items-center gap-2 text-lg">
        <Funnel size={24} weight="duotone" /> Filtrar gráficos por data
      </p>
      <ManagerDatePicker />
    </div>
  );
}
