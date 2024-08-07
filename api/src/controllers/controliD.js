"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearResults = exports.results = exports.addCommand = exports.result = exports.push = void 0;
let commandQueue = [];
let resultLog = [];
const push = async (req, res) => {
    const deviceId = req.query.deviceId;
    console.log("Device ID: ", deviceId);
    console.log("commandQueue: ", commandQueue);
    console.log(deviceId, commandQueue[0] ? commandQueue[0].id : "empty");
    if (commandQueue.length > 0) {
        const compare = commandQueue[0];
        if (deviceId === compare.id) {
            const command = commandQueue.shift();
            res.json(command.content);
        }
        else {
            res.json({});
        }
    }
    else {
        res.json({});
    }
};
exports.push = push;
const result = async (req, res) => {
    console.log("|-<|*RESULT*|>-|");
    console.log(req.body);
    resultLog.push(req.body);
    if (resultLog.length > 20) {
        resultLog.shift();
    }
    res.json();
};
exports.result = result;
const addCommand = async (req, res) => {
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
exports.addCommand = addCommand;
const results = async (req, res) => {
    console.log("resultLog");
    console.log(resultLog);
    res.json(resultLog);
};
exports.results = results;
const clearResults = async (req, res) => {
    resultLog = [];
    console.log("cleared!", resultLog);
    res.json(resultLog);
};
exports.clearResults = clearResults;
