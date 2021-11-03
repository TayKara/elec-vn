var audioBGM = document.getElementById("audioBGM");

var settings: JSON;
settings = window.api.sendSync("ask-settings");

document.getElementById("buttonStart")
    ?.addEventListener("click", (ev:Event) => {
        openWindow("start");
    });

document.getElementById("buttonLoad")
    ?.addEventListener("click", (ev:Event) => {
        openWindow("load");
    });
    
document.getElementById("buttonCG")
    ?.addEventListener("click", (ev:Event) => {
        openWindow("cg");
    });

document.getElementById("buttonScene")
    ?.addEventListener("click", (ev:Event) => {
        openWindow("scene");
    });

document.getElementById("buttonSettings")
    ?.addEventListener("click", (ev:Event) => {
        openWindow("settings");
    });

document.getElementById("buttonQuit")
    ?.addEventListener("click", (ev:Event) => {
        window.api.send("quit");
    });

function openWindow(message: string){
    //@ts-ignore
    window.api.send("open", message);
    
}

applySettings();

window.api.receive("settings-changed", (args)=>{
    settings = args;
    applySettings();
});

function applySettings(){
    if(settings != null && settings != undefined){
        applyBgmVolume();
    }
}

function applyBgmVolume(){
    audioBGM.volume = settings.bgmVolume*0.01;
}