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
    console.log(ev);
});
document.getElementById("buttonScene")
    ?.addEventListener("click", (ev) => {
    console.log(ev);
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
