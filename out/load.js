var playable = window.api.sendSync("ask-playable");
var currentPlayable = window.api.sendSync("ask-current-playable");
var saves = window.api.sendSync("ask-saves");
var containerSaves = document.getElementById("containerSaves");
var buttonReturn = document.getElementById("buttonReturn");
var current = 0;
var length = 0;
buttonReturn.addEventListener("click", (ev) => {
    window.api.send("close-children");
});
addButtons();
function addButtons() {
    if (saves != null && saves != undefined) {
        length = saves.length;
    }
    addButton();
}
function addButton() {
    console.log("addButton" + current + " " + length);
    if (current < length) {
        let button = document.createElement("button");
        button.setAttribute("class", "loadItem");
        let text;
        let thisButton = current;
        text = saves[current].text;
        button.addEventListener("click", (ev) => {
            window.api.send("load-playable", saves[thisButton].playable);
            window.api.send("close-children");
        });
        current++;
        button.innerText = text;
        containerSaves.appendChild(button);
        addButton();
    }
}
