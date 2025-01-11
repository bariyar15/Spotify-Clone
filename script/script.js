let currentSong = new Audio()
let songs
let currFolder
// console.log("hello");

function secondsToMinutesSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');

  return `${formattedMinutes}:${formattedSeconds}`;
}



async function getSongs(folder) {
  currFolder = folder
  let a = await fetch(`/${folder}/`);
  let response = await a.text();
  // console.log(response);
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      // console.log(element.href.split(`http://127.0.0.1:5500/${folder}/`)[1])

      songs.push(element.href.split(`/${folder}/`)[1]);
    }
  }


  let songUL = document
    .querySelector(".songList")
    .getElementsByTagName("ul")[0];
  songUL.innerHTML = ""
  for (const song of songs) {
    songUL.innerHTML =
      songUL.innerHTML +
      `<li>
     <img class="invert" src="images/music.svg" alt="">
                            <div class="info">
                                <div>${song.replace(/%20/g, " ")}</div>
                                <div>Priyanshu Bariyar</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img height="25px" class="invert" src="images/playseek.svg" alt="">
                            </div>
                        
    </li>`;
  }
  //event listener to each song
  Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
    e.addEventListener("click", element => {

      console.log(e.querySelector(".info").firstElementChild.innerHTML.trim());
      playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());

    })
  })
  return songs


}
const playMusic = (track, pause = false) => {
  // let audio=new Audio("/Song/"+track)
  currentSong.src = `/${currFolder}/` + track
  if (!pause) {
    currentSong.play()
    play.src = "images/pause.svg"
  }

  document.querySelector(".songinfo").innerHTML = decodeURI(track)
  document.querySelector(".songtime").innerHTML = "00:00/00:00"


}
async function displayAlbums() {
  let a = await fetch(`/Song`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  // console.log(div);
  let anch = div.getElementsByTagName("a")
  let cardContainer=document.querySelector(".cardContainer")
  let array=Array.from(anch)
  for (let index = 0; index < array.length; index++) {
    const e = array[index];
    
    if (e.href.includes("/Song/")) {
      let folder = (e.href.split("/").slice(-1)[0]);
      
      
      //getting meta data
      let a = await fetch(`/Song/${folder}/info.json`);
      let response = await a.json();
      // console.log(response);
      cardContainer.innerHTML=cardContainer.innerHTML + `<div data-folder="${folder}" class="card">
              <div class="play">
                <img src="images/play.svg" alt="play" />
              </div>
              <img  src="/Song/${folder}/cover.jpg" alt="image" />
              <h2>${response.title}</h2>
              <p>${response.description}</p>
            </div>`

    }
  }


  //  console.log(anch);
  Array.from(document.getElementsByClassName("card")).forEach(e => {
    e.addEventListener("click", async item => {
      songs = await getSongs(`Song/${item.currentTarget.dataset.folder}`)
      playMusic(songs[0])

    })
  })
  }






async function main() {

  //getting the list

  await getSongs("Song/ncs");
  displayAlbums()
  playMusic(songs[0].replaceAll("%20", " ").trim(), true)  // console.log(songs); 
  //displaying albums on the page




  //event listener to play 
  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play()
      play.src = "images/pause.svg"
    }
    else {
      currentSong.pause()
      play.src = "images/play.svg"
    }
  })
  //listening for time update
  currentSong.addEventListener("timeupdate", () => {
    // console.log(currentSong.currentTime, currentSong.duration);
    document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)}/${secondsToMinutesSeconds(currentSong.duration)}`
    document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%"

  })
  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width)
    document.querySelector(".circle").style.left = (e.offsetX / e.target.getBoundingClientRect().width) * 100 + "%";
    currentSong.currentTime = currentSong.duration * percent

  })
  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-120%"
})
  // Add an event listener for hamburger
  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0"
})
  prev.addEventListener("click", e => {
    console.log("previous clicked");
    // console.log();
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
    console.log(songs, currentSong, index);

    if (index - 1 >= 0) {
      playMusic(songs[index - 1])
    }



  })
  next.addEventListener("click", e => {
    // console.log("next clicked");
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
    // console.log(songs, currentSong, index);
    if (index + 1 < songs.length) {
      playMusic(songs[index + 1])
    }

  })

  document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", e => {
    currentSong.volume = parseInt((e.target.value)) / 100

  })
  document.querySelector(".volume>img").addEventListener("click", (e)=>{
    // console.log(e.target);
    if(e.target.src.includes("volume.svg")){
      e.target.src="images/mute.svg"
      currentSong.volume=0;
      document.querySelector(".range").getElementsByTagName("input")[0].value=0
    }
    else{
      currentSong.volume=0.1
      e.target.src="images/volume.svg"
      document.querySelector(".range").getElementsByTagName("input")[0].value=10

    }
  })
  


}
main();
