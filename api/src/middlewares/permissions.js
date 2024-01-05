"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAdminPermission = exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const secretKey = process.env.SECRET_KEY || "Star512$$*810_LxTae#";
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        res.status(401).json({ error: "Token não fornecido" });
    }
    else {
        jsonwebtoken_1.default.verify(token, secretKey, (err, decoded) => {
            if (err) {
                console.error("Erro na verificação do token:", err.message);
                res.status(401).json({ error: "Token inválido" });
            }
            else {
                req.operator = decoded;
                next();
            }
        });
    }
};
exports.verifyToken = verifyToken;
const checkAdminPermission = (req, res, next) => {
    const type = req.operator.user.type;
    // console.log("TIPO DO USUÁRIO: ", type);
    if (type === "ADMIN") {
        next();
    }
    else {
        res
            .status(403)
            .json({ error: "Acesso negado. Permissões de ADMIN necessárias." });
    }
};
exports.checkAdminPermission = checkAdminPermission;
