var object = window.api.sendSync("ask-object");
var saves = window.api.sendSync("ask-saves");

var containerSaves = document.getElementById("containerSaves");
var buttonReturn = document.getElementById("buttonReturn");

var current = 0;
var length = 0;

buttonReturn.addEventListener("click", (ev:Event)=>{
    window.api.send("close-children");
});

addButtons();

function addButtons(){

    if(saves != null && saves != undefined){
        length = saves.length;
    }
    
    addButton();

}



function addButton(){
    
    if(current < length){
        let button = document.createElement("button");
        button.setAttribute("class", "loadItem");
        let text;
        let thisButton = current;
        text = saves[thisButton].text;
        
        button.addEventListener("click", (ev:Event)=>{
            window.api.send("load-game", [thisButton,saves[thisButton].objectId]);
            window.api.send("close-children");
        });
        current++;
        button.innerText = text;
        containerSaves.appendChild(button);
        addButton();
    }
}