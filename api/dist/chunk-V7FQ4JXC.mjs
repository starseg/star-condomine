import {
  db_default
} from "./chunk-BXWGZ4DM.mjs";

// src/controllers/visitorGroup.ts
var getAllVisitorGroups = async (req, res) => {
  try {
    const visitorGroup = await db_default.visitorGroup.findMany({
      orderBy: [{ visitorGroupId: "asc" }],
      include: {
        visitor: {
          select: { name: true }
        },
        group: {
          select: { name: true }
        }
      }
    });
    res.json(visitorGroup);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar rela\xE7\xF5es" });
  }
};
var getVisitorGroup = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const visitorGroup = await db_default.visitorGroup.findUniqueOrThrow({
      where: { visitorGroupId: id },
      include: {
        visitor: {
          select: { name: true }
        },
        group: {
          select: { name: true }
        }
      }
    });
    if (!visitorGroup) {
      res.status(404).json({ error: "rela\xE7\xE3o n\xE3o encontrada" });
      return;
    }
    res.json(visitorGroup);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar rela\xE7\xE3o" });
  }
};
var getVisitorGroupsByLobby = async (req, res) => {
  try {
    const lobby = parseInt(req.params.lobby, 10);
    const visitorGroup = await db_default.visitorGroup.findMany({
      orderBy: [{ visitorGroupId: "asc" }],
      include: {
        visitor: {
          select: { name: true }
        },
        group: {
          select: { name: true }
        }
      },
      where: {
        group: {
          lobbyId: lobby
        },
        visitor: {
          lobbyId: lobby
        }
      }
    });
    res.json(visitorGroup);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar rela\xE7\xF5es" });
  }
};
var createVisitorGroup = async (req, res) => {
  try {
    const { visitorId, groupId } = req.body;
    const visitorgroup = await db_default.visitorGroup.create({
      data: { visitorId, groupId }
    });
    res.status(201).json(visitorgroup);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar rela\xE7\xE3o" });
  }
};
var updateVisitorGroup = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { visitorId, groupId } = req.body;
    const visitorgroup = await db_default.visitorGroup.update({
      where: { visitorGroupId: id },
      data: { visitorId, groupId }
    });
    res.status(200).json(visitorgroup);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar rela\xE7\xE3o" });
  }
};
var deleteVisitorGroup = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    await db_default.visitorGroup.delete({
      where: { visitorGroupId: id }
    });
    res.json({ message: "rela\xE7\xE3o exclu\xEDda com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao excluir rela\xE7\xE3o" });
  }
};

export {
  getAllVisitorGroups,
  getVisitorGroup,
  getVisitorGroupsByLobby,
  createVisitorGroup,
  updateVisitorGroup,
  deleteVisitorGroup
};
