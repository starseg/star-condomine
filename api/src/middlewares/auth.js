"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateOperator = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const prisma = new client_1.PrismaClient();
const authenticateOperator = async (req, res) => {
    const { username, password } = req.body;
    try {
        const operator = await prisma.operator.findUniqueOrThrow({
            where: {
                username: username,
                status: "ACTIVE",
            },
        });
        if (!operator) {
            res.status(401).json({ error: "Nome de usuário não encontrado" });
            return;
        }
        else {
            const passwordMatch = await bcrypt_1.default.compare(password, operator.password);
            if (!passwordMatch) {
                res.status(401).json({ error: "Senha incorreta" });
                return;
            }
            const secretKey = process.env.SECRET_KEY || "Star512$$*810_LxTae#";
            const token = jsonwebtoken_1.default.sign({
                user: {
                    id: operator.operatorId,
                    name: operator.name,
                    username: operator.username,
                    type: operator.type,
                },
            }, secretKey, {
                expiresIn: "24h",
            });
            res.status(200).json({ token });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao autenticar o usuário" });
    }
};
exports.authenticateOperator = authenticateOperator;
