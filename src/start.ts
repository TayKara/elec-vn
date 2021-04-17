var playable : JSON;
var dirname : string;
var currentPlayable = -1;
var container = document.getElementById("container");
var containerText = document.getElementById("containerText");
var audioBGM = document.getElementById("audioBGM");
var audioVoice = document.getElementById("audioVoice");
var audioEffect = document.getElementById("audioEffect");
var divImages = document.getElementById("preloadImages");
var preloadImgs = new Array();
var preloadImgPos = 0;
var alreadyPreloadedPlayable = 0;
const MAX_LOADED_IMAGE = 20;
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
preloadImages(MAX_LOADED_IMAGE);
playNext();

function preloadImages(nbImgToLoad){
    for(let i=0; alreadyPreloadedPlayable < playable.play.length && i < nbImgToLoad; i++){
        let current = playable.play[alreadyPreloadedPlayable];
        alreadyPreloadedPlayable++;
        if(current.image != null && current.image != undefined){
            if(preloadImgs[preloadImgPos] != null || preloadImgs[preloadImgPos] != undefined){
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
    currentPlayable++;
    audioVoice.pause();
    if(currentPlayable < playable.play.length){

        let current = playable.play[currentPlayable];
        if(current.text != null && current.text != undefined){
            containerText.innerText = current.text
        }
        if(current.image != null && current.image != undefined){
            container.style.backgroundImage = "url('"+dirname + "/game/image/" + current.image+"')";
            preloadImages(1);
        }
        if(current.audioBGM != null && current.audioBGM != undefined){
            audioBGM.setAttribute("src", dirname + "/game/sound/" + current.audioBGM);
            audioBGM.play();
        }
        if(current.audioVoice != null && current.audioVoice != undefined){
            audioVoice.setAttribute("src", dirname + "/game/sound/" + current.audioVoice);
            audioVoice.play();
        }
        if(current.audioEffect != null && current.audioEffect != undefined){
            audioEffect.setAttribute("src", dirname + "/game/sound/" + current.audioEffect);
            audioEffect.play();
        }

    }
    else{
        window.api.send("open", "title");
    }
}