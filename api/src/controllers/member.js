"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTagsByMember = exports.countMembers = exports.getFilteredMembers = exports.getAddressTypes = exports.deleteMember = exports.updateMember = exports.createMember = exports.getMember = exports.getMembersByLobby = exports.getAllMembers = void 0;
const db_1 = __importDefault(require("../db"));
const getAllMembers = async (req, res) => {
    try {
        const member = await db_1.default.member.findMany();
        res.json(member);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao buscar os membros" });
    }
};
exports.getAllMembers = getAllMembers;
const getMembersByLobby = async (req, res) => {
    try {
        const lobby = parseInt(req.params.lobby, 10);
        const member = await db_1.default.member.findMany({
            where: { lobbyId: lobby },
            include: {
                addressType: true,
                telephone: true,
            },
            orderBy: [{ status: "asc" }, { name: "asc" }],
        });
        if (!member) {
            res.status(404).json({ error: "Nenhum membro não encontrado" });
            return;
        }
        res.json(member);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao buscar os membros" });
    }
};
exports.getMembersByLobby = getMembersByLobby;
const getMember = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const member = await db_1.default.member.findUniqueOrThrow({
            where: { memberId: id },
            include: {
                addressType: true,
                telephone: true,
                access: {
                    include: { visitor: { select: { name: true } } },
                },
                scheduling: {
                    include: { visitor: { select: { name: true } } },
                },
            },
        });
        if (!member) {
            res.status(404).json({ error: "Membro não encontrado" });
            return;
        }
        res.json(member);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao buscar o membro" });
    }
};
exports.getMember = getMember;
const createMember = async (req, res) => {
    try {
        const { type, profileUrl, name, rg, cpf, email, comments, faceAccess, biometricAccess, remoteControlAccess, passwordAccess, address, addressTypeId, accessPeriod, position, lobbyId, } = req.body;
        const member = await db_1.default.member.create({
            data: {
                type,
                profileUrl,
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
const updateMember = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const { type, profileUrl, name, rg, cpf, email, comments, status, faceAccess, biometricAccess, remoteControlAccess, passwordAccess, address, addressTypeId, accessPeriod, position, lobbyId, } = req.body;
        const member = await db_1.default.member.update({
            where: { memberId: id },
            data: {
                type,
                profileUrl,
                name,
                rg,
                cpf,
                email,
                comments,
                status,
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
        res.status(200).json(member);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao atualizar o membro" });
    }
};
exports.updateMember = updateMember;
const deleteMember = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        await db_1.default.member.delete({
            where: { memberId: id },
        });
        res.json({ message: "Membro excluído com sucesso" });
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao excluir o membro" });
    }
};
exports.deleteMember = deleteMember;
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
const getFilteredMembers = async (req, res) => {
    try {
        const lobby = parseInt(req.params.lobby, 10);
        const { query } = req.query;
        const whereCondition = query
            ? {
                OR: [
                    { cpf: { contains: query } },
                    { rg: { contains: query } },
                    { name: { contains: query } },
                    { address: { contains: query } },
                ],
                AND: { lobbyId: lobby },
            }
            : {};
        const member = await db_1.default.member.findMany({
            where: whereCondition,
            include: {
                addressType: true,
                telephone: true,
            },
        });
        if (!member) {
            res.status(404).json({ error: "Nenhum membro encontrado" });
            return;
        }
        res.json(member);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao buscar os membros" });
    }
};
exports.getFilteredMembers = getFilteredMembers;
const countMembers = async (req, res) => {
    try {
        const lobby = parseInt(req.params.lobby, 10);
        const { query } = req.query;
        const whereCondition = query
            ? {
                OR: [
                    { cpf: { contains: query } },
                    { name: { contains: query } },
                    { address: { contains: query } },
                ],
                AND: { lobbyId: lobby },
            }
            : {};
        const member = await db_1.default.member.count({
            where: whereCondition,
        });
        res.json(member);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao buscar os membros" });
    }
};
exports.countMembers = countMembers;
const getTagsByMember = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const member = await db_1.default.member.findUniqueOrThrow({
            where: { memberId: id },
            include: {
                tag: true,
            },
        });
        res.json(member);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao buscar as tags" });
    }
};
exports.getTagsByMember = getTagsByMember;
