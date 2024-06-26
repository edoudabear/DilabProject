//const { title } = require("process"); AUCUN SENS !?!

//const { group } = require("console");

var loadBar=document.querySelector(".progress-load");
var mainContent = document.querySelector(".main-content");
var logoAnimation = gsap.timeline({});
var searchField = document.querySelector(".search-field");
let searchField2 = document.querySelector(".searchField input"); // For mobile interface
var playerNotEmpty=false;
let fileRegexp=/[^a-zA-Z0-9._-\s()]+/g;
logoAnimation.from(".title",0,{scale : 1, color : "white", textShadow :"0 0 0 #FFFFFF, 0 0 0 #FFFFFF", rotate: "0", transform : "skew(0deg,0deg)"})
            .to(".title",0.4,{scale : 2,color : "red", textShadow :"0 0 3px #FFFFFF, 0 0 5px #FFFFFF", ease : "power3.bounce",rotate : "300deg", y: "30px", transform : "skew(-0.15turn,15deg)"})
            .to(".title",0.4,{scale : 1,color : "white", textShadow :"0 0 0 #FFFFFF, 0 0 0 #FFFFFF", ease : "power3.bounce", rotate: "360deg", transform : "skew(-0.15turn,15deg)"},"+=.1");
//console.log(localStorage.getItem("dilabData"));
//console.log(userData);
var userData=localStorage.getItem("dilabData");

function goToPage(address) {
    a=document.createElement('a')
    a.href=address,
    a.click();
}

function syncNotifications() {
    fetch('/Dilab/check', {
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        method: 'POST',
        body: JSON.stringify({
            type : "notifications",
        }) //data
    }).then(out => {
        return out.json();
    }).then(log => {
        if (!log.status) {
            console.log("could not load user notifications");
        } else {
            if (log.data[0].length==0 && log.data[1].length==0) {
                document.querySelector(".notificationsMenu .notificationsList").innerHTML="No New Notification";
            } else {
                document.querySelector(".notificationsMenu .notificationsList").innerHTML="";
                document.querySelector(".notificationsButton .labelCount").innerHTML=log.data[0].length+log.data[1].length;
                document.querySelector(".notificationsButton .labelCount").style.display="flex";
            }
            for (var i=0;i<log.data[0].length;i++) {
                document.querySelector(".notificationsMenu .notificationsList").innerHTML+=newMemberWaitListNotificationElement(log.data[0][i].requester,log.data[0][i].groupName);
                if (i<log.data[0].length-1 || log.data[1].length>0) {
                    document.querySelector(".notificationsMenu .notificationsList").innerHTML+="<hr />";
                }
            } for (let i=0;i<log.data[0].length;i++) {
                let el=document.querySelectorAll(".notificationsList .questionNotification")[i];
                el.querySelector(".accept").addEventListener('click',e=>{
                    joinResponse(log.data[0][i].requester,log.data[0][i].groupName,true,e);
                });
                el.querySelector(".deny").addEventListener("click",e=>{
                    joinResponse(log.data[0][i].requester,log.data[0][i].groupName,false,e);
                });
            } for (var i=0;i<log.data[1].length;i++) {
                switch (log.data[1][i].type) {
                    case "message" :
                        console.log("OK3");
                        document.querySelector(".notificationsMenu .notificationsList").innerHTML+=newMessageNotificationElement(log.data[1][i].content,log.data[1][i].notiId);
                        break;
                    default :
                        document.querySelector(".notificationsMenu .notificationsList").innerHTML+=newConfirmNotificationElement(log.data[1][i].content,log.data[1][i].notiId);
                }
                if (i<log.data[1].length-1) {
                    document.querySelector(".notificationsMenu .notificationsList").innerHTML+="<hr />";
                }
                document.querySelectorAll(".notificationsMenu .notificationsList .accept").forEach(el=>{
                    let data=el.getAttribute("notifData");
                    if (data!=null) {
                        el.addEventListener('click',e=>{
                            e.preventDefault();
                            e.stopPropagation();
                            data=parseInt(data);
                            fetch('/Dilab/set', {
                                headers: {
                                    'Content-Type': 'application/json'
                                    // 'Content-Type': 'application/x-www-form-urlencoded',
                                },
                                method: 'POST',
                                body: JSON.stringify({
                                    type : "swipeNotification",
                                    nId : String(data),
                                }) //data
                            }).then(out => {
                                return out.json();
                            }).then(data=>{
                                if (data.status==false) {
                                    Toast.fire({icon : "warning", title : "Something went wrong.."});
                                    console.log(data);
                                } else {
                                    let parentNotif=el.closest(".notification");
                                    if (parentNotif.nextSibling && parentNotif.nextSibling.localName=='hr') {
                                        parentNotif.nextSibling.remove();
                                    }
                                    else if (document.querySelectorAll(".notificationsList .notification").length==2) {
                                        document.querySelector(".notificationsList hr").remove();
                                    }
                                    parentNotif.remove();
                                    let lblCnt=document.querySelector(".labelCount");
                                    lblCnt.innerHTML=String(parseInt(lblCnt.innerHTML)-1);
                                    if (parseInt(lblCnt.innerHTML)==0) {
                                        document.querySelector(".notificationsMenu .notificationsList").innerHTML="No New Notification";
                                        document.querySelector(".labelCount").style.display="none";
                                    }
                                }
                            });
                        });
                    }
                });
                document.querySelectorAll(".notificationsMenu .notificationsList .confirmMessage").forEach(el=>{
                    let data=el.getAttribute("notifData");
                    if (data!=null) {
                        el.addEventListener('click',e=>{
                            console.log("HEREHEREHERE")
                            let str=e.target.closest(".notification").querySelector(".text a").getAttribute("href");
                            let g=new URLSearchParams(str.slice(str.indexOf('?')+1));
                            console.log(g);
                            console.log(str);
                            if (window.location.href!="https://e.diskloud.fr/Dilab/artist?a="+g.get("a")) {
                                loadPage("Dilab | Diskloud","artist",[["a",g.get("a")]]);
                            }
                            e.preventDefault();
                            e.stopPropagation();
                            data=parseInt(data);
                            fetch('/Dilab/set', {
                                headers: {
                                    'Content-Type': 'application/json'
                                    // 'Content-Type': 'application/x-www-form-urlencoded',
                                },
                                method: 'POST',
                                body: JSON.stringify({
                                    type : "swipeNotification",
                                    nId : String(data),
                                }) //data
                            }).then(out => {
                                return out.json();
                            }).then(data=>{
                                if (data.status==false) {
                                    Toast.fire({icon : "warning", title : "Something went wrong.."});
                                    console.log(data);
                                } else {
                                    let parentNotif=el.closest(".notification");
                                    if (parentNotif.nextSibling && parentNotif.nextSibling.localName=='hr') {
                                        parentNotif.nextSibling.remove();
                                    }
                                    else if (document.querySelectorAll(".notificationsList .notification").length==2) {
                                        document.querySelector(".notificationsList hr").remove();
                                    }
                                    parentNotif.remove();
                                    let lblCnt=document.querySelector(".labelCount");
                                    lblCnt.innerHTML=String(parseInt(lblCnt.innerHTML)-1);
                                    if (parseInt(lblCnt.innerHTML)==0) {
                                        document.querySelector(".notificationsMenu .notificationsList").innerHTML="No New Notification";
                                        document.querySelector(".labelCount").style.display="none";
                                    }
                                }
                            });
                        });
                    }
                })
            }
            document.querySelectorAll(".notificationsList [groupLink]").forEach(el=>{
                el.addEventListener("click",e=>{
                    console.log("yes !")
                    e.preventDefault();
                    e.stopPropagation();
                    let groupLink=el.getAttribute("href");
                    history.pushState({}, `Dilab (loading..)`, groupLink);
                    pathAnalysis();
                });
            });
            document.querySelectorAll(".notificationsList [artistLink]").forEach(el=>{
                el.addEventListener("click",e=>{
                    console.log("yes !")
                    e.preventDefault();
                    e.stopPropagation();
                    let artistLink=el.getAttribute("href");
                    history.pushState({}, `Dilab (loading..)`, artistLink);
                    pathAnalysis();
                });
            });
        }
    });
}

syncNotifications();
let a=setInterval(()=>{ syncNotifications(); },1000*20); // Iters to request the new notifications

function joinResponse(user,group,response,e) {
    console.log(user,group,response);
    fetch('/Dilab/set',{
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        method: 'POST',
        body: JSON.stringify({
            type : "answerToJoinRequest",
            userName : user,
            groupName : group,
            answer : response
        }) //data
    }).then(out => {
        return out.json();
    }).then(data => {
        console.log(data);
        if (data.status!=true) {
            Toast.fire({icon : "warning", title : "Something went wrong.."});
        } else {
            Toast.fire({ title : "Choice has been saved",icon : "info"});
            let toRem=e.target.closest(".notification");
            if (toRem.nextSibling?.localName=='hr') {
                toRem.nextSibling.remove();
            }
            toRem.remove();
            let lblCnt=document.querySelector(".labelCount");
            lblCnt.innerHTML=String(parseInt(lblCnt.innerHTML)-1);
            if (parseInt(lblCnt.innerHTML)==0) {
                document.querySelector(".notificationsMenu .notificationsList").innerHTML="No New Notification";
                document.querySelector(".labelCount").style.display="none";
            }
        }
    });
}


// Sweet alert remake of toast

const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  });

// Audio object
var soundUrls=["https://dev.diskloud.fr/audios/Stacy.mp3"]
var soundTitles=[];//["Stacy"];
var soundAuthors=[];//["Quinn XCII"];
var soundPictures=[];//['disc.svg'];
var lyrics=[];//["[0.0]🎵\n[4.5]At the 50 yard line I saw her feet\n[6.6]She was under the bleachers waiting for me\n[9.3]No I never get high but I'm smoking her weed\n[13.5]She been giving this freshman love since last June\n[16.3]The only senior girl with tattoos\n[18.1]Said nobody can find out things that we do\n[22.0]She said, put your hands behind your head\n[25.0]Let me blow your mind kid\n[27.2]But don't get too excited\n[31.2]You can call me Stacy\n[33.2]You can call me love\n[35.0]You can call me baby\n[37.4]And all of the above\n[39.8]You can call me late night\n[42.0]And I'll be at your door\n[44.0]You can call me anything\n[46.7]Oh anything you want\n[49.0]Just don't call me yours\n[50.5]🎵\n[59.5]It's 3:05 on a Friday, bell rings\n[61.9]Her parents left last night for Palm Springs\n[64.3]She's got the whole house empty for me\n[68.4]My brother he needed the car so I ran\n[71.0]Down 71st as fast as I can\n[73.1]I'm telling her everything I had planned\n[77.1]She said, I know we've been getting close\n[80.0]We can't get no closer\n[81.8]You'll get it when you're older\n[85.6]You can call me Stacy\n[87.2]You can call me love\n[90.0]You can call me baby\n[92.4]And all of the above\n[95.2]You can call me late night\n[97.0]And I'll be at your door\n[99.1]You can call me anything\n[100.9]Oh anything you want\n[103.8]Just don't call me yours\n[105.8]🎵\n[112.8](Just don't call me yours)\n[114.8]🎵\n[121.8]You can call me Stacy\n[124.2]You can call me love\n[126.8]You can call me baby\n[128.8]And all of the above\n[131.0]You can call me late night\n[133.8]And I'll be at your door\n[135.5]You can call me anything\n[137.8]Oh anything you want\n[140.0]Just don't call me yours\n[142.2]I'm over you, I'm over you\n[151.0]I'm over you, I'm over you"]
var parsedLyrics=[];
var parsedLyricsTimes=[];
var lyricsIndex=0;
var audioObj = new Audio();
var soundTitleObj = document.querySelector(".player .songTitle");
var soundAuthorsObj = document.querySelector(".player .songGroup")
var playPauseBtn=document.querySelectorAll(".musicButton")[1];
var soundBar = document.querySelectorAll(".filledPart")[1];
var musicBar = document.querySelector(".filledPart");
var prevButton = document.querySelector(".musicButton");
var nextButton = document.querySelectorAll(".musicButton")[2];
var playlistContainer = document.querySelector(".playElements");
playlistIndex = 0; // Index corresponds to index of  currently playing sound, with regard to the soundUrls array


// Context menu for right click
var contextMenu=document.querySelector(".contextMenu");

var playingIcon=document.createElement("div");
playingIcon.classList.add("playingIcon");
playingIcon.innerHTML="<div class=\"bar\"></div>\
                        <div class=\"bar\"></div>\
                        <div class=\"bar\"></div>\
                        <div class=\"bar\"></div>";

updateSoundIcon(audioObj.volume*100);
soundBar.style.width = audioObj.volume*100+"%";

function parseLyrics(data) {
    if (data.trim()=="") {
        updateLyrics("You are listening to..");
        updateLyrics(soundTitles[playlistIndex]);
        updateLyrics(soundAuthors[playlistIndex]);
        return [[],[]];
    }
    var results=[[],[]],lyricsList=data.split('\n');
    updateLyrics(soundTitles[playlistIndex]);
    for (var i=0;i<lyricsList.length;i++) {
        if (lyricsList[i].trim()!="") {
            j=0;
            while (lyricsList[i][j]!='[') {
                j++;
            }
            j++;
            lyricsList[i]=lyricsList[i].slice(j);
            j=0;
            while (lyricsList[i][j]!=']') {
                j++;
            }
            results[0].push(lyricsList[i].substring(0,j));
            j++;
            results[1].push(lyricsList[i].slice(j));
            if (i<2) {
                updateLyrics(lyricsList[i].slice(j));
            }
        }
    }
    results[1].push((playlistIndex>=0) ? soundAuthors[playlistIndex] : "");
    results[1].push("");
    lyricsIndex = 0;
    return results;
}

function loadSound(url) {
    audioObj.src=url;
    //audioObj.load();
    musicBar.style.width="0%";
    soundTitleObj.innerHTML=soundTitles[playlistIndex];
    soundTitleObj.title=soundTitles[playlistIndex];
    soundAuthorsObj.innerHTML=soundAuthors[playlistIndex];
    soundAuthorsObj.title=soundAuthors[playlistIndex];
    var lyricsData=parseLyrics(lyrics[playlistIndex]);
    //console.log(playlistIndex);
    if (soundPictures[playlistIndex]!="disc.svg") {
        currentSoundPicturePath="https://e.diskloud.fr/Dilab/project/"+`${soundAuthors[playlistIndex]}/${soundTitles[playlistIndex]}`;
    } else {
        currentSoundPicturePath= "https://e.diskloud.fr/Dilab/project/music-note-beamed.svg";
    }
    parsedLyrics=lyricsData[1];
    parsedLyricsTimes=lyricsData[0];
    document.querySelector(".fullScreen .soundName").innerHTML=soundTitles[playlistIndex];
    document.querySelector(".fullScreen  .soundAuthor").innerHTML=soundAuthors[playlistIndex];
    document.querySelector(".coverOfCurrentlyPlayingSound").src= currentSoundPicturePath;
    document.querySelector(".fullScreen .fullScreenPlayingSoundCover").src= currentSoundPicturePath;
    playlistContainer.innerHTML="";
    for (var i=0;i<soundUrls.length;i++) {
      var picturePath = `${soundPictures[i]!="" ? "https://e.diskloud.fr/Dilab/project/" + soundPictures[i] : "https://e.diskloud.fr/Dilab/project/music-note-beamed.svg"}`;
      if (soundPictures[i].indexOf("https://e.diskloud.fr/")>-1) {
        picturePath=soundPictures[i];
      }
      playlistContainer.innerHTML+=`<div dataval=${i} class="playlistElement" onclick=playSound(${i},true)>
                                        <div class=left>\
                                            <div class="cover">\
                                                <img src="${picturePath}" />\
                                            </div>\
                                            <div class=soundName>\
                                                <span class="soundTitle">${soundTitles[i]}</span>\
                                                <span class=soundAuthor>${soundAuthors[i]}</span>\
                                            </div>\
                                        </div>\
                                        <span class="duration">${""}</span>\
                                    </div>`;
      if (i==playlistIndex) {
          playlistContainer.lastChild.querySelector(".cover").appendChild(playingIcon);
      }
    }
    for (var i=0;i<soundUrls.length;i++) {
        playlistContainer.querySelectorAll(".playlistElement")[i].addEventListener("contextmenu", function(e) {
            contextMenu.style.display = "flex";
            e.preventDefault();
            for (var j=0;j<document.querySelectorAll(".contextMenu .menuOption").length;) {
                document.querySelectorAll(".contextMenu .menuOption")[j].remove();
            }
            var playEl=e.target;
            while (!playEl.classList.contains("playlistElement") && !playEl.classList.contains("playlistMenu")) {
                playEl=playEl.parentNode;
            }
            var index=playEl.getAttribute("dataval");
            contextMenu.innerHTML+="<div onclick=\"playSound("+index+",true)\" class=\"menuOption\">Play</div>";
            if (soundUrls.length>1) {
                contextMenu.innerHTML+="<div onclick=\"removePlaylistElement("+index+")\" class=\"menuOption\">Remove from queue</div>";
            }
            var menuElement=document.querySelector(".contextMenu");
            menuElement.style.left = `min(${e.clientX}px,calc(100% - ${menuElement.offsetWidth}px))`;
            menuElement.style.top = `min(${e.clientY}px,calc(100% - ${menuElement.offsetHeight}px))`;
            return false;
        });
    }
}

function removePlaylistElement(index) {
    soundUrls.splice(index,1);
    soundTitles.splice(index,1);
    soundAuthors.splice(index,1);
    soundPictures.splice(index,1);
    lyrics.splice(index,1);

    document.querySelectorAll(".playlistMenu .playlistElement")[index].remove();
    contextMenu.style.display="none";
    playlistContainer.querySelector(".playlistElement .cover").innerHTML+=`<div class="playingIcon">
                                                                                <div class="bar"></div>
                                                                                <div class="bar"></div>                        
                                                                                <div class="bar"></div>                        
                                                                                <div class="bar"></div>
                                                                            </div>`
    for (var i=0;i<soundUrls.length;i++) {
        playlistContainer.querySelectorAll(".playlistElement")[i].setAttribute("dataval",i);
    }
    if (soundUrls.length==1) {
        playlistContainer.querySelectorAll(".playlistElement div")[1].remove();
    }
    if (index==playlistIndex) {
        if (!audioObj.paused) {
            audioObj.pause();
        }
        setPlayIcon(false);
        playSound(Math.min(index,soundUrls.length-1));
    }
}

audioObj.onended = function() {
    nextButton.click();
};
let activeId=-1;
function playSound(i,autoplay=false,iconUpdate=-1) {
    contextMenu.style.display="none";
    playlistIndex=i;
    loadSound(soundUrls[i]);
    if (autoplay)
        playOrPauseMusic();
    if (iconUpdate>-1 && iconUpdate!=activeId) {
        fetch('/Dilab/add', {
            headers: {
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            method: 'POST',
            body: JSON.stringify({
                type : "stream",
                songId : String(iconUpdate)
            }) //data
        }).then(out => {
            return out.json();
        }).then(log => {
            if (log.status==true) {
                console.log("counted stream");
            } else {
                console.log(log);
            }
        });
    }
    if (iconUpdate>-1) { // On met à jour l'icône des lecteurs .release (et uniquement les .release !)
        activeId=iconUpdate;
        document.querySelectorAll(".release .control").forEach(el=>{
            if (parseInt(el.getAttribute("soundId"))==iconUpdate)
                el.innerHTML=`<i class="bi bi-pause-circle-fill"></i>`;
            else
                el.innerHTML=`<i class="bi bi-play-circle-fill"></i>`;
        });
    }
}

if (soundTitles.length>0) {
    playSound(0);
}

playPauseBtn.addEventListener('click',e=> {
    if (audioObj.paused) {
        audioObj.play();
        setPlayIcon(true);
        if (activeId!=-1) {
            document.querySelectorAll(".release .control").forEach(el=>{
                if (parseInt(el.getAttribute("soundId"))==activeId)
                    el.innerHTML=`<i class="bi bi-pause-circle-fill"></i>`;
                else
                    el.innerHTML=`<i class="bi bi-play-circle-fill"></i>`;
            });
        }
    } else { 
        audioObj.pause();
        document.querySelectorAll(".release .control").forEach(el=>{
            el.innerHTML=`<i class="bi bi-play-circle-fill"></i>`;
        });
    }
});

function playOrPauseMusic() {
    if (audioObj.paused) {
        audioObj.play();
        setPlayIcon(true);
    } else { 
        audioObj.pause();
        setPlayIcon(false);
    }
}

function updatePlayPauseIcons() {
    if (!audioObj.paused && activeId!=-1) {
        if (activeId!=-1) {
            document.querySelectorAll(".release .control").forEach(el=>{
                if (parseInt(el.getAttribute("soundId"))==activeId)
                    el.innerHTML=`<i class="bi bi-pause-circle-fill"></i>`;
                else
                    el.innerHTML=`<i class="bi bi-play-circle-fill"></i>`;
            });
        }
    }
}

prevButton.addEventListener("click",()=>{
    if (prevButton.classList.contains("disabled")) {
        return;
    }
    setPlayIcon(true);
    if (!audioObj.paused && (audioObj.currentTime>4 || playlistIndex==0)) {
        audioObj.currentTime=0;
        console.log(playlistIndex);
        return;
    } else if (playlistIndex==0) {
        loadSound(soundUrls[playlistIndex]);
        audioObj.play();
        console.log("case two");
        return;
    }
    //else case below
    playlistIndex--;
    loadSound(soundUrls[playlistIndex]);
    audioObj.play();
    updatePlayerData();
});

nextButton.addEventListener("click",()=>{
    if (nextButton.classList.contains("disabled")) {
        return;
    }
    if (playlistIndex==soundUrls.length-1) {
        playlistIndex=0;
        loadSound(soundUrls[playlistIndex]);
        setPlayIcon(false);
        return;
    }//else case below
    playlistIndex++;
    loadSound(soundUrls[playlistIndex]);
    audioObj.play();
    setPlayIcon(true);
    updatePlayerData();
});

//Same as previous lines, but for fullscreen elements

document.querySelectorAll(".fullScreen .musicButton")[1].addEventListener('click',e=> {
    if (document.querySelectorAll(".fullScreen .musicButton")[1].classList.contains("disabled")) {
        return;
    }
    if (audioObj.paused) {
        audioObj.play();
        setPlayIcon(true);
    } else { 
        audioObj.pause();
        setPlayIcon(false);
    }
});

document.querySelector(".fullScreen .musicButton").addEventListener("click",()=>{
    if (document.querySelector(".fullScreen .musicButton").classList.contains("disabled")) {
        return;
    }
    if (audioObj.currentTime>4 || playlistIndex==0) {
        audioObj.currentTime=0;
        setPlayIcon(true);
        return;
    }
    playlistIndex--;
    loadSound(soundUrls[playlistIndex]);
    setPlayIcon(true);
    audioObj.play();
    updatePlayerData();
});

document.querySelectorAll(".fullScreen .musicButton")[2].addEventListener("click",()=>{
    if (document.querySelectorAll(".fullScreen .musicButton")[2].classList.contains("disabled")) {
        return;
    }
    if (playlistIndex==soundUrls.length-1) {
        playlistIndex=0;
        loadSound(soundUrls[playlistIndex]);
        setPlayIcon(false);
        return;
    }//else case below
    playlistIndex++;
    loadSound(soundUrls[playlistIndex]);
    audioObj.play();
    setPlayIcon(true);
    updatePlayerData();
});

audioObj.addEventListener("canplaythrough", function() {
    updateMusicProgressTime(audioObj.duration,false); //Display the duration of the song
    updateMusicProgressTime(audioObj.currentTime); //Update the displayed duration on the html/JS player
    parseLyrics(lyrics[playlistIndex]);
    lyricsPlay(audioObj.currentTime);
});

audioObj.addEventListener("error",()=> {
    Swal.fire("Error","There was an error while loading your audio file...","error");
});

function lyricsPlay(time) {
    if (parsedLyricsTimes.length==0) {
        return;
    }
    var newIndex=0;
    for (var i=0;i<parsedLyricsTimes.length;i++) {
        if (parseFloat(parsedLyricsTimes[i])>=time) {
            newIndex=i;
            break;
        } if (i==parsedLyricsTimes.length-1) {
            newIndex=parsedLyricsTimes.length;
        }
    }
    newIndex--;
    if (newIndex<0) {
        return;
    } else if (newIndex==lyricsIndex+1) {
        updateLyrics(parsedLyrics[i]);
    } else if (newIndex!=lyricsIndex) {
        if (newIndex>0) {
            updateLyrics(parsedLyrics[newIndex-1]);
        } else {
            updateLyrics(soundTitles[playlistIndex]);
        }
        updateLyrics(parsedLyrics[newIndex]);
        if (newIndex<parsedLyrics.length) {
            updateLyrics(parsedLyrics[newIndex+1]);
        } else {
            updateLyrics(soundAuthors[playlistIndex]);
        }
    }
    lyricsIndex=newIndex;
}

audioObj.addEventListener("stalled",()=> {
    Swal.fire("Error","There was a problem while loading your audio file...","error");
});

audioObj.addEventListener("timeupdate", function() {
    if (clickedElement!=document.querySelector(".progressBarContainer"))
        musicBar.style.width=audioObj.currentTime/audioObj.duration*100+"%";
    updateMusicProgressTime(audioObj.currentTime); //Update the displayed duration on the html/JS player
    lyricsPlay(audioObj.currentTime);
});

document.addEventListener("click",e=> {
    if (!contextMenu.contains(e.target)) {
        contextMenu.style.display="none";
    }
})

document.addEventListener("keypress",e=> {
    /*if (e.key==" ") {
        playOrPauseMusic();
    }*/
});

document.querySelector(".player .musicInfos .cover").addEventListener('click',e=> {
    goFullScreenMode();
});

// Fullscreen mode

/*window.onresize = function () {
    if (window.matchMedia('(display-mode: fullscreen)').matches ||
    window.document.fullscreenElement) {
        goFullScreenMode();
    }
}*/

function goFullScreenMode() {
    var elem=document.querySelector(".fullScreen");
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen(); // for Safari
    } else {
        Swal.fire("Warning","Your browser does not support fullscreen mode. Try on Chrome, Edge and Firefox (Safari doesn't support our fullscreen mode). Doesn't work :(","warning");
    }
    document.querySelector(".fullScreen").style.display="block";  
}


