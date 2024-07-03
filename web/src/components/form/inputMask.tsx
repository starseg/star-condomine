import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { MaskedInput } from "../maskedInput";

interface MaskInputProps {
  control: any;
  name: string;
  label: string;
  placeholder: string;
  mask: string;
  type?: string;
}

export default function MaskInput({
  control,
  name,
  label,
  mask,
  placeholder,
  type = "text",
}: MaskInputProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <MaskedInput
              mask={mask}
              type={type}
              placeholder={placeholder}
              autoComplete="off"
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
