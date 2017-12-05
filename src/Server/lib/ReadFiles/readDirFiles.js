"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
function getDirFiles(extensions, dirPath) {
    return new Promise((resolve, reject) => {
        fs.readdir(dirPath, (err, files) => {
            if (err) {
                reject(err);
                return;
            }
            let obj = {};
            files.map((file) => {
                return path.join(path.resolve(__dirname, dirPath), file);
            }).filter((file, idx) => {
                return extensions.indexOf(path.extname(file)) !== -1;
            })
                .map((file) => {
                let ext = path.extname(file);
                let fileName = path.basename(file);
                if (!obj.hasOwnProperty(ext)) {
                    obj[ext] = {};
                }
                obj[ext][fileName] = {};
                obj[ext][fileName].path = dirPath;
                obj[ext][fileName].content = fs.readFileSync(file);
            });
            resolve(obj);
        });
    });
}
exports.getDirFiles = getDirFiles;
//# sourceMappingURL=readDirFiles.js.map