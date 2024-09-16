import {
  db_default
} from "./chunk-BXWGZ4DM.mjs";

// src/controllers/tag.ts
var getAllTags = async (req, res) => {
  try {
    const tag = await db_default.tag.findMany();
    res.json(tag);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar as tags" });
  }
};
var getTag = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const tag = await db_default.tag.findUniqueOrThrow({
      where: { tagId: id }
    });
    if (!tag) {
      res.status(404).json({ error: "Tag n\xE3o encontrada" });
      return;
    }
    res.json(tag);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar a tag" });
  }
};
var getTagsByMember = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const tags = await db_default.tag.findMany({
      where: { memberId: id },
      include: {
        type: { select: { description: true } },
        member: { select: { name: true } }
      },
      orderBy: [{ status: "asc" }]
    });
    if (!tags) {
      res.status(404).json({ error: "Tags n\xE3o encontradas" });
      return;
    }
    res.json(tags);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar as tags" });
  }
};
var createTag = async (req, res) => {
  try {
    const { value, comments, tagTypeId, memberId } = req.body;
    const tag = await db_default.tag.create({
      data: { value, comments, tagTypeId, memberId }
    });
    res.status(201).json(tag);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar a tag" });
  }
};
var updateTag = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { value, tagTypeId, comments, status, memberId } = req.body;
    const tag = await db_default.tag.update({
      where: { tagId: id },
      data: { value, tagTypeId, comments, status, memberId }
    });
    res.status(201).json(tag);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar a tag" });
  }
};
var deleteTag = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    await db_default.tag.delete({
      where: { tagId: id }
    });
    res.json({ message: "Tag exclu\xEDda com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao excluir a tag" });
  }
};
var getTagTypes = async (req, res) => {
  try {
    const tag = await db_default.tagType.findMany();
    if (!tag) {
      res.status(404).json({ error: "Tipos n\xE3o encontrados" });
      return;
    }
    res.json(tag);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar os tipos" });
  }
};
var deleteTagsByMember = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    await db_default.tag.deleteMany({
      where: { memberId: id }
    });
    res.json({ message: "Tags exclu\xEDdas com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao excluir as tags" });
  }
};
var getTagsByLobby = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { query } = req.query;
    const whereCondition = query ? {
      OR: [
        { value: { contains: query } },
        { comments: { contains: query } },
        { type: { description: { contains: query } } },
        { member: { name: { contains: query } } },
        { member: { cpf: { contains: query } } },
        { member: { address: { contains: query } } },
        {
          member: {
            addressType: { description: { contains: query } }
          }
        }
      ],
      AND: {
        member: { lobbyId: id }
      }
    } : { member: { lobbyId: id } };
    const tags = await db_default.tag.findMany({
      include: {
        type: { select: { description: true } },
        member: {
          select: {
            rg: true,
            cpf: true,
            name: true,
            address: true,
            addressTypeId: true,
            addressType: {
              select: {
                description: true
              }
            },
            lobby: {
              select: {
                name: true
              }
            }
          }
        }
      },
      where: whereCondition,
      orderBy: [{ status: "asc" }, { member: { name: "asc" } }]
    });
    if (!tags) {
      res.status(404).json({ error: "Tags n\xE3o encontradas" });
      return;
    }
    res.json(tags);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar as tags" });
  }
};

export {
  getAllTags,
  getTag,
  getTagsByMember,
  createTag,
  updateTag,
  deleteTag,
  getTagTypes,
  deleteTagsByMember,
  getTagsByLobby
};
