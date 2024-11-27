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
import { ControllerRenderProps, FieldValues } from "react-hook-form";
import { toast } from "react-toastify";

interface InputImageProps {
  control: any;
  name: string;
  isFacial?: boolean;
}

export default function InputImage({
  control,
  name,
  isFacial = false,
}: InputImageProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (
    e: ChangeEvent<HTMLInputElement>,
    field: ControllerRenderProps<FieldValues, string>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);

      img.onload = () => {
        const { width, height } = img;
        const totalPixels = width * height;

        // Validação para imagens pequenas
        if (isFacial && (width < 160 || height < 160)) {
          toast.error(
            "A resolução da imagem está muito baixa (Mín. 160x160 px)."
          );

          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
          field.onChange(null);
          return;
        }

        // Se a imagem excede o tamanho limite, redimensiona
        if (isFacial && totalPixels > 2073600) {
          const maxWidth = 1920;
          const maxHeight = 1080;

          let newWidth = width;
          let newHeight = height;

          if (width > height) {
            newWidth = maxWidth;
            newHeight = (height * maxWidth) / width;
          } else {
            newHeight = maxHeight;
            newWidth = (width * maxHeight) / height;
          }

          const canvas = document.createElement("canvas");
          canvas.width = newWidth;
          canvas.height = newHeight;

          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0, newWidth, newHeight);

            canvas.toBlob((blob) => {
              if (blob) {
                const resizedFile = new File([blob], file.name, {
                  type: file.type,
                  lastModified: Date.now(),
                });

                // Atualiza a pré-visualização e o nome do arquivo
                setSelectedImage(URL.createObjectURL(resizedFile));
                setFileName(resizedFile.name);

                // Atualiza o estado no React Hook Form
                field.onChange(resizedFile);

                toast.success("Imagem redimensionada automaticamente.");
              }
            }, file.type);
          }
        } else {
          // Caso a imagem esteja no tamanho permitido
          const reader = new FileReader();
          reader.onloadend = () => {
            setSelectedImage(reader.result as string);
            setFileName(file.name);

            // Atualiza o estado no React Hook Form
            field.onChange(file);
          };
          reader.readAsDataURL(file);
        }

        URL.revokeObjectURL(objectUrl);
      };

      img.onerror = () => {
        console.error("Erro ao carregar a imagem.");
        toast.error("Erro ao carregar a imagem.");
        URL.revokeObjectURL(objectUrl);
      };

      img.src = objectUrl;
    }
  };

  const removeImage = (field: ControllerRenderProps<FieldValues, string>) => {
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    field.onChange(null);
  };
  return (
    <div className="flex items-center gap-2 w-full">
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <>
            {console.log(field)}
            <>
              {selectedImage ? (
                <div className="relative">
                  <button
                    onClick={() => removeImage(field)}
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
            </>
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
                  ref={fileInputRef}
                  onChange={(e) => {
                    handleImageChange(e, field);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </>
        )}
      />
    </div>
  );
}
