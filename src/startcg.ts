var object : JSON;
var dirname : string;
var currentObject = -1;
var container = document.getElementById("container");
var divImages = document.getElementById("preloadImages");
var preloadImgs = new Array();
var preloadImgPos = 0;
var alreadyPreloadedObject = 0;

const MAX_LOADED_IMAGE = 20;


container?.addEventListener("click", (ev:Event) => {
    if(ev.target == container || ev.target == containerText){
        playNext();
    }
});


object = window.api.sendSync("ask-object");
dirname = window.api.sendSync("ask-dirname");


preloadImages(MAX_LOADED_IMAGE);

playNext();

function preloadImages(nbImgToLoad){
    for(let i=0; alreadyPreloadedObject < object.length && i < nbImgToLoad; i++){
        let current = object[alreadyPreloadedObject];
        alreadyPreloadedObject++;
        if(current.image){
            if(preloadImgs[preloadImgPos]){
                divImages.removeChild(divImages.childNodes[preloadImgPos]);
            }
            preloadImgs[preloadImgPos] = new Image();
            preloadImgs[preloadImgPos].src = dirname + "/game/image/" + current.image;
            divImages.appendChild(preloadImgs[preloadImgPos]);
            preloadImgPos++;
            if(preloadImgPos >= MAX_LOADED_IMAGE)
                preloadImgPos = 0;
        }
    }
}

function playNext(){
    currentObject++;
    if(currentObject < object.length){

        let current = object[currentObject];

        if(current.image){
            container.style.backgroundImage = "url('"+dirname + "/game/image/" + current.image+"')";
            preloadImages(1);
        }

    }
    else{
        window.api.send("open", "title");
    }
}