var playable;
var dirname;
var currentPlayable = -1;
var container = document.getElementById("container");
var divImages = document.getElementById("preloadImages");
var preloadImgs = new Array();
var preloadImgPos = 0;
var alreadyPreloadedPlayable = 0;
const MAX_LOADED_IMAGE = 20;
container?.addEventListener("click", (ev) => {
    if (ev.target == container || ev.target == containerText) {
        playNext();
    }
});
playable = window.api.sendSync("ask-playable");
dirname = window.api.sendSync("ask-dirname");
preloadImages(MAX_LOADED_IMAGE);
playNext();
function preloadImages(nbImgToLoad) {
    for (let i = 0; alreadyPreloadedPlayable < playable.length && i < nbImgToLoad; i++) {
        let current = playable[alreadyPreloadedPlayable];
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
    currentPlayable++;
    if (currentPlayable < playable.length) {
        let current = playable[currentPlayable];
        if (current.image != null && current.image != undefined) {
            container.style.backgroundImage = "url('" + dirname + "/game/image/" + current.image + "')";
            preloadImages(1);
        }
    }
    else {
        window.api.send("open", "title");
    }
}
