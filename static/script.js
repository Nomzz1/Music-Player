// function for form.html (uses same script)
function fileUpload(){
    let fileInput = document.getElementById("fileInput");
    let txt = "";
    let txt2 = "";
    if ('files' in fileInput) {
        if (fileInput.files.length == 0) {
            txt = "No files chosen.";
        } else {
            txt = `Upload ${fileInput.files.length} files:`;
            for(i = 0; i < fileInput.files.length;i++){
                txt2 += `<br><br>${fileInput.files[i].name}`;
            };
        };
    } else {
        txt = "No files chosen.";
    };
    document.getElementById("submitLabel").innerHTML = txt;
    document.getElementById("fileList").innerHTML = txt2;
};

// function to play a song (bound to play button)
function play(song){
    if (window.currentSong != null){
        window.currentSong.pause();
    };
    if (document.getElementById("pauseIcon").innerHTML == "play_arrow"){
        document.getElementById("pauseIcon").innerHTML = "pause";
    };
    window.currentSong = new Audio("static/music/" + song);
    window.currentSong.addEventListener("ended",nextSong);
    currentSong.ontimeupdate = function(){
        document.getElementById("timeBar").value = (currentSong.currentTime/currentSong.duration)*1000;
        document.getElementById("currentTime").innerHTML = `${Math.floor(currentSong.currentTime/60).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})}:${Math.floor(currentSong.currentTime%60).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})}`
    };
    window.currentSong.play();
    window.currentSong.volume = document.getElementById("volume").value/100;
    document.getElementById("playingNow").innerHTML = "Playing Now: " + song.replace(".mp3","").replace(/_/g," ");
};

// function to pause based on icon (bound to pause button)
function pause(){
    if (document.getElementById("pauseIcon").innerHTML == "pause"){
        document.getElementById("pauseIcon").innerHTML = "play_arrow";
        window.currentSong.pause();
    } else if (document.getElementById("pauseIcon").innerHTML == "play_arrow"){
        document.getElementById("pauseIcon").innerHTML = "pause";
        window.currentSong.play();
    };
};

// binding pause/play to space
window.addEventListener('keyup', function(event){
    if (event.code == "Space"){
        pause();
    };
});

// using the html names to get the songList
let buttonList = document.getElementsByName("song");
let songList = [];
for (i=0;i<buttonList.length;i++){
    songList.push(buttonList[i].id);
};

// queue system
window.queue = [];

function addToQueue(song){
    window.queue.push(song);
    listItem = document.createElement("li");
    listItem.innerHTML = song.replace(".mp3","").replace(/_/g," ");
    queueList = document.getElementById("queue");
    queueList.appendChild(listItem);
    if (window.currentSong == null){
        nextSong();
    };
};

function nextSong(){
    if (document.getElementById("repeat").innerHTML == "repeat_on"){
        window.queue.push(currentSong.src.split("/").pop());
        listItem = document.createElement("li");
        listItem.innerHTML = currentSong.src.split("/").pop().replace(".mp3","").replace(/_/g," ");
        queueList = document.getElementById("queue");
        queueList.appendChild(listItem);
    } else if (document.getElementById("repeat").innerHTML == "repeat_one_on"){
        window.queue.unshift(currentSong.src.split("/").pop());
        listItem = document.createElement("li");
        listItem.innerHTML = currentSong.src.split("/").pop().replace(".mp3","").replace(/_/g," ");
        queueList = document.getElementById("queue");
        queueList.prepend(listItem);
    };
    if (window.queue.length != 0){
        queueList = document.getElementById("queue");
        queueList.firstChild.remove();
        play(window.queue[0]);
        window.queue.shift();
    } else {
        window.currentSong.pause();
        window.currentSong = null;
        document.getElementById("playingNow").innerHTML = "Playing Now: (No song selected)";
        document.getElementById("timeBar").value = 0;
        document.getElementById("currentTime").innerHTML = "--:--";
    };
};

// skip and rewind buttons:
function rewind(){
    window.currentSong.currentTime = 0;
};

//shuffle queue
function shuffle(){
    window.queue = [];
    document.getElementById("queue").innerHTML = "";
    tempQueue = songList.sort(() => Math.random() - 0.5);
    for (i=0;i<tempQueue.length;i++){
        addToQueue(tempQueue[i]);
    };
};

// loop system
function repeat(){
    if (document.getElementById("repeat").innerHTML == "repeat"){
        document.getElementById("repeat").innerHTML = "repeat_on";
    } else if (document.getElementById("repeat").innerHTML == "repeat_on"){
        document.getElementById("repeat").innerHTML = "repeat_one_on";
    } else if (document.getElementById("repeat").innerHTML == "repeat_one_on"){
        document.getElementById("repeat").innerHTML = "repeat";
    };
};

// time bar
function changeTime(value){
    currentSong.currentTime = (value / 1000) * currentSong.duration;
};

// volume
function changeVolume(value){
    currentSong.volume = value/100;
    document.getElementById("volumeValue").innerHTML = value;
};

// mute
function mute(){
    if (document.getElementById("mute").innerHTML == "volume_off"){
        document.getElementById("mute").innerHTML = "volume_up";
        document.getElementById("volume").value = 0;
        changeVolume(0);
    } else if (document.getElementById("mute").innerHTML == "volume_up"){
        document.getElementById("mute").innerHTML = "volume_off";
        document.getElementById("volume").value = 50;
        changeVolume(50);
    };
};

// Clear queue
function clearQueue(){
    window.queue = [];
    document.getElementById("queue").innerHTML = "";
};