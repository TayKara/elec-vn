var playable = window.api.sendSync("ask-playable");
var dirname = window.api.sendSync("ask-dirname");
var playedPlayables = window.api.sendSync("ask-played-playables");


var audio = document.getElementById("audioVoice");
var containerLogs = document.getElementById("containerLogs");
var buttonReturn = document.getElementById("buttonReturn");

buttonReturn.addEventListener("click", (ev:Event)=>{
    window.api.send("close-children");
});

function addButtons(listButtons){
    console.log("log playable")
    console.log(playedPlayables);
    
    for(let i=0; i < playedPlayables.length; i++){
        let value = playable.find(element=> (element.id == playedPlayables[i] && element.type == "playable"));
        if(value != null || value != undefined){

            let button = document.createElement("button");
            button.setAttribute("class", "logItem");
            value = playable[i];
            if(value.audioVoice != null && value.audioVoice != undefined){
                button.addEventListener("click", ()=>{
                    audio.setAttribute("src", dirname+"/game/sound/"+value.audioVoice);
                    audio.play();
                });
    
            }
            if(value.text != null && value.text != undefined){
                button.innerText = value.text;
            }
            containerLogs.appendChild(button);
        }
    }

    let button = containerLogs.childNodes[containerLogs.childNodes.length-1];
    button.scrollIntoView();
}

addButtons(playedPlayables);