var loadBar=document.querySelector(".progress-load");
var mainContent = document.querySelector(".main-content");
var logoAnimation = gsap.timeline({});
var searchField = document.querySelector(".search-field");
logoAnimation.from(".title",0,{scale : 1, color : "white", textShadow :"0 0 0 #FFFFFF, 0 0 0 #FFFFFF", rotate: "0", transform : "skew(0deg,0deg)"})
            .to(".title",0.4,{scale : 2,color : "red", textShadow :"0 0 3px #FFFFFF, 0 0 5px #FFFFFF", ease : "power3.bounce",rotate : "300deg", y: "30px", transform : "skew(-0.15turn,15deg)"})
            .to(".title",0.4,{scale : 1,color : "white", textShadow :"0 0 0 #FFFFFF, 0 0 0 #FFFFFF", ease : "power3.bounce", rotate: "360deg", transform : "skew(-0.15turn,15deg)"},"+=.1");
console.log(localStorage.getItem("dilabData"));
console.log(userData);
var userData=localStorage.getItem("dilabData");

function goToPage(address) {
    a=document.createElement('a')
    a.href=address,
    a.click();
}

// Audio object
var soundUrls=["https://dev.diskloud.fr/audios/Stacy.mp3","https://dev.diskloud.fr/audios/SHMRedlight.mp3","https://dev.diskloud.fr/audios/Project%201.2.wav","https://dev.diskloud.fr/audios/DIMM.mp3","https://dev.diskloud.fr/audios/M83MidnightCity.mp3"]; //This is an example file (REUMSTEIKE (2020), credits by CLAIRE, LEO AND EDOUARD) !
var soundTitles=["Stacy","Redlight (2022)","Project 1.2","Dimm","Midnight City"];
var soundAuthors=["Quinn XCII","Swedish House Mafia, Sting","Various artists","Nourch","M83"];
var soundPictures=['','','','',''];
var lyrics=["[0.0]🎵\n[4.5]At the 50 yard line I saw her feet\n[6.6]She was under the bleachers waiting for me\n[9.3]No I never get high but I'm smoking her weed\n[13.5]She been giving this freshman love since last June\n[16.3]The only senior girl with tattoos\n[18.1]Said nobody can find out things that we do\n[22.0]She said, put your hands behind your head\n[25.0]Let me blow your mind kid\n[27.2]But don't get too excited\n[31.2]You can call me Stacy\n[33.2]You can call me love\n[35.0]You can call me baby\n[37.4]And all of the above\n[39.8]You can call me late night\n[42.0]And I'll be at your door\n[44.0]You can call me anything\n[46.7]Oh anything you want\n[49.0]Just don't call me yours\n[50.5]🎵\n[59.5]It's 3:05 on a Friday, bell rings\n[61.9]Her parents left last night for Palm Springs\n[64.3]She's got the whole house empty for me\n[68.4]My brother he needed the car so I ran\n[71.0]Down 71st as fast as I can\n[73.1]I'm telling her everything I had planned\n[77.1]She said, I know we've been getting close\n[80.0]We can't get no closer\n[81.8]You'll get it when you're older\n[85.6]You can call me Stacy\n[87.2]You can call me love\n[90.0]You can call me baby\n[92.4]And all of the above\n[95.2]You can call me late night\n[97.0]And I'll be at your door\n[99.1]You can call me anything\n[100.9]Oh anything you want\n[103.8]Just don't call me yours\n[105.8]🎵\n[112.8](Just don't call me yours)\n[114.8]🎵\n[121.8]You can call me Stacy\n[124.2]You can call me love\n[126.8]You can call me baby\n[128.8]And all of the above\n[131.0]You can call me late night\n[133.8]And I'll be at your door\n[135.5]You can call me anything\n[137.8]Oh anything you want\n[140.0]Just don't call me yours\n[142.2]I'm over you, I'm over you\n[151.0]I'm over you, I'm over you",
"[0.0]🎵\n[30.0]True say\n[67.0]True say\n[107.0]You don't have to put on the red light\n[113.5]Those days are over\n[116.5]You don't have to sell your body to the night (True say)\n[123.0]You don't have to wear that dress tonight\n[128.0]Those days are over\n[132.5]You don't have to put on the red light (True say)\n[138.5]🎵\n[144.0]Those days are over\n[147.5]You don't have to put on the red light\n[152.0]Those days are over\n[155.5]You don't have to put on the red light\n[159.2]Those days are over\n[162.8]You don't have to put on the red light\n[165.2]🎵\n[189.8]Those days are ovеr\n[193.8]You don't have to put on the red light\n[198.0]Thosе days are over\n[201.8]You don't have to put on the red light",
"",
"",
"[0.0]🎵\n[38.0]Waiting in the car\n[43.0]Waiting for the ride in the dark\n[47.3]At night the city grows\n[52.0]Look at the horizon glow\n[56.0]🎵\n[75.0]Waiting in the car\n[79.5]Waiting for the ride in the dark\n[83.0]Drinking in the lounge\n[88.0]Following the neon signs\n[92.8]Waiting for a word\n[97.8]Looking at the milky skyline\n[102.0]The city is my church\n[107]It wraps me in its blinding twilight\n[110.5]🎵\n[138.0]Waiting in the car\n[143.8]Waiting for the ride in the dark\n[148.5]Waiting in the car (waiting in the car)\n[153]Waiting for the ride in the dark\n[158.0]Waiting in the car\n[161.6]Waiting for the ride in the dark\n[166.0]Waiting in the car (waiting in the car)\n[170.8]Waiting for the ride in the dark\n[175.0]Waiting in the car (waiting in the car)\n[180.0]Waiting for the ride in the dark\n[185.0]🎵"]
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
    parsedLyrics=lyricsData[1];
    parsedLyricsTimes=lyricsData[0];
    document.querySelector(".fullScreen .soundName").innerHTML=soundTitles[playlistIndex];
    document.querySelector(".fullScreen  .soundAuthor").innerHTML=soundAuthors[playlistIndex];
    document.querySelector(".coverOfCurrentlyPlayingSound").src= soundPictures[playlistIndex]!="" ? "https://e.diskloud.fr/Dilab/release/"+soundPictures[playlistIndex] : "https://e.diskloud.fr/Dilab/release/music-note-beamed.svg";
    document.querySelector(".fullScreen .fullScreenPlayingSoundCover").src= soundPictures[playlistIndex]!="" ? "https://e.diskloud.fr/Dilab/release/"+soundPictures[playlistIndex] : "https://e.diskloud.fr/Dilab/release/music-note-beamed.svg";
    playlistContainer.innerHTML="";
    for (var i=0;i<soundUrls.length;i++) {
      playlistContainer.innerHTML+=`<div class="playlistElement" onclick=playSound(${i},true)>
                                        <div class=left>\
                                            <div class="cover">\
                                                <img src="${soundPictures[i]!="" ? "https://e.diskloud.fr/Dilab/release/" + soundPictures[i] : "https://e.diskloud.fr/Dilab/release/music-note-beamed.svg"}" />\
                                            </div>\
                                            <div class=soundName>\
                                                <span class="soundTitle">${soundTitles[i]}</span>\
                                                <span class=soundAuthor>${soundAuthors[i]}</span>\
                                            </div>\
                                        </div>\
                                        <span class="duration">02:00</span>\
                                    </div>`;
      /*playlistContainer.querySelectorAll(".playlistElement")[i-playlistIndex].addEventListener("click",()=> {
        playlistIndex=i;
        loadSound(soundUrls[playlistIndex]);
        console.log(soundUrls[playlistIndex]);
        playOrPauseMusic();
    });*/
      if (i==playlistIndex) {
          playlistContainer.lastChild.querySelector(".cover").appendChild(playingIcon);
      }
    }
}

