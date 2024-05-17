"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTagsByLobby = exports.deleteTagsByMember = exports.getTagTypes = exports.deleteTag = exports.updateTag = exports.createTag = exports.getTagsByMember = exports.getTag = exports.getAllTags = void 0;
const db_1 = __importDefault(require("../db"));
const getAllTags = async (req, res) => {
    try {
        const tag = await db_1.default.tag.findMany();
        res.json(tag);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao buscar as tags" });
    }
};
exports.getAllTags = getAllTags;
const getTag = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const tag = await db_1.default.tag.findUniqueOrThrow({
            where: { tagId: id },
        });
        if (!tag) {
            res.status(404).json({ error: "Tag não encontrada" });
            return;
        }
        res.json(tag);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao buscar a tag" });
    }
};
exports.getTag = getTag;
const getTagsByMember = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const tags = await db_1.default.tag.findMany({
            where: { memberId: id },
            include: {
                type: { select: { description: true } },
                member: { select: { name: true } },
            },
            orderBy: [{ status: "asc" }],
        });
        if (!tags) {
            res.status(404).json({ error: "Tags não encontradas" });
            return;
        }
        res.json(tags);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao buscar as tags" });
    }
};
exports.getTagsByMember = getTagsByMember;
const createTag = async (req, res) => {
    try {
        const { value, comments, tagTypeId, memberId } = req.body;
        const tag = await db_1.default.tag.create({
            data: { value, comments, tagTypeId, memberId },
        });
        res.status(201).json(tag);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao criar a tag" });
    }
};
exports.createTag = createTag;
const updateTag = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const { value, tagTypeId, comments, status, memberId } = req.body;
        const tag = await db_1.default.tag.update({
            where: { tagId: id },
            data: { value, tagTypeId, comments, status, memberId },
        });
        res.status(201).json(tag);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao criar a tag" });
    }
};
exports.updateTag = updateTag;
const deleteTag = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        await db_1.default.tag.delete({
            where: { tagId: id },
        });
        res.json({ message: "Tag excluída com sucesso" });
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao excluir a tag" });
    }
};
exports.deleteTag = deleteTag;
const getTagTypes = async (req, res) => {
    try {
        const tag = await db_1.default.tagType.findMany();
        if (!tag) {
            res.status(404).json({ error: "Tipos não encontrados" });
            return;
        }
        res.json(tag);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao buscar os tipos" });
    }
};
exports.getTagTypes = getTagTypes;
const deleteTagsByMember = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        await db_1.default.tag.deleteMany({
            where: { memberId: id },
        });
        res.json({ message: "Tags excluídas com sucesso" });
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao excluir as tags" });
    }
};
exports.deleteTagsByMember = deleteTagsByMember;
const getTagsByLobby = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const tags = await db_1.default.tag.findMany({
            include: {
                type: { select: { description: true } },
                member: { select: { rg: true, cpf: true, name: true } },
            },
            where: {
                member: {
                    lobbyId: id,
                },
            },
            orderBy: [{ status: "asc" }, { member: { name: "asc" } }],
        });
        if (!tags) {
            res.status(404).json({ error: "Tags não encontradas" });
            return;
        }
        res.json(tags);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao buscar as tags" });
    }
};
exports.getTagsByLobby = getTagsByLobby;
