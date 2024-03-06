"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVisitorTypes = exports.createVisitor = exports.getAddressTypes = exports.createTelephone = exports.createMember = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createMember = async (req, res) => {
    try {
        const { type, profileUrl, name, rg, cpf, email, comments, faceAccess, biometricAccess, remoteControlAccess, passwordAccess, address, addressTypeId, accessPeriod, position, lobbyId, } = req.body;
        const member = await prisma.member.create({
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
const createTelephone = async (req, res) => {
    try {
        const { number, memberId } = req.body;
        const telephone = await prisma.telephone.create({
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
        const address = await prisma.addressType.findMany();
        res.json(address);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao buscar os tipos de endereço" });
    }
};
exports.getAddressTypes = getAddressTypes;
const createVisitor = async (req, res) => {
    try {
        const { profileUrl, name, rg, cpf, phone, startDate, endDate, relation, visitorTypeId, lobbyId, } = req.body;
        const visitor = await prisma.visitor.create({
            data: {
                profileUrl,
                name,
                rg,
                cpf,
                phone,
                startDate,
                endDate,
                relation,
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
        const types = await prisma.visitorType.findMany();
        res.json(types);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao buscar os tipos" });
    }
};
exports.getVisitorTypes = getVisitorTypes;
