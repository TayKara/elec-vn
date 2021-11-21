var scenes = window.api.sendSync("ask-scenes");
var objects = window.api.sendSync("ask-object");
var dirname = window.api.sendSync("ask-dirname");
var currentScene = window.api.sendSync("ask-current-scene");

var buttonReturn = document.getElementById("buttonReturn");
var containerScenes = document.getElementById("containerScenes");

buttonReturn.addEventListener("click", (ev:Event)=>{
    window.api.send("close-children");
});

addScenes();

function addScenes(){
    if(scenes && objects){
        for(let i = 0; i < scenes.length; i++){
            let image;
            for(let j = 0; j < objects.length; j++){
                if(objects[j].image)
                    image = objects[j].image;
                if(objects[j].id == scenes[i].ids[0]){
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