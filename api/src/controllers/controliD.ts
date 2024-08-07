import { Request, Response } from "express";

let commandQueue: any[] = [];
let resultLog: any[] = [];

export const push = async (req: Request, res: Response): Promise<void> => {
  const deviceId = req.query.deviceId;
  console.log("Device ID: ", deviceId);
  console.log("commandQueue: ", commandQueue);
  console.log(deviceId, commandQueue[0] ? commandQueue[0].id : "empty");

  if (commandQueue.length > 0) {
    const compare = commandQueue[0];
    if (deviceId === compare.id) {
      const command = commandQueue.shift();
      res.json(command.content);
    } else {
      res.json({});
    }
  } else {
    res.json({});
  }
};

export const result = async (req: Request, res: Response): Promise<void> => {
  console.log("|-<|*RESULT*|>-|");
  console.log(req.body);
  resultLog.push(req.body);
  if (resultLog.length > 20) {
    resultLog.shift();
  }
  res.json();
};

export const addCommand = async (
  req: Request,
  res: Response
): Promise<void> => {
  const id = req.query.id;
  const content = req.body;
  const command = {
    id,
    content,
  };
  console.log(command);
  commandQueue.push(command);
  res.json({ message: "Command added successfully" });
};

export const results = async (req: Request, res: Response): Promise<void> => {
  console.log("resultLog");
  console.log(resultLog);
  res.json(resultLog);
};

export const clearResults = async (
  req: Request,
  res: Response
): Promise<void> => {
  resultLog = [];
  console.log("cleared!", resultLog);
  res.json(resultLog);
};
