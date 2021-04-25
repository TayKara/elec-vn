"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayableGenerator = void 0;
class PlayableGenerator {
    static getPlayableByScenes(playables, scene) {
        let copyPlayables = JSON.parse(JSON.stringify(playables));
        let image;
        let audioBGM;
        let i = 0;
        while (i < copyPlayables.length) {
            if (copyPlayables[i].image != null && copyPlayables[i].image != undefined) {
                image = copyPlayables[i].image;
            }
            if (copyPlayables[i].audioBGM != null && copyPlayables[i].audioBGM != undefined) {
                audioBGM = copyPlayables[i].audioBGM;
            }
            if (scene.ids.includes(copyPlayables[i].id)) {
                if (copyPlayables[i].id == scene.ids[0]) {
                    if (image != null && image != undefined && (copyPlayables[i].image == null || copyPlayables[i].image == undefined))
                        copyPlayables[i].image = image;
                    if (audioBGM != undefined && audioBGM != null && (copyPlayables[0].audioBGM == undefined || copyPlayables[0].audioBGM == null))
                        copyPlayables[0].audioBGM = audioBGM;
                }
                i++;
            }
            else {
                copyPlayables.splice(i, 1);
            }
        }
        return copyPlayables;
    }
    static getPlayableByCGs(playables, cg) {
        let copyPlayables = JSON.parse(JSON.stringify(playables));
        let image;
        let i = 0;
        while (i < copyPlayables.length) {
            if (copyPlayables[i].image != null && copyPlayables[i].image != undefined) {
                image = copyPlayables[i].image;
            }
            if (cg.ids.includes(copyPlayables[i].id)) {
                if (copyPlayables[i].image == null || copyPlayables[i].image == undefined) {
                    copyPlayables.splice(i, 1);
                }
                else {
                    i++;
                }
            }
            else {
                copyPlayables.splice(i, 1);
            }
        }
        return copyPlayables;
    }
    static getPlayableByLoad(playables, load) {
        let copyPlayables = JSON.parse(JSON.stringify(playables));
        let image;
        let audioBGM;
        let i = 0;
        if (load < copyPlayables.length) {
            while (i < load) {
                if (copyPlayables[i].image != null && copyPlayables[i].image != undefined) {
                    image = copyPlayables[i].image;
                }
                if (copyPlayables[i].audioBGM != null && copyPlayables[i].audioBGM != undefined) {
                    audioBGM = copyPlayables[i].audioBGM;
                }
                i++;
            }
            copyPlayables.splice(0, load);
            if (image != undefined && image != null && (copyPlayables[0].image == undefined || copyPlayables[0].image == null))
                copyPlayables[0].image = image;
            if (audioBGM != undefined && audioBGM != null && (copyPlayables[0].audioBGM == undefined || copyPlayables[0].audioBGM == null))
                copyPlayables[0].audioBGM = audioBGM;
        }
        return copyPlayables;
    }
}
exports.PlayableGenerator = PlayableGenerator;
