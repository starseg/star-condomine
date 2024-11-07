import { Prisma } from '@prisma/client'
import prisma from '../db'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { subDays } from 'date-fns'
import { InvalidDateError } from './errors/invalid-date-error'

export class AccessService {
  async getAllAccesses() {
    const accesses = await prisma.access.findMany()

    if (!accesses) {
      throw new ResourceNotFoundError()
    }

    return accesses
  }

  async getAccessById(id: number) {
    const access = await prisma.access.findUnique({
      where: { accessId: id },
      include: {
        visitor: {
          select: {
            name: true,
            cpf: true,
            visitorType: {
              select: {
                description: true,
              },
            },
          },
        },
        member: {
          select: {
            name: true,
            cpf: true,
          },
        },
        operator: {
          select: {
            name: true,
          },
        },
      },
    })

    if (!access) {
      throw new ResourceNotFoundError()
    }

    return access
  }

  async createAccess(accessData: Prisma.AccessUncheckedCreateInput) {
    const access = await prisma.access.create({
      data: accessData,
    })

    return access
  }

  async updateAccess(id: number, accessData: Prisma.AccessUncheckedUpdateInput) {
    try {
      const updatedAccess = await prisma.access.update({
        where: { accessId: id },
        data: accessData,
      })

      return updatedAccess
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new ResourceNotFoundError()
      }

      throw error
    }
  }

  async deleteAccess(id: number) {
    try {
      const deletedAccess = await prisma.access.delete({
        where: { accessId: id },
      })

      return deletedAccess
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new ResourceNotFoundError()
      }

      throw error
    }
  }

  async getAccessByLobby(lobbyId: number) {
    const oneMonthAgo = subDays(new Date(), 31)
    const accesses = await prisma.access.findMany({
      where: {
        lobbyId,
        startTime: { gte: oneMonthAgo },
      },
      include: {
        visitor: {
          select: {
            name: true,
            cpf: true,
            visitorType: {
              select: {
                description: true,
              },
            },
          },
        },
        member: {
          select: {
            name: true,
            cpf: true,
          },
        },
      },
      orderBy: [{ status: "asc" }, { startTime: "desc" }],
    })

    if (!accesses) {
      throw new ResourceNotFoundError()
    }

    return accesses
  }

  async getFilteredAccesses(lobbyId: number, query?: string) {
    const whereCondition = query
      ? {
        OR: [
          { visitor: { name: { contains: query } } },
          { member: { name: { contains: query } } },
        ],
        AND: { lobbyId },
      }
      : { lobbyId }
    const accesses = await prisma.access.findMany({
      where: whereCondition,
      include: {
        visitor: {
          select: {
            name: true,
            cpf: true,
            visitorType: {
              select: {
                description: true,
              },
            },
          },
        },
        member: {
          select: {
            name: true,
            cpf: true,
          },
        },
      },
      orderBy: [{ status: "asc" }, { startTime: "desc" }],
    })

    if (!accesses) {
      throw new ResourceNotFoundError()
    }

    return accesses
  }

  async generateReport(lobbyId: number, startDate?: Date, endDate?: Date) {

    if (!startDate || !endDate) {
      const resultWithoutDate = await prisma.access.findMany({
        where: {
          lobbyId: lobbyId,
        },
        include: {
          visitor: {
            select: {
              name: true,
            },
          },
          member: {
            select: {
              name: true,
            },
          },
          operator: {
            select: {
              name: true,
            },
          },
        },
        orderBy: [{ startTime: "asc" }],
      });

      if (!resultWithoutDate) {
        throw new ResourceNotFoundError();
      }

      return resultWithoutDate;
    }

    if (startDate && isNaN(startDate.getTime()) || endDate && isNaN(endDate.getTime())) {
      throw new InvalidDateError();
    }

    const resultWithDate = await prisma.access.findMany({
      where: {
        lobbyId: lobbyId,
        startTime: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        visitor: {
          select: {
            name: true,
          },
        },
        member: {
          select: {
            name: true,
          },
        },
        operator: {
          select: {
            name: true,
          },
        },
      },
      orderBy: [{ startTime: "asc" }],
    })

    if (!resultWithDate) {
      throw new ResourceNotFoundError();
    }

    return resultWithDate;
  }
}

