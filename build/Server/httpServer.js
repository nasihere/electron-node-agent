"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http = require("http");
const fs = require("fs");
const path = require("path");
const url = require("url");
const serverConfig_1 = require("./lib/serverConfig");
function findContentType(extname) {
    switch (extname) {
        case '.js':
            return 'text/javascript';
        case '.css':
            return 'text/css';
        case '.json':
            return 'application/json';
        case '.png':
            return 'image/png';
        case '.jpg':
            return 'image/jpg';
        case '.wav':
            return 'audio/wav';
        default:
            return 'text/html';
    }
}
class HttpServer extends serverConfig_1.ServerConfig {
    constructor() {
        super();
        this.init = () => {
            this.server = http.createServer(this.handleRequests);
        };
        this.handleRequests = (request, response) => {
            if (request.url === '/favicon.ico') {
                response.writeHead(200, { 'Content-Type': 'image/x-icon' });
                response.end();
                return;
            }
            let requestConfig = {
                uri: url.parse(request.url).pathname,
                filePath: /\.\w{2,5}$/.test(request.url) ? path.resolve(__dirname, '../htmlv3/' + request.url) : path.resolve(__dirname, '../htmlv3/index.html'),
                get filename() { return path.join(process.cwd(), this.uri); },
                get contentType() { return findContentType(path.extname(this.filePath)); }
            };
            fs.readFile(requestConfig.filePath, function (error, content) {
                if (error) {
                    console.log(`error on ${request.url}`, error);
                    if (error.code === 'ENOENT') {
                        fs.readFile('./404.html', function (error, content) {
                            response.writeHead(200, { 'Content-Type': requestConfig.contentType });
                            response.end(content, 'utf-8');
                        });
                    }
                    else {
                        response.writeHead(500);
                        response.end('Sorry, check with the site admin for error: ' + error.code + ' ..\n');
                        response.end();
                    }
                }
                else {
                    response.writeHead(200, { 'Content-Type': requestConfig.contentType });
                    response.end(content, 'utf-8');
                }
            });
        };
        this.init();
    }
}
exports.HttpServer = HttpServer;
exports.httpServer = new HttpServer();
//# sourceMappingURL=httpServer.js.map