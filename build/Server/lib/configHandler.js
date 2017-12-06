"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const util_1 = require("util");
const ReadFiles_1 = require("./ReadFiles");
class configHandler {
    constructor(config) {
        this.writeFile = (filePath, str) => {
            return new Promise((resolve, reject) => {
                fs.writeFile(filePath, str, 'utf8', (err) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    else {
                        resolve();
                    }
                });
            });
        };
        this.readFile = (filePath) => {
            return new Promise((resolve, reject) => {
                fs.readFile(filePath, 'utf8', (err, data) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(data);
                    }
                });
            });
        };
        this.setId = (items) => {
            return new Promise((resolve, reject) => {
                let newItems = items.map(item => {
                    item.id = (Math.random() * 1e32).toString(36);
                    item.pid = null;
                    return item;
                });
                resolve(newItems);
            });
        };
        this.sendFail = (e, connection, type) => {
            connection.sendUTF(JSON.stringify({
                type: type,
                data: {
                    success: false,
                    error: e
                }
            }));
        };
        this.sendSuccess = (connection, type, data) => {
            connection.sendUTF(JSON.stringify({
                type: type,
                data: {
                    success: true,
                    config: data
                }
            }));
        };
        this.defaultConfig = function () {
            if (!fs.existsSync(this.configSrc)) {
                console.info('Default config created', this.configSrc);
                this.writeFile(this.configSrc, '{"configService": []}');
            }
        };
        this.extraConfig = function (statusObj) {
            this.configFile.configService = this.configFile.configService.map((item) => {
                if (item.id === statusObj.id) {
                    return Object.assign({}, item, statusObj);
                }
                else {
                    return item;
                }
            });
        };
        this.saveConfig = function (newConfig, connection) {
            return __awaiter(this, void 0, void 0, function* () {
                if (true) {
                    newConfig = yield this.pullNpmScripts(newConfig.cmd);
                    newConfig.id = (Math.random() * 1e32).toString(36);
                    console.log('SaveConfig');
                    console.log('-'.repeat(100));
                    console.log(JSON.stringify(newConfig));
                    this.configFile.configService.push(newConfig);
                    this.writeFile(this.configSrc, JSON.stringify(this.configFile, null, "\t")).then(() => {
                        this.sendSuccess(connection, 'saveConfig', this.configFile);
                    }).catch((e) => {
                        this.sendFail(e, connection, 'saveConfig');
                    });
                    return;
                }
            });
        };
        this.readConfig = (connection) => {
            console.log('this.configSrc', this.configSrc);
            this.readFile(this.configSrc).then((data) => {
                try {
                    console.log('Reading Config from:', this.configSrc);
                    let fileData = JSON.parse(data);
                    if (util_1.isUndefined(this.configFile)) {
                        console.log('isUnDefined:', this.configSrc);
                        this.setId(fileData.configService)
                            .then(this.setNpmScripts)
                            .then(this.getReadMeContent)
                            .then((configService) => {
                            fileData.configService = configService;
                            this.configFile = fileData;
                            console.log({ "status": 200, "message": "CONN_SUCC_SEND_CONFIG", "data": fileData });
                            this.sendSuccess(connection, "readConfig", this.configFile);
                        })
                            .catch((e) => {
                            console.log({ "status": 204, "message": "CONN_ERR_READ_CONFIG", "data": e });
                            console.error(e);
                        });
                    }
                    else {
                        for (let i = 0; i < fileData.configService.length; i++) {
                            let currentItem = fileData.configService[i];
                            let keyLength = Object.keys(currentItem).length;
                            let testLength = 0;
                            for (let key in currentItem) {
                                if (currentItem[key] === this.configFile.configService[i][key]) {
                                    testLength++;
                                }
                            }
                            if (keyLength == testLength) {
                                currentItem.id = (Math.random() * 1e32).toString(36);
                                if (this.configFile.length) {
                                    this.configFile.splice(i, 0, currentItem);
                                }
                            }
                        }
                        console.log('New Config Sent', JSON.stringify(this.configFile));
                        this.sendSuccess(connection, "readConfig", this.configFile);
                    }
                }
                catch (e) {
                    throw e;
                }
            }).catch((e) => {
                this.sendFail(e, connection, 'readConfig');
            });
        };
        this.editConfig = (message, connection) => {
            let configItem = message.cmd;
            if (this.configFile) {
                let _items = this.configFile.configService.map((item) => {
                    if (item.id === configItem.id) {
                        item['env'] = configItem['env'];
                        item['command'] = configItem['command'];
                        return item;
                    }
                    else {
                        return item;
                    }
                    ;
                });
                console.log('editConfig');
                console.log(_items);
                this.configFile.configService = _items;
                const writeJson = JSON.stringify(this.configFile, null, "\t");
                this.writeFile(this.configSrc, writeJson).then((data) => {
                    this.sendSuccess(connection, "updateConfig", this.configFile);
                }).catch((e) => {
                    this.sendFail(e, connection, 'updateConfig');
                });
            }
            else {
                this.readFile(this.configSrc).then((data) => {
                    try {
                        let fileData = JSON.parse(data);
                        fileData.configService = this.setId(fileData.configService);
                        this.configFile = fileData;
                        this.sendSuccess(connection, 'updateConfig', this.configFile);
                    }
                    catch (e) {
                        throw e;
                    }
                }).catch((e) => {
                    this.sendFail(e, connection, 'updateConfig');
                });
            }
        };
        this.deleteConfig = (message, connection) => {
            let configItem = message.cmd;
            if (this.configFile) {
                let idx = this.configFile.configService.findIndex((item, idx) => item.id === configItem.id);
                if (idx !== -1) {
                    this.readFile(this.configSrc).then((data) => {
                        try {
                            let fileData = JSON.parse(data);
                            fileData.configService.splice(idx, 1);
                            this.configFile = fileData;
                            const writeJson = JSON.stringify(this.configFile, null, "\t");
                            this.writeFile(this.configSrc, writeJson).then(() => {
                                this.sendSuccess(connection, 'deleteConfig', this.configFile);
                            });
                        }
                        catch (e) {
                            this.sendFail(e, connection, 'deleteConfig');
                        }
                    });
                }
            }
        };
        this.configSrc = config.configPath;
        this.defaultConfig();
    }
    pullNpmScripts(item) {
        return __awaiter(this, void 0, void 0, function* () {
            let npm = yield ReadFiles_1.getNpmScripts(item.cd);
            item.npm = npm;
            console.log('pull npm script');
            console.log(JSON.stringify(item));
            return item;
        });
    }
    setNpmScripts(items) {
        return __awaiter(this, void 0, void 0, function* () {
            for (let i = 0; i < items.length; i++) {
                let npm = yield ReadFiles_1.getNpmScripts(items[i].cd);
                items[i].npm = npm;
            }
            return items;
        });
    }
    getReadMeContent(items) {
        return __awaiter(this, void 0, void 0, function* () {
            for (let i = 0; i < items.length; i++) {
                let readMe = yield ReadFiles_1.getReadme(items[i].cd);
                items[i].readMe = readMe;
            }
            return items;
        });
    }
}
exports.configHandler = configHandler;
//# sourceMappingURL=configHandler.js.map