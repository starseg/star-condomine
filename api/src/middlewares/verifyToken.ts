import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const secretKey = process.env.SECRET_KEY || "Star512$$*810_LxTae#";

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    res.status(401).json({ error: "Token não fornecido" });
  } else {
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        console.error("Erro na verificação do token:", err.message);
        res.status(401).json({ error: "Token inválido" });
      }
      req.operator = decoded;
      next();
    });
  }
};
