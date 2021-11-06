var playable = window.api.sendSync("ask-playable");
var currentPlayable = window.api.sendSync("ask-current-playable");
var currentPlayableId = window.api.sendSync("ask-current-playable-id");
var playedPlayables = window.api.sendSync("ask-played-playables");
console.log("played playables");
console.log(playedPlayables);
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
    let button = document.createElement("button");
    button.setAttribute("class", "saveItem");
    let text;
    let thisButton = current;
    if (current < length) {
        text = saves[current].text;
        button.addEventListener("click", (ev) => {
            eraseSave(button, thisButton);
        });
        current++;
        button.innerText = text;
        containerSaves.appendChild(button);
        addButton();
    }
    else {
        text = "Add new save";
        button.addEventListener("click", (ev) => {
            console.log(thisButton);
            console.log(length);
            if (thisButton == length) {
                newSave(button, current);
                current++;
                length++;
                addButton();
            }
        });
        button.innerText = text;
        containerSaves.appendChild(button);
    }
}
function newSave(button, position) {
    let text = playable[currentPlayable].text;
    console.log(text);
    if (text == null || text == undefined)
        text = "Save";
    if (text.length > 10)
        text = text.substring(0, 10) + "...";
    text = text + "\nDate: " + (new Date).toLocaleString();
    saves.push({
        "text": text,
        "playableId": currentPlayableId,
        "playedPlayables": playedPlayables
    });
    button.innerText = text;
    console.log(saves);
    window.api.send("set-game-saves", saves);
}
function eraseSave(button, position) {
    let text = playable[currentPlayable].text;
    console.log(text);
    if (text == null || text == undefined)
        text = "Save";
    if (text.length > 10)
        text = text.substring(0, 10) + "...";
    text = text + "\nDate: " + (new Date).toLocaleString();
    console.log(position);
    button.innerText = text;
    saves[position].text = text;
    saves[position].playableId = currentPlayableId;
    console.log(saves);
    window.api.send("set-game-saves", saves);
}
