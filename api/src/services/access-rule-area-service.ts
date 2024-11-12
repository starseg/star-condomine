import { Prisma } from "@prisma/client";
import prisma from "../db";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

export class AccessRuleAreaService {
  async getAllAccessRuleAreas() {
    const areaAccessRule = await prisma.areaAccessRule.findMany({
      orderBy: [{ areaAccessRuleId: "asc" }],
      include: {
        lobby: {
          select: { name: true },
        },
        accessRule: {
          select: { name: true },
        },
      },
    });

    return areaAccessRule;
  }

  async getAccessRuleAreaById(id: number) {
    const areaAccessRule = await prisma.areaAccessRule.findUnique({
      where: { areaAccessRuleId: id },
      include: {
        lobby: {
          select: { name: true },
        },
        accessRule: {
          select: { name: true },
        },
      },
    });

    if (!areaAccessRule) {
      throw new ResourceNotFoundError();
    }

    return areaAccessRule;
  }

  async createAccessRuleArea(accessRuleAreaData: Prisma.AreaAccessRuleUncheckedCreateInput) {
    const areaAccessRule = await prisma.areaAccessRule.create({
      data: accessRuleAreaData,
    });

    return areaAccessRule;
  }

  async updateAccessRuleArea(id: number, accessRuleAreaData: Prisma.AreaAccessRuleUncheckedUpdateInput) {
    try {
      const areaAccessRule = await prisma.areaAccessRule.update({
        where: { areaAccessRuleId: id },
        data: accessRuleAreaData,
      });

      return areaAccessRule;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new ResourceNotFoundError();
      }

      throw error;
    }
  }

  async deleteAccessRuleArea(id: number) {
    try {
      const areaAccessRule = await prisma.areaAccessRule.delete({
        where: { areaAccessRuleId: id },
      });

      return areaAccessRule;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new ResourceNotFoundError();
      }

      throw error;
    }
  }
}