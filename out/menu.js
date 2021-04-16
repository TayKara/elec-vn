document.getElementById("buttonStart")
    ?.addEventListener("click", (ev) => {
    openWindow("start");
});
document.getElementById("buttonLoad")
    ?.addEventListener("click", (ev) => {
    console.log(ev);
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
    console.log(ev);
});
document.getElementById("buttonQuit")
    ?.addEventListener("click", (ev) => {
    console.log(ev);
});
function openWindow(message) {
    //@ts-ignore
    window.api.send("open", message);
}
