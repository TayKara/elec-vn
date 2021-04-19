var buttonReturn = document.getElementById("buttonReturn");
var buttonScreen = document.getElementById("buttonScreen");
var sliderTextSpeed = document.getElementById("sliderTextSpeed");
var sliderSkipSpeed = document.getElementById("sliderSkipSpeed");
var sliderAutoSpeed = document.getElementById("sliderAutoSpeed");
var sliderTextOpacity = document.getElementById("sliderTextOpacity");
var sliderBGMVolume = document.getElementById("sliderBGMVolume");
var sliderVoiceVolume = document.getElementById("sliderVoiceVolume");
var sliderEffectVolume = document.getElementById("sliderEffectVolume");
var isFull = false;


var settings = window.api.sendSync("ask-settings");

function applySettings(){
    sliderTextSpeed.value = settings.textSpeed;
    sliderSkipSpeed.value = settings.skipSpeed;
    sliderAutoSpeed.value = settings.autoSpeed;
    sliderTextOpacity.value = settings.textOpacity;
    sliderBGMVolume.value = settings.bgmVolume;
    sliderVoiceVolume.value = settings.voiceAudio;
    sliderEffectVolume.value = settings.effectVolume;
    if(settings.screen == "full"){
        buttonScreen.innerText = "Window";
        isFull = true;
    }
    else{
        buttonScreen.innerText = "Full";
        isFull = false;
    }
}

applySettings();

function updateSettings(){
    settings.textSpeed = sliderTextSpeed.value;
    settings.skipSpeed = sliderSkipSpeed.value;
    settings.autoSpeed = sliderAutoSpeed.value;
    settings.textOpacity = sliderTextOpacity.value;
    settings.bgmVolume = sliderBGMVolume.value;
    settings.voiceAudio = sliderVoiceVolume.value;
    settings.effectVolume = sliderEffectVolume.value;
    if(isFull){
        settings.screen = "full";
    }
    else{
        settings.screen = "window";
    }
    window.api.send("set-settings", settings);
}

sliderTextSpeed.oninput = updateSettings;
sliderSkipSpeed.oninput = updateSettings;
sliderAutoSpeed.oninput = updateSettings;
sliderTextOpacity.oninput = updateSettings;
sliderBGMVolume.oninput = updateSettings;
sliderVoiceVolume.oninput = updateSettings;
sliderEffectVolume.oninput = updateSettings;

buttonScreen.addEventListener("click", (ev:Event)=>{
    if(isFull){
        isFull = false;
        buttonScreen.innerText = "Full";
    }
    else{
        isFull = true;
        buttonScreen.innerText = "Window";
    }
    updateSettings();
});

buttonReturn.addEventListener("click", (ev:Event)=>{
    window.api.send("save-settings");
    window.api.send("open", "title");
});
