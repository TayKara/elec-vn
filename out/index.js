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
const ScriptPlayer_1 = require("./ScriptPlayer");
var window;
var isWatched = false;
electron_1.app.on('ready', () => {
    // once electron has started up, create a window.
    fs.watch(path.join(__dirname), { recursive: true }, (eventType, fileName) => {
        if (!isWatched) {
            isWatched = true;
            electron_1.app.relaunch();
            electron_1.app.exit();
        }
    });
    createWindow();
});
function createWindow() {
    window = new electron_1.BrowserWindow({ width: 800, height: 600, webPreferences: {
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
let data = fs.readFileSync(path.join(__dirname, "game/script.json"), { encoding: "utf-8" });
try {
    let player = ScriptPlayer_1.ScriptPlayer.getInstance();
    player.playable = JSON.parse(data);
    console.log(player.playable);
}
catch (exception) {
    console.log(exception);
}
electron_1.ipcMain.on("open", (event, args) => {
    switch (args) {
        case "start": {
            window.loadFile(path.join(__dirname, "start.html"));
            break;
        }
        case "title": {
            window.loadFile(path.join(__dirname, "index.html"));
        }
    }
});
electron_1.ipcMain.on("ask-playable", (event, arg) => {
    event.returnValue = ScriptPlayer_1.ScriptPlayer.getInstance().playable;
});
electron_1.ipcMain.on("ask-dirname", (event, args) => {
    event.returnValue = __dirname;
});
