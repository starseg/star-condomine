import { Prisma } from "@prisma/client"
import prisma from "../db"
import { ResourceNotFoundError } from "./errors/resource-not-found-error"

export class AccesRuleTimezoneService {
  async getAllAccessRuleTimeZones() {
    const accessRuleTimeZones = await prisma.accessRuleTimeZone.findMany({
      orderBy: [{ accessRuleTimeZoneId: "asc" }],
      include: {
        timeZone: {
          select: { name: true },
        },
        accessRule: {
          select: { name: true },
        },
      },
    })

    if (!accessRuleTimeZones) {
      throw new ResourceNotFoundError()
    }

    return accessRuleTimeZones
  }

  async getAccessRuleTimeZone(id: number) {
    const accessRuleTimeZone = await prisma.accessRuleTimeZone.findUnique({
      where: { accessRuleTimeZoneId: id },
      include: {
        timeZone: {
          select: { name: true },
        },
        accessRule: {
          select: { name: true },
        },
      },
    })

    if (!accessRuleTimeZone) {
      throw new ResourceNotFoundError()
    }

    return accessRuleTimeZone
  }

  async getAccessRuleTimeZonesByLobby(lobby: number) {
    const accessRuleTimeZones = await prisma.accessRuleTimeZone.findMany({
      where: {
        accessRule: { lobbyId: lobby },
        timeZone: { lobbyId: lobby },
      },
      include: {
        timeZone: {
          select: { name: true },
        },
        accessRule: {
          select: { name: true },
        },
      },
    })

    if (!accessRuleTimeZones) {
      throw new ResourceNotFoundError()
    }

    return accessRuleTimeZones
  }

  async createAccessRuleTimeZone(data: Prisma.AccessRuleTimeZoneUncheckedCreateInput) {
    const accessRuleTimeZone = await prisma.accessRuleTimeZone.create({ data })
    return accessRuleTimeZone
  }

  async updateAccessRuleTimeZone(id: number, data: Prisma.AccessRuleTimeZoneUncheckedUpdateInput) {
    try {
      const accessRuleTimeZone = await prisma.accessRuleTimeZone.update({
        where: { accessRuleTimeZoneId: id },
        data
      })

      return accessRuleTimeZone
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new ResourceNotFoundError()
      }

      throw error
    }
  }

  async deleteAccessRuleTimeZone(id: number) {
    try {
      const accessRuleTimeZone = await prisma.accessRuleTimeZone.delete({
        where: { accessRuleTimeZoneId: id },
      })

      return accessRuleTimeZone
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new ResourceNotFoundError()
      }

      throw error
    }
  }
}