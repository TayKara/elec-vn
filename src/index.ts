import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import * as fs from 'fs';

var window: BrowserWindow;
var isWatched = false;

app.on('ready', () => {
  // once electron has started up, create a window.
  fs.watch(path.join(__dirname), {recursive:true} , (eventType, fileName)=>{
      if(!isWatched){
        isWatched = true;
        app.relaunch();
        app.exit();
      }
  });
  createWindow();
});

function createWindow(){

    window = new BrowserWindow({ width: 800, height: 600, webPreferences:{
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js")
    } });
  
    // hide the default menu bar that comes with the browser window
    window.setMenuBarVisibility(true);
  
    // load a website to display
    window.loadFile(path.join(__dirname, "index.html"));

    window.webContents.openDevTools();
    }

ipcMain.on("open", (event, args)=>{
  switch(args){
    case "start":{
      window.loadFile(path.join(__dirname, "start.html"));
      break;
    }
  }
})