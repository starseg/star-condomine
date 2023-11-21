import { Request, Response, NextFunction } from "express";
import { createLogging } from "../controllers/logging";

export const logging = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // Obtém informações relevantes da requisição
  try {
    const { method, url, operator } = req;
    const userAgent = req.get("User-Agent") || "Desconhecido";
    const operatorId = parseInt(operator.operatorId, 10) || 0;

    // Registra as informações no banco de dados
    // await createLogging(method, url, userAgent, operatorId);
    console.log(method, url, userAgent, operatorId);
    // Continue para a próxima middleware ou rota
    next();
  } catch (error) {
    console.error("Erro ao criar o registro de logging:", error);
    res.status(500).json({ error: "Erro ao criar o registro" });
  }
};
