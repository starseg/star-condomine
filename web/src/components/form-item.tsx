import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "./ui/checkbox";

interface InputItemProps {
  control: any;
  name: string;
  label: string;
  placeholder: string;
  type?: string;
}

interface CheckboxItemProps {
  control: any;
  name: string;
  label: string;
}

export function InputItem({
  control,
  name,
  label,
  placeholder,
  type = "text",
}: InputItemProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input type={type} placeholder={placeholder} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export function CheckboxItem({ control, name, label }: CheckboxItemProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-row items-center space-x-2 space-y-0">
          <FormControl>
            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
          </FormControl>
          <FormLabel className="font-normal">{label}</FormLabel>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
