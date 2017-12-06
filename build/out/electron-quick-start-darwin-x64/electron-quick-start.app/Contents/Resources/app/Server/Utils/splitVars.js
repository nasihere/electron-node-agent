"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function splitVars(str) {
    if (!str)
        return null;
    let varsObj = {};
    let envVars = str.trim().replace(/;$/, "").split(";")
        .map(o => o.trim().split("="))
        .forEach((s) => {
        let key = (s[0]) ? s[0].trim() : '';
        let val = (s[1]) ? s[1].trim() : '';
        varsObj[key] = val;
    });
    return varsObj;
}
exports.splitVars = splitVars;
//# sourceMappingURL=splitVars.js.map