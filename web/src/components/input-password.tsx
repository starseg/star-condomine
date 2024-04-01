import { useState } from "react";
import * as React from "react";
import { cn } from "../lib/utils";
import { Eye, EyeClosed } from "@phosphor-icons/react/dist/ssr";
import { Button } from "./ui/button";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const InputPassword = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };
    return (
      <div className="flex gap-2">
        <input
          type={showPassword ? "text" : "password"}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          ref={ref}
          {...props}
        />
        <Button
          type="button"
          variant={"outline"}
          className="aspect-square p-0"
          onClick={togglePasswordVisibility}
        >
          {showPassword ? <EyeClosed size={18} /> : <Eye size={18} />}
        </Button>
      </div>
    );
  }
);
InputPassword.displayName = "InputPassword";

export { InputPassword };
