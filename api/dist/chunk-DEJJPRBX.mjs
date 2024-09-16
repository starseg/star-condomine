import {
  db_default
} from "./chunk-BXWGZ4DM.mjs";

// src/controllers/memberGroup.ts
var getAllMemberGroups = async (req, res) => {
  try {
    const memberGroup = await db_default.memberGroup.findMany({
      orderBy: [{ memberGroupId: "asc" }],
      include: {
        member: {
          select: { name: true }
        },
        group: {
          select: { name: true }
        }
      }
    });
    res.json(memberGroup);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar rela\xE7\xF5es" });
  }
};
var getMemberGroup = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const memberGroup = await db_default.memberGroup.findUniqueOrThrow({
      where: { memberGroupId: id },
      include: {
        member: {
          select: { name: true }
        },
        group: {
          select: { name: true }
        }
      }
    });
    if (!memberGroup) {
      res.status(404).json({ error: "rela\xE7\xE3o n\xE3o encontrada" });
      return;
    }
    res.json(memberGroup);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar rela\xE7\xE3o" });
  }
};
var getMemberGroupsByLobby = async (req, res) => {
  try {
    const lobby = parseInt(req.params.lobby, 10);
    const memberGroup = await db_default.memberGroup.findMany({
      orderBy: [{ memberGroupId: "asc" }],
      include: {
        member: {
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
        member: {
          lobbyId: lobby
        }
      }
    });
    res.json(memberGroup);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar rela\xE7\xF5es" });
  }
};
var createMemberGroup = async (req, res) => {
  try {
    const { memberId, groupId } = req.body;
    const membergroup = await db_default.memberGroup.create({
      data: { memberId, groupId }
    });
    res.status(201).json(membergroup);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar rela\xE7\xE3o" });
  }
};
var updateMemberGroup = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { memberId, groupId } = req.body;
    const membergroup = await db_default.memberGroup.update({
      where: { memberGroupId: id },
      data: { memberId, groupId }
    });
    res.status(200).json(membergroup);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar rela\xE7\xE3o" });
  }
};
var deleteMemberGroup = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    await db_default.memberGroup.delete({
      where: { memberGroupId: id }
    });
    res.json({ message: "rela\xE7\xE3o exclu\xEDda com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao excluir rela\xE7\xE3o" });
  }
};

export {
  getAllMemberGroups,
  getMemberGroup,
  getMemberGroupsByLobby,
  createMemberGroup,
  updateMemberGroup,
  deleteMemberGroup
};
