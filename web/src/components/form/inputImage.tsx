"use client";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { X } from "@phosphor-icons/react/dist/ssr";
import { FolderCheck, Upload } from "lucide-react";
import { ChangeEvent, useRef, useState } from "react";

interface InputImageProps {
  control: any;
  name: string;
}

export default function InputImage({ control, name }: InputImageProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileName(file.name);

      const reader = new FileReader();

      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };

      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  return (
    <div className="w-full flex gap-2 items-center">
      {selectedImage ? (
        <div className="relative">
          <button
            onClick={removeImage}
            className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full hover:bg-red-700"
          >
            <X weight="bold" />
          </button>
          <img
            src={selectedImage}
            alt="Preview"
            className="w-16 h-16 object-cover rounded-md"
          />
        </div>
      ) : (
        <div className="w-16 h-16 bg-stone-800 flex items-center justify-center text-center rounded-md p-2">
          <p className="text-xs">Nenhuma imagem selecionada</p>
        </div>
      )}
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem className="w-full">
            <FormLabel className="w-full items-center justify-center flex gap-4 border border-dashed rounded-lg py-4 cursor-pointer transition-colors hover:bg-card-foreground/10 hover:border-card">
              {selectedImage ? (
                <>
                  <FolderCheck />
                  <p>
                    Imagem selecionada{" "}
                    <span className="text-xs">({fileName})</span>
                  </p>
                </>
              ) : (
                <>
                  <Upload />
                  <p>Selecione uma imagem</p>
                </>
              )}
            </FormLabel>
            <FormControl>
              <Input
                className="hidden"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  field.onChange(e.target.files ? e.target.files[0] : null);
                  handleImageChange(e);
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
