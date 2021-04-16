"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
electron_1.contextBridge.exposeInMainWorld("api", {
    send: (channel, data) => {
        electron_1.ipcRenderer.send(channel, data);
    },
    receive: (channel, func) => {
        electron_1.ipcRenderer.on(channel, (event, ...args) => func(...args));
    },
    sendSync: (channel, data) => {
        return electron_1.ipcRenderer.sendSync(channel, data);
    }
});
