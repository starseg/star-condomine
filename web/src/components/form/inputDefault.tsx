import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface DefaultInputProps {
  control: any;
  name: string;
  label: string;
  placeholder: string;
  type?: string;
  description?: string;
}

export default function DefaultInput({
  control,
  name,
  label,
  placeholder,
  type = "text",
  description,
}: DefaultInputProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              type={type}
              placeholder={placeholder}
              autoComplete="off"
              {...field}
            />
          </FormControl>
          <FormMessage />
          <FormDescription>{description}</FormDescription>
        </FormItem>
      )}
    />
  );
}
