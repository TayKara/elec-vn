export class PlayableGenerator{

    static getPlayableByScenes(playables, scene){
        let copyPlayables = JSON.parse(JSON.stringify(playables));
        let image;
        let audioBGM;

        let start = copyPlayables.find((e)=> e.id == scene.ids[0]);
        let end = copyPlayables.find((e)=> e.id == scene.ids[1]);
        let index = copyPlayables.indexOf(start);
        let indexEnd = copyPlayables.indexOf(end);
        let cpIndex = index;
        while(index >= 0 && (image == undefined || audioBGM == undefined)){
            if(image == undefined && copyPlayables[index] != undefined)
                image = copyPlayables[index].image;
            if(audioBGM == undefined && copyPlayables[index].audioBGM != undefined)
                audioBGM = copyPlayables[index].audioBGM;
            index--;
        }
        copyPlayables.splice(indexEnd, copyPlayables.length - indexEnd -1);
        copyPlayables.splice(0, cpIndex);
        copyPlayables[0].image = image;
        copyPlayables[0].audioBGM = audioBGM;


        
        return copyPlayables;
    }

    static getPlayableByCGs(playables, cg){
        let copyPlayables = JSON.parse(JSON.stringify(playables));
        let image;
        let i=0;

        while(i < copyPlayables.length){
            if(copyPlayables[i].image != null && copyPlayables[i].image != undefined){
                image = copyPlayables[i].image;
            }
            if(cg.ids.includes(copyPlayables[i].id)){
                if(copyPlayables[i].image == null || copyPlayables[i].image == undefined){
                    copyPlayables.splice(i, 1);
                }else{
                    i++;
                }
            }
            else{
                copyPlayables.splice(i, 1);
            }
        }
        return copyPlayables;
    }

    static getPlayableByLoad(playables, load){
        let copyPlayables = JSON.parse(JSON.stringify(playables));
        let image;
        let audioBGM;

        let current = copyPlayables.find((e)=> e.id == load);
        let index = copyPlayables.indexOf(current);
        let cpIndex = index;
        while(index >= 0 && (image == undefined || audioBGM == undefined)){
            if(image == undefined && copyPlayables[index] != undefined)
                image = copyPlayables[index].image;
            if(audioBGM == undefined && copyPlayables[index].audioBGM != undefined)
                audioBGM = copyPlayables[index].audioBGM;
            index--;
        }
        copyPlayables.splice(0, cpIndex);
        copyPlayables[0].image = image;
        copyPlayables[0].audioBGM = audioBGM;


        return copyPlayables;
    }

}