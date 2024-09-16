// src/controllers/controliD.ts
var commandQueue = [];
var resultLog = [];
var push = async (req, res) => {
  const deviceId = req.query.deviceId;
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
var result = async (req, res) => {
  console.log("|-<|*RESULT*|>-|");
  console.log(req.body);
  resultLog.push(req.body);
  if (resultLog.length > 20) {
    resultLog.shift();
  }
  res.json();
};
var addCommand = async (req, res) => {
  const id = req.query.id;
  const content = req.body;
  const command = {
    id,
    content
  };
  console.log(command);
  commandQueue.push(command);
  res.json({ message: "Command added successfully" });
};
var results = async (req, res) => {
  res.json(resultLog);
};
var clearResults = async (req, res) => {
  resultLog = [];
  console.log("cleared!", resultLog);
  res.json(resultLog);
};

export {
  push,
  result,
  addCommand,
  results,
  clearResults
};
