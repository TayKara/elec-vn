var playable;
var dirname;
var settings;
var currentPlayable = -1;
var container = document.getElementById("container");
var containerText = document.getElementById("containerText");
var audioBGM = document.getElementById("audioBGM");
var audioVoice = document.getElementById("audioVoice");
var audioEffect = document.getElementById("audioEffect");
var divImages = document.getElementById("preloadImages");
var buttonSkip = document.getElementById("buttonSkip");
var buttonAuto = document.getElementById("buttonAuto");
var buttonLog = document.getElementById("buttonLog");
var buttonSave = document.getElementById("buttonSave");
var buttonLoad = document.getElementById("buttonLoad");
var buttonSettings = document.getElementById("buttonSettings");
var buttonTitle = document.getElementById("buttonTitle");
var preloadImgs = new Array();
var preloadImgPos = 0;
var alreadyPreloadedPlayable = 0;
const MAX_LOADED_IMAGE = 20;
var intervalWriteText;
var intervalSkip;
var isPreviousTextWritten = true;
var isSkipEnabled = false;
var isAutoEnabled = false;
container?.addEventListener("click", (ev) => {
    if (ev.target == container || ev.target == containerText) {
        setNormalState();
        playNext();
    }
});
buttonSkip?.addEventListener("click", (ev) => {
    let previous = isSkipEnabled;
    setNormalState();
    isSkipEnabled = !previous;
    skipPlay();
});
buttonAuto?.addEventListener("click", (ev) => {
    let previous = isAutoEnabled;
    setNormalState();
    isAutoEnabled = !previous;
    if (isAutoEnabled)
        playNext();
});
buttonLog?.addEventListener("click", (ev) => {
    console.log("log");
    console.log(ev);
});
buttonSave?.addEventListener("click", (ev) => {
    console.log("save");
    console.log(ev);
});
buttonLoad?.addEventListener("click", (ev) => {
    console.log("load");
    console.log(ev);
});
buttonSettings?.addEventListener("click", (ev) => {
    window.api.send("open", "settings");
});
buttonTitle?.addEventListener("click", (ev) => {
    window.api.send("open", "title");
});
playable = window.api.sendSync("ask-playable");
dirname = window.api.sendSync("ask-dirname");
settings = window.api.sendSync("ask-settings");
applySettings();
window.api.receive("settings-changed", (args) => {
    settings = args;
    applySettings();
});
preloadImages(MAX_LOADED_IMAGE);
playNext();
function preloadImages(nbImgToLoad) {
    for (let i = 0; alreadyPreloadedPlayable < playable.play.length && i < nbImgToLoad; i++) {
        let current = playable.play[alreadyPreloadedPlayable];
        alreadyPreloadedPlayable++;
        if (current.image != null && current.image != undefined) {
            if (preloadImgs[preloadImgPos] != null || preloadImgs[preloadImgPos] != undefined) {
                divImages.removeChild(divImages.childNodes[preloadImgPos]);
            }
            preloadImgs[preloadImgPos] = new Image();
            preloadImgs[preloadImgPos].src = dirname + "/game/image/" + current.image;
            divImages.appendChild(preloadImgs[preloadImgPos]);
            preloadImgPos++;
            if (preloadImgPos >= MAX_LOADED_IMAGE)
                preloadImgPos = 0;
        }
    }
}
function playNext() {
    if (isPreviousTextWritten) {
        currentPlayable++;
        audioVoice.pause();
        if (currentPlayable < playable.play.length) {
            let current = playable.play[currentPlayable];
            if (current.text != null && current.text != undefined) {
                writeText(current.text, settings.textSpeed);
            }
            if (current.image != null && current.image != undefined) {
                container.style.backgroundImage = "url('" + dirname + "/game/image/" + current.image + "')";
                preloadImages(1);
            }
            if (current.audioBGM != null && current.audioBGM != undefined) {
                audioBGM.setAttribute("src", dirname + "/game/sound/" + current.audioBGM);
                audioBGM.play();
            }
            if (current.audioEffect != null && current.audioEffect != undefined) {
                audioEffect.setAttribute("src", dirname + "/game/sound/" + current.audioEffect);
                audioEffect.play();
            }
            if (current.audioVoice != null && current.audioVoice != undefined) {
                audioVoice.setAttribute("src", dirname + "/game/sound/" + current.audioVoice);
                audioVoice.play();
                audioVoice.removeEventListener("play", autoPlay);
                audioVoice.addEventListener("play", autoPlay);
            }
            else {
                autoPlay();
            }
        }
        else {
            window.api.send("open", "title");
        }
    }
    else {
        clearInterval(intervalWriteText);
        let current = playable.play[currentPlayable];
        if (current.text != undefined && current.text != null)
            writeText(current.text, 0);
    }
}
function writeText(text, textSpeed) {
    containerText.innerText = "";
    let i = 0;
    if (textSpeed != 0) {
        isPreviousTextWritten = false;
        intervalWriteText = setInterval(() => {
            if (i < text.length) {
                containerText.innerText = text.substring(0, i);
                i++;
            }
            else if (i >= text.length) {
                clearInterval(intervalWriteText);
                isPreviousTextWritten = true;
            }
        }, textSpeed);
    }
    else {
        containerText.innerText = text;
        isPreviousTextWritten = true;
    }
}
function autoPlay() {
    console.log("autoPlay");
    console.log(isAutoEnabled);
    setTimeout(() => {
        if (isAutoEnabled) {
            let current = playable.play[currentPlayable];
            if (current.audioVoice != null && current.audioVoice != undefined) {
                let timeout = audioVoice.duration - audioVoice.currentTime;
                if (timeout < 0)
                    timeout = 0;
                setTimeout(() => {
                    if (isAutoEnabled)
                        playNext();
                }, timeout * 1000);
            }
            else {
                playNext();
            }
        }
    }, 100);
}
function skipPlay() {
    let timeout = settings.skipSpeed;
    if (timeout == 0)
        timeout = 1;
    if (isSkipEnabled) {
        intervalSkip = setInterval(() => {
            if (!isSkipEnabled)
                clearInterval(intervalSkip);
            else
                playNext();
        }, timeout * 100);
    }
}
function setNormalState() {
    isSkipEnabled = false;
    isAutoEnabled = false;
}
function applySettings() {
    console.log(settings);
    if (settings != null && settings != undefined) {
        applyTextOpacity();
        applyBgmVolume();
        applyVoiceVolume();
        applyEffectVolume();
    }
}
function applyTextOpacity() {
    //background-color: rgba(0, 0, 0, 0.5);
    containerText.style.backgroundColor = "rgba(0, 0, 0, " + settings.textOpacity * 0.01 + ")";
}
function applyBgmVolume() {
    audioBGM.volume = settings.bgmVolume * 0.01;
}
function applyVoiceVolume() {
    audioVoice.volume = settings.voiceVolume * 0.01;
}
function applyEffectVolume() {
    audioEffect.volume = settings.effectVolume * 0.01;
}
