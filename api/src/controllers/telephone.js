"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePhonesByMember = exports.getTelephonesByMember = exports.deleteTelephone = exports.createTelephone = exports.getTelephone = exports.getAllTelephones = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getAllTelephones = async (req, res) => {
    try {
        const telephone = await prisma.telephone.findMany();
        res.json(telephone);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao buscar os telefones" });
    }
};
exports.getAllTelephones = getAllTelephones;
const getTelephone = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const telephone = await prisma.telephone.findUniqueOrThrow({
            where: { telephoneId: id },
        });
        if (!telephone) {
            res.status(404).json({ error: "Telefone não encontrado" });
            return;
        }
        res.json(telephone);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao buscar o telefone" });
    }
};
exports.getTelephone = getTelephone;
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
const deleteTelephone = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        await prisma.telephone.delete({
            where: { telephoneId: id },
        });
        res.json({ message: "Telefone excluído com sucesso" });
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao excluir o telefone" });
    }
};
exports.deleteTelephone = deleteTelephone;
const getTelephonesByMember = async (req, res) => {
    try {
        const telephone = await prisma.telephone.findMany({
            where: {
                memberId: parseInt(req.params.id, 10),
            },
        });
        res.json(telephone);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao buscar os telefones" });
    }
};
exports.getTelephonesByMember = getTelephonesByMember;
const deletePhonesByMember = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        await prisma.telephone.deleteMany({
            where: { memberId: id },
        });
        res.json({ message: "Telefones excluídos com sucesso" });
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao excluir os telefones" });
    }
};
exports.deletePhonesByMember = deletePhonesByMember;
