import { app, BrowserWindow } from 'electron';
import * as path from 'path';
import * as fs from 'fs';

var window: BrowserWindow;
var isWatched = false;

app.on('ready', () => {

  // once electron has started up, create a window.
  fs.watch(path.join(__dirname), (eventType, fileName)=>{
      if(!isWatched){
        isWatched = true;
        app.relaunch();
        app.exit();
      }
  });
  createWindow();
});

function createWindow(){

    window = new BrowserWindow({ width: 800, height: 600 });
  
    // hide the default menu bar that comes with the browser window
    window.setMenuBarVisibility(true);
  
    // load a website to display
    console.log(path.join(__dirname, "index.html"));
    window.loadFile(path.join(__dirname, "index.html"));
}
