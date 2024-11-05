import api from "@/lib/axios";
import { Session } from "next-auth";

export const getBase64Photo = async (session: Session | null, memberId: number) => {
  if (session)
    try {
      const response = await api.get(
        `member/find/${memberId}/base64photo`
      );
      return response.data.base64;
    } catch (error) {
      console.error("Erro ao obter dados:", error);
    }
  return "";
};