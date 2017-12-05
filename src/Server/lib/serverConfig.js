"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rc = require("rc");
const path = require("path");
class ServerConfig {
    constructor() {
        this.defaults = {
            port: 8125,
            wsport: 1337,
            configPath: path.resolve(__dirname, '../app-config.json')
        };
        let config = rc('nodeagents', this.defaults);
        if (process.argv.length > 2) {
            process.argv.slice(2).forEach(x => {
                const param = x.split('=');
                switch (param[0]) {
                    case "--port":
                        config.port = parseInt(param[1]);
                        break;
                    case "--wsport":
                        config.wsport = parseInt(param[1]);
                        break;
                    case "--config":
                        config.configPath = param[1];
                        break;
                }
            });
        }
        this.config = config;
    }
}
exports.ServerConfig = ServerConfig;
//# sourceMappingURL=serverConfig.js.map