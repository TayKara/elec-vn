var meta : JSON = window.api.sendSync("ask-meta");

var container = document.getElementById("container");
container.addEventListener("click", ev=>{
        window.api.send("open", "title");
    });

addCinematics();

function addCinematics(){
    console.log(meta);
    if(meta){
        if(meta["videoCinematics"]){
            let video = document.createElement("video");
            video.setAttribute("class", "cinematicsVideo");
            video.src = "./game/cinematics/"+meta["videoCinematics"];
            video.autoplay = true;
            container.appendChild(video);
        }
        else{
            if(meta["imageCinematics"]){
                container.style.backgroundImage = "url('./game/cinematics/"+meta["imageCinematics"]+"')";
            }
            else{
                window.api.send("open","title");
            }
        }
    }
}