"use client";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FolderCheck, Upload } from "lucide-react";
import { ChangeEvent, useState } from "react";

interface InputFileProps {
  control: any;
  name: string;
  complement?: string;
  description?: string;
}

export default function InputFile({
  control,
  name,
  description,
  complement,
}: InputFileProps) {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileName(file.name);

      const reader = new FileReader();

      reader.onloadend = () => {
        setSelectedFile(reader.result as string);
      };

      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full flex items-center">
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem className="w-full">
            <FormLabel className="w-full items-center justify-center flex gap-4 border border-dashed rounded-lg py-4 px-4 cursor-pointer transition-colors hover:bg-card-foreground/10 hover:border-card">
              {selectedFile ? (
                <>
                  <FolderCheck />
                  <p>
                    Arquivo selecionado{" "}
                    <span className="text-xs">({fileName})</span>
                  </p>
                </>
              ) : (
                <>
                  <Upload />
                  <p>Selecione um arquivo {complement}</p>
                </>
              )}
            </FormLabel>
            <FormControl>
              <Input
                className="hidden"
                type="file"
                onChange={(e) => {
                  field.onChange(e.target.files ? e.target.files[0] : null);
                  handleFileChange(e);
                }}
              />
            </FormControl>
            <FormMessage />
            <FormDescription>{description}</FormDescription>
          </FormItem>
        )}
      />
    </div>
  );
}
