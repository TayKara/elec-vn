var scenes = window.api.sendSync("ask-scenes");
var playables = window.api.sendSync("ask-playable");
var dirname = window.api.sendSync("ask-dirname");
var currentScene = window.api.sendSync("ask-current-scene");

var buttonReturn = document.getElementById("buttonReturn");
var containerScenes = document.getElementById("containerScenes");

buttonReturn.addEventListener("click", (ev:Event)=>{
    window.api.send("close-children");
});

addScenes();

function addScenes(){
    if(scenes != null && scenes != undefined && playables != null && playables != undefined){
        for(let i = 0; i < scenes.length; i++){
            let image;
            for(let j = 0; j < playables.length; j++){
                if(playables[j].image != null && playables[j] != undefined)
                    image = playables[j].image;
                if(playables[j].id == scenes[i].ids[0]){
                    addScene(image, i)
                    break;
                }
            }
        }
        if(currentScene != -1 && currentScene < containerScenes.childNodes.length){

            let current = containerScenes.childNodes[currentScene+1];
            current.scrollIntoView();
        }
    }
}

function addScene(image, choosedScene){
    console.log(image);
    console.log(choosedScene);
    let div = document.createElement("div");
    div.setAttribute("class", "sceneItem");
    div.setAttribute("style", "background-image: url('"+dirname+"/game/image/"+image+"');");
    containerScenes.appendChild(div);
    div.addEventListener("click", (event)=>{
        window.api.send("start-scene", choosedScene);
    });
}