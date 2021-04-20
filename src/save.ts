var playable = window.api.sendSync("ask-playable");
var currentPlayable = window.api.sendSync("ask-current-playable");
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
    console.log("addButton" + current + " " + length);
    
    let button = document.createElement("button");
    button.setAttribute("class", "saveItem");
    let text;
    let thisButton = current;
    if(current < length){
        text = saves[current].text;
        
        button.addEventListener("click", (ev:Event)=>{
            eraseSave(button, thisButton);
        });
        current++;
        button.innerText = text;
        containerSaves.appendChild(button);
        addButton();
    }else{
        text = "Add new save";
        button.addEventListener("click", (ev:Event)=>{
            console.log(thisButton);
            console.log(length);
            if(thisButton == length){
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

function newSave(button, position){
    let text : string = playable.play[currentPlayable].text;
    if(text.length > 10) text = text.substring(0, 10);
    saves.push({
        "text": text,
        "playable": currentPlayable
    })

    button.innerText = text;
    console.log(saves);
    window.api.send("set-game-saves", saves);
}

function eraseSave(button, position){
    let text : string = playable.play[currentPlayable].text;
    if(text.length > 10) text = text.substring(0, 10);
    console.log(position);
    button.innerText = text;
    saves[position].text = text;
    saves[position].playable = currentPlayable;
    console.log(saves);
    window.api.send("set-game-saves", saves);
}