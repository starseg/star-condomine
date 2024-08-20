"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidURL = void 0;
function isValidURL(str) {
    if (str === null)
        return false;
    try {
        new URL(str);
        return true;
    }
    catch (_) {
        return false;
    }
}
exports.isValidURL = isValidURL;
