var playable : JSON;
var dirname : string;
var settings : JSON;
var currentPlayable = -1;
var backgroundImageFront = document.getElementById("backgroundImageFront");
var backgroundImageRear = document.getElementById("backgroundImageRear");
var containerText = document.getElementById("containerText");
var audioBGM = document.getElementById("audioBGM");
var audioVoice = document.getElementById("audioVoice");
var audioEffect = document.getElementById("audioEffect");
var divImages = document.getElementById("preloadImages");
var containerChoices = document.getElementById("containerChoices");

var buttonSkip = document.getElementById("buttonSkip");
var buttonAuto = document.getElementById("buttonAuto");
var buttonLog = document.getElementById("buttonLog");
var buttonSave = document.getElementById("buttonSave");
var buttonLoad = document.getElementById("buttonLoad");
var buttonSettings = document.getElementById("buttonSettings");
var buttonTitle = document.getElementById("buttonTitle");

const MAX_LOADED_IMAGE = 20;
const TYPE_PLAYABLE = "playable";
const TYPE_CHOICE = "choice";
const TYPE_END = "end";
const TYPE_GOTO = "goto";

var preloadImgs = new Array();
var preloadImgPos = 0;
var alreadyPreloadedPlayable = 0;
var intervalWriteText;
var intervalSkip;
var isPreviousTextWritten = true;
var isSkipEnabled = false;
var isAutoEnabled = false;
var isRearBackgroundShown = false;
var idIntervalSwitchBackground;


backgroundImageFront?.addEventListener("click", (ev:Event) => {
    if((ev.target == backgroundImageFront || ev.target == containerText) && !(containerChoices.firstChild)){
        setNormalState();
        playNext();
    }
});

buttonSkip?.addEventListener("click", (ev:Event) => {
    let previous = isSkipEnabled;
    setNormalState();
    isSkipEnabled = !previous;
    skipPlay();
});
buttonAuto?.addEventListener("click", (ev:Event) => {
    let previous = isAutoEnabled;
    setNormalState();
    isAutoEnabled = !previous;
    if(isAutoEnabled)
        playNext();
});
buttonLog?.addEventListener("click", (ev:Event) => {
    window.api.send("open", "log");
    setNormalState();
});
buttonSave?.addEventListener("click", (ev:Event) => {
    window.api.send("open", "save")
    setNormalState();
});
buttonLoad?.addEventListener("click", (ev:Event) => {
    window.api.send("open", "load");
    setNormalState();
});
buttonSettings?.addEventListener("click", (ev:Event) => {
    window.api.send("open", "settings");
    setNormalState();
});
buttonTitle?.addEventListener("click", (ev:Event) => {
        setNormalState();
        window.api.send("open", "title");
});

playable = window.api.sendSync("ask-playable");
dirname = window.api.sendSync("ask-dirname");
settings = window.api.sendSync("ask-settings");

applySettings();

window.api.receive("settings-changed", (args)=>{
    settings = args;
    applySettings();
});

window.api.receive("playable-loaded", (args)=>{
    setNormalState();
    currentPlayable = args - 1;
    playNext();
});

preloadImages(MAX_LOADED_IMAGE);

playNext();

function preloadImages(nbImgToLoad){
    for(let i=0; alreadyPreloadedPlayable < playable.length && i < nbImgToLoad; i++){
        let current = playable[alreadyPreloadedPlayable];
        alreadyPreloadedPlayable++;
        if(current.image != null && current.image != undefined){
            if(preloadImgs[preloadImgPos] != null || preloadImgs[preloadImgPos] != undefined){
                divImages.removeChild(divImages.childNodes[preloadImgPos]);
            }
            preloadImgs[preloadImgPos] = new Image();
            preloadImgs[preloadImgPos].src = dirname + "/game/image/" + current.image;
            divImages.appendChild(preloadImgs[preloadImgPos]);
            preloadImgPos++;
            if(current.image2 != null && current.image2 != undefined){
                
                preloadImgs[preloadImgPos] = new Image();
                preloadImgs[preloadImgPos].src = dirname + "/game/image/" + current.image;
                divImages.appendChild(preloadImgs[preloadImgPos]);
                preloadImgPos++;
            }
            if(preloadImgPos >= MAX_LOADED_IMAGE)
                preloadImgPos = 0;
        }
    }
}

function playNext(){
    clearInterval(idIntervalSwitchBackground);
    backgroundImageFront.style.opacity = "1";
    backgroundImageRear.style.opacity = "0";
    if(isPreviousTextWritten){
        currentPlayable++;
        audioVoice.pause();
        if(currentPlayable < playable.length){
            if(playable[currentPlayable].id != null && playable[currentPlayable].id != undefined)
                window.api.send("set-current-playable-id", playable[currentPlayable].id);
            window.api.send("set-current-playable", currentPlayable);

            let current = playable[currentPlayable];
            let type = "";
            if(current.type != null && current.type != undefined)
                type = current.type;
            if(type == TYPE_CHOICE){
                playChoice(current);
            }
            else if(type == TYPE_GOTO){
                if(current.goto)
                    goTo(current.goto);
            }
            else if(type == TYPE_END){
                playEnd();
            }
            else{
                playPlayable(current);
            }

        }
        else{
            playEnd();
        }
    }else{
        clearInterval(intervalWriteText);
        let current = playable[currentPlayable];
        if(current.text != undefined && current.text != null)
            writeText(current.text, 0);
    }
}

