import api from "@/lib/axios";
import { Session } from "next-auth";

export const getVisitorBase64Photo = async (session: Session | null, visitorId: number) => {
  if (session)
    try {
      const response = await api.get(
        `visitor/find/${visitorId}/base64photo`,
        {
          headers: {
            Authorization: `Bearer ${session?.token.user.token}`,
          },
        }
      );
      return response.data.base64;
    } catch (error) {
      console.error("Erro ao obter dados:", error);
    }
  return "";
};