document.querySelector(".fullScreen .fullscreenExit").addEventListener('click',e=>{
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    }
})

if (document.addEventListener)
{
 document.addEventListener('fullscreenchange', exitHandler, false);
 document.addEventListener('mozfullscreenchange', exitHandler, false);
 document.addEventListener('MSFullscreenChange', exitHandler, false);
 document.addEventListener('webkitfullscreenchange', exitHandler, false);
}

function exitHandler()
{
 if (!document.webkitIsFullScreen && !document.mozFullScreen && !document.msFullscreenElement)
 {
    if (document.querySelector(".fullScreen").style.display="block") { // Contrôle safari
        document.querySelector(".fullScreen").style.display="none";
    }
 }
}

// Lyrics inside fullScreen mode (function to update the lyrics)

function updateLyrics(content) {
    //document.querySelector(".topText").style.opacity="0";
    //document.querySelector(".topText").style.height="0";
    //document.querySelector(".topText").style.transform="translate('-20px')";
  
    document.querySelector(".topText").remove();
    
    document.querySelector(".mainText").classList.add("topText");
    document.querySelector(".mainText").classList.remove("mainText");
    
    document.querySelector(".bottomText").classList.add("mainText");
    document.querySelector(".bottomText").classList.remove("bottomText");
    
    var nextBottom=document.createElement("div");
    nextBottom.innerHTML=content;
    nextBottom.style.opacity = "0";
    nextBottom.style.transform="translateY(20px)";
    nextBottom.classList.add("bottomText");
    document.querySelector(".fullScreen .lyricsCard").appendChild(nextBottom);
    nextBottom.style.height="";
    setTimeout(()=>{
      nextBottom.style.opacity="";
      nextBottom.style.transform="";
    },20);
  }

audioObj.onpause = function() {
    setPlayIcon(false);
};

audioObj.onplay = () => {
    setPlayIcon(true);
    var audios=document.querySelectorAll("audio");
    for (var i=0;i<audios.length;i++) {
        audios[i].pause();
        audios[i].parentElement.querySelector("i").classList.remove("bi-pause-circle-fill");
        audios[i].parentElement.querySelector("i").classList.add("bi-play-circle-fill");
        audios[i].currentTime = 0;
    }
}

function setPlayIcon(play) {
    if (play) {
        var el=document.querySelectorAll(".musicButton > i")[1];
        el.className="bi";
        el.classList.add("bi-pause-circle");
        el=document.querySelectorAll(".fullScreen .musicButton > i")[1];
        el.className="bi";
        el.classList.add("bi-pause-circle");
        if (document.querySelector(".playingIcon")) {
            document.querySelector(".playingIcon").style.display="flex"; // for play animation inside playlist menu
            //document.querySelector(".fullScreen .cover").style.height="10em";
        }
    } else {
        var el=document.querySelectorAll(".musicButton> i")[1];
        el.className="bi";
        el.classList.add("bi-play-circle");
        el=document.querySelectorAll(".fullScreen .musicButton> i")[1];
        el.className="bi";
        el.classList.add("bi-play-circle");
        if (document.querySelector(".playingIcon")) {
            document.querySelector(".playingIcon").style.display="";
            //document.querySelector(".fullScreen .cover").style.height="";
        }
    }
}

// Playlist menu event listeners
var playlistMenu = document.querySelector(".playlistMenu");
var playlistButton = document.querySelector(".playlistIcon")
document.querySelector(".playlistIcon").addEventListener('click',e=> {
    if (playlistMenu.style.display!="block") {
        playlistMenu.style.opacity = "0";
        playlistMenu.style.transform = "translate(0,10px)";
        setTimeout(()=> {
            playlistMenu.style.display="block";
            playlistMenu.style.transform = "";
            playlistMenu.style.opacity="";
        },100);
    } else {
        playlistMenu.style.transform = "translate(0,10px)";
        playlistMenu.style.opacity = "0";
        setTimeout(()=> {
            playlistMenu.style.display="";
            playlistMenu.style.transform = "";
            playlistMenu.style.opacity="";
        },200);    
    }

    playlistMenu.style.display=(playlistMenu.style.display=="block") ? "" : "block";
})

