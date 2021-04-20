import { app, BrowserWindow, ipcMain, webContents } from 'electron';
import * as path from 'path';
import * as fs from 'fs';

var top: BrowserWindow;
var settings : BrowserWindow;
var load : BrowserWindow;
var save : BrowserWindow;
var isWatched = false;
var player;
const defaultGameSettings = {
  "textSpeed":"5",
  "skipSpeed":"5",
  "autoSpeed":"5",
  "textOpacity":"50",
  "screen":"window",
  "bgmVolume":"80",
  "voiceVolume":"100",
  "effectVolume":"80"
};
var gameSettings;
const defaultGameSaves = [];
var gameSaves;
var reopenSettings = false;
var currentPlayable = 0;

loadFiles();

app.on('ready', () => {
  // once electron has started up, create a window.
  fs.watch(path.join(__dirname), {recursive:true} , (eventType, fileName)=>{
      if(!isWatched && !fileName.includes("game")){
        isWatched = true;
        app.relaunch();
        app.exit();
      }
  });
  createWindow();
});

function createWindow(){

  top = new BrowserWindow({ width: 800, height: 600, webPreferences:{
    nodeIntegration: false,
    contextIsolation: true,
    preload: path.join(__dirname, "preload.js")
  } });

  // hide the default menu bar that comes with the browser window
  top.setMenuBarVisibility(true);

  // load a website to display
  top.loadFile(path.join(__dirname, "index.html"));

  top.webContents.openDevTools();

  top.on("resize", ()=>{
    resizeChildWindows();
  });

  top.on("enter-full-screen", ()=>{
    if(reopenSettings){
      settings = openModalWindow("settings");
      reopenSettings = false;
    }
  });


  top.on("leave-full-screen", ()=>{
    if(reopenSettings){
      settings = openModalWindow("settings");
      reopenSettings = false;
    }
  });

  applySettings();

}

function resizeChildWindows(){

  let width = top.getSize()[0] - 100;
  let height = top.getSize()[1] - 100;
  let children = top.getChildWindows();
  for(let i=0; i<children.length; i++){
    children[i].setSize(width, height);
  }

}

function loadFiles(){
  try{
    let scriptPlayable = fs.readFileSync(path.join(__dirname, "game/script.json"), {encoding:"utf-8"});
    player = JSON.parse(scriptPlayable);
    
  }catch(exception){
    console.log(exception);
  
  }

  try{
    let scriptGameSettings = fs.readFileSync(path.join(__dirname, "game/settings.json"), {encoding:"utf-8"});
  
    gameSettings = JSON.parse(scriptGameSettings);
  }catch(exception){
    console.log(exception);
    gameSettings = defaultGameSettings;
    saveSettings();
  }

  try{
    let savesPresent = fs.readFileSync(path.join(__dirname, "game/saves.json"), {encoding:"utf-8"});
    gameSaves = JSON.parse(savesPresent);
  }catch(exception){
    console.log(exception);
    gameSaves = defaultGameSaves;
    saveGameSaves();
  }
}

function saveSettings(){
  fs.writeFile(path.join(__dirname, "game/settings.json"), JSON.stringify(gameSettings), ()=>{});
}

function saveGameSaves(){
  fs.writeFile(path.join(__dirname, "game/saves.json"), JSON.stringify(gameSaves), ()=>{});
}

function applySettings(){

  if(gameSettings.screen == "full" && !top.isFullScreen()
  || gameSettings.screen != "full" && top.isFullScreen()){
    if(settings != null && settings != undefined){
      reopenSettings = true;
      settings.close();
    }
    if(gameSettings.screen == "full") 
      top.fullScreen = true;
    else 
      top.fullScreen = false;
  }
}

function openModalWindow(type){
  var fileToLoad;
  switch(type){
    case "settings":{
      fileToLoad = "settings.html";
      break;
    }
    case "load":{
      fileToLoad = "load.html";
      break;
    }
    case "save":{
      fileToLoad = "save.html";
      break;
    }
    case "log":{
      fileToLoad = "log.html";
    }
  }

  var modalWin = new BrowserWindow({parent:top, modal:true, show:true, frame:false, resizable:false, webPreferences:{
    nodeIntegration: false,
    contextIsolation: true,
    preload: path.join(__dirname, "preload.js")
  }});
  modalWin.webContents.openDevTools();
  modalWin.loadFile(path.join(__dirname, fileToLoad));
  modalWin.on("ready-to-show", ()=>{
    resizeChildWindows();
  });

  return modalWin;

}

function closeChildrenWindows(){

  var childs = top.getChildWindows();
  for(let i=0; i < childs.length; i++){
    childs[i].close()
  }
}


//IPC MESSAGES

ipcMain.on("open", (event, args)=>{
  switch(args){
    case "start":{
      top.loadFile(path.join(__dirname, "start.html"));
      break;
    }
    case "title":{
      closeChildrenWindows();
      top.loadFile(path.join(__dirname, "index.html"));
      break;
    }
    case "settings":{
      settings = openModalWindow("settings");
      break;
    }
    case "load":{
      load = openModalWindow("load");
      break;
    }
    case "save":{
      save = openModalWindow("save");
      break;
    }
    case "log":{
      save = openModalWindow("log");
      break;
    }
  }
});

ipcMain.on("close-children", (event, args)=>{
  closeChildrenWindows();
});

ipcMain.on("ask-playable", (event, arg)=>{
  event.returnValue = player;
});

ipcMain.on("ask-current-playable", (event, arg)=>{
  event.returnValue = currentPlayable;
});

ipcMain.on("ask-dirname", (event, args)=>{
  event.returnValue = __dirname;
});

ipcMain.on("ask-settings", (event, args)=>{
  event.returnValue = gameSettings;
});

ipcMain.on("ask-saves", (event, args)=>{
  event.returnValue = gameSaves;
});

ipcMain.on("set-settings", (event, args)=>{
  gameSettings = args;
  top.webContents.send("settings-changed", gameSettings);
  applySettings();
});

ipcMain.on("save-settings", (event, args)=>{
  saveSettings();
});

ipcMain.on("load-playable", (event, args)=>{
  top.webContents.send("playable-loaded", args);
})

ipcMain.on("set-current-playable", (event, args)=>{
  currentPlayable = args;
});

ipcMain.on("set-game-saves", (event, args)=>{
  gameSaves = args;
  console.log(gameSaves);
  saveGameSaves();
})

ipcMain.on("quit", (event, args)=>{
  closeChildrenWindows();
  top.close();
});