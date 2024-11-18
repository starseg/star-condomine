import * as React from "react";
import { cn } from "@/lib/utils";
import InputMask from "react-input-mask";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  mask: string;
}

export const MaskedInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, mask, ...props }, ref) => {
    return (
      <InputMask mask={mask} {...props}>
        {(inputProps) => (
          <input
            ref={ref}
            type={type}
            className={cn(
              "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-stone-50",
              className
            )}
            {...inputProps} // Passe as propriedades de input para o <input />
          />
        )}
      </InputMask>
    );
  }
);

MaskedInput.displayName = "MaskedInput"; // Adicionei isso para garantir um nome legível no React DevTools.
