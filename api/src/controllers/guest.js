"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLobby = exports.getVisitorTypes = exports.createVisitor = exports.getAddressTypes = exports.createTelephone = exports.createMember = void 0;
const db_1 = __importDefault(require("../db"));
const createMember = async (req, res) => {
    try {
        const { type, profileUrl, documentUrl, name, rg, cpf, email, comments, faceAccess, biometricAccess, remoteControlAccess, passwordAccess, address, addressTypeId, accessPeriod, position, lobbyId, } = req.body;
        const member = await db_1.default.member.create({
            data: {
                type,
                profileUrl,
                documentUrl,
                name,
                rg,
                cpf,
                email,
                comments,
                faceAccess,
                biometricAccess,
                remoteControlAccess,
                passwordAccess,
                address,
                addressTypeId,
                accessPeriod,
                position,
                lobbyId,
            },
        });
        res.status(201).json(member);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao criar o membro" });
    }
};
exports.createMember = createMember;
const createTelephone = async (req, res) => {
    try {
        const { number, memberId } = req.body;
        const telephone = await db_1.default.telephone.create({
            data: { number, memberId },
        });
        res.status(201).json(telephone);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao criar o telefone" });
    }
};
exports.createTelephone = createTelephone;
const getAddressTypes = async (req, res) => {
    try {
        const address = await db_1.default.addressType.findMany();
        res.json(address);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao buscar os tipos de endereço" });
    }
};
exports.getAddressTypes = getAddressTypes;
const createVisitor = async (req, res) => {
    try {
        const { profileUrl, documentUrl, name, rg, cpf, phone, startDate, endDate, relation, comments, status, visitorTypeId, lobbyId, } = req.body;
        const visitor = await db_1.default.visitor.create({
            data: {
                profileUrl,
                documentUrl,
                name,
                rg,
                cpf,
                phone,
                startDate,
                endDate,
                relation,
                comments,
                status,
                visitorTypeId,
                lobbyId,
            },
        });
        res.status(201).json(visitor);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao criar o visitante" });
    }
};
exports.createVisitor = createVisitor;
const getVisitorTypes = async (req, res) => {
    try {
        const types = await db_1.default.visitorType.findMany();
        res.json(types);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao buscar os tipos" });
    }
};
exports.getVisitorTypes = getVisitorTypes;
const getLobby = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const lobby = await db_1.default.lobby.findUniqueOrThrow({
            where: { lobbyId: id },
            select: {
                code: true,
            },
        });
        if (!lobby.code) {
            res.status(404).json({ error: "Portaria não encontrada" });
            return;
        }
        const key1 = Number(process.env.LOBBY_CODE_KEY_1);
        const key2 = Number(process.env.LOBBY_CODE_KEY_2);
        const result = lobby.code * key1 - key2;
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao buscar a portaria" });
    }
};
exports.getLobby = getLobby;
