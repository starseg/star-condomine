"use client";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import React from "react";

interface ButtonProps extends React.InputHTMLAttributes<HTMLButtonElement> {}

const BackButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, ...props }, ref) => {
    const router = useRouter();
    function goBack() {
      router.back();
    }
    return (
      <button
        ref={ref}
        className={cn(
          "hover:scale-110 transition ease-in text-stone-50",
          className
        )}
        onClick={goBack}
      >
        <ArrowLeft size={"2.5rem"} />
      </button>
    );
  }
);

export default BackButton;
