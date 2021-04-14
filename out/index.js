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
var window;
var isWatched = false;
electron_1.app.on('ready', () => {
    // once electron has started up, create a window.
    fs.watch(path.join(__dirname), (eventType, fileName) => {
        if (!isWatched) {
            isWatched = true;
            electron_1.app.relaunch();
            electron_1.app.exit();
        }
    });
    createWindow();
});
function createWindow() {
    window = new electron_1.BrowserWindow({ width: 800, height: 600 });
    // hide the default menu bar that comes with the browser window
    window.setMenuBarVisibility(true);
    // load a website to display
    console.log(path.join(__dirname, "index.html"));
    window.loadFile(path.join(__dirname, "index.html"));
}
