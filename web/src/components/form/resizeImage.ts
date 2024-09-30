export async function resizeImage(file: File): Promise<File> {
  const MAX_WIDTH = 1920; // Largura máxima permitida
  const MAX_HEIGHT = 1080; // Altura máxima permitida

  // Cria um elemento de imagem a partir do arquivo
  const img = new Image();
  const reader = new FileReader();

  return new Promise((resolve, reject) => {
    reader.onload = (event) => {
      img.src = event.target?.result as string;
    };

    img.onload = () => {
      // Define a nova largura e altura mantendo a proporção
      let width = img.width;
      let height = img.height;

      if (width > MAX_WIDTH || height > MAX_HEIGHT) {
        const widthRatio = MAX_WIDTH / width;
        const heightRatio = MAX_HEIGHT / height;
        const ratio = Math.min(widthRatio, heightRatio);

        width = width * ratio;
        height = height * ratio;
      }

      // Cria um canvas para redimensionar a imagem
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        return reject(new Error("Falha ao obter o contexto do canvas"));
      }

      ctx.drawImage(img, 0, 0, width, height);

      // Converte o canvas de volta para um arquivo de imagem
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const resizedFile = new File([blob], file.name, {
              type: file.type,
            });
            resolve(resizedFile);
          } else {
            reject(new Error("Falha ao redimensionar a imagem"));
          }
        },
        file.type,
        0.9 // Qualidade da imagem (0 a 1)
      );
    };

    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}
