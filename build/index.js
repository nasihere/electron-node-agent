"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron = require('electron');
const wsserver_1 = require("./Server/wsserver");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require('path');
const url = require('url');
let mainWindow;
function createWindow() {
    const { width, height } = electron.screen.getPrimaryDisplay().workAreaSize;
    console.log(__dirname);
    mainWindow = new BrowserWindow({ width, height, icon: path.join(__dirname, '/assets/icons') });
    mainWindow.wssPort = wsserver_1.tempwsServer.httpserver.address().port;
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, `Client/index.html`),
        protocol: 'file:',
        slashes: true
    }));
    mainWindow.on('closed', function () {
        mainWindow = null;
    });
}
app.on('ready', createWindow);
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
app.on('activate', function () {
    if (mainWindow === null) {
        createWindow();
    }
});
const websocket = require("websocket");
let webSocketServer = websocket.server;
function runService() {
    wsserver_1.tempwsServer.httpserver.listen(0, function () {
        console.log((new Date()) + " Server is listening on port " + wsserver_1.tempwsServer.httpserver.address().port);
    });
}
runService();
//# sourceMappingURL=index.js.map