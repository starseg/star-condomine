import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

interface RadioInputProps {
  control: any;
  name: string;
  label: string;
  object: any[];
  idExtractor: (item: any) => number;
  descriptionExtractor: (item: any) => string;
}

export default function RadioInput({
  control,
  name,
  label,
  object,
  idExtractor,
  descriptionExtractor,
}: RadioInputProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <RadioGroup
            onValueChange={field.onChange}
            defaultValue={field.value}
            className="flex flex-col space-y-1"
          >
            {object.map((item) => {
              const id = idExtractor(item);
              const description = descriptionExtractor(item);
              return (
                <FormItem
                  className="flex items-center space-x-3 space-y-0"
                  key={id}
                >
                  <FormControl>
                    <RadioGroupItem value={id?.toString()} />
                  </FormControl>
                  <FormLabel className="font-normal">{description}</FormLabel>
                </FormItem>
              );
            })}
          </RadioGroup>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