function playChoice(current){

    for(let i=0; i < current.choices.length; i++){
        let buttonChoice = document.createElement("button");
        buttonChoice.setAttribute("class", "buttonChoices");
        buttonChoice.innerText = current.choices[i].text;
        let id = current.choices[i].goto;
        buttonChoice.addEventListener("click", (ev)=>{
            while(containerChoices.firstChild){
                containerChoices.removeChild(containerChoices.firstChild);
            }
            goTo(id);
        });
        containerChoices.appendChild(buttonChoice);
    }
}

function playPlayable(current){
    if(current.text != null && current.text != undefined){
        writeText(current.text, settings.textSpeed);
    }
    if(current.image != null && current.image != undefined){
        backgroundImageFront.style.backgroundImage = "url('"+dirname + "/game/image/" + current.image+"')";
        preloadImages(1);
    }
    if(current.image2 != null && current.image2 != undefined){
        backgroundImageRear.style.backgroundImage = "url('"+dirname + "/game/image/" + current.image2+"')";
        preloadImages(1);
        idIntervalSwitchBackground = setInterval(()=>{
            switchBackround();
        },1000);
    }
    if(current.audioBGM != null && current.audioBGM != undefined){
        audioBGM.setAttribute("src", dirname + "/game/sound/" + current.audioBGM);
        audioBGM.play();
    }
    if(current.audioEffect != null && current.audioEffect != undefined){
        audioEffect.setAttribute("src", dirname + "/game/sound/" + current.audioEffect);
        audioEffect.play();
    }
    if(current.audioVoice != null && current.audioVoice != undefined){
        audioVoice.setAttribute("src", dirname + "/game/sound/" + current.audioVoice);
        audioVoice.play();
        audioVoice.removeEventListener("play", autoPlay);
        audioVoice.addEventListener("play", autoPlay);
    }else{
        autoPlay();
    }
}

function switchBackround(){
    let opacityBackground = 0;
    let idSwitch = setInterval(()=>{
        opacityBackground = opacityBackground + 0.1;
        if(!isRearBackgroundShown){
            backgroundImageFront.style.opacity = (1 - opacityBackground) + "";
            backgroundImageRear.style.opacity = (opacityBackground) + "";
        }else{
            backgroundImageRear.style.opacity = (1 - opacityBackground) + "";
            backgroundImageFront.style.opacity = (opacityBackground) + "";

        }
        if(opacityBackground >= 1){
            isRearBackgroundShown = !isRearBackgroundShown;
            clearInterval(idSwitch);
            opacityBackground = 0;
        }
    }, 50);
}

function playEnd(){
    window.api.send("open", "title");
}

function goTo(id){

    for(let i=0; i < playable.length; i++){
        if(playable[i].id == id){
            currentPlayable = --i;
            break;
        }
    }
    playNext();
}

function writeText(text : string, textSpeed){
    containerText.innerText = "";
    let i = 0;
    if(textSpeed != 0){
        isPreviousTextWritten = false;
        intervalWriteText = setInterval(()=>{
            if(i <= text.length){
                containerText.innerText = text.substring(0, i);
                i++;
            }
            else if(i >= text.length){
                clearInterval(intervalWriteText);
                isPreviousTextWritten = true;
            }
        }, textSpeed);
    }
    else{
        containerText.innerText = text;
        isPreviousTextWritten = true;
    }
}

function autoPlay(){
    setTimeout(()=>{
        if(isAutoEnabled){
            let current = playable[currentPlayable];
            if(current.audioVoice != null && current.audioVoice != undefined){
                let timeout = audioVoice.duration - audioVoice.currentTime;
                if(timeout < 0) timeout = 0;
                setTimeout(()=>{
                    if(isAutoEnabled)
                        playNext();
                }, timeout*1000);
            }else{
                playNext();
            }
        }
    }, 100);
    
}

function skipPlay(){
    let timeout = settings.skipSpeed;
    if(timeout == 0) timeout = 1;
    if(isSkipEnabled){
        intervalSkip = setInterval(()=>{
            if(!isSkipEnabled)
                clearInterval(intervalSkip)
            else
                playNext();
        }, timeout*100);
    }
}

function setNormalState(){
    isSkipEnabled = false;
    isAutoEnabled = false;
}


function applySettings(){
    if(settings != null && settings != undefined){
        applyTextOpacity();
        applyBgmVolume();
        applyVoiceVolume();
        applyEffectVolume();
    }
}

function applyTextOpacity(){
    
    //background-color: rgba(0, 0, 0, 0.5);

    containerText.style.backgroundColor="rgba(0, 0, 0, "+settings.textOpacity*0.01+")";
}

function applyBgmVolume(){
    audioBGM.volume = settings.bgmVolume*0.01;
}

function applyVoiceVolume(){
    audioVoice.volume = settings.voiceVolume*0.01;
}

function applyEffectVolume(){
    audioEffect.volume = settings.effectVolume*0.01;
}
