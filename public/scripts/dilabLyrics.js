/*var lyrics=`Your eyes are dim
I need the real love
Won't make you drip
In two, alone in the, oh
And what got me high has left me so low, so low
You gave your space
And in your loving
I drink the song
I drink the world in
And what got me high has left me so low, so low
      
You can't kill the fire while it's burning (Kill the fire while it's burning)
You can't kill the light in the dark (Kill the light in the dark)
You can't kill the fire while it's burning (Kill the fire while it's burning)
You can't kill the light in the dark, in the dark

In the dark
You can't kill the light in the dark, in the dark

As you fade out
Our sunsets dying
So tell me who
And what you're fighting
What got me high has left me so low, so low
Those sleepless nights
Unaccounted trials
You lock me out in your denial
What got me high has left me so low, so low

You can't kill the fire while it's burning (Kill the fire while it's burning)
You can't kill the light in the dark (Kill the light in the dark)
You can't kill the fire while it's burning (Kill the fire while it's burning)
You can't kill the light in the dark, in the dark
You can't kill the fire while it's burning
You can't kill the light in the dark
You can't kill the fire while it's burning
Burning, burning, burning, burning
Burning, burning, burning, burning
Burning, burning, burning, burning
In the dark

You can't kill the fire while it's burning
You can't kill the light in the dark, in the dark
You can't kill the fire while it's burning
You can't kill the light in the dark, in the dark
In the dark
You can't kill the light in the dark, in the dark`*/

//Je stocke les valeurs de l'utilisateur (c'est doit pas être très propre :))
/*
// C'est très bien, vraiment ! Dans la pratique on manipule le DOM exactement comme ça !
// Maintenant comme ces infos sont déjà connues par le serveur et le client, ce n'est pas la peine de les rerenseigner ;)
document.getElementById("songButton").onclick = function () {
  let title = document.getElementById("songText").value;
  document.querySelector(".soundName").innerText=title
}

document.getElementById("authorButton").onclick = function () {
  let author = document.getElementById("authorText").value;
  document.querySelector(".soundAuthor").innerText=author
}
*/

// Objet permettant de jouer une musique chargée à partir d'un lien
if (localStorage.getItem("lyricsSyncOutput")!=null && localStorage.getItem("lyricsSyncOutput")!="") {
  Swal.fire({
    icon : "info",
    text : "You have already synchronised the lyrics. You can do it again, but it is not mandatory.",
    allowOutsideClick : false,
    showCancelButton : false,
    confirmButtonText : "Re-Synchronise lyrics anyway"
  })
}
let data=JSON.parse(localStorage.getItem("lyricsSyncInput"));
if (data==null || data=="") {
  Swal.fire({
    title : "Error",
    text : "We are missing some information about your project. Maybe you aren't supposed to be here...",
    icon : "error",
    showConfirmButton : false,
    allowOutsideClick : false
  });
}
let lyrics=data.lyrics;
let splitLyrics = lyrics.split(/\\n/)
for (var i = 0; i < splitLyrics.length; i++){
  if (splitLyrics[i].trim()==''){
    splitLyrics.splice(i,1)
  } 
}
splitLyricsFinal = lyrics.split(/\\n/)
for (var i = 0; i < splitLyricsFinal.length; i++){
  if (splitLyricsFinal[i].trim()==''){
    splitLyricsFinal.splice(i,1)
  } 
}
splitLyricsFinal.unshift("Music playing")
splitLyrics.push('')
splitLyrics.push('')


var audio = new Audio(`/Dilab/project/${decodeURI(data.author)}/${decodeURI(data.name)}/${data.audioLink}`); // Avec cet objet, toutes les infos et fonctions sont données pour pouvoir obtenir le temps de la musique et la contrôler. Faut se renseigner sur internet (c'est surtout ça programmer sur le web : consulter les docs et les forums en ligne)
var bouton = document.querySelector(".fullScreen .boutonSynchronisateur");
document.querySelector(".soundName").innerText=data.name;
document.querySelector(".soundAuthor").innerText=data.author

function updateLyrics(content) {
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
  },50);
}

var time = []
var finalList = []
var stringFinal = []

count = 0
bouton.addEventListener("click",()=>{
  if (audio.play == true) {
    // Do nothing
  } else {
    audio.play();
    bouton.value="Next line";
  }
  if (count<=splitLyricsFinal.length-1){
    updateLyrics(splitLyrics[count])
    time.push("["+audio.currentTime+"]")
    finalList.push("["+audio.currentTime+"]")
    finalList.push(splitLyricsFinal[count])
    count = count + 1
    //console.log(finalList)
    if (count==splitLyricsFinal.length){
      Swal.fire({
        title : "Success",
        text : "Lyrics stored",
        icon :"success",
        allowOutsideClick : false,
        showCancelButton : false,
        showConfirmButton : false
      });
      for (var i = 0; i < finalList.length; i++){
        stringFinal += finalList[i];
        if (i<finalList.length-1 && i%2==1)
          stringFinal+='\n';
      }
      audio.pause();
      localStorage.setItem("lyricsSyncOutput",stringFinal);
      console.log(localStorage.getItem("lyricsSyncOutput"));
      console.log(stringFinal);
    }
  }
});

