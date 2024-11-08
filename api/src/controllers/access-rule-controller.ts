import { Request, Response } from "express";
import { z } from "zod";
import { AccessRuleService } from "../services/access-rule-service";
import { ResourceNotFoundError } from "../services/errors/resource-not-found-error";

const accessRuleSchema = z.object({
  name: z.string(),
  type: z.coerce.number(),
  priority: z.coerce.number(),
  lobbyId: z.coerce.number(),
})

const accessRuleService = new AccessRuleService()

export async function getAllAccessRules(req: Request, res: Response) {
  try {
    const accessRules = await accessRuleService.getAllAccessRules()
    res.json(accessRules)
  } catch (error) {
    res.status(500).json({ message: "Error getting access rules", error })
  }
};

export async function getAccessRule(req: Request, res: Response) {
  try {
    const id = z.coerce.number().parse(req.params.id)
    const accessRule = await accessRuleService.getAccessRuleById(id)
    return res.json(accessRule)
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return res.status(404).json({ error: error.message });
    }

    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }

    return res.status(500).json({ message: "Error getting access rule", error });
  }
};

export async function getAccessRulesByLobby(req: Request, res: Response) {
  try {
    const lobbyId = z.coerce.number().parse(req.params.lobby)
    const accessRules = await accessRuleService.getAccessRulesByLobby(lobbyId)
    return res.json(accessRules)
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return res.status(404).json({ error: error.message });
    }

    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }

    return res.status(500).json({ message: "Error getting access rule", error });
  }
};

export async function createAccessRule(req: Request, res: Response) {
  try {
    const { name, type, priority, lobbyId } = accessRuleSchema.parse(req.body)
    const accessRule = await accessRuleService.createAccessRule({ name, type, priority, lobbyId })
    return res.json(accessRule)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }

    return res.status(500).json({ message: "Error getting access rule", error });
  }
};

export async function updateAccessRule(req: Request, res: Response) {
  try {
    const id = z.coerce.number().parse(req.params.id)
    const { name, type, priority, lobbyId } = accessRuleSchema.partial().parse(req.body)
    const accessRule = await accessRuleService.updateAccessRule(id, { name, type, priority, lobbyId })
    return res.json(accessRule)
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return res.status(404).json({ error: error.message });
    }

    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }

    return res.status(500).json({ message: "Error getting access rule", error });
  }
};

export async function deleteAccessRule(req: Request, res: Response) {
  try {
    const id = z.coerce.number().parse(req.params.id)
    const deletedAccessRule = await accessRuleService.deleteAccessRule(id)
    return res.json(deletedAccessRule)
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return res.status(404).json({ error: error.message });
    }

    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }

    return res.status(500).json({ message: "Error getting access rule", error });
  }
};
