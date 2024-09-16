// src/middlewares/permissions.ts
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
var secretKey = process.env.SECRET_KEY || "Star512$$*810_LxTae#";
var verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    res.status(401).json({ error: "Token n\xE3o fornecido" });
  } else {
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        console.error("Erro na verifica\xE7\xE3o do token:", err.message);
        res.status(401).json({ error: "Token inv\xE1lido" });
      } else {
        req.operator = decoded;
        next();
      }
    });
  }
};
var checkAdminPermission = (req, res, next) => {
  const type = req.operator.user.type;
  if (type === "ADMIN") {
    next();
  } else {
    res.status(403).json({ error: "Acesso negado. Permiss\xF5es de ADMIN necess\xE1rias." });
  }
};

export {
  verifyToken,
  checkAdminPermission
};