audioObj.onended = function() {
    nextButton.click();
};

function playSound(i,autoplay=false) {
    playlistIndex=i;
    loadSound(soundUrls[i]);
    if (autoplay)
        playOrPauseMusic();
}

playSound(0);

playPauseBtn.addEventListener('click',e=> {
    if (audioObj.paused) {
        audioObj.play();
        setPlayIcon(true);
    } else { 
        audioObj.pause();
        setPlayIcon(false);
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

prevButton.addEventListener("click",()=>{
    if (audioObj.currentTime>4 || playlistIndex==0) {
        audioObj.currentTime=0;
        setPlayIcon(true);
        return;
    }//else case below
    playlistIndex--;
    loadSound(soundUrls[playlistIndex]);
    setPlayIcon(true);
    audioObj.play();
});

nextButton.addEventListener("click",()=>{
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
});

//Same as previous lines, but for fullscreen elements

document.querySelectorAll(".fullScreen .musicButton")[1].addEventListener('click',e=> {
    if (audioObj.paused) {
        audioObj.play();
        setPlayIcon(true);
    } else { 
        audioObj.pause();
        setPlayIcon(false);
    }
});

document.querySelector(".fullScreen .musicButton").addEventListener("click",()=>{
    if (audioObj.currentTime>4 || playlistIndex==0) {
        audioObj.currentTime=0;
        setPlayIcon(true);
        return;
    }//else case below
    playlistIndex--;
    loadSound(soundUrls[playlistIndex]);
    setPlayIcon(true);
    audioObj.play();
});

document.querySelectorAll(".fullScreen .musicButton")[2].addEventListener("click",()=>{
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

document.addEventListener("keypress",e=> {
    /*if (e.key==" ") {
        playOrPauseMusic();
    }*/
});

document.querySelector(".player .musicInfos .cover").addEventListener('click',e=> {
    goFullScreenMode();
})

// Fullscreen mode

window.onresize = function () {
    if (window.matchMedia('(display-mode: fullscreen)').matches ||
    window.document.fullscreenElement) {
        goFullScreenMode();
    }
}

function goFullScreenMode() {
    var elem=document.querySelector(".fullScreen");
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen(); // for Safari
        document.querySelector(".fullScreen").style.display="block";
    } else {
        Swal.fire("Warning","Your browser does not support fullscreen mode. Try on Chrome, Edge and Firefox (Safari doesn't support our fullscreen mode). Doesn't work :(","warning");
    }    
}


/*document.querySelector(".fullScreen .fullscreenExit").addEventListener('click',e=>{
    document.exitFullscreen();
});*/

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
    if (document.querySelector(".fullScreen").style.display="block" && elem.webkitRequestFullscreen ) { // Contrôle safari
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
    document.querySelector(".lyricsCard").appendChild(nextBottom);
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
}

function setPlayIcon(play) {
    if (play) {
        var el=document.querySelectorAll(".musicButton > i")[1];
        el.className="bi";
        el.classList.add("bi-pause-circle");
        el=document.querySelectorAll(".fullScreen .musicButton > i")[1];
        el.className="bi";
        el.classList.add("bi-pause-circle");
        document.querySelector(".playingIcon").style.display="flex"; // for play animation inside playlist menu
        document.querySelector(".fullScreen .cover").style.height="10em";
    } else {
        var el=document.querySelectorAll(".musicButton> i")[1];
        el.className="bi";
        el.classList.add("bi-play-circle");
        el=document.querySelectorAll(".fullScreen .musicButton> i")[1];
        el.className="bi";
        el.classList.add("bi-play-circle");
        document.querySelector(".playingIcon").style.display="";
        document.querySelector(".fullScreen .cover").style.height="";
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
    switch (path) {
        case "" :
            loadTemplate("home",()=>{
                document.querySelectorAll(".defaultPage .button")[0].addEventListener("click",()=>{loadPage("Projects","projects",[])});
                document.querySelectorAll(".defaultPage .button")[1].addEventListener("click",()=>{loadPage("Releases","releases",[])});
            });
            break;
        case "/group" :
            loadTemplate("group",()=>{
                document.querySelector(".chat > .messagesContainer").scrollTo(0,document.querySelector(".chat > .messagesContainer").scrollHeight);
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
                        console.log(log);
                        if (log.status==true) {
                            // group info insertion
                            data=log.data;
                            document.querySelector(".main-content-header").innerHTML=data[0][0].groupName;
                            var year=new Date(data[0][0].dateOfBirth);
                            document.querySelector(".styledHead .styledHeadPP img").src="https://e.diskloud.fr/Dilab/group/"+data[0][0].groupPicture;
                            document.querySelector(".registrationDate").innerHTML=year.getFullYear();
                            document.querySelector(".groupGenres").innerHTML=data[0][0].genres;
                            document.querySelector(".groupBio").innerHTML=data[0][0].description;
                            document.querySelector(".nReleases").innerHTML=data[3][0].nb_releases;
                            document.querySelector(".nProjects").innerHTML=data[2][0].nb_projets_actifs;
                            document.querySelector(".nGroupStreams").innerHTML=data[4][0].nb_streams_tot;
                            document.querySelector(".groupJoinDate").innerHTML=year.getDate()+'/'+String(year.getMonth()+1)+'/'+year.getFullYear();
                            // group main releases
                            document.querySelector(".releases").innerHTML="";
                            for (var i=0;i<data[1].length;i++) {
                                console.log(data[1][i].duration);
                                var duree=timestampToNormalTime(data[1][i].duration);
                                document.querySelector(".releases").innerHTML+=newReleaseElement(data[1][i].name,data[0][0].groupName,new Date(data[1][i].releaseDate).getFullYear(),data[1][i].nb_streams+" streams",duree,data[1][i].releasePicture);
                            }
                            if (data[1].length==0) {
                                document.querySelector(".releases").innerHTML=`<div class="noRelease">The group has not uploaded any release yet</div>`
                            }
                        } else {
                            document.querySelector(".main-content").innerHTML="";
                            Swal.fire("Error",log.data,"error");
                        }
                    });
                } /*else {
                    window.location.href="https://e.diskloud.fr/Dilab";
                    location="https://e.diskloud.fr/Dilab";
                }*/
            });
            break;
        case "/artist" :
            loadTemplate("artist",()=>{
                document.querySelector(".chat > .messagesContainer").scrollTo(0,document.querySelector(".chat > .messagesContainer").scrollHeight)
            });
            break;
        case "/release" :
            loadTemplate("release",()=>{});
            break;
        case "/project" :
            loadTemplate("project",()=>{});
            break;
        case "/releases" :
            loadTemplate("releases",()=>{
                document.querySelector(".opt").style.fontWeight="bold";
                document.querySelector(".projectLink").addEventListener("click",()=>{loadPage("Projects","projects",[])});
            });
            break;
        case "/projects" :
            loadTemplate("projects",()=>{
                document.querySelectorAll(".opt")[1].style.fontWeight="bold";
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

                            elem.querySelector("input[name=pGenre]").addEventListener("focusout",e=> {
                                document.querySelector(".genreIsTooLong").style.display="none";
                                elem.querySelector("input[name=pGenre]").style.outline="4px solid lightgreen";
                                elem.querySelector("input[name=pGenre]").style.opacity="1";
                                if (elem.querySelector("input[name=pGenre]").value) {
                                    if (elem.querySelector("input[name=pGenre]").value.length>=64) {
                                        elem.querySelector("input[name=pGenre]").style.outline="4px solid red";
                                        elem.querySelector("input[name=pGenre]").style.opacity="";
                                        document.querySelector(".genreIsTooLong").style.display="block";
                                    }
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
                                } else if (this.files[0].type.slice(0,this.files[0].type.indexOf('/'))!="audio") {
                                    Swal.fire("Error","Invalid file type<br />Must be an audio","error");
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
                                elem.querySelector(".confirm").textContent="Please wait";
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
                                                if (elem.querySelector("input[name=pGenre]").value.length>=64) {
                                                    Swal.fire("Not so fast..",`We know genres are complicated to choose, but it's too long here`,"error");
                                                    elem.querySelector(".confirm").textContent="Create project";
                                                    elem.querySelector(".confirm").disabled=false;
                                                    elem.querySelector(".confirm").style.opacity="";
                                                    elem.querySelector(".confirm").style.pointerEvents="";
                                                    return;
                                                }
                                                if (elem.querySelector("textarea[name=pDescription]").value.length>=500) {
                                                    Swal.fire("Not so fast..",`Wow, don't spoil us the whole story about the project, it's too long !`,"error");
                                                    elem.querySelector(".confirm").textContent="Create project";
                                                    elem.querySelector(".confirm").disabled=false;
                                                    elem.querySelector(".confirm").style.opacity="";
                                                    elem.querySelector(".confirm").style.pointerEvents="";
                                                    return;
                                                }
                                                // Here we (will) create a FormData object containing the user's input and send it to the server
                                                var data=new FormData();
                                                data.append("projectName", elem.querySelector("input[name=pName]").value);
                                                data.append("projectGenre", elem.querySelector("input[name=pGenre]").value);
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

                            elem.querySelector(".profilePicture").addEventListener("click",e=> {
                                uploadField.click();
                            });

                            document.querySelector(".createGroupBtn").addEventListener('click',()=> {
                                var data=new FormData();
                                data.append("groupName",document.querySelector(".fieldStyle input[name=grpName]").value);
                                data.append("groupOrientation",document.querySelector("input[name=grpOrientation]").value);
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
        case "/search" :
            query=urlParams.get("q")
            if (query!=null && query!="") {
                loadTemplate("search",()=>{
                    searchField.value=query;
                    document.querySelector(".main-content-header").innerHTML+=' "'+query.replace(/ /g,"&nbsp;")+'"';
                    window.onresize= (e)=> {
                        var elements = document.querySelectorAll(".search-results .release .streams");
                        if (document.querySelector(".search-results .release").offsetWidth < 600) {
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
            }
        case "/settings" :
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
            }
        default :
            window.location.href="https://e.diskloud.fr/Dilab";
            location="https://e.diskloud.fr/Dilab";
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
                Swal.fire("Error","Apparently, you are not connected (and it threw and error) :(","error");
                return;
            }
          }); 
    });
}

function loadPage(title,url,params=[]) {
    url = 'https://e.diskloud.fr/Dilab/'+url;
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
    if (templateLoadTimeout!=null) {
        clearTimeout(templateLoadTimeout); // ensures that timeout hiding progress bar does not trigger after if calling this function too quickly
    }
    loadBar.style.display="block";
    loadBar.style.width="5%";
    xhr= new XMLHttpRequest;
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
    if (searchField.value.trim()!="")
        loadPage("Search results","search",[["q",searchField.value]]);
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
document.querySelector(".bi-search").addEventListener("click",()=>{searchLoad()});
searchField.addEventListener("keypress",function(e) {
    if (e.key=="Enter") {
        searchLoad();
    }
})
document.querySelector(".title").addEventListener("mouseover",()=>{
    if (!logoAnimation.isActive())
        logoAnimation.play(0);
});

if (document.querySelector(".loginButton")) {
    pathAnalysis();
    document.querySelector(".loginButton").addEventListener("click",()=> {
        var path=window.location.href.toLowerCase().replace("https://e.diskloud.fr/dilab","");
        if (path[0]=="/") {
            path=path.slice(1,path.length);
        }
        redirect("https://e.diskloud.fr/Dilab/login?redirect="+encodeURI(path));
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


//PopUp Window handler
document.querySelector(".popUpWindow").addEventListener('click', e => {
    e.stopPropagation();
});
document.querySelector(".popUpWindowContainer").addEventListener('click',e => {
    document.querySelector(".popUpWindowContainer").style.display="";
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
})

//Music Progress Control
document.querySelector(".progressBarContainer").addEventListener('click', e => {
        //var progress=e.target;
    var progress=document.querySelector(".progressBarContainer").querySelector(".progressBar")
    /*while (document.querySelector(".progressBar")!=progress && progress!=document.body) {
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
            let bounds = clickedElement.getBoundingClientRect();
            var x;
            if (((e.clientX - bounds.left)/clickedElement.offsetWidth)*100>100) {
                x=100;
            } else if (((e.clientX - bounds.left)/clickedElement.offsetWidth)*100<0) {
                x=0;
            } else {
                x = ((e.clientX - bounds.left)/clickedElement.offsetWidth)*100;
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
    element=document.querySelectorAll(selector)[i];
    step-=1;
    var percentProg=step/(element.querySelectorAll(".step").length-1)*100
    if (percentProg>100) {
        percentProg=100;
    }
    element.parentNode.querySelector(".percent").style.width=percentProg+"%"
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

// Element templates

function newReleaseElement(title,group,releaseDate,streams,duration,imagePath) {
    return `
    <div class=release>
        <div class=left-content>
            <div class=control>
                <i class="bi bi-play-circle-fill"></i>
            </div>
            <div class=cover>
                <img src="https://e.diskloud.fr/Dilab/release/${imagePath}" />
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

function newGroupElement(title="",genre="",description="",foundDate="",nCollaborators="",nProjects="",nReleases="",imagePath="people.svg") {
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
                        <i class="bi bi-dot"></i>
                        <div class="genre">
                            ${genre}
                        </div>
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
