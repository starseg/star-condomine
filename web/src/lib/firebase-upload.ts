import { firebaseConfig } from "./firebase";
import { initializeApp } from "firebase/app";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

type UploadFunction = (file: File, fileName: string) => Promise<string>;
const uploadFile: UploadFunction = async (file, fileName) => {
  initializeApp(firebaseConfig);
  const storage = getStorage();
  const fileRef = ref(storage, fileName);
  try {
    await uploadBytes(fileRef, file).then((snapshot) => {});
    const downloadURL = await getDownloadURL(fileRef);
    return downloadURL;
  } catch (error) {
    console.error("Erro ao enviar o arquivo:", error);
    throw error;
  }
};

export const handleFileUpload = async (file: File, fileName: string) => {
  try {
    const url = await uploadFile(file, fileName);
    return url;
  } catch (error) {
    console.error("Erro durante o upload:", error);
  }
};
