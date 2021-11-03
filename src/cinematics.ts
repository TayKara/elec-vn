document?.getElementById("container")
    .addEventListener("click", ev=>{
        window.api.send("open", "title");
    });