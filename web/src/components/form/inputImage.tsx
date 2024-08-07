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
    <div className="flex items-center gap-2 w-full">
      {selectedImage ? (
        <div className="relative">
          <button
            onClick={removeImage}
            className="top-0 right-0 absolute bg-red-500 hover:bg-red-700 p-1 rounded-full text-white"
          >
            <X weight="bold" />
          </button>
          <img
            src={selectedImage}
            alt="Preview"
            className="rounded-md w-16 h-16 object-cover"
          />
        </div>
      ) : (
        <div className="flex justify-center items-center bg-stone-800 p-2 rounded-md w-16 h-16 text-center">
          <p className="text-xs">Sem imagem</p>
        </div>
      )}
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem className="w-full">
            <FormLabel className="flex justify-center items-center gap-4 hover:border-card hover:bg-card-foreground/10 py-4 border border-dashed rounded-lg w-full transition-colors cursor-pointer">
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