// Path analysis
function pathAnalysis() {
    if (chatReloader!=null) {
        clearTimeout(chatReloader);
    }
    chatReloader=null;
    lastMessage=null;
    var path=window.location.href.toLowerCase().replace("https://e.diskloud.fr/dilab","");
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    if (path[path.length-1]=="/") {
        path=path.slice(0,path.length-1);
    }
    if (path.indexOf('?')>-1) {
        path=path.slice(0,path.indexOf('?'));
    }
    document.querySelector(".opt").style.fontWeight="";
    document.querySelectorAll(".opt")[1].style.fontWeight="";
    document.querySelectorAll(".opt")[2].style.fontWeight="";
    document.querySelectorAll(".opt").forEach(el=>{el.style.color="";});
    console.log(path)
    switch (path) {
        case "" :
            loadTemplate("home",()=>{
                document.querySelectorAll(".defaultPage .button")[0].addEventListener("click",()=>{loadPage("Projects","projects",[])});
                document.querySelectorAll(".defaultPage .button")[1].addEventListener("click",()=>{loadPage("Releases","releases",[])});
            });
            break;
        case "/group" :
            loadTemplate("group",()=>{
                if (urlParams.get("g")) {
                    fetch('/Dilab/get', {
                        headers: {
                            'Content-Type': 'application/json'
                            // 'Content-Type': 'application/x-www-form-urlencoded',
                        },
                        method: 'POST',
                        body: JSON.stringify({
                            type : "group",
                            groupName : encodeURI(urlParams.get("g"))
                        }) //data
                    }).then(out => {
                        return out.json();
                    }).then(log => {
                        if (log.status==true) {
                            // group info insertion
                            data=log.data;
                            document.querySelector(".main-content-header").innerHTML=data[0][0].groupName;
                            document.querySelector(".groupPage .userChat").innerHTML=data[0][0].groupName;
                            var year=new Date(data[0][0].dateOfBirth);
                            document.querySelector(".styledHead .styledHeadPP img").src="https://e.diskloud.fr/Dilab/group/"+data[0][0].groupPicture;
                            document.querySelector(".registrationDate").innerHTML=year.getFullYear();
                            if (data[0][0].isUserAdmin) {
                                document.querySelector(".userRole").innerHTML+=`<i class="bi bi-dot"></i>You are the group admin`;
                                document.querySelector(".joinButton").style.display="none";
                                console.log("isAdmin");
                                setupChat(urlParams.get("g"));
                            } else if (!document.querySelector(".loginButton")) {
                                fetch('/Dilab/check', {
                                    headers: {
                                        'Content-Type': 'application/json'
                                        // 'Content-Type': 'application/x-www-form-urlencoded',
                                    },
                                    method: 'POST',
                                    body: JSON.stringify({
                                        type : "notAdminUserRelationToGroup",
                                        groupName : encodeURI(urlParams.get("g"))
                                    }) //data
                                }).then(out => {
                                    return out.json();
                                }).then(log => {
                                    if (!log.status) {
                                        console.log("An error occured while checking if the user was a member, waiting, or nothing at all");
                                        return;
                                    } else {
                                        console.log("OUTPUT");
                                        console.log(log.data);
                                    }
                                    if (log.data=="member") {
                                        document.querySelector(".joinButton").innerHTML="Leave";
                                        document.querySelector(".joinButton").parentNode.innerHTML+=`<p>You are a member ${log.data.role!=null ? `(You are ${log.data.role})` : `(no specific role inside the group)`}`
                                        document.querySelector(".joinButton").addEventListener('click',e => {
                                            Swal.fire({
                                                title : "Confirm",
                                                text : "Are you sure you want to leave the group ?",
                                                icon : "question",
                                                showCancelButton : true,
                                            }).then(result=> {
                                                if (result.isConfirmed) {
                                                    fetch('/Dilab/remove', {
                                                        headers: {
                                                            'Content-Type': 'application/json'
                                                            // 'Content-Type': 'application/x-www-form-urlencoded',
                                                        },
                                                        method: 'POST',
                                                        body: JSON.stringify({
                                                            type : "leaveGroup",
                                                            groupName : encodeURI(urlParams.get("g"))
                                                        })
                                                    }).then(output=> {
                                                            return output.json();
                                                    }).then(data=>{
                                                        if (data.status) {
                                                            document.querySelector(".joinButton").innerHTML="Join";
                                                            document.querySelector(".joinButton").parentNode.removeChild(document.querySelector(".joinButton").parentNode.querySelector("p"));
                                                            document.querySelector(".chat .hider").style.display = "block";
                                                            document.querySelector(".chatInput").disabled=true;
                                                            document.querySelector(".messagesContainer").innerHTML=`<div class="messagesUnavailable">You must be a group member to chat with its members</div>`;
                                                            removeListeners(document.querySelector(".joinButton")).addEventListener("click",()=>{
                                                                fetch('/Dilab/set', {
                                                                    headers: {
                                                                        'Content-Type': 'application/json'
                                                                        // 'Content-Type': 'application/x-www-form-urlencoded',
                                                                    },
                                                                    method: 'POST',
                                                                    body: JSON.stringify({
                                                                        type : "newJoinRequest",
                                                                        groupName : encodeURI(urlParams.get("g"))
                                                                    }) //data
                                                                }).then(out => {
                                                                    return out.json();
                                                                }).then(log => {
                                                                    if (log.status===false) {
                                                                        Swal.fire("Error","Something went wrong : the server responded unexpectedly. Please try later.<br />Message : "+log.data,"error");
                                                                        console.log("An error occured while checking");
                                                                        return;
                                                                    } else {
                                                                        document.querySelector(".joinButton").innerHTML="Waiting for admin to accept you";
                                                                        document.querySelector(".joinButton").classList.add("noHoverActiveButton");
                                                                        document.querySelector(".joinButton").classList.remove("button");
                                                                        document.querySelector(".joinButton").style.opacity= 0.6;
                                                                        document.querySelector(".joinButton").style.cursor= "not-allowed";
                                                                    }
                                                                });
                                                            })
                                                        } else {
                                                            Swal.fire("Error","There was a problem. Try again later","error");
                                                        }
                                                    });
                                                }
                                            });
                                        });
                                        setupChat(urlParams.get("g"));
                                    } else if (log.data=="waiting for approval") {
                                        document.querySelector(".joinButton").classList.add("noHoverActiveButton");
                                        document.querySelector(".joinButton").classList.remove("button");
                                        document.querySelector(".joinButton").style.opacity= 0.6;
                                        document.querySelector(".joinButton").style.cursor= "not-allowed";
                                        document.querySelector(".joinButton").innerHTML="Waiting for admin to accept you";
                                    } else if (log.data=="not a member") {
                                        document.querySelector(".joinButton").addEventListener('click',() => {
                                            fetch('/Dilab/set', {
                                                headers: {
                                                    'Content-Type': 'application/json'
                                                    // 'Content-Type': 'application/x-www-form-urlencoded',
                                                },
                                                method: 'POST',
                                                body: JSON.stringify({
                                                    type : "newJoinRequest",
                                                    groupName : encodeURI(urlParams.get("g"))
                                                }) //data
                                            }).then(out => {
                                                return out.json();
                                            }).then(log => {
                                                if (log.status===false) {
                                                    Swal.fire("Error","Something went wrong : the server responded unexpectedly. Please try later.<br />Message : "+log.data,"error");
                                                    console.log("An error occured while checking if the user was a member, waiting, or nothing at all");
                                                    return;
                                                } else {
                                                    document.querySelector(".joinButton").innerHTML="Waiting for admin to accept you";
                                                    document.querySelector(".joinButton").classList.add("noHoverActiveButton");
                                                    document.querySelector(".joinButton").classList.remove("button");
                                                    document.querySelector(".joinButton").style.opacity= 0.6;
                                                    document.querySelector(".joinButton").style.cursor= "not-allowed";
                                                }
                                            });
                                        });
                                    } else {
                                        console.log("Unexpected response from the server..");
                                    } if (log.data!=="member") {
                                        document.querySelector(".messagesUnavailable").innerHTML="You must be a group member to chat with its members";
                                    }
                                });
                                
                            } else {
                                document.querySelector(".joinButton").addEventListener('click',e => {
                                    Swal.fire({
                                        title : "Note",
                                        text: "You must be logged in to do that",
                                        icon : "info",
                                        showCancelButton: true,
                                        //confirmButtonColor: '#3085d6',
                                        //cancelButtonColor: '#d33',
                                        confirmButtonText: 'Let me log in!'
                                    }).then((result) => {
                                        if (result.isConfirmed) {
                                            goToPage(`https://e.diskloud.fr/Dilab/login?redirect=${encodeURIComponent(`group?g=${urlParams.get('g')}`)}`);
                                        }
                                    })
                                });
                            }
                            document.querySelector(".userRole").innerHTML+=`<i class="bi bi-dot"></i>${data[0][0].nCollaborators} members`;
                            document.querySelector(".groupGenres").innerHTML=data[0][0].genres!=null ? data[0][0].genres : "Not indicated" ;
                            document.querySelector(".groupBio").innerHTML=data[0][0].description;
                            document.querySelector(".nReleases").innerHTML=data[3][0].nb_releases;
                            document.querySelector(".nProjects").innerHTML=data[2][0].nb_projets_actifs;
                            document.querySelector(".nGroupStreams").innerHTML=data[4][0].nb_streams_tot;
                            document.querySelector(".groupJoinDate").innerHTML=year.getDate()+'/'+String(year.getMonth()+1)+'/'+year.getFullYear();
                            // group main releases
                            document.querySelector(".releases").innerHTML="";
                            let authorsGroup=[], urlsGroup=[],picturePathGroup=[],titlesGroup=[], lyricsGroup=[];
                            for (var i=0;i<data[1].length;i++) {
                                console.log(data[1][i].duration);
                                authorsGroup.push(urlParams.get("g"));
                                titlesGroup.push(data[1][i].name);
                                urlsGroup.push(`https://e.diskloud.fr/Dilab/project/${authorsGroup[i]}/${titlesGroup[i]}/`+data[1][i].audioFileDir);
                                picturePathGroup.push(data[1][i].releasePicture);
                                lyricsGroup.push(data[1][i].lyrics);
                                var duree=timestampToNormalTime(data[1][i].duration);
                                document.querySelector(".releases").innerHTML+=newReleaseElement(data[1][i].name,data[0][0].groupName,new Date(data[1][i].releaseDate).getFullYear(),data[1][i].nb_streams+" streams",duree,data[1][i].releasePicture,data[1][i].id,i);
                            }
                            for (var i=0;i<data[1].length;i++) {
                                document.querySelector(`.release[dataPlaylistId="${i}"]`).addEventListener("click",e=>{
                                    let data=JSON.parse(e.target.closest(".releases").getAttribute("playlistData"));
                                    let k=e.target.closest(".release").getAttribute("dataPlaylistId");
                                    playlistIndex=k;
                                    soundTitles=data.titles;
                                    soundAuthors=data.authors;
                                    soundUrls=data.urls;
                                    lyrics=data.lyrics;
                                    soundPictures=data.picturePath;
                                    updatePlayerData();
                                    let songId=e.target.closest(".release").querySelector(".control").getAttribute("soundId");
                                    playSound(k,false,songId);
                                    audioObj.play();
                                });
                            }
                            document.querySelector(".releases").setAttribute("playlistData",JSON.stringify({
                                    titles : titlesGroup,
                                    authors : authorsGroup,
                                    urls : urlsGroup,
                                    lyrics : lyricsGroup,
                                    picturePath : picturePathGroup
                            }));
                            if (data[1].length==0) {
                                document.querySelector(".releases").innerHTML=`<div class="noRelease">The group has not uploaded any release yet</div>`
                            }
                        } else {
                            document.querySelector(".main-content").innerHTML="";
                            Swal.fire("Error",log.data,"error");
                        }
                    });

                    fetch('/Dilab/get',{
                        headers: {
                            'Content-Type': 'application/json'
                            // 'Content-Type': 'application/x-www-form-urlencoded',
                        },
                        method: 'POST',
                        body: JSON.stringify({
                            type : "mainProjectsByGroup",
                            groupName :  encodeURI(urlParams.get("g"))
                        }) //data
                    }).then(out => {
                        return out.json();
                    }).then(data => {
                        console.log(data);
                        if (data.status!=true) {
                            Toast.fire({icon : "warning", title : "Something is not ok.. We couldn't load the most popular projects of the group"});
                        } else {
                            var projectList=data.data;
                            document.querySelector(".projects").innerHTML="<h4>Current Projects</h4>";
                            if (projectList.length==0) {
                                document.querySelector(".projects").innerHTML="<h4>Current Projects</h4>No projects under developpement currently";
                            }
                            for (var i=0;i<projectList.length;i++) {
                                var line=projectList[i],
                                el=document.createElement("div");
                                el.classList.add("project");
                                var projectPPath=(line.projectPicture!="disc.svg") ? `https://e.diskloud.fr/Dilab/project/${line.groupName}/${line.name}` : "https://e.diskloud.fr/Dilab/project/disc.svg"
                                el.innerHTML+=newProjectElement(line.name,projectPPath,line.groupName,line.description,line.dateOfBirth,line.nCollaborators,line.projectPicture,line.audioFile);
                                el.setAttribute("onclick",`loadPage("${line.name} Dilab","project",[["p","${line.name}"],["g","${line.groupName}"]]);`)
                                document.querySelector(".projects").appendChild(el);
                                progress(line.currentPhase,el);
                                if(line.audioFileDir==null) {
                                    el.querySelector(".playBtn").style.opacity=0.6;
                                    el.querySelector(".playBtn").style.cursor="not-allowed";
                                    el.querySelector(".playBtn").setAttribute("title","No audio file uploaded for this project");
                                } else {
                                    el.querySelector(".playBtn").classList.add("enabled");
                                    var audio=document.createElement("AUDIO");
                                    audio.controls=false;
                                    audio.style.display="none";
                                    audio.setAttribute("src",`/Dilab/project/${line.groupName}/${line.name}/${line.audioFileDir}`);
                                    el.querySelector(".playBtn").addEventListener("click",e=>{
                                        e.stopPropagation();
                                        var el2=document.querySelectorAll(".project");
                                        for (var i=0;i<el2.length;i++) {
                                            if (el2[i].contains(e.target)) {
                                                el2=el2[i];
                                                break;
                                            }
                                        }
                                        if (el2.querySelector(".playBtn .bi-play-circle-fill")) {
                                            var audios=document.querySelectorAll("audio");
                                            for (var i=0;i<audios.length;i++) {
                                                audios[i].pause();
                                                audios[i].parentElement.querySelector("i").classList.remove("bi-pause-circle-fill");
                                                audios[i].parentElement.querySelector("i").classList.add("bi-play-circle-fill");
                                                audios[i].currentTime = 0;
                                            }
                                            audioObj.pause();
                                            el2.querySelector(".playBtn i").classList.remove("bi-play-circle-fill");
                                            el2.querySelector(".playBtn i").classList.add("bi-pause-circle-fill");
                                            el2.querySelector("audio").play();
                                        } else {
                                            el2.querySelector(".playBtn i").classList.remove("bi-pause-circle-fill");
                                            el2.querySelector(".playBtn i").classList.add("bi-play-circle-fill");
                                            el2.querySelector("audio").pause();
                                        }
                                    })
                                    el.querySelector(".playBtn").appendChild(audio);
                                    el.querySelector(".playBtn").setAttribute("title",line.audioFileDir);
                                }
                            }
                        }
                    });
                } else {
                    window.location.href="https://e.diskloud.fr/Dilab";
                    location="https://e.diskloud.fr/Dilab";
                }
            });
            break;
        case "/artist" :
            loadTemplate("artist",()=>{
                if (urlParams.get("a")) {
                    fetch('/Dilab/get', {
                        headers: {
                            'Content-Type': 'application/json'
                            // 'Content-Type': 'application/x-www-form-urlencoded',
                        },
                        method: 'POST',
                        body: JSON.stringify({
                            type : "artist",
                            artistName : encodeURI(urlParams.get("a"))
                        }) //data
                    }).then(out => {
                        return out.json();
                    }).then(log => {
                        setupPrivateChat(urlParams.get("a"));
                        if (!log.status) {
                            console.log("something went wrong with the request..");
                            return;
                        }
                        log=log.data;
                        console.log(log);
                        document.querySelector(".styledHeadPP img").src=`https://e.diskloud.fr/Dilab/user/${log[0][0].profilePictureName}`
                        document.querySelector(".main-content-header").innerHTML=log[0][0].pseudo;
                        document.querySelector(".userChat").innerHTML=log[0][0].pseudo;
                        document.querySelector(".userFullName").innerHTML=log[0][0].prenom+" "+log[0][0].nom;
                        document.querySelector(".userBio").innerHTML=log[0][0].biographie;
                        document.querySelector(".nGroups").innerHTML=log[1].length;
                        var date=new Date(log[0][0].dateCreation)
                        document.querySelector(".userJoinDate").innerHTML=`${date.getDay()+1}/${date.getMonth()+1}/${date.getFullYear()}`;
                        document.querySelector(".userGenres").innerHTML=log[0][0].genre;
                        var date=new Date(log[0][0].dateCreation);
                        document.querySelector(".styledHead .registrationDate").innerHTML=`${date.getDay()+1}/${date.getMonth()+1}/${date.getFullYear()}, ${log[3][0].nb_streams_tot} monthly listeners`;

                        var groupsContainer=document.querySelector(".groups");
                        groupsContainer.innerHTML="<h4>Groups he's in</h4>";
                        for (var i=0;i<log[1].length;i++) {
                            // title="",genre="",description="",foundDate="",nCollaborators="",nReleases="",nProjects="",imagePath="people.svg"
                            groupsContainer.innerHTML+=newGroupElement(log[1][i].groupName,log[1][i].genres,log[1][i].description,new Date(log[1][i].dateOfBirth),log[1][i].nCollaborators,log[1][i].nReleases,log[1][i].nProjects,log[1][i].groupPicture);
                        }
                        if (log[1].length==0) {
                            groupsContainer.innerHTML+="No projects where he participates yet";
                        }
                        // artist's main releases
                        document.querySelector(".releases").innerHTML="";
                        let authorsGroup=[], urlsGroup=[],picturePathGroup=[],titlesGroup=[], lyricsGroup=[];
                        for (var i=0;i<log[2].length;i++) {
                            console.log(log[2][i].duration);
                            authorsGroup.push(log[2][i].groupName);
                            titlesGroup.push(log[2][i].name);
                            urlsGroup.push(`https://e.diskloud.fr/Dilab/project/${authorsGroup[i]}/${titlesGroup[i]}/`+log[2][i].audioFileDir);
                            picturePathGroup.push(log[2][i].releasePicture);
                            lyricsGroup.push(log[2][i].lyrics);
                            var duree=timestampToNormalTime(log[2][i].duration);
                            document.querySelector(".releases").innerHTML+=newReleaseElement(log[2][i].name,log[2][i].groupName,new Date(log[2][i].releaseDate).getFullYear(),log[2][i].nb_streams+" streams",duree,log[2][i].releasePicture,log[2][i].id,i);
                        }
                        for (var i=0;i<log[2].length;i++) {
                            document.querySelector(`.release[dataPlaylistId="${i}"]`).addEventListener("click",e=>{
                                let log=JSON.parse(e.target.closest(".releases").getAttribute("playlistData"));
                                let k=e.target.closest(".release").getAttribute("dataPlaylistId");
                                playlistIndex=k;
                                soundTitles=log.titles;
                                soundAuthors=log.authors;
                                soundUrls=log.urls;
                                lyrics=log.lyrics;
                                soundPictures=log.picturePath;
                                updatePlayerData();
                                let songId=e.target.closest(".release").querySelector(".control").getAttribute("soundId");
                                playSound(k,false,songId);
                                audioObj.play();
                            });
                        }
                        document.querySelector(".releases").setAttribute("playlistData",JSON.stringify({
                                titles : titlesGroup,
                                authors : authorsGroup,
                                urls : urlsGroup,
                                lyrics : lyricsGroup,
                                picturePath : picturePathGroup
                        }));
                    });
                } else {
                    window.location.href="https://e.diskloud.fr/Dilab";
                    location="https://e.diskloud.fr/Dilab";
                }
            });
            break;
        case "/release" :
            loadTemplate("release",()=>{

            });
            break;
        case "/project" :
            loadTemplate("project",()=>{
                if (urlParams.get("p") && urlParams.get("g")) {
                    fetch('/Dilab/get', {
                        headers: {
                            'Content-Type': 'application/json'
                            // 'Content-Type': 'application/x-www-form-urlencoded',
                        },
                        method: 'POST',
                        body: JSON.stringify({
                            type : "project",
                            projectGroup : encodeURI(urlParams.get("g")),
                            projectName : encodeURI(urlParams.get("p"))
                        }) //data
                    }).then(out => {
                        return out.json();
                    }).then(log => {
                        console.log(log);
                        if (log.status==true) {
                            // project info insertion (on html page)
                            var project=log.data[0];
                            document.querySelector(".projectPage .main-content-header").innerHTML=project.name;
                            var dateObj=new Date(project.dateOfBirth),
                            projectPicturePath=(project.projectPicture!="disc.svg") ? `https://e.diskloud.fr/Dilab/project/${project.groupName}/${project.name}` : "https://e.diskloud.fr/Dilab/project/disc.svg";
                            document.querySelector(".projectPage .styledHeadPP img").src=projectPicturePath+ "?" + new Date().getTime();
                            document.querySelector(".projectPage .registrationDate").innerHTML=`${dateObj.getDay()}/${dateObj.getMonth()}/${dateObj.getFullYear()}`;
                            progress(project.currentPhase,".progressPart .projectProgress");
                            document.querySelector(".projectPage .linkToGroup").setAttribute("href",`javascript:loadPage("${project.groupName} Dilab","group",[["g","${project.groupName}"]]);`);
                            document.querySelector(".projectPage .groupsFounder").innerHTML=project.groupName;
                            document.querySelector(".projectPage .projectDescription").innerHTML=project.description;
                            document.querySelector(".projectPage .projectGenres").innerHTML= (project.genreName==null) ? "not indicated" : project.genreName;
                            document.querySelector(".projectPage .projectBeginDate").innerHTML=`${dateObj.getDay()}/${dateObj.getMonth()}/${dateObj.getFullYear()}`;
                            document.querySelector(".projectPage .nParticipants").innerHTML=(project.nCollaborators==1 ? "1 participant" : `${project.nCollaborators} participants`)
                            // Lyrics (and audioFile update control, if currentPhase==3)
                            document.querySelector(".projectPage .lyricsCard .lyricsContent").setAttribute("data-lyrics",project.lyrics);
                            if (project.currentPhase==3) {
                                // Le premier replace est également important : il permet de ne pas sauter de ligne au tout début des paroles
                                document.querySelector(".projectPage .lyricsCard .lyricsContent").innerHTML=project.lyrics.replace(/\[[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)\]/,"").replace(/\[[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)\]/g,"<br>");
                                document.querySelector(".projectPage .lyricsCard .editLyricsBtnContainer .editButton").style.display="none";
                                document.querySelector(".audioFile .updateButton").style.display="none";
                            } else { document.querySelector(".projectPage .lyricsCard .lyricsContent").innerHTML=project.lyrics.replace(/\\n/g,"<br />"); }

                            // Project file
                            let projectFileInput=document.querySelector(".projectFile input[type=\"file\"]");
                            document.querySelector(".projectFile .updateButton")?.addEventListener("click",()=>{
                                Toast.fire({title : "Please be patient. You will be asked to choose a file" ,icon : "info"});
                                projectFileInput.click();
                            });
                            projectFileInput.addEventListener("change",()=>{
                                if (projectFileInput.files.length>0) {
                                    Swal.fire({
                                        title : "Confirm file update",
                                        text : "Change project file ?",
                                        icon : "question",
                                        showCancelButton : true,
                                        showConfirmButton : true
                                    }).then((result) => {
                                        if (!result.isConfirmed) {
                                            projectFileInput.value="";
                                            return;
                                        }
                                        if (projectFileInput.files[0].size > 2097152*4){
                                            Swal.fire("Error","File is too big!","error");
                                            projectFileInput.value = "";
                                            return;
                                        } else if (projectFileInput.files[0].name.replace(fileRegexp,'')!=projectFileInput.files[0].name) {
                                            Swal.fire("Error","File name can only contain latin letters (without accents), numbers, .,- and _","error");
                                            audioFileInput.value = "";
                                            return;
                                        }
                                        var data=new FormData();
                                        data.append("projectName", urlParams.get("p"));
                                        data.append("groupName", urlParams.get("g"));
                                        if (projectFileInput.value=='') {
                                            Swal.fire("Error","No file has been provided","error");
                                            return;
                                        } else {
                                            data.append("type","projectProjectFile");
                                            data.append("files",projectFileInput.files[0], projectFileInput.files[0].name);
                                        }
                                        console.log(FormData);
                                        Swal.fire({
                                            allowOutsideClick:false,
                                            showConfirmButton : false,
                                            showCancelButton : false,
                                            text : "Uploading your file.."
                                        });
                                        Swal.showLoading();
                                        fetch('/Dilab/set', {
                                            headers: {
                                                //'Content-Type': 'application/x-www-form-urlencoded'
                                                //'Content-Type': 'multipart/form-data',
                                            },
                                            method: 'POST',
                                            body: data
                                        }).then(out => {
                                            return out.json();
                                        }).then(log => {
                                            console.log(log);
                                            if (log.status==true) {
                                                history.pushState({}, `Dilab (loading..)`, `project?g=${encodeURI(urlParams.get("g"))}&p=${urlParams.get("p")}`)
                                                pathAnalysis();
                                                Toast.fire({title : log.data ,icon:"success"});
                                            } else {
                                                Swal.fire("Error",log.data,"error");
                                            }
                                        });
                                        projectFileInput.value="";
                                    });
                                }
                            });
                            if (project.projectFileDir!=null) {
                                document.querySelector(".projectPage .projectFileName").innerHTML=project.projectFileDir;
                                var flStudioExtension = /(\.flp)$/i,
                                abletonExtension = /(\.als|\.alp)$/i;
                                if (flStudioExtension.exec(project.projectFileDir)) {
                                    document.querySelector(".projectPage .projectFileType").innerHTML= "FL Studio project File"
                                } else if (abletonExtension.exec(project.projectFileDir)) {
                                document.querySelector(".projectPage .projectFileType").innerHTML= "Ableton Project File"
                                } else {
                                document.querySelector(".projectPage .projectFileType").innerHTML= "Unconventional project file format"
                                }
                                dateObj=new Date(project.lastProjectFileUpdate);
                                document.querySelector(".projectPage .projectFile .updateDate").innerHTML = `${dateObj.getDay()}/${dateObj.getMonth()}/${dateObj.getFullYear()} at ${dateObj.getHours()}:${dateObj.getMinutes()}`;
                                document.querySelector(".projectPage .projectFile .downloadButton").setAttribute("href",`/Dilab/project/${project.groupName}/${project.name}/${project.projectFileDir}`);
                           } else {
                               document.querySelector(".projectFile .infoWrapper").innerHTML="There is not project file uploaded";
                               document.querySelector(".projectFile .button").style.opacity="0.6";
                               document.querySelector(".projectFile .button").setAttribute("title","Cannot be downloaded : There is no project file");
                               document.querySelector(".projectFile .button").style.cursor="not-allowed";
                               document.querySelector(".projectFile .button").classList.add("noHoverActiveButton");
                               document.querySelector(".projectFile .button").classList.remove("button");
                           }
                           
                           // Audio file
                            if (project.currentPhase<3) {
                                let audioFileInput=document.querySelector(".audioFile input[type=\"file\"]");
                                document.querySelector(".audioFile .updateButton").addEventListener("click",()=>{
                                    Toast.fire({title : "Please be patient. You will be asked to choose a file" ,icon : "info"});
                                    audioFileInput.click();
                                });
                                audioFileInput.addEventListener("change",()=>{
                                    if (audioFileInput.files.length>0) {
                                        Swal.fire({
                                            title : "Confirm file update",
                                            text : "Change project file ?",
                                            icon : "question",
                                            showCancelButton : true,
                                            showConfirmButton : true
                                        }).then((result) => {
                                            if (!result.isConfirmed) {
                                                audioFileInput.value="";
                                                return;
                                            }
                                            if (audioFileInput.files[0].size > 2097152*4){
                                                Swal.fire("Error","File is too big!","error");
                                                audioFileInput.value = "";
                                                return;
                                            } else if (audioFileInput.files[0].name.replace(fileRegexp,'')!=audioFileInput.files[0].name) {
                                                Swal.fire("Error","File name can only contain latin letters (without accents), numbers, .,- and _","error");
                                                audioFileInput.value = "";
                                                return;
                                            } 
                                            var data=new FormData();
                                            data.append("projectName", urlParams.get("p"));
                                            data.append("groupName", urlParams.get("g"));
                                            if (audioFileInput.value=='') {
                                                Swal.fire("Error","No file has been provided","error");
                                                return;
                                            } else {
                                                data.append("type","projectAudioFile");
                                                data.append("files",audioFileInput.files[0], audioFileInput.files[0].name);
                                            }
                                            Swal.fire({
                                                allowOutsideClick:false,
                                                showConfirmButton : false,
                                                showCancelButton : false,
                                                text : "Uploading your file.."
                                            });
                                            console.log(data);
                                            Swal.showLoading();
                                            fetch('/Dilab/set', {
                                                headers: {
                                                    //'Content-Type': 'application/x-www-form-urlencoded'
                                                    //'Content-Type': 'multipart/form-data',
                                                },
                                                method: 'POST',
                                                body: data
                                            }).then(out => {
                                                return out.json();
                                            }).then(log => {
                                                console.log(log);
                                                if (log.status==true) {
                                                    history.pushState({}, `Dilab (loading..)`, `project?g=${encodeURI(urlParams.get("g"))}&p=${urlParams.get("p")}`)
                                                    pathAnalysis();
                                                    Toast.fire({title : log.data ,icon:"success"});
                                                } else {
                                                    Swal.fire("Error",log.data,"error");
                                                }
                                            });
                                            audioFileInput.value="";
                                        });
                                    }
                                });
                            }
                            if (project.audioFileDir!=null) {
                                var audioExtension = project.audioFileDir.slice(project.audioFileDir.lastIndexOf('.') + 1).toUpperCase();
                                document.querySelector(".projectPage .audioFileName").innerHTML=project.audioFileDir;
                                document.querySelector(".projectPage .audioFileType").innerHTML= `${audioExtension} File`
                                dateObj=new Date(project.lastAudioFileUpdate);
                                document.querySelector(".projectPage .audioFile .updateDate").innerHTML = `${dateObj.getDay()}/${dateObj.getMonth()}/${dateObj.getFullYear()} at ${dateObj.getHours()}:${dateObj.getMinutes()}`;
                                document.querySelector(".projectPage .audioFile .downloadButton").setAttribute("href",`/Dilab/project/${project.groupName}/${project.name}/${project.audioFileDir}`);
                                var audio=document.createElement("audio");
                                if (audio.canPlayType(`audio/${audioExtension}`)=="") {
                                    document.querySelector(".audioFile .playButton").setAttribute("disabled","true");
                                    document.querySelector(".audioFile .playButton").setAttribute("title","Cannot be played : Unsupported file format");
                                    document.querySelector(".audioFile .playButton").style.cursor="not-allowed";
                                    document.querySelector(".audioFile .playButton").style.userSelect="none";
                                    document.querySelector(".audioFile .playButton").style.opacity="0.6";
                                    document.querySelector(".audioFile .playButton").classList.add("noHoverActiveButton");
                                    document.querySelector(".audioFile .playButton").classList.remove("button");
                                } else {
                                        document.querySelector(".audioFile .playButton").addEventListener("click",e=> {
                                            // ACOMPLETER
                                            soundUrls=[(`/Dilab/project/${project.groupName}/${project.name}/${project.audioFileDir}`)];
                                            soundTitles=[project.name];
                                            soundAuthors=[project.groupName];
                                            soundPictures=[project.projectPicture];
                                            lyrics=[""]; //project.lyrics);
                                            updatePlayerData();
                                            playSound(0);
                                            audioObj.play();
                                        })
                                }                               
                           } else {
                                document.querySelector(".audioFile .infoWrapper").innerHTML = "There is no audio file uploaded";
                                // first button
                                document.querySelector(".audioFile .playButton").setAttribute("disabled","true");
                                document.querySelector(".audioFile .playButton").setAttribute("title","Cannot be played : There is no audio file");
                                document.querySelector(".audioFile .playButton").style.cursor="not-allowed";
                                document.querySelector(".audioFile .playButton").style.userSelect="none";
                                document.querySelector(".audioFile .playButton").style.opacity="0.6";
                                document.querySelector(".audioFile .playButton").setAttribute("disabled","true");
                                document.querySelector(".audioFile .playButton").classList.add("noHoverActiveButton");
                                document.querySelector(".audioFile .playButton").classList.remove("button");
                                // second button
                                document.querySelector(".audioFile .downloadButton").setAttribute("title","Cannot be downloaded : There is no audio file");
                                document.querySelector(".audioFile .downloadButton").style.cursor="not-allowed";
                                document.querySelector(".audioFile .downloadButton").style.userSelect="none";
                                document.querySelector(".audioFile .downloadButton").style.opacity="0.6";
                                document.querySelector(".audioFile .downloadButton").setAttribute("disabled","true");
                                document.querySelector(".audioFile .downloadButton").classList.add("noHoverActiveButton");
                                document.querySelector(".audioFile .downloadButton").classList.remove("button");
                           }
                           if (project.audioFileDir==null) {
                                document.querySelectorAll(".step")[3].addEventListener('click',()=>{
                                    if (document.querySelector(".artistCard .editButton")==null)
                                        return;
                                    Swal.fire("And the audio ?","You didn't upload any audio file yet.<br />Only then can you release the project.","warning");
                                });
                           } else {
                                document.querySelectorAll(".step")[3].addEventListener('click',()=>{
                                    if (document.querySelector(".artistCard .editButton")==null)
                                        return;
                                    if (document.querySelectorAll(".steps .completed").length == 3) {
                                        Swal.fire("Note","The project has already been released.","info");
                                        return;
                                    }
                                    displayPopUp("Release Project","releaseProject",()=>{
                                        let data={
                                            name : project.name,
                                            lyrics : document.querySelector(".lyricsContent").getAttribute("data-lyrics").replace(/<br>/g,"\\n"),
                                            author : project.groupName,
                                            audioLink : project.audioFileDir
                                        };
                                        localStorage.removeItem("lyricsSyncOutput");
                                        console.log(data.lyrics.trim().replace(/\\n/g,""));
                                        if (data.lyrics.trim().replace(/\\n/g,"")!="") {
                                            localStorage.setItem("lyricsSyncInput",JSON.stringify(data));
                                        } else {
                                            document.querySelector(".synchronizeLyricsLink").style.display="none"; // On masque le bouton renvoyant vers la page de synchronisation des lyrics
                                        }
                                        document.querySelector(".confirmRelease").addEventListener("click",()=>{
                                            let lyrics;
                                            if (data.lyrics.trim()=="") {
                                                lyrics='';
                                            } else {
                                                lyrics=localStorage.getItem("lyricsSyncOutput");
                                            }
                                            if ((lyrics=='' || lyrics==null) && data.lyrics.trim()!="") {
                                                Swal.fire("Warning","You must synchronize your lyrics first !","warning");
                                                return;
                                            }
                                            Swal.fire({
                                                icon : "question",
                                                title: 'Do you confirm the release ?',
                                                text : "Once the song will have been released, you will only be able to change the project's title, description and its project file. Audio and lyrics will become unchangeable.",
                                                showCancelButton: true,
                                                confirmButtonText: 'Yes',
                                              }).then((result) => {
                                                /* Read more about isConfirmed, isDenied below */
                                                if (result.isConfirmed) {
                                                    // Code à tester
                                                    const audioElement = new Audio(`https://e.diskloud.fr/Dilab/project/${encodeURI(urlParams.get("g"))}/${urlParams.get("p")}/`+document.querySelector(".infoWrapper .audioFileName").innerHTML);
                                                    audioElement.addEventListener("loadeddata", () => {
                                                        let duration = audioElement.duration;
                                                        let data={
                                                            type : "releaseProject",
                                                            groupName : encodeURI(urlParams.get("g")),
                                                            projectName : encodeURI(urlParams.get("p")),
                                                            lyricsSynced : encodeURI(lyrics), // Important de mettre en string. Sinon, si count=0, le champ est ignoré
                                                            "duration" : duration
                                                        };
                                                        console.log(data);
                                                        fetch(`/Dilab/set`, {
                                                            headers: {
                                                                'Content-Type': 'application/json'
                                                                // 'Content-Type': 'application/x-www-form-urlencoded',
                                                            },
                                                            method: 'POST',
                                                            body: JSON.stringify(data)
                                                        }).then(response => {
                                                            console.log(response);
                                                            return response.json();
                                                        })
                                                        .catch(error => {
                                                            Swal.fire( {
                                                            text : `Update failed: ${error}`,
                                                            title : "Error",
                                                            icon : "error"
                                                            });
                                                        }).then((result) => {
                                                            console.log(result);
                                                            if (result.status) {
                                                                progress(3,document.querySelector(".infos"))
                                                                Swal.fire("Success !","Your project has been released !","success");
                                                            } else {//Termine
                                                                Swal.fire({
                                                                    title : "Error",
                                                                    icon : "error",
                                                                    text : result.data
                                                                });
                                                            }
                                                        });
                                                    });                                      
                                                }
                                              });
                                        })
                                        return;
                                    }); // Pour synchroniser les lyrics, on utilisera un tab séparé utilisant les cookies pour transmettre le résultat
                                });
                           }
                        } else {
                            document.querySelector(".main-content").innerHTML="";
                            Swal.fire("Error",log.data,"error");
                        }
                    });

                    fetch('/Dilab/check', {
                        headers: {
                            'Content-Type': 'application/json'
                            // 'Content-Type': 'application/x-www-form-urlencoded',
                        },
                        method: 'POST',
                        body: JSON.stringify({
                            type : "notAdminUserRelationToGroup",
                            groupName : encodeURI(urlParams.get("g"))
                        }) //data
                    }).then(out => {
                        return out.json();
                    }).then(log => {
                        if (!log.status) {
                            console.log("An error occured while checking if the user was a member, waiting, or nothing at all");
                            return;
                        } if (log.data=="member") {
                            // Project cover personalization
                            let projectCover=document.querySelector(".styledHeadPP"),
                            projectCoverFile=document.querySelector(".projectCoverInput");
                            projectCover.addEventListener("click",()=>{
                                Toast.fire({title : "Please be patient. You will be asked to choose a file" ,icon : "info"});
                                projectCoverFile.click();
                            });
                            projectCoverFile.addEventListener("change",()=>{
                                if (projectCoverFile.files.length>0) {
                                    Swal.fire({
                                        title : "Confirm file update",
                                        text : "Change project cover ?",
                                        icon : "question",
                                        showCancelButton : true,
                                        showConfirmButton : true
                                    }).then((result) => {
                                        if (!result.isConfirmed) {
                                            projectCoverFile.value="";
                                            return;
                                        }
                                        if (projectCoverFile.files[0].size > 2097152*4){
                                            Swal.fire("Error","File is too big!","error");
                                            projectCoverFile.value = "";
                                            return;
                                        } else if (projectCoverFile.files[0].name.replace(fileRegexp,'')!=projectCoverFile.files[0].name) {
                                            Swal.fire("Error","File name can only contain latin letters (without accents), numbers, .,- and _","error");
                                            projectCoverFile.value = "";
                                            return;
                                        } 
                                        var data=new FormData();
                                        data.append("projectName", urlParams.get("p"));
                                        data.append("groupName", urlParams.get("g"));
                                        if (projectCoverFile.value=='') {
                                            Swal.fire("Error","No file has been provided","error");
                                            return;
                                        } else {
                                            data.append("type","projectCover");
                                            data.append("files",projectCoverFile.files[0], projectCoverFile.files[0].name);
                                        }
                                        Swal.fire({
                                            allowOutsideClick:false,
                                            showConfirmButton : false,
                                            showCancelButton : false,
                                            text : "Uploading your file.."
                                        });
                                        Swal.showLoading();
                                        fetch('/Dilab/set', {
                                            headers: {
                                                //'Content-Type': 'application/x-www-form-urlencoded'
                                                //'Content-Type': 'multipart/form-data',
                                            },
                                            method: 'POST',
                                            body: data
                                        }).then(out => {
                                            return out.json();
                                        }).then(log => {
                                            console.log(log);
                                            if (log.status==true) {
                                                history.pushState({}, `Dilab (loading..)`, `project?g=${encodeURI(urlParams.get("g"))}&p=${urlParams.get("p")}`)
                                                pathAnalysis();
                                                Toast.fire({title : log.data ,icon:"success"});
                                            } else {
                                                Swal.fire("Error",log.data,"error");
                                            }
                                        });
                                        projectCoverFile.value="";
                                    });
                                }
                            });
                            // Chat boot
                            setupChat(urlParams.get("g"),urlParams.get("p"));
                            // Project phase
                            document.querySelectorAll(".step").forEach(el=>{
                                el.style.cursor="pointer";
                                el.addEventListener('mouseover',function(){
                                    el.style.opacity=0.7;
                                 });
                                el.addEventListener('mouseleave',function(){
                                    el.style.opacity=1;
                                });
                                let count=parseInt(el.getAttribute("data-k"));
                                if (count<3) {
                                    el.addEventListener('click',function(){
                                        if (document.querySelectorAll(".steps .completed").length == 3) {
                                            Swal.fire("Note","You cannot change the project phase anymore, as it has been released.","info");
                                            return;
                                        }
                                        Swal.fire({
                                            title: 'Change the current phase ?',
                                            showCancelButton: true,
                                            confirmButtonText: 'Yes',
                                          }).then((result) => {
                                            /* Read more about isConfirmed, isDenied below */
                                            if (result.isConfirmed) {
                                                fetch(`/Dilab/set`, {
                                                    headers: {
                                                        'Content-Type': 'application/json'
                                                        // 'Content-Type': 'application/x-www-form-urlencoded',
                                                    },
                                                    method: 'POST',
                                                    body: JSON.stringify({
                                                        type : "projectPhase",
                                                        groupName : encodeURI(urlParams.get("g")),
                                                        projectName : encodeURI(urlParams.get("p")),
                                                        phase : String(count) // Important de mettre en string. Sinon, si count=0, le champ est ignoré
                                                    })}).then(response => {
                                                      if (!response.ok) {
                                                        throw new Error(response.statusText)
                                                      }
                                                      return response.json()
                                                    })
                                                    .catch(error => {
                                                      Swal.fire( {
                                                        text : `Update failed: ${error}`,
                                                        title : "Error",
                                                        icon : "error"
                                                      });
                                                    }).then((result) => {
                                                        console.log(result);
                                                        if (result.status) {
                                                          progress(parseInt(count),document.querySelector(".infos"))
                                                        }//Termine
                                                    });                                        }
                                          });
                                    });
                                }
                            });
                            // Project description
                            document.querySelector(".editButton[button-action='projectDescUpdate']").addEventListener('click',()=>{
                                Swal.fire({
                                    title: 'Submit your new description',
                                    input: 'text',
                                    inputAttributes: {
                                      autocapitalize: 'off'
                                    },
                                    showCancelButton: true,
                                    confirmButtonText: 'Update',
                                    showLoaderOnConfirm: true,
                                    preConfirm: (input) => {
                                      return fetch(`/Dilab/set`, {
                                        headers: {
                                            'Content-Type': 'application/json'
                                            // 'Content-Type': 'application/x-www-form-urlencoded',
                                        },
                                        method: 'POST',
                                        body: JSON.stringify({
                                            type : "projectDescription",
                                            groupName : encodeURI(urlParams.get("g")),
                                            projectName : encodeURI(urlParams.get("p")),
                                            description : encodeURI(input)
                                        })}).then(response => {
                                          if (!response.ok) {
                                            throw new Error(response.statusText)
                                          }
                                          return response.json()
                                        })
                                        .catch(error => {
                                          Swal.showValidationMessage(
                                            `Update failed: ${error}`
                                          )
                                        }).then((result) => {
                                            if (result.status) {
                                              document.querySelector(".infoElement .projectDescription").innerHTML=input;
                                            }//Termine
                                        });
                                    },
                                    allowOutsideClick: () => !Swal.isLoading()
                                  });
                            });
                            // Project lyrics
                            document.querySelector(".cancelButton[button-action='cancelEditLyrics']").addEventListener("click",()=>{
                                let el=document.querySelector(".lyricsContent");
                                el.innerHTML=el.getAttribute("data-lyrics").replace(/\\n/g,"<br />") // second replace to remove the first html line escape. This won't affect the other generated brs.
                                lyricsEditBtn.innerHTML="Edit lyrics";
                                document.querySelector(".cancelButton[button-action='cancelEditLyrics']").style.display="none";
                                document.querySelector(".lyricsContent").setAttribute("contenteditable",false);
                            });
                            // Pour éviter du copiage d'html
                            document.querySelector(".lyricsContent").addEventListener('paste', function (e) {
                                e.preventDefault();
                                var text = e.clipboardData.getData('text/plain');
                                document.execCommand('insertText', false, text);
                            });
                            let lyricsEditBtn=document.querySelector(".editButton[button-action='editLyrics']");
                            lyricsEditBtn.addEventListener("click",()=>{
                                let lyricsEl=document.querySelector(".lyricsContent");
                                if (lyricsEditBtn.innerHTML=="Edit lyrics") {
                                    lyricsEditBtn.innerHTML="Confirm changes";
                                    document.querySelector(".cancelButton[button-action='cancelEditLyrics']").style.display="block";
                                    lyricsEl.setAttribute("contenteditable",true);
                                    lyricsEl.focus();
                                    lyricsEl.style.userSelect="auto";
                                } else {
                                    lyricsEl.setAttribute("contenteditable",false);
                                    lyricsEl.style.userSelect="";
                                    let newLyrics=lyricsEl.innerHTML.replace(/<div><\/div>/g,"\\n").replace(/<div>/g,"\\n").replace(/<\/div>/g,"");
                                    if (newLyrics==""){
                                        newLyrics=" ";
                                    }
                                    if (newLyrics!=lyricsEl.getAttribute("data-lyrics")) {
                                        lyricsEditBtn.style.opacity=0.7;                                    document.querySelector(".cancelButton[button-action='cancelEditLyrics']").style.display="none";
                                        fetch('/Dilab/set', {
                                            headers: {
                                                'Content-Type': 'application/json'
                                                // 'Content-Type': 'application/x-www-form-urlencoded',
                                            },
                                            method: 'POST',
                                            body: JSON.stringify({
                                                type : "projectLyrics",
                                                groupName : encodeURI(urlParams.get("g")),
                                                projectName : encodeURI(urlParams.get("p")),
                                                lyrics : encodeURI(newLyrics)
                                            }) //data
                                        }).then(out => {
                                            return out.json();
                                        }).then(log => {
                                            lyricsEditBtn.style.opacity=1;
                                            lyricsEditBtn.innerHTML="Edit lyrics";
                                            if (log.status && log.k==1) {
                                                // Request worked
                                                lyricsEl.setAttribute("data-lyrics",newLyrics);
                                                Swal.fire({
                                                    position: 'top-end',
                                                    toast : true,
                                                    icon: 'info',
                                                    title: 'Updated lyrics',
                                                    showConfirmButton: false,
                                                    timer: 1500,
                                                    timerProgressBar : true
                                                });
                                            } else {
                                                // Otherwise, display error message and restore previous text
                                                console.log(log);
                                                Swal.fire({
                                                    position: 'top-end',
                                                    toast : true,
                                                    icon: 'error',
                                                    title: 'Something went wrong. Please try again later',
                                                    showConfirmButton: false,
                                                    timer: 3000,
                                                    timerProgressBar : true
                                                });
                                                el.innerHTML=el.getAttribute("data-lyrics").replace(/\\n/g,"<br />");
                                            }
                                        });
                                    } else {
                                        document.querySelector(".cancelButton[button-action='cancelEditLyrics']").style.display="none";
                                        lyricsEditBtn.innerHTML="Edit lyrics";
                                    }
                                }
                            });
                            // Project name
                            document.querySelector(".propertyOption[prop-type='project-mame']").addEventListener("click",()=>{
                                console.log(urlParams.get("p"));
                                Swal.fire({
                                    title: 'Submit your new project name',
                                    input: 'text',
                                    inputAttributes: {
                                      autocapitalize: 'off'
                                    },
                                    showCancelButton: true,
                                    confirmButtonText: 'Update',
                                    showLoaderOnConfirm: true,
                                    preConfirm: (input) => {
                                      return fetch(`/Dilab/set`, {
                                        headers: {
                                            'Content-Type': 'application/json'
                                            // 'Content-Type': 'application/x-www-form-urlencoded',
                                        },
                                        method: 'POST',
                                        body: JSON.stringify({
                                            type : "projectName",
                                            groupName : encodeURI(urlParams.get("g")),
                                            projectName : encodeURI(urlParams.get("p")),
                                            newName : encodeURI(input)
                                        })}).then(response => {
                                          if (!response.ok) {
                                            throw new Error(response.statusText)
                                          }
                                          return response.json()
                                        })
                                        .catch(error => {
                                          Swal.showValidationMessage(
                                            `Update failed: ${error}`
                                          );
                                        }).then((result) => {
                                            if (result.status && result.k==1) {
                                                document.querySelector(".styledHead .main-content-header").innerHTML=input;
                                                history.pushState({}, `Dilab (loading..)`, `project?g=${encodeURI(urlParams.get("g"))}&p=${encodeURI(input)}`)
                                                pathAnalysis();
                                            } else if (!result.status && result.return=="CE") {
                                                Swal.showValidationMessage(
                                                    `This project name is already used.`
                                                );
                                            } else {
                                                console.log(result);
                                                Swal.fire({
                                                    position: 'top-end',
                                                    toast : true,
                                                    icon: 'error',
                                                    title: 'Something went wrong. Please try again later',
                                                    showConfirmButton: false,
                                                    timer: 3000,
                                                    timerProgressBar : true
                                                });
                                            }
                                        });
                                    },
                                    allowOutsideClick: () => !Swal.isLoading()
                                  });
                            });
                        } else {
                            document.querySelector(".styledHeadPP .styledHeadEditIcon").style.display="none";
                            document.querySelector(".styledHeadPP").style.cursor="default";
                            document.querySelectorAll(".propertyOption").forEach(element=>{
                                element.style.display="none";
                            });
                            console.log(log.data);
                            document.querySelector(".messagesUnavailable").innerHTML="You must be a group member to chat with its members";
                            let projectPage=document.querySelector(".projectPage");
                            projectPage.querySelectorAll(".updateButton, .editButton").forEach(el=>{el.remove();});
                        }
                    });

                } else {
                    window.location.href="https://e.diskloud.fr/Dilab";
                    location="https://e.diskloud.fr/Dilab";
                }
            });
            break;
        case "/releases" :
            loadTemplate("releases",()=>{
                document.querySelector(".opt").style.fontWeight="bold";
                document.querySelector(".opt").style.color="white";
                document.querySelector(".projectLink").addEventListener("click",()=>{loadPage("Projects","projects",[])});
            
                fetch(`/Dilab/get`, {
                    headers: {
                        'Content-Type': 'application/json'
                        // 'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    method: 'POST',
                    body: JSON.stringify({
                        type : "mainReleases",
                    }) //data
                }).then(out => {
                    return out.json();
                }).then(log => {
                    console.log(log)
                    // main releases
                    var data=log.data;
                    document.querySelectorAll(".releases")[1].innerHTML="";
                    /*for (var i=0;i<data.length;i++) {
                        console.log(data[i].duration);
                        var duree=timestampToNormalTime(data[i].duration);
                        document.querySelectorAll(".releases")[1].innerHTML+=newReleaseElement(data[i].name,data[i].groupName,new Date(data[i].releaseDate).getFullYear(),data[i].nb_streams+" streams",duree,data[i].releasePicture,data[i].id);
                    }*/
                    let authorsGroup=[], urlsGroup=[],picturePathGroup=[],titlesGroup=[], lyricsGroup=[];
                    for (var i=0;i<data.length;i++) {
                        console.log(data[i].duration);
                        authorsGroup.push(data[i].groupName);
                        titlesGroup.push(data[i].name);
                        urlsGroup.push(`https://e.diskloud.fr/Dilab/project/${authorsGroup[i]}/${titlesGroup[i]}/`+data[i].audioFileDir);
                        picturePathGroup.push(data[i].releasePicture);
                        lyricsGroup.push(data[i].lyrics);
                        var duree=timestampToNormalTime(data[i].duration);
                        document.querySelectorAll(".releases")[1].innerHTML+=newReleaseElement(data[i].name,data[i].groupName,new Date(data[i].releaseDate).getFullYear(),data[i].nb_streams+" streams",duree,data[i].releasePicture,data[i].id,i);
                    }
                    for (var i=0;i<data.length;i++) {
                        document.querySelector(`.release[dataPlaylistId="${i}"]`).addEventListener("click",e=>{
                            let data=JSON.parse(e.target.closest(".releases").getAttribute("playlistData"));
                            let k=e.target.closest(".release").getAttribute("dataPlaylistId");
                            playlistIndex=k;
                            soundTitles=data.titles;
                            soundAuthors=data.authors;
                            soundUrls=data.urls;
                            lyrics=data.lyrics;
                            soundPictures=data.picturePath;
                            updatePlayerData();
                            let songId=e.target.closest(".release").querySelector(".control").getAttribute("soundId");
                            playSound(k,false,songId);
                            audioObj.play();
                        });
                    }
                    updatePlayPauseIcons();
                    document.querySelectorAll(".releases")[1].setAttribute("playlistData",JSON.stringify({
                            titles : titlesGroup,
                            authors : authorsGroup,
                            urls : urlsGroup,
                            lyrics : lyricsGroup,
                            picturePath : picturePathGroup
                    }));
                });

                fetch(`/Dilab/get`, {
                    headers: {
                        'Content-Type': 'application/json'
                        // 'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    method: 'POST',
                    body: JSON.stringify({
                        type : "newestReleases",
                    }) //data
                }).then(out => {
                    return out.json();
                }).then(log => {
                    console.log(log)
                    var data=log.data;
                    // newset releases
                    document.querySelectorAll(".releases")[0].innerHTML="";
                    /*for (var i=0;i<data.length;i++) {
                        var duree=timestampToNormalTime(data[i].duration);
                        document.querySelectorAll(".releases")[0].innerHTML+=newReleaseElement(data[i].name,data[i].groupName,new Date(data[i].releaseDate).getFullYear(),data[i].nb_streams+" streams",duree,data[i].releasePicture,data[i].id);
                    }*/
                    let authorsGroup=[], urlsGroup=[],picturePathGroup=[],titlesGroup=[], lyricsGroup=[];
                    for (var i=0;i<data.length;i++) {
                        console.log(data[i].duration);
                        authorsGroup.push(data[i].groupName);
                        titlesGroup.push(data[i].name);
                        urlsGroup.push(`https://e.diskloud.fr/Dilab/project/${authorsGroup[i]}/${titlesGroup[i]}/`+data[i].audioFileDir);
                        picturePathGroup.push(data[i].releasePicture);
                        lyricsGroup.push(data[i].lyrics);
                        var duree=timestampToNormalTime(data[i].duration);
                        document.querySelectorAll(".releases")[0].innerHTML+=newReleaseElement(data[i].name,data[i].groupName,new Date(data[i].releaseDate).getFullYear(),data[i].nb_streams+" streams",duree,data[i].releasePicture,data[i].id,i);
                    }
                    for (var i=0;i<data.length;i++) {
                        document.querySelector(`.release[dataPlaylistId="${i}"]`).addEventListener("click",e=>{
                            let data=JSON.parse(e.target.closest(".releases").getAttribute("playlistData"));
                            let k=e.target.closest(".release").getAttribute("dataPlaylistId");
                            playlistIndex=k;
                            soundTitles=data.titles;
                            soundAuthors=data.authors;
                            soundUrls=data.urls;
                            lyrics=data.lyrics;
                            soundPictures=data.picturePath;
                            updatePlayerData();
                            let songId=e.target.closest(".release").querySelector(".control").getAttribute("soundId");
                            playSound(k,false,songId);
                            audioObj.play();
                        });
                    }
                    updatePlayPauseIcons();
                    document.querySelectorAll(".releases")[0].setAttribute("playlistData",JSON.stringify({
                            titles : titlesGroup,
                            authors : authorsGroup,
                            urls : urlsGroup,
                            lyrics : lyricsGroup,
                            picturePath : picturePathGroup
                    }));
                });

                if (!document.querySelector(".loginButton") && userData!=null && userData.genres) {
                    fetch('/Dilab/get',{
                        headers: {
                            'Content-Type': 'application/json'
                            // 'Content-Type': 'application/x-www-form-urlencoded',
                        },
                        method: 'POST',
                        body: JSON.stringify({
                            type : "mainReleasesByGenre",
                            genreId : userData.genres
                        }) //data
                    }).then(out => {
                        return out.json();
                    }).then(data => {
                        console.log(data);
                        if (data.status!=true) {
                            Toast.fire({icon : "warning", title : "Something is not ok.. We couldn't load the most popular projects depending on your favorite genre"});
                        } else {
                            var data=data.data;
                            document.querySelectorAll(".releases")[2].innerHTML="";
                            
                            // main releases
                            /*for (var i=0;i<data.length;i++) {
                                var duree=timestampToNormalTime(data[i].duration);
                                document.querySelectorAll(".releases")[2].innerHTML+=newReleaseElement(data[i].name,data[i].groupName,new Date(data[i].releaseDate).getFullYear(),data[i].nb_streams+" streams",duree,data[i].releasePicture,data[i].id);
                            }*/
                            let authorsGroup=[], urlsGroup=[],picturePathGroup=[],titlesGroup=[], lyricsGroup=[];
                            for (var i=0;i<data.length;i++) {
                                console.log(data[i].duration);
                                authorsGroup.push(data[i].groupName);
                                titlesGroup.push(data[i].name);
                                urlsGroup.push(`https://e.diskloud.fr/Dilab/project/${authorsGroup[i]}/${titlesGroup[i]}/`+data[i].audioFileDir);
                                picturePathGroup.push(data[i].releasePicture);
                                lyricsGroup.push(data[i].lyrics);
                                var duree=timestampToNormalTime(data[i].duration);
                                document.querySelectorAll(".releases")[2].innerHTML+=newReleaseElement(data[i].name,data[i].groupName,new Date(data[i].releaseDate).getFullYear(),data[i].nb_streams+" streams",duree,data[i].releasePicture,data[i].id,i);
                            }
                            for (var i=0;i<data.length;i++) {
                                let els=document.querySelectorAll(`.release[dataPlaylistId="${i}"]`);
                                els[els.length-1].addEventListener("click",e=>{
                                    let data=JSON.parse(e.target.closest(".releases").getAttribute("playlistData"));
                                    console.log(data);
                                    let k=e.target.closest(".release").getAttribute("dataPlaylistId");
                                    playlistIndex=k;
                                    soundTitles=data.titles;
                                    soundAuthors=data.authors;
                                    soundUrls=data.urls;
                                    lyrics=data.lyrics;
                                    soundPictures=data.picturePath;
                                    updatePlayerData();
                                    let songId=e.target.closest(".release").querySelector(".control").getAttribute("soundId");
                                    playSound(k,false,songId);
                                    audioObj.play();
                                });
                            }
                            updatePlayPauseIcons();
                            document.querySelectorAll(".releases")[2].setAttribute("playlistData",JSON.stringify({
                                    titles : titlesGroup,
                                    authors : authorsGroup,
                                    urls : urlsGroup,
                                    lyrics : lyricsGroup,
                                    picturePath : picturePathGroup
                            }));
                            if (data.length==0) {
                                document.querySelectorAll(".releases")[2].innerHTML="<span class=\"noDataTextInfo\">Apparently, you are very original as far as your genre is concerned.. !<p>No project similar to your tastes has been published yet. Maybe you could be the first artist to publish !</p></div>";
                            }
                        }
                    });
                } else {
                    document.querySelectorAll(".releases")[2].innerHTML="<span class=\"noDataTextInfo\">We have to know about you to show you personalized content.. !<p><a href=https://e.diskloud.fr/Dilab/login >Log in</a> to get personalized releases and upload your own content !</div>";
                }
            });
            break;
        case "/projects" :
            loadTemplate("projects",()=>{
                document.querySelectorAll(".opt")[1].style.fontWeight="bold";
                document.querySelectorAll(".opt")[1].style.color="white";
                document.querySelectorAll(".projectsContainer .leftBtn")[0].addEventListener("click", () => {
                    document.querySelectorAll(".projectsContainer > .projects")[0].scrollBy(-window.innerWidth+200, 0);
                });
                document.querySelectorAll(".projectsContainer .rightBtn")[0].addEventListener("click", () => {
                    document.querySelectorAll(".projectsContainer > .projects")[0].scrollBy(window.innerWidth-200, 0);
                });
                document.querySelectorAll(".projectsContainer .leftBtn")[1].addEventListener("click", () => {
                    document.querySelectorAll(".projectsContainer > .projects")[1].scrollBy(-window.innerWidth+200, 0);
                });
                document.querySelectorAll(".projectsContainer .rightBtn")[1].addEventListener("click", () => {
                    document.querySelectorAll(".projectsContainer > .projects")[1].scrollBy(window.innerWidth-200, 0);
                });
                fetch('/Dilab/get',{
                    headers: {
                        'Content-Type': 'application/json'
                        // 'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    method: 'POST',
                    body: JSON.stringify({
                        type : "mainProjects"
                    }) //data
                }).then(out => {
                    return out.json();
                }).then(data => {
                    console.log(data);
                    if (data.status!=true) {
                        Toast.fire({icon : "warning", title : "Something is not ok.. We couldn't load the most popular projects on the platform"});
                    } else {
                        var projectList=data.data;
                        document.querySelector(".projectsWrapper").innerHTML="";
                        for (var i=0;i<projectList.length;i++) {
                            var line=projectList[i],
                            el=document.createElement("div");
                            el.classList.add("project");
                            var projectPPath=(line.projectPicture!="disc.svg") ? `https://e.diskloud.fr/Dilab/project/${line.groupName}/${line.name}` : "https://e.diskloud.fr/Dilab/project/disc.svg"
                            el.innerHTML+=newProjectElement(line.name,projectPPath,line.groupName,line.description,line.dateOfBirth,line.nCollaborators,line.projectPicture,line.audioFile);
                            el.setAttribute("onclick",`loadPage("${line.name} Dilab","project",[["p","${line.name}"],["g","${line.groupName}"]]);`)
                            document.querySelector(".projectsWrapper").appendChild(el);
                            progress(line.currentPhase,el);
                            if(line.audioFileDir==null) {
                                el.querySelector(".playBtn").style.opacity=0.6;
                                el.querySelector(".playBtn").style.cursor="not-allowed";
                                el.querySelector(".playBtn").setAttribute("title","No audio file uploaded for this project");
                            } else {
                                el.querySelector(".playBtn").classList.add("enabled");
                                var audio=document.createElement("AUDIO");
                                audio.controls=false;
                                audio.style.display="none";
                                audio.setAttribute("src",`/Dilab/project/${encodeURI(line.groupName)}/${encodeURI(line.name)}/${encodeURI(line.audioFileDir)}`);
                                el.querySelector(".playBtn").addEventListener("click",e=>{
                                    e.stopPropagation();
                                    var el2=document.querySelectorAll(".project");
                                    for (var i=0;i<el2.length;i++) {
                                        if (el2[i].contains(e.target)) {
                                            el2=el2[i];
                                            break;
                                        }
                                    }
                                    if (el2.querySelector(".playBtn .bi-play-circle-fill")) {
                                        var audios=document.querySelectorAll("audio");
                                        for (var i=0;i<audios.length;i++) {
                                            audios[i].pause();
                                            audios[i].parentElement.querySelector("i").classList.remove("bi-pause-circle-fill");
                                            audios[i].parentElement.querySelector("i").classList.add("bi-play-circle-fill");
                                            audios[i].currentTime = 0;
                                        }
                                        audioObj.pause();
                                        el2.querySelector(".playBtn i").classList.remove("bi-play-circle-fill");
                                        el2.querySelector(".playBtn i").classList.add("bi-pause-circle-fill");
                                        el2.querySelector("audio").play();
                                    } else {
                                        el2.querySelector(".playBtn i").classList.remove("bi-pause-circle-fill");
                                        el2.querySelector(".playBtn i").classList.add("bi-play-circle-fill");
                                        el2.querySelector("audio").pause();
                                    }
                                })
                                el.querySelector(".playBtn").appendChild(audio);
                                el.querySelector(".playBtn").setAttribute("title",line.audioFileDir);
                            }
                        }
                    }
                });

                if (!document.querySelector(".loginButton") && userData!=null && userData.genres) {
                    fetch('/Dilab/get',{
                        headers: {
                            'Content-Type': 'application/json'
                            // 'Content-Type': 'application/x-www-form-urlencoded',
                        },
                        method: 'POST',
                        body: JSON.stringify({
                            type : "mainProjectsByGenre",
                            genreId : userData.genres
                        }) //data
                    }).then(out => {
                        return out.json();
                    }).then(data => {
                        console.log(data);
                        if (data.status!=true) {
                            Toast.fire({icon : "warning", title : "Something is not ok.. We couldn't load the most popular projects of your favorite genre"});
                        } else {
                            var projectList=data.data;
                            document.querySelectorAll(".projectsWrapper")[1].innerHTML="";
                            for (var i=0;i<projectList.length;i++) {
                                var line=projectList[i],
                                el=document.createElement("div");
                                el.classList.add("project");
                                var projectPPath=(line.projectPicture!="disc.svg") ? `https://e.diskloud.fr/Dilab/project/${line.groupName}/${line.name}` : "https://e.diskloud.fr/Dilab/project/disc.svg"
                                el.innerHTML+=newProjectElement(line.name,projectPPath,line.groupName,line.description,line.dateOfBirth,line.nCollaborators,line.projectPicture,line.audioFile);
                                el.setAttribute("onclick",`loadPage("${line.name} Dilab","project",[["p","${line.name}"],["g","${line.groupName}"]]);`)
                                document.querySelectorAll(".projectsWrapper")[1].appendChild(el);
                                progress(line.currentPhase,el);
                                if(line.audioFileDir==null) {
                                    el.querySelector(".playBtn").style.opacity=0.6;
                                    el.querySelector(".playBtn").style.cursor="not-allowed";
                                    el.querySelector(".playBtn").setAttribute("title","No audio file uploaded for this project");
                                } else {
                                    el.querySelector(".playBtn").classList.add("enabled");
                                    var audio=document.createElement("AUDIO");
                                    audio.controls=false;
                                    audio.style.display="none";
                                    audio.setAttribute("src",`/Dilab/project/${line.groupName}/${line.name}/${line.audioFileDir}`);
                                    el.querySelector(".playBtn").addEventListener("click",e=>{
                                        e.stopPropagation();
                                        var el2=document.querySelectorAll(".project");
                                        for (var i=0;i<el2.length;i++) {
                                            if (el2[i].contains(e.target)) {
                                                el2=el2[i];
                                                break;
                                            }
                                        }
                                        if (el2.querySelector(".playBtn .bi-play-circle-fill")) {
                                            var audios=document.querySelectorAll("audio");
                                            for (var i=0;i<audios.length;i++) {
                                                audios[i].pause();
                                                audios[i].parentElement.querySelector("i").classList.remove("bi-pause-circle-fill");
                                                audios[i].parentElement.querySelector("i").classList.add("bi-play-circle-fill");
                                                audios[i].currentTime = 0;
                                            }
                                            audioObj.pause();
                                            el2.querySelector(".playBtn i").classList.remove("bi-play-circle-fill");
                                            el2.querySelector(".playBtn i").classList.add("bi-pause-circle-fill");
                                            el2.querySelector("audio").play();
                                        } else {
                                            el2.querySelector(".playBtn i").classList.remove("bi-pause-circle-fill");
                                            el2.querySelector(".playBtn i").classList.add("bi-play-circle-fill");
                                            el2.querySelector("audio").pause();
                                        }
                                    })
                                    el.querySelector(".playBtn").appendChild(audio);
                                    el.querySelector(".playBtn").setAttribute("title",line.audioFileDir);
                                }
                            }
                            if (projectList.length==0) {
                                console.log("yes..");
                                document.querySelectorAll(".projectsWrapper")[1].innerHTML="<span class=\"noDataTextInfo\">Apparently, you are very original as far as your genre is concerned.. !<p>No project similar to your tastes has been published yet. Maybe you could be the first artist to publish !</p></div>";
                            }
                        }
                    });
                } else {
                    document.querySelectorAll(".projectsWrapper")[1].innerHTML="<span class=\"noDataTextInfo\">We have to know about you to show you personalized content.. !<p><a href=https://e.diskloud.fr/Dilab/login >Log in</a> to get personalized projects and upload your own content !</div>";
                }

                if (!document.querySelector(".loginButton")) {
                    document.querySelector(".newProject").addEventListener('click',e => {
                        displayPopUp("New Project","newProject",elem=>{
                            fetch('/Dilab/get', {
                                headers: {
                                    'Content-Type': 'application/json'
                                    // 'Content-Type': 'application/x-www-form-urlencoded',
                                },
                                method: 'POST',
                                body: JSON.stringify({
                                    type : "groupsWhereUserIsAdmin"
                                }) //data
                            }).then(out => {
                                return out.json();
                            }).then(data => {
                                if (data.status==false) {
                                   return;
                               }
                               data=data.data;
                               if (data.length==0) {
                                   Swal.fire({
                                       title : "Warning",
                                       html : `You can't create a project yet, because you didn't found any group. Create a group before creating a project`,
                                       icon : "warning",
                                       showCancelButton : true,
                                       cancelButtonText : "OK",
                                       confirmButtonText : "Go to new group page"
                                    }).then(
                                        result => {
                                            document.querySelector(".popUpWindowContainer").style.display="";
                                            if (result.isConfirmed) {
                                                loadPage("Groups","groups",[["action","newGroup"]]);
                                            }
                                        }
                                    );
                                   return;
                               }
                               for (var i=0;i<data.length;i++) {
                                   document.querySelector(".popUpWindow .groupSelectInput").innerHTML+=`\n<option value="${data[i].groupName}">${data[i].groupName}</option>`;
                               }
                            });
                            elem.querySelector("input[name=pName]").addEventListener("focusout",e=> {
                                document.querySelector(".nameIsTooLong").style.display="none";
                                document.querySelector(".nameIsMandatory").style.display="none";
                                document.querySelector(".isUsedNotifier").style.display="none";
                                elem.querySelector("input[name=pName]").style.outline="4px solid lightgreen";
                                elem.querySelector("input[name=pName]").style.opacity="1";
                                if (elem.querySelector("input[name=pName]").value) {
                                    if (elem.querySelector("input[name=pName]").value.length>=128) {
                                        elem.querySelector("input[name=pName]").style.outline="4px solid red";
                                        elem.querySelector("input[name=pName]").style.opacity="";
                                        document.querySelector(".nameIsTooLong").style.display="block";
                                        return;
                                    }
                                    checkIfExists("projectNameAvailable",[["projectName",elem.querySelector("input[name=pName]").value],["groupName",elem.querySelector(".groupSelectInput").value]],elem.querySelector("input[name=pName]"),elem.querySelector(".isUsedNotifier"));
                                } else {
                                    elem.querySelector("input[name=pName]").style.outline="4px solid red";
                                    document.querySelector(".nameIsMandatory").style.display="block";
                                }
                            });
                            elem.querySelector(".groupSelectInput").addEventListener("change",e=> {
                                document.querySelector(".nameIsTooLong").style.display="none";
                                document.querySelector(".nameIsMandatory").style.display="none";
                                document.querySelector(".isUsedNotifier").style.display="none";
                                elem.querySelector("input[name=pName]").style.outline="4px solid lightgreen";
                                elem.querySelector("input[name=pName]").style.opacity="1";
                                if (elem.querySelector("input[name=pName]").value) {
                                    if (elem.querySelector("input[name=pName]").value.length>=128) {
                                        elem.querySelector("input[name=pName]").style.outline="4px solid red";
                                        elem.querySelector("input[name=pName]").style.opacity="";
                                        document.querySelector(".nameIsTooLong").style.display="block";
                                        return;
                                    }
                                    checkIfExists("projectNameAvailable",[["projectName",elem.querySelector("input[name=pName]").value],["groupName",elem.querySelector(".groupSelectInput").value]],elem.querySelector("input[name=pName]"),elem.querySelector(".isUsedNotifier"));
                                } else {
                                    document.querySelector(".nameIsMandatory").style.display="block";
                                }
                            });

                            elem.querySelector("textarea[name=pDescription]").addEventListener("focusout",e=> {
                                document.querySelector(".descriptionIsTooLong").style.display="none";
                                elem.querySelector("textarea[name=pDescription]").style.outline="4px solid lightgreen";
                                elem.querySelector("textarea[name=pDescription]").style.opacity="1";
                                if (elem.querySelector("textarea[name=pDescription]").value) {
                                    if (elem.querySelector("textarea[name=pDescription]").value.length>=500) {
                                        elem.querySelector("textarea[name=pDescription]").style.outline="4px solid red";
                                        elem.querySelector("textarea[name=pDescription]").style.opacity="";
                                        document.querySelector(".descriptionIsTooLong").style.display="block";
                                    }
                                }
                            });

                            elem.querySelector("textarea[name=pLyrics]").addEventListener("focusout",()=> {
                                elem.querySelector("textarea[name=pLyrics]").style.outline="4px solid lightgreen";
                                elem.querySelector("textarea[name=pLyrics]").style.opacity="1";            
                            });

                            var audioUploadField = elem.querySelector("input[name=audioFile]");
                            audioUploadField.onchange = function() {
                                elem.querySelector(".audioRem").style.display="none";
                                if (this.files[0].size > 2097152*4){
                                    Swal.fire("Error","File is too big (8MB max) !","error");
                                    this.value = "";
                                }  else if (this.files[0].name.replace(fileRegexp,'')!=this.files[0].name) {
                                    Swal.fire("Error","File name can only contain latin letters (without accents), numbers, .,- and _","error");
                                    audioFileInput.value = "";
                                    return;
                                } else if (this.files[0].name.replace(fileRegexp,'')!=this.files[0].name) {
                                    res.end('{ "return" : "error","status" : false,"data" : "File name can only contain latin letters (without accents), numbers, .,- and _" }');
                                } else {
                                    // from an input element
                                    var filesToUpload = this.files;
                                    var file = filesToUpload[0];

                                    elem.querySelector(".audioFileName").innerHTML=file.name;
                                    isPPChanged=true;
                                    elem.querySelector(".audioRem").style.display="block";
                                    elem.querySelector(".audioRem").addEventListener("click",e=> {
                                        e.stopPropagation();
                                        audioUploadField.value='';
                                        elem.querySelector(".audioFileName").innerHTML="No Audio File Uploaded yet";
                                        elem.querySelector(".audioRem").style.display="none";
                                    });
                                }
                            };

                            elem.querySelector(".audioFile").addEventListener("click",e=> {
                                audioUploadField.click();
                            });

                            var projectUploadField = elem.querySelector("input[name=projectFile]");
                            projectUploadField.onchange = function() {
                                elem.querySelector(".projectRem").style.display="none";
                                if (this.files[0].size > 2097152*4){
                                    Swal.fire("Error","File is too big (8MB max) !","error");
                                    this.value = "";
                                } else if (this.files[0].name.replace(fileRegexp,'')!=this.files[0].name) {
                                    Swal.fire("Error","File name can only contain latin letters (without accents), numbers, .,- and _","error");
                                    audioFileInput.value = "";
                                    return;
                                } else {
                                    // from an input element
                                    var filesToUpload = this.files;
                                    var file = filesToUpload[0];

                                    elem.querySelector(".projectFileName").innerHTML=file.name;
                                    isPPChanged=true;
                                    elem.querySelector(".projectRem").style.display="block";
                                    elem.querySelector(".projectRem").addEventListener("click",e=> {
                                        e.stopPropagation();
                                        projectUploadField.value='';
                                        elem.querySelector(".projectFileName").innerHTML="No Project File Uploaded yet";
                                        elem.querySelector(".projectRem").style.display="none";
                                    });
                                }
                            };

                            elem.querySelector(".projectFile").addEventListener("click",e=> {
                                projectUploadField.click();
                            });


                            var ppUploadField = elem.querySelector(".profilePictureInput");
                            ppUploadField.onchange = function() {
                                elem.querySelector(".pictureRemButton").style.display="none";
                                if (this.files[0].size > 2097152*2){
                                    Swal.fire("Error","File is too big!","error");
                                    this.value = "";
                                } else if (this.files[0].type.slice(0,this.files[0].type.indexOf('/'))!="image") {
                                    Swal.fire("Error","Invalid file type<br />Must be a picture","error");
                                } else {
                                    // from an input element
                                    var filesToUpload = this.files;
                                    var file = filesToUpload[0];

                                    elem.querySelector(".profilePictureEmbedd").src=URL.createObjectURL(file);
                                    isPPChanged=true;
                                    elem.querySelector(".pictureRemButton").style.display="block";
                                    elem.querySelector(".pictureRemButton").addEventListener("click",e=> {
                                        unloadImage(0);
                                    });
                                }
                            };
                            elem.querySelector(".profilePicture").addEventListener("click",e=> {
                                ppUploadField.click();
                            });

                            elem.querySelector(".confirm").addEventListener("click",e=> {
                                elem.querySelector(".confirm").textContent="Please wait..";
                                elem.querySelector(".confirm").style.opacity=0.6;
                                elem.querySelector(".confirm").style.pointerEvents="none";
                                elem.querySelector(".confirm").disabled=true;
                                if (!elem.querySelector("input[name=pName]").value) {
                                    Swal.fire("Not so fast..","You must specify a project name !","error");
                                    elem.querySelector(".confirm").textContent="Create project";
                                    elem.querySelector(".confirm").disabled=false;
                                    elem.querySelector(".confirm").style.opacity="";
                                    elem.querySelector(".confirm").style.pointerEvents="";
                                    return;
                                } if (!(elem.querySelector("input[name=pName]").value.length>0 && elem.querySelector("input[name=pName]").value.length<128)) {
                                    Swal.fire("Not so fast..","You must specify a valid project name !","error");
                                    elem.querySelector(".confirm").textContent="Create project";
                                    elem.querySelector(".confirm").disabled=false;
                                    elem.querySelector(".confirm").style.opacity="";
                                    elem.querySelector(".confirm").style.pointerEvents="";
                                    return;
                                } if (elem.querySelector("input[name=pName]").value.indexOf('/')>-1) {
                                    Swal.fire("Not so fast..","Project name cannot contain the '/' character.","error");
                                    elem.querySelector(".confirm").textContent="Create project";
                                    elem.querySelector(".confirm").disabled=false;
                                    elem.querySelector(".confirm").style.opacity="";
                                    elem.querySelector(".confirm").style.pointerEvents="";
                                    return;
                                }
                                data={
                                    "type" : "projectNameAvailable",
                                    "projectName" : elem.querySelector("input[name=pName]").value,
                                    "groupName" : elem.querySelector(".groupSelectInput").value
                                }
                                fetch("https://e.diskloud.fr/dilab/check", {
                                    method: 'POST', // *GET, POST, PUT, DELETE, etc.
                                    mode: 'cors', // no-cors, *cors, same-origin
                                    headers: {
                                      'Content-Type': 'application/json'
                                      // 'Content-Type': 'application/x-www-form-urlencoded',
                                    },
                                    redirect: 'follow', // manual, *follow, error
                                    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
                                    body: JSON.stringify(data) // body data type must match "Content-Type" header
                                  }).then( response => {
                                      return response.json()
                                    }).then(json => {
                                        if (json.status) { // Valid credentials case
                                            if(json.data) {
                                                Swal.fire("Not so fast..",`You can't use that project name, it's already used for another project in this group (${elem.querySelector(".groupSelectInput").value}) !`,"error");
                                                elem.querySelector(".confirm").textContent="Create project";
                                                elem.querySelector(".confirm").disabled=false;
                                                elem.querySelector(".confirm").style.opacity="";
                                                elem.querySelector(".confirm").style.pointerEvents="";
                                                return true;
                                            } else {
                                                if (elem.querySelector("textarea[name=pDescription]").value.length>=500) {
                                                    Swal.fire("Not so fast..",`Wow, don't spoil us the whole story about the project, it's too long !`,"error");
                                                    elem.querySelector(".confirm").textContent="Create project";
                                                    elem.querySelector(".confirm").disabled=false;
                                                    elem.querySelector(".confirm").style.opacity="";
                                                    elem.querySelector(".confirm").style.pointerEvents="";
                                                    return;
                                                }
                                                // Here we create a FormData object containing the user's input and send it to the server
                                                var data=new FormData();
                                                data.append("projectName", elem.querySelector("input[name=pName]").value);
                                                data.append("projectDescription", elem.querySelector("textarea[name=pDescription]").value);
                                                data.append("projectLyrics",elem.querySelector("textarea[name=pLyrics]").value);
                                                data.append("groupName", elem.querySelector(".groupSelectInput").value);
                                                data.append("projectPhase", elem.querySelector("select[name=pPhase]").value);
                                                if (audioUploadField.value=='') {
                                                    data.append("audioFile", false);
                                                } else {
                                                    data.append("audioFile", true);
                                                    data.append("files",audioUploadField.files[0], audioUploadField.files[0].name);
                                                }
                                                if (projectUploadField.value=='') {
                                                    data.append("projectFile", false);
                                                } else {
                                                    data.append("projectFile", true);
                                                    data.append("files",projectUploadField.files[0], projectUploadField.files[0].name);
                                                }
                                                if (ppUploadField.value=='') {
                                                    data.append("projectPPFile", false);
                                                } else {
                                                    data.append("projectPPFile", true);
                                                    data.append("files",ppUploadField.files[0], ppUploadField.files[0].name);
                                                }
                                                console.log(FormData);
                                                fetch('/Dilab/add', {
                                                    headers: {
                                                        //'Content-Type': 'application/x-www-form-urlencoded'
                                                        //'Content-Type': 'multipart/form-data',
                                                    },
                                                    method: 'POST',
                                                    body: data
                                                }).then(out => {
                                                    return out.json();
                                                }).then(log => {
                                                    elem.querySelector(".confirm").textContent="Create project";
                                                    elem.querySelector(".confirm").disabled=false;
                                                    elem.querySelector(".confirm").style.opacity="";
                                                    elem.querySelector(".confirm").style.pointerEvents="";
                                                    console.log(log);
                                                    if (log.status==true) {
                                                        Swal.fire("Success !",log.data,"success");
                                                        document.querySelector(".popUpWindowContainer").style.display="";
                                                    } else {
                                                        Swal.fire("Error",log.data,"error");
                                                    }
                                                });
                                            }
                                        }
                                        else {
                                            Swal.fire("Bad news..",`The server couldn't handle your request, try again or try later.`,"error");
                                            return true;
                                        }
                                    });
                            })
                        });
                    });
                    query=urlParams.get("action");
                    if (query=="newProject") {
                        document.querySelector(".newProject").click();
                    }
                } else {
                    document.querySelector(".newProject").addEventListener('click',e => {
                        Swal.fire({
                            title : "Note",
                            text: "You must be logged in to do that",
                            icon : "info",
                            showCancelButton: true,
                            //confirmButtonColor: '#3085d6',
                            //cancelButtonColor: '#d33',
                            confirmButtonText: 'Let me log in!'
                        }).then((result) => {
                            if (result.isConfirmed) {
                              goToPage("https://e.diskloud.fr/Dilab/login");
                            }
                        })
                    });
                }
            });
            break;
        case "/groups" :
            loadTemplate("groups",()=>{
                document.querySelectorAll(".opt")[2].style.fontWeight="bold";
                document.querySelectorAll(".opt")[2].style.color="white";
                document.querySelectorAll(".groupsContainer .leftBtn")[0].addEventListener("click", () => {
                    document.querySelectorAll(".groupsContainer > .groups")[0].scrollBy(-window.innerWidth+200, 0);
                });
                document.querySelectorAll(".groupsContainer .rightBtn")[0].addEventListener("click", () => {
                    document.querySelectorAll(".groupsContainer > .groups")[0].scrollBy(window.innerWidth-200, 0);
                });
                document.querySelectorAll(".groupsContainer .leftBtn")[1].addEventListener("click", () => {
                    document.querySelectorAll(".groupsContainer > .groups")[1].scrollBy(-window.innerWidth+200, 0);
                });
                document.querySelectorAll(".groupsContainer .rightBtn")[1].addEventListener("click", () => {
                    document.querySelectorAll(".groupsContainer > .groups")[1].scrollBy(window.innerWidth-200, 0);
                });

                if (!document.querySelector(".loginButton") && userData!=null && userData.genres) {
                    fetch('/Dilab/get', {
                        headers: {
                            'Content-Type': 'application/json'
                            // 'Content-Type': 'application/x-www-form-urlencoded',
                        },
                        method: 'POST',
                        body: JSON.stringify({
                            type : "mainGroupsByGenre",
                            genreId : userData.genres
                        }) //data
                    }).then(out => {
                        return out.json();
                    }).then(data => {
                       if (data.status==false) {
                           return;
                       }
                       data=data.data;
                       console.log(data);
                       document.querySelectorAll(".groupsWrapper")[1].innerHTML="";
                       for (var i=0;i<data.length;i++) {
                           document.querySelectorAll(".groupsWrapper")[1].innerHTML+=newGroupElement(data[i].groupName,data[i].genres,data[i].description,new Date(data[i].dateOfBirth),data[i].nCollaborators,data[i].nReleases,data[i].nProjects,data[i].groupPicture);
                        }
                        if (data.length==0) {
                            document.querySelectorAll(".groupsWrapper")[1].innerHTML="<span class=\"noDataTextInfo\">Apparently, you are very original as far as your genre is concerned.. !<p>No project similar to your tastes has been published yet. Maybe you could be the first artist to publish !</p></div>";
                        }
                    });
                } else {
                    document.querySelectorAll(".groupsWrapper")[1].innerHTML="<span class=\"noDataTextInfo\">We have to know about you to show you personalized content.. !<p><a href=https://e.diskloud.fr/Dilab/login >Log in</a> to get personalized groups and upload your own content !</div>";
                }

                fetch('/Dilab/get', {
                    headers: {
                        'Content-Type': 'application/json'
                        // 'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    method: 'POST',
                    body: JSON.stringify({
                        type : "mainGroups"
                    }) //data
                }).then(out => {
                    return out.json();
                }).then(data => {
                   if (data.status==false) {
                       return;
                   }
                   data=data.data;
                   document.querySelector(".groupsWrapper").innerHTML="";
                   for (var i=0;i<data.length;i++) {
                       document.querySelector(".groupsWrapper").innerHTML+=newGroupElement(data[i].groupName,data[i].genres,data[i].description,new Date(data[i].dateOfBirth),data[i].nCollaborators,data[i].nReleases,data[i].nProjects,data[i].groupPicture);
                    }
                });

                if (!document.querySelector(".loginButton")) {
                    document.querySelector(".newGroup").addEventListener('click',e => {
                        displayPopUp("New Group","newGroup",elem=> {
                            
                            elem.querySelector("input[name=grpName]").addEventListener("focusout",e=> {
                                document.querySelector(".isUsedNotifier").style.display="none";
                                document.querySelector(".nameIsMandatory").style.display="none";
                                elem.querySelector("input[name=grpName]").style.outline="4px solid lightgreen";
                                elem.querySelector("input[name=grpName]").style.opacity="1";
                                if (elem.querySelector("input[name=grpName]").value) {
                                    if (elem.querySelector("input[name=grpName]").value.length>=128) {
                                        elem.querySelector("input[name=grpName]").style.outline="4px solid red";
                                        elem.querySelector("input[name=grpName]").style.opacity="";
                                        document.querySelector(".nameIsTooLong").style.display="block";
                                        return;
                                    }
                                    checkIfExists("groupNameAvailable",[["groupName",elem.querySelector("input[name=grpName]").value]],elem.querySelector("input[name=grpName]"),elem.querySelector(".isUsedNotifier"));
                                } else {
                                    elem.querySelector("input[name=grpName]").style.outline="4px solid red";
                                    document.querySelector(".nameIsMandatory").style.display="block";
                                }
                            });

                            var uploadField = elem.querySelector(".profilePictureInput");

                            uploadField.onchange = function() {
                                elem.querySelector(".pictureRemButton").style.display="none";
                                if (this.files[0].size > 2097152*2){
                                    Swal.fire("Error","File is too big!","error");
                                    this.value = "";
                                } else if (this.files[0].type.slice(0,this.files[0].type.indexOf('/'))!="image") {
                                    Swal.fire("Error","Invalid file type<br />Must be a picture","error");
                                } else {
                                    // from an input element
                                    var filesToUpload = this.files;
                                    var file = filesToUpload[0];

                                    elem.querySelector(".profilePictureEmbedd").src=URL.createObjectURL(file)
                                    isPPChanged=true;
                                    elem.querySelector(".pictureRemButton").style.display="block";
                                    elem.querySelector(".pictureRemButton").addEventListener("click",e=> {
                                        unloadImage(0);
                                    })
                                }
                            };

                            document.querySelector("input[name=grpOrientation]").addEventListener("keyup",e=> {
                                if (document.querySelector("input[name=grpOrientation]").value.length>0) {
                                    document.querySelector("input[name=grpOrientation]").parentElement.querySelector(".searchRecommendations").style.display="block";
                                    fetch('/Dilab/get', {
                                        headers: {
                                            'Content-Type': 'application/json'
                                            // 'Content-Type': 'application/x-www-form-urlencoded',
                                        },
                                        method: 'POST',
                                        body: JSON.stringify({
                                            type : "genre",
                                            genrePattern : document.querySelector("input[name=grpOrientation]").value
                                        }) //data
                                    }).then(out => {
                                        return out.json();
                                    }).then(data => {
                                        if (data.status==false) {
                                            return;
                                        } else {
                                            document.querySelector("input[name=grpOrientation]").parentElement.querySelector(".searchRecommendations").innerHTML="";
                                            var res=data.data;
                                            for (var i=0;i<res.length;i++) {
                                                res[i].genreName = (res[i].genreName[res[i].genreName.length-1]==' ' ? res[i].genreName.slice(0,-1) : res[i].genreName)
                                                document.querySelector("input[name=grpOrientation]").parentElement.querySelector(".searchRecommendations").innerHTML+=`<div datavalue=${res[i].id} class="choice">${res[i].genreName}</div>`
                                            } for (var i=0;i<res.length;i++) {
                                                document.querySelector("input[name=grpOrientation]").parentElement.querySelectorAll(".searchRecommendations .choice")[i].addEventListener("click",e=> {
                                                    document.querySelector(".savedGenre").innerHTML=e.target.innerHTML;
                                                    document.querySelector(".savedGenre").setAttribute("datavalue",e.target.getAttribute("datavalue"));
                                                    document.querySelector(".searchRecommendations").style.display="none";
                                                    document.querySelector("input[name=grpOrientation]").value=e.target.innerHTML;
                                                });
                                            } if (res.length==0) {
                                                document.querySelector("input[name=grpOrientation]").parentElement.querySelector(".searchRecommendations").innerHTML="No results found";
                                            }
                                       }
                                    });
                                } else {
                                    document.querySelector("input[name=grpOrientation]").parentElement.querySelector(".searchRecommendations").style.display="none";
                                }
                            });

                            document.querySelector("input[name=grpOrientation]").addEventListener("focus",()=>{
                                document.querySelector("input[name=grpOrientation]").parentElement.querySelector(".searchRecommendations").style.display="block";
                            });

                            document.querySelector("input[name=grpOrientation]").addEventListener("focusout",(e)=>{
                                console.log(!document.querySelector(".inputSearchRecommendationContainer").contains(e.target) && document.querySelector(".inputSearchRecommendationContainer").contains(document.querySelector("input[name=grpOrientation]")));
                                console.log(!document.querySelector(".inputSearchRecommendationContainer").contains(e.target))
                                if (!document.querySelector(".inputSearchRecommendationContainer").contains(e.target) && document.querySelector(".inputSearchRecommendationContainer").contains(document.querySelector("input[name=grpOrientation]"))) {
                                    document.querySelector("input[name=grpOrientation]").parentElement.querySelector(".searchRecommendations").style.display="none";
                                }
                            });

                            elem.querySelector("textarea[name=grpDescription]").addEventListener("focusout",e=> {
                                document.querySelector(".descriptionIsTooLong").style.display="none";
                                elem.querySelector("textarea[name=grpDescription]").style.outline="4px solid lightgreen";
                                elem.querySelector("textarea[name=grpDescription]").style.opacity="1";
                                if (elem.querySelector("textarea[name=grpDescription]").value) {
                                    if (elem.querySelector("textarea[name=grpDescription]").value.length>=500) {
                                        elem.querySelector("textarea[name=grpDescription]").style.outline="4px solid red";
                                        elem.querySelector("textarea[name=grpDescription]").style.opacity="";
                                        document.querySelector(".descriptionIsTooLong").style.display="block";
                                    }
                                }
                            });

                            elem.querySelector(".profilePicture").addEventListener("click",e=> {
                                uploadField.click();
                            });

                            document.querySelector(".createGroupBtn").addEventListener('click',()=> {
                                document.querySelector(".createGroupBtn").disabled=true;
                                document.querySelector(".createGroupBtn").style.pointerEvents="none";
                                document.querySelector(".createGroupBtn").innerHTML="Please wait..";
                                document.querySelector(".createGroupBtn").style.opacity=0.6;
                                var data=new FormData();
                                data.append("groupName",document.querySelector(".fieldStyle input[name=grpName]").value);
                                data.append("groupOrientation",document.querySelector(".savedGenre").getAttribute("datavalue")=="" ? "NULL" : document.querySelector(".savedGenre").getAttribute("datavalue"));
                                data.append("groupDescription",document.querySelector("textarea[name=grpDescription]").value);
                                if (!uploadField.files.length>0) {
                                    data.append("files", 1);
                                } else {
                                    data.append("files",uploadField.files[0], uploadField.files[0].name);
                                }
                                fetch('/Dilab/add', {
                                    headers: {
                                        //'Content-Type': 'application/x-www-form-urlencoded'
                                        //'Content-Type': 'multipart/form-data',
                                    },
                                    method: 'POST',
                                    body: data
                                }).then(out => {
                                    return out.json();
                                }).then(log => {
                                    console.log(log);
                                    if (log.status==true) {
                                        Swal.fire("Group Created !",log.data,"success");
                                    } else {
                                        Swal.fire("Error",log.data,"error");
                                    }
                                    document.querySelector(".createGroupBtn").disabled=false;
                                    document.querySelector(".createGroupBtn").style.opacity=1;
                                    document.querySelector(".createGroupBtn").innerHTML="Create group";
                                    document.querySelector(".createGroupBtn").style.pointerEvents="";
                                });
                            });
                        });
                    });
                    query=urlParams.get("action");
                    if (query=="newGroup") {
                        document.querySelector(".newGroup").click();
                    }
                } else {
                    document.querySelector(".newGroup").addEventListener('click',e => {
                        Swal.fire({
                            title : "Note",
                            text: "You must be logged in to do that",
                            icon : "info",
                            showCancelButton: true,
                            //confirmButtonColor: '#3085d6',
                            //cancelButtonColor: '#d33',
                            confirmButtonText: 'Let me log in!'
                        }).then((result) => {
                            if (result.isConfirmed) {
                              goToPage("https://e.diskloud.fr/Dilab/login");
                            }
                        })
                    });
                }
            });
            break;
        case "/searchpage" :
            loadTemplate("searchpage",()=>{
                document.querySelectorAll(".opt")[3].style.color="white";
                searchField2 = document.querySelector(".searchField input"); // For mobile interface
                if (searchField2?.value)
                    searchField2.value=query;
                searchField2?.addEventListener("keypress",function(e) {
                    if (e.key=="Enter") {
                        searchLoad();
                    }
                });
            });
            break;
        case "/search" :
            query=urlParams.get("q")
            if (query!=null && query!="") {
                loadTemplate("search",()=>{
                    searchField2 = document.querySelector(".searchField input"); // For mobile interface
                    searchField.value=query;
                    if (searchField2!=null)
                        searchField2.value=query;
                    searchField2?.addEventListener("keypress",function(e) {
                        if (e.key=="Enter") {
                            searchLoad();
                        }
                    });
                    document.querySelectorAll(".main-content-header")[1].innerHTML+=' "'+query.replace(/ /g,"&nbsp;")+'"';
                    window.onresize= (e)=> {
                        var elements = document.querySelectorAll(".search-results .release .streams");
                        if (document.querySelector(".search-results .release") && document.querySelector(".search-results .release").offsetWidth < 600) {
                            for (var i=0; i<elements.length ; i++) {
                                elements[i].style.display="none";
                            }
                        }
                        else {
                            for (var i=0; i<elements.length ; i++) {
                                elements[i].style.display="block";
                            }
                        }
                    }
                    fetch("https://e.diskloud.fr/Dilab/get",{
                        headers: {
                            'Content-Type': 'application/json'
                            // 'Content-Type': 'application/x-www-form-urlencoded',
                            },
                            method: 'POST',
                            body: JSON.stringify({
                                type : "search",
                                searchPattern : query
                            }) //data
                        }).then(out => {
                            return out.json();
                        }).then(data => {
                            if (data.status==false) {
                                Swal.fire("Error","There was a problem with our servers. Please try again later.","error");
                                return;
                            } else {
                                data= JSON.parse(data.data);
                                // Release results
                                document.querySelector(".releases").innerHTML="";
                                /*for (var i=0;i<data[0].length;i++) {
                                    document.querySelector(".releases").innerHTML+=newReleaseElement(data[0][i].name,data[0][i].groupName,new Date(data[0][i].releaseDate).getFullYear(),data[0][i].nb_streams+" streams",data[0][i].duration,data[0][i].releasePicture,data[0][i].id);
                                }*/
                                let authorsGroup=[], urlsGroup=[],picturePathGroup=[],titlesGroup=[], lyricsGroup=[];
                                for (var i=0;i<data[0].length;i++) {
                                    authorsGroup.push(data[0][i].groupName);
                                    titlesGroup.push(data[0][i].name);
                                    urlsGroup.push(`https://e.diskloud.fr/Dilab/project/${authorsGroup[i]}/${titlesGroup[i]}/`+data[0][i].audioFileDir);
                                    picturePathGroup.push(data[0][i].releasePicture);
                                    lyricsGroup.push(data[0][i].lyrics);
                                    var duree=timestampToNormalTime(data[0][i].duration);
                                    document.querySelector(".releases").innerHTML+=newReleaseElement(data[0][i].name,data[0][i].groupName,new Date(data[0][i].releaseDate).getFullYear(),data[0][i].nb_streams+" streams",duree,data[0][i].releasePicture,data[0][i].id,i);
                                }
                                for (var i=0;i<data[0].length;i++) {
                                    document.querySelector(`.release[dataPlaylistId="${i}"]`).addEventListener("click",e=>{
                                        let data=JSON.parse(e.target.closest(".releases").getAttribute("playlistData"));
                                        let k=e.target.closest(".release").getAttribute("dataPlaylistId");
                                        playlistIndex=k;
                                        soundTitles=data.titles;
                                        soundAuthors=data.authors;
                                        soundUrls=data.urls;
                                        lyrics=data.lyrics;
                                        soundPictures=data.picturePath;
                                        updatePlayerData();
                                        let songId=e.target.closest(".release").querySelector(".control").getAttribute("soundId");
                                        playSound(k,false,songId);
                                        audioObj.play();
                                    });
                                }
                                updatePlayPauseIcons();
                                document.querySelector(".releases").setAttribute("playlistData",JSON.stringify({
                                        titles : titlesGroup,
                                        authors : authorsGroup,
                                        urls : urlsGroup,
                                        lyrics : lyricsGroup,
                                        picturePath : picturePathGroup
                                }));
                                if (data[0].length==0) {
                                    document.querySelector(".releases").innerHTML="<span class=\"noDataTextInfo\">No Releases found :(<p></div>";
                                }
                                // Project results
                                document.querySelector(".projectsWrapper").innerHTML="";
                                for (var i=0;i<data[1].length;i++) {
                                    console.log(data[1][i].projectPicture);
                                    var line=data[1][i],
                                    el=document.createElement("div");
                                    el.classList.add("project");
                                    var projectPPath=(line.projectPicture!="disc.svg") ? `https://e.diskloud.fr/Dilab/project/${line.groupName}/${line.name}` : "https://e.diskloud.fr/Dilab/project/disc.svg"
                                    el.innerHTML+=newProjectElement(line.name,projectPPath,line.groupName,line.description,line.dateOfBirth,line.nCollaborators,line.projectPicture,line.audioFile);
                                    el.setAttribute("onclick",`loadPage("${line.name} Dilab","project",[["p","${line.name}"],["g","${line.groupName}"]]);`)
                                    document.querySelector(".projectsWrapper").appendChild(el);
                                    progress(line.currentPhase,el);
                                    if(line.audioFileDir==null) {
                                        el.querySelector(".playBtn").style.opacity=0.6;
                                        el.querySelector(".playBtn").style.cursor="not-allowed";
                                        el.querySelector(".playBtn").setAttribute("title","No audio file uploaded for this project");
                                    } else {
                                        el.querySelector(".playBtn").classList.add("enabled");
                                        var audio=document.createElement("AUDIO");
                                        audio.controls=false;
                                        audio.style.display="none";
                                        audio.setAttribute("src",`/Dilab/project/${line.groupName}/${line.name}/${line.audioFileDir}`);
                                        // Player setup with the event listeners
                                        el.querySelector(".playBtn").addEventListener("click",e=>{
                                            e.stopPropagation();
                                            var el2=document.querySelectorAll(".project");
                                            for (var i=0;i<el2.length;i++) {
                                                if (el2[i].contains(e.target)) {
                                                    el2=el2[i];
                                                    break;
                                                }
                                            }
                                            if (el2.querySelector(".playBtn .bi-play-circle-fill")) {
                                                var audios=document.querySelectorAll("audio");
                                                for (var i=0;i<audios.length;i++) {
                                                    audios[i].pause();
                                                    audios[i].parentElement.querySelector("i").classList.remove("bi-pause-circle-fill");
                                                    audios[i].parentElement.querySelector("i").classList.add("bi-play-circle-fill");
                                                    audios[i].currentTime = 0;
                                                }
                                                audioObj.pause();
                                                el2.querySelector(".playBtn i").classList.remove("bi-play-circle-fill");
                                                el2.querySelector(".playBtn i").classList.add("bi-pause-circle-fill");
                                                el2.querySelector("audio").play();
                                            } else {
                                                el2.querySelector(".playBtn i").classList.remove("bi-pause-circle-fill");
                                                el2.querySelector(".playBtn i").classList.add("bi-play-circle-fill");
                                                el2.querySelector("audio").pause();
                                            }
                                        })
                                        el.querySelector(".playBtn").appendChild(audio);
                                        el.querySelector(".playBtn").setAttribute("title",line.audioFileDir);
                                    }
                                }
                                if (data[1].length==0) {
                                    document.querySelector(".projectsWrapper").innerHTML="<span class=\"noDataTextInfo\">No projects found :(<p></div>";
                                }                
                                // Group results
                                document.querySelector(".groupsWrapper").innerHTML="";
                                for (var i=0;i<data[2].length;i++) {
                                    document.querySelector(".groupsWrapper").innerHTML+=newGroupElement(data[2][i].groupName,data[2][i].genres,data[2][i].description,new Date(data[2][i].dateOfBirth),data[2][i].nCollaborators,data[2][i].nReleases,data[2][i].nProjects,data[2][i].groupPicture);
                                }
                                if (data[2].length==0) {
                                    document.querySelector(".groupsWrapper").innerHTML="<span class=\"noDataTextInfo\">No groups found :(<p></div>";
                                }
                                // Artist results
                                document.querySelector(".artistsWrapper").innerHTML="";
                                for (var i=0;i<data[3].length;i++) {
                                    document.querySelector(".artistsWrapper").innerHTML+=newArtistElement(`${data[3][i].nom} ${data[3][i].prenom}`,data[3][i].pseudo,data[3][i].genre,data[3][i].biographie,new Date(data[3][i].dateCreation),data[3][i].profilePictureName);
                                }
                                if (data[3].length==0) {
                                    document.querySelector(".artistsWrapper").innerHTML="<span class=\"noDataTextInfo\">No artists found :(<p></div>";
                                }
                            }
                        }
                    );
                    document.querySelector(".search-results .projectsContainer .leftBtn").addEventListener("click", () => {
                        document.querySelector(".search-results > .projectsContainer > .projects").scrollBy(-window.innerWidth+200, 0);
                    });
                    document.querySelector(".search-results .projectsContainer .rightBtn").addEventListener("click", () => {
                        document.querySelector(".search-results > .projectsContainer > .projects").scrollBy(window.innerWidth-200, 0);
                    });
                    document.querySelector(".search-results .groupsContainer .leftBtn").addEventListener("click", () => {
                        document.querySelector(".search-results > .groupsContainer > .groups").scrollBy(-window.innerWidth+200, 0);
                    });
                    document.querySelector(".search-results .groupsContainer .rightBtn").addEventListener("click", () => {
                        document.querySelector(".search-results > .groupsContainer > .groups").scrollBy(window.innerWidth-200, 0);
                    });
                    document.querySelector(".search-results .artistsContainer .leftBtn").addEventListener("click", () => {
                        document.querySelector(".search-results > .artistsContainer > .artists").scrollBy(-window.innerWidth/3, 0);
                    });
                    document.querySelector(".search-results .artistsContainer .rightBtn").addEventListener("click", () => {
                        document.querySelector(".search-results > .artistsContainer > .artists").scrollBy(window.innerWidth/3, 0);
                    });
                });
                break;
            } else {
                window.location.href="https://e.diskloud.fr/Dilab"; // Default case
                location="https://e.diskloud.fr/Dilab";
        } case "/settings" :
            if (userData!=null) {
                loadTemplate("settings",()=>{
                    reloadUserData();
                    document.querySelector(".profilePicture img").src = "/dilab/user/"+userData.profilePicturePath;
                    document.querySelector(".usernameInput").value=userData.pseudo;
                    document.querySelector(".nameInput").value=userData.prenom;
                    document.querySelector(".surnameInput").value=userData.nom;
                    document.querySelector(".biographyInput").value=userData.biographie;
                    document.querySelector(".settingsPage .svgContainer").addEventListener("click",() => {
                        document.querySelector(".settingsPage .profilePictureInput").click();
                    });
                    document.querySelector(".changePswdBtn").addEventListener("click",function() {
                        changePassword();
                    })
                    document.querySelector(".profilePictureInput").onchange=function() {
                        document.querySelector(".pictureRemButton").style.display="none";
                        if (this.files[0].size > 2097152*2){
                           Swal.fire("Error","File is too big!","error");
                           this.value = "";
                        } else if (this.files[0].type.slice(0,this.files[0].type.indexOf('/'))!="image") {
                            Swal.fire("Error","Invalid file type<br />Must be a picture","error");
                        } else {
                            // from an input element
                            var filesToUpload = this.files;
                            var file = filesToUpload[0];
                    
                            document.querySelector(".profilePicture > img").src=URL.createObjectURL(file)
                            document.querySelector(".pictureRemButton").style.display="block";
                        }
                    };
                    document.querySelector(".inputConfirm").addEventListener('click',async ()=> {
                        var output="";
                        if (document.querySelector(".profilePictureInput").files.length>0)
                            output+= updateProfilePicture();
                        if (document.querySelector(".usernameInput").value!=userData.pseudo)
                            output+= updateUsername();
                        if (document.querySelector(".biographyInput").value!=userData.biographie)
                            output+=updateBio();
                        if (document.querySelector(".nameInput").value!=userData.prenom)
                            output+= updateName(true);
                        if (document.querySelector(".surnameInput").value!=userData.nom)
                            output+= updateName(false);
                        reloadUserData();
                        var timestamp=new Date().getTime();
                        document.querySelector(".profilePicture > img").src="/dilab/user/"+userData.profilePicturePath+"?t=" + String(timestamp+5000);
                        Swal.fire("Account update",(output=="") ? "No changes were made" : "Updated content <br />(tried at least)","info");
                    })
                });
                break;
        } default :
        loadTemplate("error404",()=>{
            document.querySelector(".bg-wrap svg").setAttribute("viewBox",`0 0 ${window.innerWidth} ${window.innerHeight}`)
        });
    }
}

function unloadImage(i=0) {
    document.querySelectorAll("input[type=file]")[i].value='';
    document.querySelectorAll(".pictureRemButton")[i].style.display="none";
    document.querySelectorAll(".profilePictureEmbedd")[i].src="https://icons.getbootstrap.com/assets/icons/person-circle.svg";
}

function changePassword() {
    Swal.fire({
        title : "Step 1",
        text: 'Enter your current password',
        input: 'password',
        icon : "info",
        inputAttributes: {
            placeholder: "Password",
            autocapitalize: 'off'
        },
        preConfirm : result=>{
            var previousPassword=result;
            return fetch(`/dilab/check`, {
                method: 'POST', // *GET, POST, PUT, DELETE, etc.
                mode: 'cors', // no-cors, *cors, same-origin
                headers: {
                  'Content-Type': 'application/json'
                  // 'Content-Type': 'application/x-www-form-urlencoded',
                },
                redirect: 'follow', // manual, *follow, error
                referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
                body: JSON.stringify({
                    type : "password",
                    value : result
                }) // body data type must match "Content-Type" header
              }).then(response => {
                if (!response.ok) {
                    throw new Error(response.statusText)
                }
                return response.json()
                })
                .catch(error => {
                Swal.showValidationMessage(
                    `Request failed: ${error}`
                )
            }).then((result) => {
                if (!result) {
                    return;
                } if (result.status) {
                    Swal.fire({
                        icon :"info",
                        title: `Enter new password`,
                        input: "password",
                        inputValidator : function(value) {
                            if(value === '') { 
                              return 'You need to write something!'
                            } else {
                              var nformat = /\\0\\1|\\2|\\3|\\4|\\5|\\6|\\7|\\8|\\9|/g,
                              cformat = /\\*|\\$|\\\)|\\+|\\=|\\[|\\{|\\]|\\}|\\||\\\|\\'|\\<|\\,|\\.|\\>|\\?|/g;
                              if(!nformat.test(value) || !cformat.test(value) || value.length<8 || value==value.toLowerCase() || value.toUpperCase()==value){   
                                return 'Password requires at least une upper cased character, one lower cased character, one number and one special character (*,$,),=,[,],{,},|,\\,\',<,,,.,> or ?)'
                              } 
                            }
                        },    
                        showCancelButton: true,
                        preConfirm : (value) => {
                            return fetch(`/dilab/set`, {
                                method: 'POST', // *GET, POST, PUT, DELETE, etc.
                                mode: 'cors', // no-cors, *cors, same-origin
                                headers: {
                                  'Content-Type': 'application/json'
                                  // 'Content-Type': 'application/x-www-form-urlencoded',
                                },
                                redirect: 'follow', // manual, *follow, error
                                referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
                                body: JSON.stringify({
                                    type : "passwordViaPreviousPassword",
                                    prevPassword : previousPassword,
                                    newPassword : value
                                }) // body data type must match "Content-Type" header
                              }).then(response => {
                                if (!response.ok) {
                                    throw new Error(response.statusText)
                                }
                                return response.json()
                                })
                                .catch(error => {
                                Swal.showValidationMessage(
                                    `Request failed: ${error}`
                                )
                            }).then(output => {
                                if (output.status) {
                                    Swal.fire({
                                        title : "Success",
                                        text : "Password updated",
                                        icon : "success"
                                    })
                                } else {
                                    Swal.fire({
                                        title : "Mmhm",
                                        text : "There was an error when updating your password.."
                                    })
                                }
                            })
                        }
                    }).then(res=> {
                        if (result.isDismissed) {
                            return false;
                        }
                    })
                } else {
                    Swal.fire({
                        title : "Error",
                        text : "Invalid Password",
                        icon : "error",
                        showConfirmButton : true,
                        showCancelButton : true
                    }).then(output=> {
                        if (output.isConfirmed) {
                            changePassword();
                        }
                    });
                }
            })
        },
        showCancelButton : true,
        confirmButtonText: 'Next step',
        showLoaderOnConfirm: true
    }).then( function(result) {
        if (result.isDismissed) {
            return false;
        }
    });
}

function reloadUserData(firstConnection=false) {
    var data= {
        type: "userData"
    }
    return fetch("https://e.diskloud.fr/dilab/get", {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        headers: {
          'Content-Type': 'application/json'
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(data) // body data type must match "Content-Type" header
      }).then( response => {
          response.json().then(async (json) => {
            console.log(json);
            if (json.status) { // Valid credentials case
                localStorage.setItem("dilabData", JSON.stringify(json.data));
                userData= await json.data;
                var timestamp = new Date().getTime();
                document.querySelector(".userPPImg").src="/dilab/user/"+userData.profilePicturePath+"?t=" + timestamp;
                document.querySelector(".menuPPImg").src="/dilab/user/"+userData.profilePicturePath+"?t=" + timestamp;
                document.querySelector(".userMainMenu .nameAndSurname").innerHTML = userData.prenom + " " +userData.nom;
                if (firstConnection) {
                    pathAnalysis();
                }
                return userData;
                //Swal.fire("Success !","Apparently, the credentials you passed where wrong","success");
            }
            else {
                console.log("user data has been deleted");
                //Swal.fire("Error","Apparently, you are not connected (and it threw an error) :(","error");
                return;
            }
          }); 
    });
}

function loadPage(title,url,params=[]) {
    url = 'https://e.diskloud.fr/Dilab/'+url;
    console.log(url);
    for (var i=0;i<params.length;i++) {
        if (i==0) {
            url+="?"
        }
        url+=encodeURI(params[i][0])+"="+encodeURI(params[i][1]);
        if (i<params.length-1) {
            url+="&";
        }
    }
    document.title = title;
    history.pushState({}, title, url)
    pathAnalysis();
}

window.onpopstate = function(event) {
    if (loadPage) 
        pathAnalysis();
};

var templateLoadTimeout=null;

function loadTemplate(link,callBack) {
    console.log("link :" +link);
    if (templateLoadTimeout!=null) {
        clearTimeout(templateLoadTimeout); // ensures that timeout hiding progress bar does not trigger after if calling this function too quickly
    }
    loadBar.style.display="block";
    loadBar.style.width="5%";
    xhr= new XMLHttpRequest;
    console.log("https://e.diskloud.fr/DilabRessources/dilabTemplates/"+link+".txt");
    xhr.open("GET","https://e.diskloud.fr/DilabRessources/dilabTemplates/"+link+".txt");
    xhr.onload=function() {
        if (xhr.statusCode!=200) {
            mainContent.innerHTML="<h2>There is no internet connection..</h2>"
        }
        loadBar.style.width="100%";
        mainContent.innerHTML=xhr.responseText;
        callBack();
        templateLoadTimeout=setTimeout(()=>{
            loadBar.style.display="none";
            loadBar.style.width="0%";
        }, 600);
    };
    xhr.send();
    return true;
}

function searchLoad() {
    if (searchField.value.trim()!="" && window.innerWidth>700)
        loadPage("Search results","search",[["q",searchField.value]]);
    else if (searchField2?.value.trim()!="" && window.innerWidth<=700) {
        loadPage("Search results","search",[["q",searchField2.value]]);
    }
}

function outerWidth(el) {
    const height=el.offsetWidth,
    style=window.getComputedStyle(el);
    return ['left','right'].map(side=>parseInt(style[`margin-${side}`])).reduce((total,side)=> total+side, height);
}

document.querySelector(".title").addEventListener("click",()=>{loadPage("Dilab","",[])});
document.querySelectorAll(".opt")[0].addEventListener("click",()=>{loadPage("Releases","releases",[])});
document.querySelectorAll(".opt")[1].addEventListener("click",()=>{loadPage("Projects","projects",[])});
document.querySelectorAll(".opt")[2].addEventListener("click",()=>{loadPage("Groups","groups",[])});
document.querySelectorAll(".opt")[3].addEventListener("click",()=>{loadPage("Search","searchpage",[])})
document.querySelector(".bi-search").addEventListener("click",()=>{searchLoad()});
searchField.addEventListener("keypress",function(e) {
    if (e.key=="Enter") {
        searchLoad();
    }
});
document.querySelector(".title").addEventListener("mouseover",()=>{
    if (!logoAnimation.isActive())
        logoAnimation.play(0);
});

// TRAITEMENT CLIENT PERSONNALISE :
// Première connection ?
if (document.querySelector(".loginButton")) {
    pathAnalysis();
    document.querySelectorAll(".loginButton").forEach(el=>{
        el.addEventListener("click",()=> {
            var path=window.location.href.toLowerCase().replace("https://e.diskloud.fr/dilab","");
            if (path[0]=="/") {
                path=path.slice(1,path.length);
            }
            redirect("https://e.diskloud.fr/Dilab/login?redirect="+encodeURIComponent(path));
        });
    });
} else {
    var userBtn=document.querySelector(".userProfileCircleButton"),
    userMenu=document.querySelector(".userMainMenu"),
    notificationsBtn=document.querySelector(".notificationsButton")
    notificationsMenu=document.querySelector(".notificationsMenu");

    document.addEventListener('click',e=> { // Listener to hide userMenu when user clicks outside of it
        if (!userMenu.contains(e.target) && !userBtn.contains(e.target)) {
            userMenu.style.display="";
        }
        if (!notificationsMenu.contains(e.target) && !notificationsBtn.contains(e.target)) {
            notificationsMenu.style.display="";
        }
    });

    if (localStorage.getItem("dilabData")!="" && localStorage.getItem("dilabData")!=null) {
        userData=JSON.parse(localStorage.getItem("dilabData"));
        document.querySelector(".userPPImg").src="/dilab/user/"+userData.profilePicturePath;
        document.querySelector(".menuPPImg").src="/dilab/user/"+userData.profilePicturePath;
        document.querySelector(".userMainMenu .nameAndSurname").innerHTML = userData.prenom + " " +userData.nom;
        pathAnalysis();
    } else {
        reloadUserData(true); //We add true option to also update the main page with decent data
    }

    document.querySelector(".userMainMenu .disconnectBtn").addEventListener("click",function(e) {
        e.preventDefault();
        disconnect();
    });

    document.querySelector(".userMainMenu .settingsBtn").addEventListener("click",()=>{
        loadPage("Settings","settings",[]);
        document.querySelector(".userMainMenu").style.display="";
    });
    userBtn.addEventListener("click",()=>{
        if (userMenu.style.display=="") {
            userMenu.style.display="flex";
        } else {
            userMenu.style.display="";
        }
        //document.querySelector(".blocker").style.display="block";
        //userMenu.style.zIndex="2";
        //userMenu.querySelector(".invisibleLink").focus();
    });

    notificationsBtn.addEventListener("click",()=>{
        if (notificationsMenu.style.display=="") {
            notificationsMenu.style.display="flex";
        } else {
            notificationsMenu.style.display="";
        }
        //document.querySelector(".blocker").style.display="block";
        //userMenu.style.zIndex="2";
        //userMenu.querySelector(".invisibleLink").focus();
    });



    /*document.querySelector(".blocker").addEventListener("click", function (event) {
        if (
            // we are still inside the dialog so don't close
            userMenu.contains(event.relatedTarget) ||
            // we have switched to another tab so probably don't want to close 
            !document.hasFocus()
        ) {
            return;
        }
        document.querySelector(".blocker").style.display="none";
        userMenu.style.zIndex="";
        userMenu.style.display="";
    });*/
}
// Connecté ou pas, ensuite on vérifie les infos sur le lecteur musical :
if (localStorage.getItem("playerData")!=null) {
    playerNotEmpty=true;
    let playerData=JSON.parse(localStorage.getItem("playerData"));
    if (!playerData.currentPlay || !playerData.authors || !playerData.urls || !playerData.picturePath ||
        !playerData.titles || !playerData.currentTime || !playerData.lyrics) {
        console.log("We are here");
        localStorage.removeItem("playerData");
        // Supprimer les données de sauvegarde si elles sont corrompues.
    } else {
        playlistIndex=parseInt(playerData.currentPlay);
        lyrics=playerData.lyrics;
        soundUrls=playerData.urls;
        soundAuthors=playerData.authors;
        soundTitles=playerData.titles;
        soundPictures=playerData.picturePath;
        updateMusicProgressTime(playerData.currentTime/100*audioObj.duration);
        audioObj.currentTime=playerData.currentTime;   
        loadSound(soundUrls[playlistIndex]);
        document.querySelectorAll(".musicButton, .musicProgressTime, .musicDuration, .progressBarContainer, .likeIt, .playlistIcon").forEach(el=>{
            el.classList.remove("disabled");
        });
    }
}
// Sauvegarder le contenu du lecteur toutes les 10 secondes
function updatePlayerData() {
    localStorage.setItem("playerData",JSON.stringify({
        titles : soundTitles,
        authors : soundAuthors,
        urls : soundUrls,
        currentTime : audioObj.currentTime,
        lyrics : lyrics,
        currentPlay : String(playlistIndex),
        picturePath : soundPictures
    }));
    document.querySelectorAll(".musicButton, .musicProgressTime, .musicDuration, .progressBarContainer, .likeIt, .playlistIcon").forEach(el=>{
        el.classList.remove("disabled");
    });
}

let playerUpdater=setInterval(()=>{ updatePlayerData(); },5000);
//PAS TERMINE

//Playlist Menu event listener
document.addEventListener('click',e=> { // Listener to hide userMenu when user clicks outside of it
    if (!playlistMenu.contains(e.target) && !playlistButton.contains(e.target)) {
        playlistMenu.style.transform = "translate(0,10px)";
        playlistMenu.style.opacity = "0";
        setTimeout(()=> {
            playlistMenu.style.display="";
            playlistMenu.style.transform = "";
            playlistMenu.style.opacity="";
        },100);
    }
});

// Function that allows to remove ALL eventListeners of an element

function removeListeners(element) {
    const newElement = element.cloneNode(true);
    element.parentNode.replaceChild(newElement, element);
    return newElement;
}

// Chat setup

var chatReloader=null,lastMessage=null;

function setupChat(groupName,projectName=null) {
    var body={
        type : projectName==null ? "groupChat" : "projectChat",
        "groupName" : groupName
    }
    if (projectName!=null) {
        body.projectName=projectName
    }
    fetch('/Dilab/get', {
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        method: 'POST',
        body: JSON.stringify(body) //data
    }).then(out => {
        return out.json();
    }).then(log => {
        console.log(log);
        if (log.status) {
            document.querySelector(".messagesContainer").innerHTML="";
            document.querySelector(".messagesContainer").style.overflow = "auto";
            for (var i=0;i<log.data.length;i++) {
                if (i==0) {
                    document.querySelector(".messagesContainer").innerHTML+=generateNewDateAnouncement(log.data[0].sendTime)
                } else {
                    var date1=new Date(log.data[i-1].sendTime),
                    date2=new Date(log.data[i].sendTime);
                    if (date1.getDate()!=date2.getDate() || date1.getMonth()!=date2.getMonth() || date1.getFullYear()!=date2.getFullYear()) {
                        document.querySelector(".messagesContainer").innerHTML+=generateNewDateAnouncement(log.data[i].sendTime)
                    }
                }
                document.querySelector(".messagesContainer").innerHTML+=generateNewMessageElement(log.data[i].isAuthorRequester,log.data[i].message,log.data[i].pseudo,log.data[i].sendTime);
            } if (log.data.length==0) {
                document.querySelector(".messagesContainer").innerHTML=`<div class="noMessage">No message has been sent yet..</div>`
            } else {
                document.querySelector(".messagesContainer").scrollTo({
                    left: 0,
                    top : document.querySelector(".messagesContainer").scrollHeight
                });
            }
            document.querySelector(".hider").style.display="none";
            document.querySelector(".chatInput").disabled=false;

            document.querySelector(".chatAttachBtn").addEventListener("click",()=>{
                Swal.fire("Info","Sharing files via the chat is not available yet (will come later)","info");
            });

            document.querySelector(".chatInput").addEventListener("keyup",e=> {
                if (e.key=="Enter") {
                    e.preventDefault();
                    var message=document.querySelector(".chatInput").value;
                    const queryString = window.location.search;
                    const urlParams = new URLSearchParams(queryString);
                    sendMessage(message,urlParams.get("g"),urlParams.get("p"));
                    document.querySelector(".chatInput").value="";
                }
            });

            document.querySelector(".chatSendBtn").addEventListener("click",()=>{
                var message=document.querySelector(".chatInput").value;
                const queryString = window.location.search;
                const urlParams = new URLSearchParams(queryString);
                sendMessage(message,urlParams.get("g"),urlParams.get("p"));
                document.querySelector(".chatInput").value="";    
            });
            chatReloader=setTimeout(()=>{
                updateChat(groupName,projectName);
            },4000);
            lastMessage=(log.data[log.data.length-1]) ? log.data[log.data.length-1] : null;
        } else {
            document.querySelector(".messagesUnavailable").innerHTML="We couldn't load the messages.. sorry"
        }
    });
}
function updateChat(groupName,projectName=null) {
    var body={ // Attention, problème de fuseau horaire (serveur décalé d'une heure. Pour le client, ça peut être différent)
        type : projectName==null ? "groupChat" : "projectChat",
        "groupName" : groupName,
    }
    if (lastMessage!=null) {
        body.minTime =  lastMessage.sendTime
    }
    if (projectName!=null) {
        body.projectName=projectName
    }
    fetch('/Dilab/get', {
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        method: 'POST',
        body: JSON.stringify(body) //data
    }).then(out => {
        return out.json();
    }).then(log => {
        if (log.status) {
            console.log(log.data);
            // This code part is very badly written
            var minIndex=(lastMessage==null) ? -1 :log.data.findIndex(message => JSON.stringify(lastMessage) == JSON.stringify(message));
            if (minIndex > -1 ) {
                while (minIndex< log.data.length+1 && JSON.stringify(lastMessage) == JSON.stringify(log.data[minIndex+1])) {
                    minIndex++;
                }
            }
            for (var i=minIndex+1;i<log.data.length && (minIndex>-1 || lastMessage==null);i++) {
                if (lastMessage==null) {
                    document.querySelector(".messagesContainer").innerHTML="";
                }
                if (i==minIndex+1) {
                    if (lastMessage==null) {
                        document.querySelector(".messagesContainer").innerHTML+=generateNewDateAnouncement(log.data[0].sendTime);
                    } else {
                        var date1=new Date(lastMessage.sendTime),
                        date2=new Date(log.data[i].sendTime);
                        if (date1.getDate()!=date2.getDate() || date1.getMonth()!=date2.getMonth() || date1.getFullYear()!=date2.getFullYear()) {
                            document.querySelector(".messagesContainer").innerHTML+=generateNewDateAnouncement(log.data[i].sendTime)
                        }
                    }
                } else {
                    var date1=new Date(log.data[i-1].sendTime),
                    date2=new Date(log.data[i].sendTime);
                    if (date1.getDate()!=date2.getDate() || date1.getMonth()!=date2.getMonth() || date1.getFullYear()!=date2.getFullYear()) {
                        document.querySelector(".messagesContainer").innerHTML+=generateNewDateAnouncement(log.data[i].sendTime)
                    }
                }
                lastMessage=log.data[log.data.length-1];
                document.querySelector(".messagesContainer").innerHTML+=generateNewMessageElement(log.data[i].isAuthorRequester,log.data[i].message,log.data[i].pseudo,log.data[i].sendTime);
            }
            if (log.data.length-minIndex>1) {
                document.querySelector(".messagesContainer").scrollTo({
                    left: 0,
                    top : document.querySelector(".messagesContainer").scrollHeight,
                    behavior : "smooth"
                });
            }
            chatReloader=setTimeout(()=>{
                updateChat(groupName,projectName);
            },4000);
        } else {
            Swal.fire("Error","We had troubles loading new messages.","error");
        }
    });
}
function sendMessage(message,groupName,projectName=null) {
    if (message.length == 0) return;
    var body={
        type : "message",
        messageDestType : projectName==null ? "g" : "p",
        "groupName" : groupName,
        messageContent : message
    }
    if (projectName!=null) {
        body.projectName=projectName
    }
    fetch('/Dilab/add', {
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        method: 'POST',
        body: JSON.stringify(body) //data
    }).then(out => {
        return out.json();
    }).then(log => {
        console.log(log);
        if (log.status) {
            clearTimeout(chatReloader);
            updateChat(groupName,projectName);
        } else {
            Swal.fire("Error","Apparently, your message wasn't sent. Try again later","error");
        }
    });
}

function setupPrivateChat(user) {
    var body={
        type : "artistChat",
        artist : user
    }
    fetch('https://e.diskloud.fr/Dilab/get', {
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        method: 'POST',
        body: JSON.stringify(body) //data
    }).then(out => {
        return out.json();
    }).then(log => {
        console.log(log);
        if (log.status) {
            document.querySelector(".messagesContainer").innerHTML="";
            document.querySelector(".messagesContainer").style.overflow = "auto";
            for (var i=0;i<log.data.length;i++) {
                if (i==0) {
                    document.querySelector(".messagesContainer").innerHTML+=generateNewDateAnouncement(log.data[0].sendTime)
                } else {
                    var date1=new Date(log.data[i-1].sendTime),
                    date2=new Date(log.data[i].sendTime);
                    if (date1.getDate()!=date2.getDate() || date1.getMonth()!=date2.getMonth() || date1.getFullYear()!=date2.getFullYear()) {
                        document.querySelector(".messagesContainer").innerHTML+=generateNewDateAnouncement(log.data[i].sendTime)
                    }
                }
                document.querySelector(".messagesContainer").innerHTML+=generateNewMessageElement(log.data[i].isAuthorRequester,log.data[i].message,log.data[i].pseudo,log.data[i].sendTime);
            } if (log.data.length==0) {
                document.querySelector(".messagesContainer").innerHTML=`<div class="noMessage">No message has been sent yet..</div>`
            } else {
                document.querySelector(".messagesContainer").scrollTo({
                    left: 0,
                    top : document.querySelector(".messagesContainer").scrollHeight
                });
            }
            document.querySelector(".hider").style.display="none";
            document.querySelector(".chatInput").disabled=false;

            document.querySelector(".chatAttachBtn").addEventListener("click",()=>{
                Swal.fire("Info","Sharing files via the chat is not available yet (will come later)","info");
            });

            document.querySelector(".chatInput").addEventListener("keyup",e=> {
                if (e.key=="Enter") {
                    e.preventDefault();
                    var message=document.querySelector(".chatInput").value;
                    const queryString = window.location.search;
                    const urlParams = new URLSearchParams(queryString);
                    sendPrivateMessage(message,urlParams.get("a"));
                    document.querySelector(".chatInput").value="";
                }
            });

            document.querySelector(".chatSendBtn").addEventListener("click",()=>{
                var message=document.querySelector(".chatInput").value;
                const queryString = window.location.search;
                const urlParams = new URLSearchParams(queryString);
                sendPrivateMessage(message,urlParams.get("a"));
                document.querySelector(".chatInput").value="";    
            });
            chatReloader=setTimeout(()=>{
                updatePrivateChat(user);
            },4000);
            lastMessage=(log.data[log.data.length-1]) ? log.data[log.data.length-1] : null;
        } else {
            document.querySelector(".messagesUnavailable").innerHTML="We couldn't load the messages.. sorry"
        }
    });
}
function updatePrivateChat(user) {
    var body={ // Attention, problème de fuseau horaire (serveur décalé d'une heure. Pour le client, ça peut être différent)
        type : "artistChat",
        "artist" : user,
    }
    if (lastMessage!=null) {
        body.minTime =  lastMessage.sendTime
    }
    fetch('/Dilab/get', {
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        method: 'POST',
        body: JSON.stringify(body) //data
    }).then(out => {
        return out.json();
    }).then(log => {
        if (log.status) {
            console.log(log.data);
            // This code part is very badly written
            var minIndex=(lastMessage==null) ? -1 :log.data.findIndex(message => JSON.stringify(lastMessage) == JSON.stringify(message));
            if (minIndex > -1 ) {
                while (minIndex< log.data.length+1 && JSON.stringify(lastMessage) == JSON.stringify(log.data[minIndex+1])) {
                    minIndex++;
                }
            }
            for (var i=minIndex+1;i<log.data.length && (minIndex>-1 || lastMessage==null);i++) {
                if (lastMessage==null) {
                    document.querySelector(".messagesContainer").innerHTML="";
                }
                if (i==minIndex+1) {
                    if (lastMessage==null) {
                        document.querySelector(".messagesContainer").innerHTML+=generateNewDateAnouncement(log.data[0].sendTime);
                    } else {
                        var date1=new Date(lastMessage.sendTime),
                        date2=new Date(log.data[i].sendTime);
                        if (date1.getDate()!=date2.getDate() || date1.getMonth()!=date2.getMonth() || date1.getFullYear()!=date2.getFullYear()) {
                            document.querySelector(".messagesContainer").innerHTML+=generateNewDateAnouncement(log.data[i].sendTime)
                        }
                    }
                } else {
                    var date1=new Date(log.data[i-1].sendTime),
                    date2=new Date(log.data[i].sendTime);
                    if (date1.getDate()!=date2.getDate() || date1.getMonth()!=date2.getMonth() || date1.getFullYear()!=date2.getFullYear()) {
                        document.querySelector(".messagesContainer").innerHTML+=generateNewDateAnouncement(log.data[i].sendTime)
                    }
                }
                lastMessage=log.data[log.data.length-1];
                document.querySelector(".messagesContainer").innerHTML+=generateNewMessageElement(log.data[i].isAuthorRequester,log.data[i].message,log.data[i].pseudo,log.data[i].sendTime);
            }
            if (log.data.length-minIndex>1) {
                document.querySelector(".messagesContainer").scrollTo({
                    left: 0,
                    top : document.querySelector(".messagesContainer").scrollHeight,
                    behavior : "smooth"
                });
            }
            chatReloader=setTimeout(()=>{
                updatePrivateChat(user);
            },4000);
            document.querySelectorAll(".notification").forEach(el => {
                const queryString = window.location.search;
                const urlParams = new URLSearchParams(queryString);
                if (document.querySelector(".confirmMessage") != null && document.querySelector(".text").innerHTML.indexOf(urlParams.get("a"))>-1) {
                    document.querySelector(".confirmMessage").click();
                }
            })
        } else {
            Swal.fire("Error","We had troubles loading new messages.","error");
        }
    });
}
function sendPrivateMessage(message,artistDest) { // artistDest est le pseudo de l'artiste
    if (message.length == 0) return;
    var body={
        type : "PVmessage",
        messageDestType : "t",
        "destination" : artistDest,
        messageContent : message
    }
    fetch('/Dilab/add', {
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        method: 'POST',
        body: JSON.stringify(body) //data
    }).then(out => {
        return out.json();
    }).then(log => {
        console.log(log);
        if (log.status) {
            clearTimeout(chatReloader);
            updatePrivateChat(artistDest);
        } else {
            Swal.fire("Error","Apparently, your message wasn't sent. Try again later","error");
        }
    });
}

//PopUp Window handler
document.querySelector(".popUpWindow").addEventListener('click', e => {
    e.stopPropagation();
});
document.querySelector(".popUpWindowContainer").addEventListener('click',e => {
    document.querySelector(".popUpWindowContainer").style.display="";
    localStorage.removeItem("lyricsSyncInput");
});
document.querySelector(".popUpWindow .popUpCloseBtn").addEventListener('click',e => {
    document.querySelector(".popUpWindowContainer").style.display="";
});

/* OTHER EVENT LISTENERS */
var clicking=false;
var clickedElement=null;

document.addEventListener('mousedown',e=> { // Listener to allow drag when click begun by user
    clickedElement=e.target;
    while (document.querySelector(".playlistMenu")!=clickedElement && document.querySelector(".progressBarContainer")!=clickedElement  && clickedElement!=document.querySelectorAll(".progressBarContainer")[1] && clickedElement!=document.body) {
        clickedElement=clickedElement.parentNode;
    }
    clicking=true;
    soughtProgress=null;
});

document.addEventListener('mouseup',() => {
    clickedElement=null;
    clicking=false;
    if (soughtProgress!=null) {
        audioObj.currentTime=soughtProgress;
    }
});

document.addEventListener('touchstart',e=> { // Listener to allow drag when click begun by user
    clickedElement=e.target;
    while (document.querySelector(".playlistMenu")!=clickedElement && document.querySelector(".progressBarContainer")!=clickedElement  && clickedElement!=document.querySelectorAll(".progressBarContainer")[1] && clickedElement!=document.body) {
        clickedElement=clickedElement.parentNode;
    }
    clicking=true;
    soughtProgress=null;
    if (clickedElement==document.querySelector(".progressBarContainer"))
        clickedElement.querySelector(".dotPosition").style.transform="scale(1.4) translate(35%,-35%)";
    var evt = new MouseEvent("touchmove", {
        view: window,
        bubbles: true,
        cancelable: true,
        clientX:e.touches[0].clientX,
        clientY:e.touches[0].clientY
    });
    document.querySelector(".progressBarContainer").dispatchEvent(evt);
});

document.addEventListener('touchend',() => {
    if (clickedElement!=null)
        clickedElement.querySelector(".dotPosition").style.transform="";
    clickedElement=null;
    clicking=false;
    if (soughtProgress!=null) {
        audioObj.currentTime=soughtProgress;
    }
});

//Music Progress Control
document.querySelector(".progressBarContainer").addEventListener('click', e => {
    var progress=document.querySelector(".progressBarContainer").querySelector(".progressBar");
    if (progress==null) {
        return;
    }
    let bounds = progress.getBoundingClientRect();
    var x;
    if (((e.clientX - bounds.left)/progress.offsetWidth)*100>100) {
        x=100;
    } else if (((e.clientX - bounds.left)/progress.offsetWidth)*100<0) {
        x=0;
    } else {
        x = ((e.clientX - bounds.left)/progress.offsetWidth)*100;
    }
    //y = e.clientY - bounds.top;
    progress.querySelector(".filledPart").style.width = x+"%";
    if (document.querySelector(".progressBarContainer").contains(e.target)) {
        if (audioObj.paused) {
            updateMusicProgressTime(x/100*audioObj.duration);
        }
        audioObj.currentTime=x/100*audioObj.duration;   
    }
}); 

//Sound Control

function setVolume(x) { // x stands for audio intensity level
    document.querySelectorAll(".progressBarContainer")[1].querySelector(".filledPart").style.width = String(x)+"%";
    audioObj.volume=x/100;
    localStorage.setItem("DilabVolumeLevel",x);
    updateSoundIcon(x);
}

//Synchronisation of sound level with value stored inside cookie
if (localStorage.getItem("DilabVolumeLevel")!=null && localStorage.getItem("DilabVolumeLevel")!="") {
    setVolume(localStorage.getItem("DilabVolumeLevel"));
}

document.querySelectorAll(".progressBarContainer")[1].addEventListener('click', e => {
    var progress=document.querySelectorAll(".progressBarContainer")[1].querySelector(".progressBar")
    /*while (document.querySelectorAll(".progressBar")[1]!=progress && progress!=document.body) {
        progress=progress.parentNode;
    } if (progress==document.body) {
        console.log("its the body..")
        return;
    }*/
    if (progress==null) {
        return;
    }
    let bounds = progress.getBoundingClientRect();
    var x;
    if (((e.clientX - bounds.left)/progress.offsetWidth)*100>100) {
      x=100;
    } else if (((e.clientX - bounds.left)/progress.offsetWidth)*100<0) {
      x=0;
    } else {
      x = ((e.clientX - bounds.left)/progress.offsetWidth)*100;
    }
    //y = e.clientY - bounds.top;
    progress.querySelector(".filledPart").style.width = x+"%";
    audioObj.volume=x/100;
    localStorage.setItem("DilabVolumeLevel",x);
    updateSoundIcon(x);
});

//To update music time
function updateMusicProgressTime(timestamp,progress=true) {
    if (isNaN(timestamp)) {
        timestamp=0;
    }
    timestamp=parseInt(timestamp);
    //audioObj.currentTime=timestamp;
    var secs=timestamp%60,mins=(timestamp-secs)/60;
    mins=mins.toLocaleString('en-US', {
        minimumIntegerDigits: 2,
        useGrouping: false
    });
    secs=secs.toLocaleString('en-US', {
        minimumIntegerDigits: 2,
        useGrouping: false
    });
    if (progress) {
        document.querySelector(".musicProgressTime").innerHTML=mins+":"+secs;
    } else {
        document.querySelector(".musicDuration").innerHTML=mins+":"+secs;        
    }

}

//Handling mouse move
document.addEventListener('mousemove', e => {
    if (!clicking && clickedElement==null) { // Check if mouse is held
        return;
    }
    else {
        if (clickedElement==document.body) {
            return;
        }
        if (clickedElement==document.querySelector(".progressBarContainer") || clickedElement==document.querySelectorAll(".progressBarContainer")[1]) {
            var progress=clickedElement==document.querySelector(".progressBarContainer") ?
                document.querySelector(".progressBarContainer").querySelector(".progressBar") :
                document.querySelectorAll(".progressBarContainer")[1].querySelector(".progressBar");
            let bounds = progress.getBoundingClientRect();
            var x;
            if (((e.clientX - bounds.left)/progress.offsetWidth)*100>100) {
                x=100;
            } else if (((e.clientX - bounds.left)/progress.offsetWidth)*100<0) {
                x=0;
            } else {
                x = ((e.clientX - bounds.left)/progress.offsetWidth)*100;
            }
            //y = e.clientY - bounds.top;
            clickedElement.querySelector(".filledPart").style.width = x+"%";
            if (clickedElement==document.querySelector(".progressBarContainer")) {
                if (audioObj.paused) {
                    updateMusicProgressTime(x/100*audioObj.duration);
                }
                soughtProgress=x/100*audioObj.duration;
            } else {
                updateSoundIcon(x);
                audioObj.volume=x/100;
            }
        }
    }
});

document.querySelector(".progressBarContainer").addEventListener('touchmove', e => {
    if (!clicking && clickedElement==null) { // Check if mouse is held
        return;
    }
    else {
        if (clickedElement==document.body) {
            return;
        }
        if (clickedElement==document.querySelector(".progressBarContainer")) {
            var progress= document.querySelectorAll(".progressBarContainer")[0].querySelector(".progressBar");
            let bounds = progress.getBoundingClientRect();
            var x;
            if (((e.clientX - bounds.left)/progress.offsetWidth)*100>100) {
                x=100;
            } else if (((e.clientX - bounds.left)/progress.offsetWidth)*100<0) {
                x=0;
            } else if (e.clientX) {
                x = ((e.clientX - bounds.left)/progress.offsetWidth)*100;
            } else if (((e.touches[0].clientX - bounds.left)/progress.offsetWidth)*100>100) {
                x=100;
            } else if (((e.touches[0].clientX - bounds.left)/progress.offsetWidth)*100<0) {
                x=0;
            } else {
                x = ((e.touches[0].clientX - bounds.left)/progress.offsetWidth)*100;
            }
            //y = e.clientY - bounds.top;
            progress.querySelector(".filledPart").style.width = x+"%";
            if (audioObj.paused) {
                updateMusicProgressTime(x/100*audioObj.duration);
            }
            soughtProgress=x/100*audioObj.duration;
            /*
                updateSoundIcon(x);
                audioObj.volume=x/100;
            */
        }
    }
});

function updateSoundIcon(soundValue) {
    var iconElement=document.querySelector(".soundIcon i");
    iconElement.className="";
    if (soundValue < 1) {
        iconElement.classList.add("bi");
        iconElement.classList.add("bi-volume-mute-fill");
    } else if (soundValue < 60) {
        iconElement.classList.add("bi");
        iconElement.classList.add("bi-volume-down-fill");
    } else {
        iconElement.classList.add("bi");
        iconElement.classList.add("bi-volume-up-fill");
    }
}

unmutedWidth=0;
document.querySelector(".soundIcon").addEventListener('click',e => {
    var iconElement=document.querySelector(".soundIcon i");
    iconElement.className=''
    iconElement.classList.add("bi");
    if (document.querySelector(".soundControl .progressBar .filledPart").offsetWidth>0) {
        unmutedWidth=document.querySelector(".soundControl .progressBar .filledPart").style.width;
        document.querySelector(".soundControl .progressBar .filledPart").style.width="0px";
        iconElement.classList.add("bi-volume-mute-fill");
        audioObj.volume=0;
    } else {
        if (unmutedWidth!=0) {
            document.querySelector(".soundControl .progressBar .filledPart").style.width=unmutedWidth;
            iconElement.classList.add("bi-volume-up-fill");
            audioObj.volume=parseFloat(unmutedWidth)/100; //Convert with of sound bar (% unit) into a double value
        } else {
            document.querySelector(".soundControl .progressBar .filledPart").style.width="20%";
            iconElement.classList.add("bi-volume-up-fill");
            audioObj.volume=0.2;
        }
    }
    localStorage.setItem("DilabVolumeLevel",audioObj.volume);
})

/* FURTHER TECHNICAL FUNCTIONS */

function redirect(address) {
    a=document.createElement('a');
    a.href=address;
    a.click();
}

function displayPopUp(title,content,callBack=(e)=>{}) {
    document.querySelector(".popUpWindowContainer").style.display="block";
    document.querySelector(".popUpWindowContainer > .popUpWindow > .popUpHeader > .popUpTitle").innerHTML=title;
    document.querySelector(".popUpWindowContainer > .popUpWindow > .popUpMainContent").innerHTML="<div class=\"kabobloader\"><div class=\"bounce1\"></div><div class=\"bounce2\"></div><div class=\"bounce3\"></div></div>";
    fetch("https://e.diskloud.fr/dilabRessources/dilabTemplates/popUp/"+content).then(output=>
    {
        if (output.status!=200) {
            document.querySelector(".popUpWindowContainer > .popUpWindow > .popUpMainContent").innerHTML="Error "+output.status;
            return false;
        }
        return output.text() }).then(loadedContent => {
        if (loadedContent!=false) {
            document.querySelector(".popUpWindowContainer > .popUpWindow > .popUpMainContent").innerHTML=loadedContent;
            callBack(document.querySelector(".popUpWindowContainer"));
        }
    })
}

function progress(step,selector,i=0) {
    var element=selector;
    if (!selector.innerHTML) {
        element=document.querySelectorAll(selector)[i];
    }
    var percentProg=step/(element.querySelectorAll(".step").length-1)*100
    if (percentProg>100) {
        percentProg=100;
    }
    if (element.querySelector(".percent")) {
        element.querySelector(".percent").style.width=percentProg+"%";
    }
    element.querySelectorAll(".step").forEach(el=> {
        el.classList.remove("selected","completed")
        if (el.id<step) {
            el.classList.add("completed");
        } else if (el.id==step) {
            el.classList.add("selected");
        }
    });
}

function disconnect() {
    fetch("https://e.diskloud.fr/dilab/disconnect", {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        headers: {
          'Content-Type': 'application/json'
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify({}) // body data type must match "Content-Type" header
      }).then( response => {
          response.json().then(json => {
            if (json.status) { // Valid credentials case
                localStorage.removeItem("dilabData");
                location.reload();
                //Swal.fire("Success !","Apparently, the credentials you passed where wrong","success");
            }
            else {
                Swal.fire("Error","Apparently, the server could not disconnect you :( (maybe you were already disconnected)..","error");
            }
          }); 
    });
}




/* SETTINGS PAGE FUNCTIONS */
function updateBio() {
    var updateValue=document.querySelector(".biographyInput").value;
    return fetch("https://e.diskloud.fr/dilab/set", {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        headers: {
          'Content-Type': 'application/json'
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify({
            userBiographyOnly : updateValue
        }) // body data type must match "Content-Type" header
      }).then( response => {
          response.json().then(json => {
            if (json.status) { // Valid credentials case
                //Swal.fire("Success","Your biography has been updated.","success");
                reloadUserData();
                return "Updated Biography properly<br />"
            }
            else {
                //Swal.fire("Error","It failed updating your bio..","error");
                return `Could not update your biography : ${json.data}<br />`
            }
          }); 
    });
}

function updateUsername() {
    var updateValue=document.querySelector(".usernameInput").value;
    fetch("https://e.diskloud.fr/dilab/set", {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        headers: {
          'Content-Type': 'application/json'
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify({
            usernameOnly : updateValue
        }) // body data type must match "Content-Type" header
      }).then( response => {
          response.json().then(json => {
            if (json.status) { // Valid credentials case
                //Swal.fire("Success","Your username has been updated.","success");
                reloadUserData();
                return "Updated username properly<br />";
            }
            else {
                //Swal.fire("Error",json.data,"error");
                return `Could not update username : ${json.data}<br />`;
            }
          }); 
    });
}

function updateName(firstOrLastName) {
    var updateValue;
    if (firstOrLastName) {
        data= {
            firstNameOnly : document.querySelector(".nameInput").value
        };
    } else {
        data= {
            lastNameOnly : updateValue=document.querySelector(".surnameInput").value
        };
    }
    fetch("https://e.diskloud.fr/dilab/set", {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        headers: {
          'Content-Type': 'application/json'
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(data) // body data type must match "Content-Type" header
      }).then( response => {
          response.json().then(json => {
            if (json.status) { // Valid credentials case
                //Swal.fire("Success",json.data,"success");
                reloadUserData();
                if (firstOrLastName) {
                    return "Updated your first name";
                } else {
                    return "Updated your last name";
                }
            }
            else {
                //Swal.fire("Error",json.data,"error");
                if (firstOrLastName) {
                    return `Could not update your first name${json.data}<br />`;
                } else {
                    return `Could not update your last name${json.data}<br />`;
                }
            }
          }); 
    });
}

function updateProfilePicture() {
    var data=new FormData();
    data.append("profilePictureOnly",true);
    if (!document.querySelector(".profilePictureInput").files[0]) {
        Swal.fire("Error","You did not upload any new profile picture..","error");
        settingsPageUnloadImage();
        return;
    } else if (document.querySelector(".profilePictureInput").files[0].size > 2097152*2){ // Check file size (4MB max)
        Swal.fire("Error","Your image is too big  (cannot exceed 4MB)..","error");
        settingsPageUnloadImage();
        return;
    } else if (document.querySelector(".profilePictureInput").files[0].type.slice(0,document.querySelector(".profilePictureInput").files[0].type.indexOf('/'))!="image") { // Check file type (image ?)
        Swal.fire("Error","You did not upload a proper new profile picture..","error");
        settingsPageUnloadImage();
        return;
    } else {
        data.append("files",document.querySelector(".profilePictureInput").files[0], document.querySelector(".profilePictureInput").files[0].name);
    }

    fetch('/Dilab/set', {
        headers: {
            //'Content-Type': 'application/x-www-form-urlencoded'
            //'Content-Type': 'multipart/form-data',
        },
        method: 'POST',
        body: data
    }).then(out => {
        return out.json();
    }).then(log => {
        settingsPageUnloadImage();
        if (log.status==true) {
            //var timestamp=new Date().getTime();
            //document.querySelector(".profilePicture > img").src="/dilab/user/"+userData.profilePicturePath+"?t=" + String(timestamp);
            reloadUserData();
            //Swal.fire("Updated your profile picture !",log.data,"success");
            return "Updated your profile picture successfully<br />";
        } else {
            //Swal.fire("Error",log.data,"error");
            return `Could not update your profile picture :${json.data}<br />`;
        }
    });
};

function settingsPageUnloadImage() {
    var timestamp=new Date().getTime();
    document.querySelector(".profilePicture > img").src="/dilab/user/"+userData.profilePicturePath+"?t=" + String(timestamp);
    document.querySelector(".profilePictureInput").value=null;
    document.querySelector(".settingsPage .pictureRemButton").style.display="";
}

// Existence control

function checkIfExists(what,input,inputElement,errElement) {
    var data= {
        type : what
    }
    for (var i=0;i<input.length;i++) {
        data[input[i][0]]=input[i][1];
    }
    console.log(data);

    return fetch("https://e.diskloud.fr/dilab/check", {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        headers: {
          'Content-Type': 'application/json'
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(data) // body data type must match "Content-Type" header
      }).then( response => {
          response.json().then(json => {
            console.log(json);
            if (json.status) { // Valid credentials case
                if(json.data) {
                    inputElement.style.outline="4px solid red";
                    inputElement.style.opacity="";
                    errElement.style.display="block";
                } else {
                    inputElement.style.outline="4px solid lightgreen";
                    inputElement.style.opacity="1";
                    errElement.style.display="";
                }
            }
            else {
                Swal.fire("Server Error","Sorry, it seems to be our fault, but there's an unexplainable problem :( <br /> (try again later)","error");
                return false;
            }
          }); 
    });
}

function wellFormattedDate(hours,minutes) {
    return (hours>9 ? String(hours) : "0"+String(hours))+":"+(minutes>9 ? String(minutes) : "0"+String(minutes));
}

// html escape

function escapeHtml(unsafe) {
    return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
  }

// Element templates

function newReleaseElement(title,group,releaseDate,streams,duration,imagePath,musicId,count=-1) {
    return `
    <div dataPath="${encodeURIComponent(musicId)}" ${(count==-1) ? "" : `dataPlaylistId="${count}"`} class=release>
        <div class=left-content>
            <div class=control ${(count==-1) ? "" : `soundId="${musicId}"`}>
                <i class="bi bi-play-circle-fill"></i>
            </div>
            <div class=cover>
                <img src="https://e.diskloud.fr/Dilab/project/${imagePath!="disc.svg" ? `${decodeURI(group)}/${decodeURI(title)}` : "disc.svg"}" />
            </div>
            <div class=infos>
                <div class=title title="${title}">
                    ${title}
                </div>
                <div class=groupAuthors title="${group}">
                    <span class=groupName>
                        ${group}
                    </span>
                    <i class="bi bi-dot"></i>
                    <span class=releaseDate>
                        ${releaseDate}
                    </span>
                </div>
            </div>
        </div>
        <div class=streams>
            ${streams}
        </div>
        <div class=duration>
            ${duration}
        </div>
    </div>    
    `
}

function newGroupElement(title="",genre="",description="",foundDate="",nCollaborators="",nReleases="",nProjects="",imagePath="people.svg") {
    return `<div onclick='loadPage("${title} Dilab","group",[["g","${title}"]])' class="group">
                <div class="cover">
                    <img src="https://e.diskloud.fr/Dilab/group/${imagePath}" title="profile picture group">
                </div>
                <div class="textContent">
                    <div class="title">
                        ${title}
                    </div>                    
                    <div class="infos">
                        <div class="foundDate">
                            Created in ${foundDate.getFullYear()}
                        </div>
                        ${genre!=null ? `<i class="bi bi-dot"></i>
                        <div class="genre">
                            ${genre}
                        </div>` : ``}
                        <i class="bi bi-dot"></i>
                        <div class="members">
                            <span class="nMembers">${nCollaborators}</span>&nbsp;members
                        </div>
                        <i class="bi bi-dot"></i>
                        <div class="groupProjects">
                            <span class="nProjects">${nProjects}</span>&nbsp;projects (<span class="nReleases">${nReleases}</span> &nbsp;released)
                        </div>
                    </div>
                    <div class="biography">
                        ${description}
                    </div>
                </div>
            </div>`
}

function newProjectElement(title,projectPP,group,description,foundDate,nCollaborators,imagePath,audioFile) {
    foundDate=new Date(foundDate);
    return `
        <div class="cover">
            <img title="Project cover" src="${projectPP}">
            <div class="playBtn">
                <i class="bi bi-play-circle-fill"></i>
            </div>
        </div>
        <div class="mainDescription">
            <div class="header">
                <div class="title">
                    ${title}
                </div>
                <div class="projectGroup">
                    ${group}
                    <i class="bi bi-dot"></i>
                    Created in ${foundDate.getFullYear()}
                </div>
            </div>
            <div class="projectProgress">
                Project Launch
                <div class="stationProgressWrapper">
                    <div class="stationProgressContainer">
                        <div class="progressStationBar">
                            <div class="percent"></div>
                        </div>
                        <div class="steps">
                            <div class="step" title="Launching project" id="0"><i class="bi bi-check2"></i></div>
                            <div class="step" title="Working on instrumental part" id="1"><i class="bi bi-check2"></i></div>
                            <div class="step" title="Working on vocals" id="2"><i class="bi bi-check2"></i></div>
                            <div class="step" title="Releasing project" id="3"><i class="bi bi-check2"></i></div>
                        </div>
                    </div>
                </div>
                Project Release
            </div>
            <div class="description">
                ${description}                      
            </div>
        </div>`;
}

function newArtistElement(artistFullName,pseudo,genre,biography,yearOfJoin,artistPicture) {
    return `<div onclick='loadPage("${artistFullName} Dilab","artist",[["a","${pseudo}"]])' class=artist title="User's biography : ${biography}">
        <div class=cover>
            <img title="Artist's profile picture" src="https://e.diskloud.fr/Dilab/user/${artistPicture}" height="100px" />
        </div>
        <div title="${artistFullName}" class=title>
            ${artistFullName}
        </div>
        <div class=pseudo>
            (@${pseudo})
        </div>
        <div class=furtherInfos>
            <span class=nFollowers>
                Fan of ${genre}</i>&nbsp;
                Registered since&nbsp;<span class="yearOfRegistration">${yearOfJoin.getFullYear()}
            </span>
        </div>
    </div>`
}

function newMemberWaitListNotificationElement(userName,groupName) {
    return `<div class="notification questionNotification">
        <div class=icon>
            <i class="bi bi-person-plus-fill"></i>
        </div>
        <div class=text>
            <a artistLink="${userName}" href=/Dilab/artist?a=${encodeURI(userName)} ><strong>${userName}</strong></a> wants to join your group <a groupLink="${groupName}" href=/Dilab/group?g=${encodeURI(groupName)} ><strong>${groupName}</strong></a>
        </div>
        <div class=options>
            <div title="Accept join" class=accept>
                <i class="bi bi-check2"></i>
            </div>
            <div title="Block join" class=deny>
                <i class="bi bi-x"></i>
            </div>
        </div>
    </div>`

}

function newMessageNotificationElement(content,notification_id) {
    return `<div class="notification">
        <div class=icon>
            <i class="bi bi-chat-dots-fill"></i>
        </div>
        <div class=text>
           ${content}
        </div>
        <div class=options>
            <div notifData=${String(notification_id)} title="Go to message" class=confirmMessage >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-right" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8"/>
          </svg>
            </div>
        </div>
    </div>`
}

function newConfirmNotificationElement(content,notification_id) {
    return `<div class="notification">
        <div class=icon>
            <i class="bi bi-person-plus-fill"></i>
        </div>
        <div class=text>
           ${content}
        </div>
        <div class=options>
            <div notifData=${String(notification_id)} title="Confirm" class=accept>
                <i class="bi bi-check2"></i>
            </div>
        </div>
    </div>`

}

function generateNewMessageElement(isTheAuthorTheRequester,message,author,sendDate) {
    var date= new Date(sendDate);
    return `<div class="globalMessage ${isTheAuthorTheRequester ? "local" : "dist"}">
        <div class="messageWrapper">
            <div class="message local">
                ${(isTheAuthorTheRequester) ? `` : `<p class="author">${escapeHtml(author)}</p>`}
                <p>${escapeHtml(message)}</p>
            </div>                 
        </div>
        <div class="messageTimeWrapper">
            <div class="messageTime">
                ${wellFormattedDate(date.getHours(),date.getMinutes())}
            </div>    
        </div> 
    </div>`
}

function generateNewDateAnouncement(announcedDate) {
    var date = new Date(announcedDate);
    return `<div class="dateAnouncement">
                <div class="datePopUp">
                    ${String(date.getDate()) +"/"+ String(date.getMonth()+1) +"/"+ String(date.getFullYear())}
                </div>
            </div>`
}

// Other algoritmic functions

function timestampToNormalTime(timestamp) {
    var hours=(timestamp-timestamp%3600)/3600;
    timestamp=timestamp%3600;
    var mins=(timestamp-timestamp%60)/60;
    timestamp=timestamp%60;
    var secs=timestamp;
    time="";
    if (hours>0) {
        time+=hours+":";
    } if (mins<10) {
        time+="0";
    }
    time+=mins+":";
    if (secs<10) {
        time+="0"
    }
    return time+secs;
}

document.querySelectorAll("*[tabindex]").forEach(el=>{
    el.addEventListener("keyup",e=>{
        if (e.key=="Enter" || e.key==" ") {
            el.click();
        }
    })
})
