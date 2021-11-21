var cgs = window.api.sendSync("ask-cgs");
var objects = window.api.sendSync("ask-object");
var dirname = window.api.sendSync("ask-dirname");
var currentCG = window.api.sendSync("ask-current-cg");

var buttonReturn = document.getElementById("buttonReturn");
var containerCGs = document.getElementById("containerCGs");

buttonReturn.addEventListener("click", (ev:Event)=>{
    window.api.send("close-children");
});

addCGs();

function addCGs(){
    if(cgs && objects){
        for(let i = 0; i < cgs.length; i++){
            let image;
            for(let j = 0; j < objects.length; j++){
                if(objects[j].image)
                    image = objects[j].image;
                if(objects[j].id == cgs[i].ids[0]){
                    addCG(image, i)
                    break;
                }
            }
        }
        if(currentCG != -1 && currentCG < containerCGs.childNodes.length){

            let current = containerCGs.childNodes[currentCG+1];
            current.scrollIntoView();
        }
    }
}

function addCG(image, choosedCG){
    console.log(image);
    console.log(choosedCG);
    let div = document.createElement("div");
    div.setAttribute("class", "cgItem");
    div.setAttribute("style", "background-image: url('"+dirname+"/game/image/"+image+"');");
    containerCGs.appendChild(div);
    div.addEventListener("click", (event)=>{
        window.api.send("start-cg", choosedCG);
    });
}