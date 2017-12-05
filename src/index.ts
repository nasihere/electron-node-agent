const electron = require('electron');
// Module to control application life.
// var electron = require('electron-connect').server.create();

import { httpServer } from './Server/httpServer';
import { tempwsServer } from './Server/wsserver';

const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow
 
const path = require('path')
const url = require('url')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  const {width, height} = electron.screen.getPrimaryDisplay().workAreaSize
console.log(__dirname)
  mainWindow = new BrowserWindow({width, height,icon: path.join(__dirname, '/assets/icons')})
  mainWindow.wssPort = tempwsServer.httpserver.address().port
  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, `Client/index.html`),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

import * as websocket from 'websocket';

let webSocketServer = websocket.server;

 function runService() {
  // httpServer.server.listen(httpServer.config.port, () => {
	// 	console.log('Server running at http://localhost:'+httpServer.config.port+'/');
      
  // });
  // tempwsServer.httpserver.listen(tempwsServer.config.wsport, function () {
	// 	console.log((new Date()) + " Server is listening on port " + 1337);
  // });
  tempwsServer.httpserver.listen(0, function() {
    console.log((new Date()) + " Server is listening on port " + tempwsServer.httpserver.address().port);
  });
  
  // let server = new wsServerClass(httpServer.server);
  // server.init();
  // tempwsServer.init(httpServer.server);
  // let server =new webSocketServer({
	// 		// WebSocket server is tied to a HTTP server. WebSocket request is just
	// 		// an enhanced HTTP request. For more info http://tools.ietf.org/html/rfc6455#page-6
	// 		httpServer:  httpServer.server
  //   });
  //   server.on('request',(request:websocket.request) =>{
  //     console.log('im here setRequesTlistner')
  //     request.on('requestResolved', ():void => {
  //       console.log((new Date()) + ' Connection from origin ' + request.origin + '.');
  //     });
  //     request.on('requestRejected', ():void => {
  //       console.log((new Date()) + ' Rejected from origin ' + request.origin + '.');
  //     });
  //     request.on('requestAccepted',this.setConnectionListeners);
  //     request.accept(null, request.origin);
	// });
		
  // tempwsServer.httpserver.listen(tempwsServer.config.wsport, function () {
	// 	console.log((new Date()) + " Server is listening on port " + 1337);
	// });
}
runService();