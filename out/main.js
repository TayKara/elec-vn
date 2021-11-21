"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const ObjectGenerator_1 = require("./ObjectGenerator");
const STATE_SCENE = "SCENE";
const STATE_CG = "CG";
const STATE_PLAY = "PLAY";
const STATE_LOAD = "LOAD";
const STATE_INIT = "INIT";
var top;
var settings;
var load;
var save;
var log;
var scene;
var cg;
var isWatched = false;
var player;
const defaultGameSettings = {
    "textSpeed": "5",
    "skipSpeed": "5",
    "autoSpeed": "5",
    "textOpacity": "50",
    "screen": "window",
    "bgmVolume": "80",
    "voiceVolume": "100",
    "effectVolume": "80"
};
var meta;
var gameSettings;
const defaultGameSaves = [];
var gameSaves;
const defaultGameScenes = [];
var gameScenes;
const defaultGameCGs = [];
var gameCGs;
var playedObjects = [];
var reopenSettings = false;
var currentObject = 0;
var currentObjectId = -1;
var currentScene = -1;
var currentSceneObject;
var currentCG = -1;
var currentCGObject;
var currentLoadObject;
var currentState = STATE_INIT;
loadFiles();
electron_1.app.on('ready', () => {
    // once electron has started up, create a window.
    fs.watch(path.join(__dirname), { recursive: true }, (eventType, fileName) => {
        if (!isWatched && !fileName.includes("game")) {
            isWatched = true;
            electron_1.app.relaunch();
            electron_1.app.exit();
        }
    });
    createWindow();
});
function createWindow() {
    let gameTitle = "Elec VN";
    if (meta && meta.title)
        gameTitle = meta.title;
    top = new electron_1.BrowserWindow({ title: gameTitle, width: 800, height: 600, webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, "preload.js")
        } });
    // hide the default menu bar that comes with the browser window
    top.setMenuBarVisibility(true);
    // load a website to display
    top.loadFile(path.join(__dirname, "index.html"));
    top.webContents.openDevTools();
    top.on("resize", () => {
        resizeChildWindows();
    });
    top.on("enter-full-screen", () => {
        if (reopenSettings) {
            settings = openModalWindow("settings");
            reopenSettings = false;
        }
    });
    top.on("leave-full-screen", () => {
        if (reopenSettings) {
            settings = openModalWindow("settings");
            reopenSettings = false;
        }
    });
    applySettings();
}
function resizeChildWindows() {
    let width = top.getSize()[0] - 100;
    let height = top.getSize()[1] - 100;
    let children = top.getChildWindows();
    for (let i = 0; i < children.length; i++) {
        children[i].setSize(width, height);
    }
}
function loadFiles() {
    try {
        let metaFile = fs.readFileSync(path.join(__dirname, "game/meta.json"), { encoding: "utf-8" });
        meta = JSON.parse(metaFile);
    }
    catch (exception) {
        console.log(exception);
    }
    try {
        let scriptObject = fs.readFileSync(path.join(__dirname, "game/script.json"), { encoding: "utf-8" });
        player = JSON.parse(scriptObject);
    }
    catch (exception) {
        console.log(exception);
    }
    try {
        let scriptGameSettings = fs.readFileSync(path.join(__dirname, "game/settings.json"), { encoding: "utf-8" });
        gameSettings = JSON.parse(scriptGameSettings);
    }
    catch (exception) {
        console.log(exception);
        gameSettings = defaultGameSettings;
        saveSettings();
    }
    try {
        let savesPresent = fs.readFileSync(path.join(__dirname, "game/saves.json"), { encoding: "utf-8" });
        gameSaves = JSON.parse(savesPresent);
    }
    catch (exception) {
        console.log(exception);
        gameSaves = defaultGameSaves;
        saveGameSaves();
    }
    try {
        let scenesFile = fs.readFileSync(path.join(__dirname, "game/scenes.json"), { encoding: "utf-8" });
        gameScenes = JSON.parse(scenesFile);
    }
    catch (exception) {
        console.log(exception);
        gameScenes = defaultGameScenes;
        saveGameScenes();
    }
    try {
        let cgsFile = fs.readFileSync(path.join(__dirname, "game/cgs.json"), { encoding: "utf-8" });
        gameCGs = JSON.parse(cgsFile);
    }
    catch (exception) {
        console.log(exception);
        gameCGs = defaultGameCGs;
        saveGameCGs();
    }
}
function saveSettings() {
    fs.writeFile(path.join(__dirname, "game/settings.json"), JSON.stringify(gameSettings), () => { });
}
function saveGameSaves() {
    fs.writeFile(path.join(__dirname, "game/saves.json"), JSON.stringify(gameSaves), () => { });
}
function saveGameScenes() {
    fs.writeFile(path.join(__dirname, "game/scenes.json"), JSON.stringify(gameScenes), () => { });
}
function saveGameCGs() {
    fs.writeFile(path.join(__dirname, "game/cgs.json"), JSON.stringify(gameCGs), () => { });
}
function applySettings() {
    if (gameSettings.screen == "full" && !top.isFullScreen()
        || gameSettings.screen != "full" && top.isFullScreen()) {
        if (settings != null && settings != undefined) {
            reopenSettings = true;
            settings.close();
        }
        if (gameSettings.screen == "full")
            top.fullScreen = true;
        else
            top.fullScreen = false;
    }
}
function openModalWindow(type) {
    var fileToLoad;
    switch (type) {
        case "settings": {
            fileToLoad = "settings.html";
            break;
        }
        case "load": {
            fileToLoad = "load.html";
            break;
        }
        case "save": {
            fileToLoad = "save.html";
            break;
        }
        case "log": {
            fileToLoad = "log.html";
            break;
        }
        case "scene": {
            fileToLoad = "scene.html";
            break;
        }
        case "cg": {
            fileToLoad = "cg.html";
        }
    }
    var modalWin = new electron_1.BrowserWindow({ parent: top, modal: true, show: true, frame: false, resizable: false, webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, "preload.js")
        } });
    modalWin.webContents.openDevTools();
    modalWin.loadFile(path.join(__dirname, fileToLoad));
    modalWin.on("ready-to-show", () => {
        resizeChildWindows();
    });
    return modalWin;
}
function closeChildrenWindows() {
    var childs = top.getChildWindows();
    for (let i = 0; i < childs.length; i++) {
        childs[i].close();
    }
}
function reopenPreviousState() {
    switch (currentState) {
        case STATE_SCENE: {
            scene = openModalWindow("scene");
            break;
        }
        case STATE_CG: {
            cg = openModalWindow("cg");
            break;
        }
        case STATE_PLAY: {
            break;
        }
        case STATE_INIT: {
            break;
        }
        case STATE_LOAD: {
            break;
        }
    }
    currentState = STATE_INIT;
}
function openWindow(args) {
    switch (args) {
        case "start": {
            top.loadFile(path.join(__dirname, "start.html"));
            break;
        }
        case "cinematics": {
            if (currentState != STATE_SCENE)
                top.loadFile(path.join(__dirname, "cinematics.html"));
            else
                openWindow("title");
            break;
        }
        case "title": {
            playedObjects = [];
            closeChildrenWindows();
            reopenPreviousState();
            top.loadFile(path.join(__dirname, "index.html"));
            break;
        }
        case "settings": {
            settings = openModalWindow("settings");
            break;
        }
        case "load": {
            load = openModalWindow("load");
            break;
        }
        case "save": {
            save = openModalWindow("save");
            break;
        }
        case "log": {
            log = openModalWindow("log");
            break;
        }
        case "scene": {
            scene = openModalWindow("scene");
            break;
        }
        case "cg": {
            cg = openModalWindow("cg");
            break;
        }
    }
}
//IPC MESSAGES
electron_1.ipcMain.on("open", (event, args) => {
    openWindow(args);
});
electron_1.ipcMain.on("close-children", (event, args) => {
    closeChildrenWindows();
});
electron_1.ipcMain.on("ask-object", (event, arg) => {
    if (currentState == STATE_SCENE) {
        event.returnValue = currentSceneObject;
    }
    else if (currentState == STATE_CG) {
        event.returnValue = currentCGObject;
    }
    else if (currentState == STATE_LOAD) {
        event.returnValue = currentLoadObject;
    }
    else {
        event.returnValue = player;
    }
});
electron_1.ipcMain.on("ask-current-object", (event, arg) => {
    event.returnValue = currentObject;
});
electron_1.ipcMain.on("ask-current-object-id", (event, arg) => {
    event.returnValue = currentObjectId;
});
electron_1.ipcMain.on("ask-dirname", (event, args) => {
    event.returnValue = __dirname;
});
electron_1.ipcMain.on("ask-settings", (event, args) => {
    event.returnValue = gameSettings;
});
electron_1.ipcMain.on("ask-saves", (event, args) => {
    event.returnValue = gameSaves;
});
electron_1.ipcMain.on("ask-scenes", (event, args) => {
    event.returnValue = gameScenes;
});
electron_1.ipcMain.on("ask-cgs", (event, args) => {
    event.returnValue = gameCGs;
});
electron_1.ipcMain.on("ask-current-scene", (event, args) => {
    event.returnValue = currentScene;
    currentScene = -1;
});
electron_1.ipcMain.on("ask-current-cg", (event, args) => {
    event.returnValue = currentCG;
    currentCG = -1;
});
electron_1.ipcMain.on("ask-played-objects", (event, args) => {
    event.returnValue = playedObjects;
});
electron_1.ipcMain.on("set-settings", (event, args) => {
    gameSettings = args;
    top.webContents.send("settings-changed", gameSettings);
    applySettings();
});
electron_1.ipcMain.on("save-settings", (event, args) => {
    saveSettings();
});
electron_1.ipcMain.on("load-game", (event, args) => {
    currentState = STATE_LOAD;
    playedObjects = gameSaves[args[0]].playedObjects;
    currentLoadObject = ObjectGenerator_1.ObjectGenerator.getObjectByLoad(player, args[1]);
    top.loadFile(path.join(__dirname, "start.html"));
});
electron_1.ipcMain.on("set-current-object", (event, args) => {
    currentObject = args;
});
electron_1.ipcMain.on("set-current-object-id", (event, args) => {
    currentObjectId = args;
    if (playedObjects.length == 0 || playedObjects[playedObjects.length - 1] != currentObjectId) {
        playedObjects.push(currentObjectId);
    }
    console.log("current object id : " + currentObjectId);
    console.log(playedObjects);
});
electron_1.ipcMain.on("set-game-saves", (event, args) => {
    gameSaves = args;
    console.log(gameSaves);
    saveGameSaves();
});
electron_1.ipcMain.on("start-scene", (event, args) => {
    if (!isNaN(args)) {
        currentState = STATE_SCENE;
        currentSceneObject = ObjectGenerator_1.ObjectGenerator.getObjectByScenes(player, gameScenes[args]);
        currentScene = args;
        closeChildrenWindows();
        top.loadFile(path.join(__dirname, "start.html"));
    }
});
electron_1.ipcMain.on("start-cg", (event, args) => {
    if (!isNaN(args)) {
        currentState = STATE_CG;
        currentCGObject = ObjectGenerator_1.ObjectGenerator.getObjectByCGs(player, gameCGs[args]);
        currentCG = args;
        closeChildrenWindows();
        top.loadFile(path.join(__dirname, "startcg.html"));
    }
});
electron_1.ipcMain.on("quit", (event, args) => {
    closeChildrenWindows();
    top.close();
});
