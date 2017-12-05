"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http = require("http");
const app_command_1 = require("./lib/app-command");
const websocket = require("websocket");
let webSocketServer = websocket.server;
class wsServerClass extends app_command_1.appCommand {
    constructor() {
        super();
        this.httpserver = http.createServer(function (request, response) {
        });
        this.init = () => {
            let server = new webSocketServer({
                httpServer: this.httpserver
            });
            server.on('request', this.setRequestListeners);
            this.wsServer = server;
        };
        this.setRequestListeners = (request) => {
            request.on('requestResolved', () => {
                console.log((new Date()) + ' Connection from origin ' + request.origin + '.');
            });
            request.on('requestRejected', () => {
                console.log((new Date()) + ' Rejected from origin ' + request.origin + '.');
            });
            request.on('requestAccepted', this.setConnectionListeners);
            request.accept(null, request.origin);
        };
        this.setConnectionListeners = (connection) => {
            this.clients.push(connection);
            let index = this.clients.length;
            console.log((new Date()) + ' Connection accepted.', index);
            let userColor = this.colors[index];
            if (this.history.length > 0) {
                for (let i = 0; i <= this.history.length - 1; i++) {
                    connection.sendUTF(JSON.stringify({
                        type: 'message',
                        data: this.history[i]
                    }));
                }
            }
            connection.on('message', (msg) => {
                let message = JSON.parse(msg.utf8Data);
                this.handleMessage(message, connection);
            });
            connection.on('close', (code, desc) => {
                if (userColor) {
                    this.clients.splice(index, 1);
                }
            });
        };
        this.init();
    }
}
exports.wsServerClass = wsServerClass;
exports.tempwsServer = new wsServerClass();
//# sourceMappingURL=wsserver.js.map