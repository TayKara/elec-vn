export class ScriptPlayer{
    static instance:ScriptPlayer;

    playable:JSON;

    static getInstance(){
        if(ScriptPlayer.instance == null || ScriptPlayer.instance == undefined){
            ScriptPlayer.instance = new ScriptPlayer();
            return ScriptPlayer.instance;
        }else{
            return ScriptPlayer.instance;
        }
    }

    initializePlayable(json : JSON){
        this.playable = json;
    }


    
}