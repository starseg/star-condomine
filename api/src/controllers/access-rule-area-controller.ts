import { z } from "zod";
import { AccessRuleAreaService } from "../services/access-rule-area-service";
import { Request, Response } from "express";
import { ResourceNotFoundError } from "../services/errors/resource-not-found-error";

const accessRuleAreaSchema = z.object({
  areaId: z.coerce.number(),
  accessRuleId: z.coerce.number(),
})

const accessRuleAreaService = new AccessRuleAreaService()

export async function getAllAccessRuleAreas(req: Request, res: Response) {
  try {
    const areaAccessRule = await accessRuleAreaService.getAllAccessRuleAreas()
    res.json(areaAccessRule)
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar os grupos", error })
  }
}

export async function getAccessRuleArea(req: Request, res: Response) {
  try {
    const id = z.coerce.number().parse(req.params.id)
    const areaAccessRule = await accessRuleAreaService.getAccessRuleAreaById(id)
    return res.json(areaAccessRule)
  } catch (error) {

    if (error instanceof ResourceNotFoundError) {
      return res.status(404).json({ error: error.message });
    }

    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }

    res.status(500).json({ message: "Erro ao buscar o grupo", error })
  }
}

export async function createAccessRuleArea(req: Request, res: Response) {
  try {
    const { areaId, accessRuleId } = accessRuleAreaSchema.parse(req.body)
    const areaAccessRule = await accessRuleAreaService.createAccessRuleArea({ areaId, accessRuleId })
    return res.status(201).json(areaAccessRule)
  } catch (error) {

    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }

    res.status(500).json({ message: "Erro ao criar o grupo", error })
  }
}

export async function updateAccessRuleArea(req: Request, res: Response) {
  try {
    const id = z.coerce.number().parse(req.params.id)
    const { areaId, accessRuleId } = accessRuleAreaSchema.partial().parse(req.body)
    const areaAccessRule = await accessRuleAreaService.updateAccessRuleArea(id, { areaId, accessRuleId })
    return res.json(areaAccessRule)
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return res.status(404).json({ error: error.message });
    }

    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }

    res.status(500).json({ message: "Erro ao atualizar o grupo", error })
  }
}

export async function deleteAccessRuleArea(req: Request, res: Response) {
  try {
    const id = z.coerce.number().parse(req.params.id)
    const areaAccessRule = await accessRuleAreaService.deleteAccessRuleArea(id)
    return res.json(areaAccessRule)
  } catch (error) {
    res.status(500).json({ message: "Erro ao deletar o grupo", error })
  }
}