"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScriptPlayer = void 0;
class ScriptPlayer {
    static getInstance() {
        if (ScriptPlayer.instance == null || ScriptPlayer.instance == undefined) {
            ScriptPlayer.instance = new ScriptPlayer();
            return ScriptPlayer.instance;
        }
        else {
            return ScriptPlayer.instance;
        }
    }
    initializePlayable(json) {
        this.playable = json;
    }
}
exports.ScriptPlayer = ScriptPlayer;
