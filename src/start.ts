var playable : JSON;
var dirname : string;
var currentPlayable = -1;
var container = document.getElementById("container");
var containerText = document.getElementById("containerText");
var textPlay = document.getElementById("textPlay");

container
    ?.addEventListener("click", (ev:Event) => {
        if(ev.target == container || ev.target == containerText){
            playNext();
        }
    });

document.getElementById("buttonSkip")
    ?.addEventListener("click", (ev:Event) => {
        console.log("skip");
        console.log(ev);
    });

//@ts-ignore
playable = window.api.sendSync("ask-playable");
dirname = window.api.sendSync("ask-dirname");
playNext();

function playNext(){
    currentPlayable++;
    if(currentPlayable < playable.play.length){

        let current = playable.play[currentPlayable];
        if(current.text != null && current.text != undefined)
            textPlay.innerText = current.text
        if(current.image != null && current.image != undefined){
            container.style.backgroundImage = "url('"+dirname + "/game/image/" + current.image+"')";
        }
    }
    else{
        window.api.send("open", "title");
    }
}