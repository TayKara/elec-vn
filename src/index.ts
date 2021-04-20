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
        console.log(ev);
    });

document.getElementById("buttonScene")
    ?.addEventListener("click", (ev:Event) => {
        console.log(ev);
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