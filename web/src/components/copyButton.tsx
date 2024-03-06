"use client";
import { useState } from "react";
import { Button } from "./ui/button";
import { Share } from "@phosphor-icons/react/dist/ssr";

const CopyButton: React.FC<{ text: string }> = ({ text }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500); // Reset copied state after 1.5 seconds
      })
      .catch((err) => console.error("Failed to copy text:", err));
  };

  return (
    <Button
      className="flex gap-2 text-xl items-center"
      onClick={copyToClipboard}
    >
      <Share size={24} />
      {copied ? "Copiado!" : "Copiar link"}
    </Button>
  );
};

export default CopyButton;
