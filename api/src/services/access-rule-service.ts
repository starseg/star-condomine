import { Prisma } from "@prisma/client";
import prisma from "../db";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

export class AccessRuleService {
  async getAllAccessRules() {
    const accessRules = await prisma.accessRule.findMany({
      orderBy: [{ accessRuleId: "asc" }],
    })

    return accessRules
  }

  async getAccessRuleById(id: number) {
    const accessRule = await prisma.accessRule.findUnique({
      where: { accessRuleId: id },
    })

    if (!accessRule) {
      throw new ResourceNotFoundError()
    }

    return accessRule
  }

  async getAccessRulesByLobby(lobby: number) {
    const accessRules = await prisma.accessRule.findMany({
      where: { lobbyId: lobby },
      orderBy: [{ accessRuleId: "asc" }],
    })

    if (!accessRules) {
      throw new ResourceNotFoundError()
    }

    return accessRules
  }

  async createAccessRule(accessRuleData: Prisma.AccessRuleUncheckedCreateInput) {
    const accessRule = await prisma.accessRule.create({
      data: accessRuleData,
    })

    return accessRule
  }

  async updateAccessRule(id: number, accessRuleData: Prisma.AccessRuleUncheckedUpdateInput) {
    try {
      const accessRule = await prisma.accessRule.update({
        where: { accessRuleId: id },
        data: accessRuleData,
      })

      return accessRule
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new ResourceNotFoundError()
      }

      throw error
    }
  }

  async deleteAccessRule(id: number) {
    try {
      const accessRule = await prisma.accessRule.delete({
        where: { accessRuleId: id },
      })

      return accessRule
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new ResourceNotFoundError()
      }

      throw error
    }
  }
}