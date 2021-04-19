var playable = window.api.sendSync("ask-playable");
var currentPlayable = window.api.sendSync("ask-current-playable");
var dirname = window.api.sendSync("ask-dirname");
var audio = document.getElementById("audioVoice");
var containerLogs = document.getElementById("containerLogs");
var buttonReturn = document.getElementById("buttonReturn");
buttonReturn.addEventListener("click", (ev) => {
    window.api.send("close-children");
});
function addButtons(nbButtons) {
    for (let i = 0; i < nbButtons; i++) {
        let button = document.createElement("button");
        button.setAttribute("class", "logItem");
        let current = playable.play[i];
        if (current.audioVoice != null && current.audioVoice != undefined) {
            button.addEventListener("click", () => {
                audio.setAttribute("src", dirname + "/game/sound/" + current.audioVoice);
                audio.play();
            });
        }
        if (current.text != null && current.text != undefined) {
            button.innerText = current.text;
        }
        containerLogs.appendChild(button);
    }
    let button = containerLogs.childNodes[containerLogs.childNodes.length - 1];
    button.scrollIntoView();
}
addButtons(currentPlayable + 1);
