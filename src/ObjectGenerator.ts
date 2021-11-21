export class ObjectGenerator{

    static getObjectByScenes(objects, scene){
        let copyObjects = JSON.parse(JSON.stringify(objects));
        let image;
        let audioBGM;

        let start = copyObjects.find((e)=> e.id == scene.ids[0]);
        let end = copyObjects.find((e)=> e.id == scene.ids[1]);
        let index = copyObjects.indexOf(start);
        let indexEnd = copyObjects.indexOf(end);
        let cpIndex = index;
        while(index >= 0 && (image == undefined || audioBGM == undefined)){
            if(image == undefined && copyObjects[index] != undefined)
                image = copyObjects[index].image;
            if(audioBGM == undefined && copyObjects[index].audioBGM != undefined)
                audioBGM = copyObjects[index].audioBGM;
            index--;
        }
        copyObjects.splice(indexEnd, copyObjects.length - indexEnd -1);
        copyObjects.splice(0, cpIndex);
        copyObjects[0].image = image;
        copyObjects[0].audioBGM = audioBGM;


        
        return copyObjects;
    }

    static getObjectByCGs(objects, cg){
        let copyObjects = JSON.parse(JSON.stringify(objects));
        let image;
        let i=0;

        while(i < copyObjects.length){
            if(copyObjects[i].image != null && copyObjects[i].image != undefined){
                image = copyObjects[i].image;
            }
            if(cg.ids.includes(copyObjects[i].id)){
                if(copyObjects[i].image == null || copyObjects[i].image == undefined){
                    copyObjects.splice(i, 1);
                }else{
                    i++;
                }
            }
            else{
                copyObjects.splice(i, 1);
            }
        }
        return copyObjects;
    }

    static getObjectByLoad(objects, load){
        let copyObjects = JSON.parse(JSON.stringify(objects));
        let image;
        let audioBGM;

        let current = copyObjects.find((e)=> e.id == load);
        let index = copyObjects.indexOf(current);
        let cpIndex = index;
        while(index >= 0 && (image == undefined || audioBGM == undefined)){
            if(image == undefined && copyObjects[index] != undefined)
                image = copyObjects[index].image;
            if(audioBGM == undefined && copyObjects[index].audioBGM != undefined)
                audioBGM = copyObjects[index].audioBGM;
            index--;
        }
        copyObjects.splice(0, cpIndex);
        copyObjects[0].image = image;
        copyObjects[0].audioBGM = audioBGM;


        return copyObjects;
    }

}