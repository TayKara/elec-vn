var audioBGM = document.getElementById("audioBGM");
var settings;
settings = window.api.sendSync("ask-settings");
document.getElementById("buttonStart")
    ?.addEventListener("click", (ev) => {
    openWindow("start");
});
document.getElementById("buttonLoad")
    ?.addEventListener("click", (ev) => {
    openWindow("load");
});
document.getElementById("buttonCG")
    ?.addEventListener("click", (ev) => {
    openWindow("cg");
});
document.getElementById("buttonScene")
    ?.addEventListener("click", (ev) => {
    openWindow("scene");
});
document.getElementById("buttonSettings")
    ?.addEventListener("click", (ev) => {
    openWindow("settings");
});
document.getElementById("buttonQuit")
    ?.addEventListener("click", (ev) => {
    window.api.send("quit");
});
function openWindow(message) {
    //@ts-ignore
    window.api.send("open", message);
}
applySettings();
window.api.receive("settings-changed", (args) => {
    settings = args;
    applySettings();
});
function applySettings() {
    if (settings != null && settings != undefined) {
        applyBgmVolume();
    }
}
function applyBgmVolume() {
    audioBGM.volume = settings.bgmVolume * 0.01;
}
