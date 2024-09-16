// src/middlewares/auth.ts
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
var prisma = new PrismaClient();
var authenticateOperator = async (req, res) => {
  const { username, password } = req.body;
  try {
    const operator = await prisma.operator.findUniqueOrThrow({
      where: {
        username,
        status: "ACTIVE"
      }
    });
    if (!operator) {
      res.status(401).json({ error: "Nome de usu\xE1rio n\xE3o encontrado" });
      return;
    } else {
      const passwordMatch = await bcrypt.compare(password, operator.password);
      if (!passwordMatch) {
        res.status(401).json({ error: "Senha incorreta" });
        return;
      }
      const secretKey = process.env.SECRET_KEY || "Star512$$*810_LxTae#";
      const token = jwt.sign(
        {
          user: {
            id: operator.operatorId,
            name: operator.name,
            username: operator.username,
            type: operator.type
          }
        },
        secretKey,
        {
          expiresIn: "24h"
        }
      );
      res.status(200).json({ token });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao autenticar o usu\xE1rio" });
  }
};

export {
  authenticateOperator
};
