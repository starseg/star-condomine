"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.result = exports.push = void 0;
const push = async (req, res) => {
    console.log("Query string: ", req.query.deviceId);
    res.json({
        verb: "POST",
        endpoint: "load_objects",
        body: { object: "users" },
        contentType: "application/json",
    });
};
exports.push = push;
const result = async (req, res) => {
    console.log(req.body);
    res.json({
        verb: "POST",
        endpoint: "load_objects",
        body: { object: "users" },
        contentType: "application/json",
    });
};
exports.result = result;
