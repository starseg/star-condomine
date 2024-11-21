import { Request, Response } from "express";

interface ActiveDeviceInterface {
  deviceId: string;
  timestamp: number;
}

let commandQueue: {
  id: string;
  content: any;
}[] = [];

let activeDevices: ActiveDeviceInterface[] = [];
let resultLog: any[] = [];
let currentTimestamp = new Date().getTime();

// Remove devices that have not sent a request in the last 10 seconds
setInterval(() => {
  if (activeDevices.length > 0) {
    activeDevices.forEach((device) => {
      currentTimestamp = new Date().getTime();
      if (currentTimestamp - device.timestamp > 10000) {
        activeDevices = activeDevices.filter((item) => item.deviceId !== device.deviceId);
      }
    })
  }

  console.log("Active Devices: ", activeDevices);
}, 10000);

export const addCommand = async (
  req: Request,
  res: Response
): Promise<void> => {
  const id = req.query.id as string;
  const content = req.body;
  const command = {
    id,
    content,
  };
  // console.log(command.content);
  commandQueue.push(command);
  res.json({ message: "Command added successfully" });
};

export const push = async (req: Request, res: Response): Promise<void> => {
  const deviceId = req.query.deviceId;

  // console.log("Device ID: ", deviceId);
  // console.log("commandQueue: ", commandQueue);
  //console.log("activeDevices: ", activeDevices)
  //console.log(deviceId, commandQueue[0] ? commandQueue[0].id : "empty");
  //console.log("Query: ", req.query);

  if (deviceId) {
    setActiveDevices(deviceId as string);
  }

  if (commandQueue.length > 0) {
    commandQueue.map((command) => {
      if (!activeDevices.some((device) => device.deviceId === command.id)) {
        commandQueue = commandQueue.filter((item) => command.id !== item.id);
      }
    });

    const compare = commandQueue.find((command) => command.id === deviceId);
    //console.log("Compare: ", compare);

    if (!compare) {
      res.json({});
      return;
    }

    if (deviceId === compare.id) {
      //console.log("Fila de comandos: ", commandQueue);
      //console.log("Indice do comando na fila: ", commandQueue.indexOf(compare))
      const command = commandQueue.splice(commandQueue.indexOf(compare), 1);
      // commandQueue = commandQueue.filter((item) => item.id !== compare.id);
      //console.log("Command: ", command)
      res.json(command[0].content);
    } else {
      res.json({});
    }
  } else {
    res.json({});
  }
};

export const result = async (req: Request, res: Response): Promise<void> => {
  console.log("|-<|*RESULT*|>-|");
  const response = {
    deviceId: req.query.deviceId,
    queryId: req.query.uuid,
    timestamp: new Date().getTime(),
    body: req.body,
  };
  console.log(response);
  resultLog.push(response);
  if (resultLog.length > 20) {
    resultLog.shift();
  }
  res.json(response);
};

export const results = async (req: Request, res: Response): Promise<void> => {
  // console.log("resultLog");
  // console.log(resultLog);
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

function setActiveDevices(deviceId: string) {
  currentTimestamp = new Date().getTime();

  if (activeDevices.some((device) => device.deviceId === deviceId)) {
    activeDevices = activeDevices.map((device) =>
      device.deviceId === deviceId
        ? { deviceId, timestamp: currentTimestamp }
        : device
    );
  } else {
    activeDevices.push({ deviceId, timestamp: currentTimestamp });
  }

  activeDevices = activeDevices.filter(
    (device) => currentTimestamp - device.timestamp < 10000
  );
}

export function getActiveDevices(res: Request, req: Response) {
  return req.json({
    devices: activeDevices.map((device) => device.deviceId),
  })
}

