"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
function getReadme(filePath) {
    if (filePath === undefined)
        return {};
    let filePathStr = path.resolve(filePath, 'README.md');
    return new Promise((resolve, reject) => {
        fs.readFile(filePathStr, 'utf8', (err, data) => {
            if (err) {
                resolve('No Package');
            }
            else {
                resolve(data);
            }
        });
    });
}
exports.getReadme = getReadme;
//# sourceMappingURL=getReadMe.js.map