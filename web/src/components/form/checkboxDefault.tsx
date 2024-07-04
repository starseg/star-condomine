import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "../ui/checkbox";
import clsx from "clsx";

interface DefaultCheckboxProps {
  control: any;
  name: string;
  title?: string;
  label: string;
}

export default function DefaultCheckbox({
  control,
  name,
  title = "",
  label,
}: DefaultCheckboxProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <div className="flex flex-col">
          <FormLabel className={clsx("mb-4", { hidden: title === "" })}>
            {title}
          </FormLabel>
          <FormItem className="flex flex-row items-center space-x-2 space-y-0">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <FormLabel className="font-normal">{label}</FormLabel>
            <FormMessage />
          </FormItem>
        </div>
      )}
    />
  );
}
