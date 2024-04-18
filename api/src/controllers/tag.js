"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTagsByMember = exports.getTagTypes = exports.deleteTag = exports.createTag = exports.getTag = exports.getAllTags = void 0;
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
const createTag = async (req, res) => {
    try {
        const { value, tagTypeId, memberId } = req.body;
        const tag = await db_1.default.tag.create({
            data: { value, tagTypeId, memberId },
        });
        res.status(201).json(tag);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao criar a tag" });
    }
};
exports.createTag = createTag;
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
