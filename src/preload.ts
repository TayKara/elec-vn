import {ipcRenderer, ContextBridge, contextBridge} from "electron";

contextBridge.exposeInMainWorld(
    "api",{
        send: (channel:any, data:any)=>{
            ipcRenderer.send(channel, data);
        },
        receive: (channel:any, func:any)=>{
            
            ipcRenderer.on(channel, (event, ...args) => func(...args));
        }
    }
)