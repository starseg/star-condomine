import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";

interface TokenInputProps {
  control: any;
  name: string;
  label: string;
  size: number;
}

export default function TokenInput({
  control,
  name,
  label,
  size,
}: TokenInputProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <InputOTP maxLength={size} {...field}>
              <InputOTPGroup>
                {Array.from({ length: size }, (_, index) => (
                  <InputOTPSlot key={index} index={index} />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
