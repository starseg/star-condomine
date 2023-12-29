import { Request, Response, NextFunction } from "express";
import { createLogging } from "../controllers/logging";

export const logging = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { method, url, headers, operator } = req;
    const userAgent = headers["user-agent"] || "Desconhecido";
    const operatorId = operator.user.id;

    // Registra as informações no banco de dados
    if (method !== "GET" && !url.startsWith("/log"))
      await createLogging(method, url, userAgent, operatorId);
    console.log(method, url, operatorId);

    // Continue para a próxima middleware ou rota
    next();
  } catch (error) {
    console.error("Erro ao criar o registro de logging:", error);
    res.status(500).json({ error: "Erro ao criar o registro" });
  }
};
