"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const childprocess = require("child_process");
const psTree = require("ps-tree");
const configHandler_1 = require("./configHandler");
const serverConfig_1 = require("./serverConfig");
const Git_1 = require("./Git");
const createFork_1 = require("./Process/createFork");
let exec = childprocess.exec, fork = childprocess.fork;
class appCommand extends serverConfig_1.ServerConfig {
    constructor() {
        super();
        this.colors = ['#ffb2b2', 'DeepSkyBlue', 'gold', 'magenta', '#ADFF2F', 'plum', 'orange', 'aqua', 'BlanchedAlmond', '#00BFFF'].sort();
        this.history = [];
        this.clients = [];
        this.skipLog = ['getConfigFile', 'deleteService', 'saveConfig'];
        this.writeToHistory = (log) => {
            if (this.skipLog.indexOf(log.text) === -1) {
                this.history.push(log);
                this.history = this.history.slice(-100);
                return log;
            }
        };
        this.readme = (message, connection) => {
            fs.readFile(message.readmePath, 'utf8', function (err, data) {
                if (err) {
                    return console.log(err);
                }
                connection.sendUTF(JSON.stringify({ type: 'readme', data: data }));
            });
        };
        this.puts = (error, stdout, stderr) => {
            if (error) {
                console.error("exec closed with error:", error);
            }
            else {
                console.info("exec closed without error");
            }
        };
        this.broadcastMsg = (message, connection) => {
            return (type, obj) => {
                let sendObj = {
                    type: '',
                    data: {
                        port: message.port,
                        id: message.id
                    }
                };
                sendObj.type = type;
                sendObj.data = Object.assign({}, sendObj.data, obj);
                for (let i = 0; i < this.clients.length; i++) {
                    this.clients[i].sendUTF(JSON.stringify(sendObj));
                }
                return sendObj;
            };
        };
        this.serviceAction = (message, connection) => {
            let Broadcast = this.broadcastMsg(message, connection);
            let self = this;
            let userColor = this.colors.shift();
            let f = createFork_1.createFork(__dirname, [userColor, JSON.stringify(message)], Broadcast, self.configHandler, message);
            f.on('message', (msg) => {
                msg.payload.id = message.id;
                switch (msg.type) {
                    case 'data':
                        let log = self.writeToHistory(msg.payload);
                        log ? Broadcast('message', log) : null;
                        break;
                    case 'close':
                        f.kill();
                        break;
                    case 'memory_usage':
                        Broadcast('memory_usage', msg.payload);
                        break;
                }
            });
            f.emit('startUsage');
            f.emit('connected', self.configHandler);
        };
        this.handleMessage = (message, connection) => {
            console.log('message', message);
            switch (message.req) {
                case "getConfigFile":
                    console.log('Request', 'getConfigFile');
                    this.configHandler.readConfig(connection);
                    break;
                case "deleteService":
                    this.configHandler.deleteConfig(message, connection);
                    break;
                case "editService":
                    this.configHandler.editConfig(message, connection);
                    break;
                case "saveConfig":
                    this.configHandler.saveConfig(message, connection);
                    break;
                case "readme":
                    this.readme(message, connection);
                    break;
                case "killService":
                    console.log('killService', message.pid);
                    psTree(message.pid, (err, children) => {
                        childprocess
                            .spawn('kill', ['-9']
                            .concat(children.map(p => p.PID)));
                    });
                    break;
                case "startService":
                    this.serviceAction(message, connection);
                    break;
                case "git":
                    Git_1.Git.handler(message, connection);
                    break;
            }
        };
        this.configHandler = new configHandler_1.configHandler(this.config);
    }
}
exports.appCommand = appCommand;
//# sourceMappingURL=app-command.js.map