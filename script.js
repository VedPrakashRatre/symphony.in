let song = [];
let i = 0;
let currentsong = new Audio();
let songul = document.querySelector(".songnames");
currentsong.volume = 0.7;
document.querySelector(".circlel").style.left = "65px";
document.querySelector(".volup").style.background =
    `linear-gradient(to right, #eea51d 75px, #252525 75px )`;

let currfolder;
let cardcontain = document.querySelector(".cardcontain")

async function main(folder) {
    currfolder = folder;
    let res = await fetch(`/api/${folder}`);
    if (!res.ok) return [];
    let data = await res.json();
    if (!data || !data.files) return [];

    song = [];
    for (let file of data.files) {
        if (file.endsWith(".mp3")) {
            song.push(file);
        }
    }
    return song;
}

const playmusic = (m, pause = false) => {
    currentsong.src = `/${currfolder}/` + m;
    if (!pause) {
        currentsong.play();
        play.src = "pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURIComponent(m);
    document.querySelector(".playtime").innerHTML = "00:00"
}

async function displayfolder() {
    let res = await fetch(`/api/musics`);
    if (!res.ok) return;
    let data = await res.json();
    if (!data || !data.files) return;

    let folders = data.files.filter(f => !f.endsWith(".mp3"));

    for (let folder of folders) {
        let res = await fetch(`/musics/${folder}/info.json`);
        let text = await res.json();
        cardcontain.innerHTML += `<div data-folder="${folder}" class="cards rounded">
            <div class="img">
                <div class="plybutton"><img src="playbutton.svg" alt="playbutton"></div>
                <img src="/musics/${folder}/cover.jpg" alt="1">
            </div>
            <h3>${text.title}</h3>
            <p>${text.description}</p>
        </div>`
    }

    Array.from(document.getElementsByClassName("cards")).forEach(e => {
        e.addEventListener("click", async item => {
            song = [];
            let folderName = item.currentTarget.dataset.folder;
            let songs = await main(`musics/${folderName}`);
            songul.innerHTML = "";

            for (const sung of songs) {
                songul.innerHTML += `<li>
                    <img class="invert" src="music.svg" width="40px" alt="">
                    <div class="info">
                        <div>${sung}</div>
                    </div>
                    <div>Unknown</div>
                    <div class="playnow">
                        <div>play now</div>
                        <div class="playnowimg"><img class="invert" src="musicplayer.svg" alt=""></div>
                    </div>
                </li>`;
            }

            if (songs.length > 0) playmusic(songs[0]);

            Array.from(document.querySelector(".songnames").getElementsByTagName("li")).forEach(e => {
                e.addEventListener("click", () => {
                    playmusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
                })
            });
        })
    })
}

function formatTime(time) {
    if (isNaN(time)) return "0:00"
    const totalSeconds = Math.floor(time);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

async function playsong() {
    let songs = await main("musics");
    playmusic(songs[0], true);

    displayfolder();

    for (const sung of songs) {
        songul.innerHTML += `<li>
            <img class="invert" src="music.svg" width="40px" alt="">
            <div class="info">
                <div>${sung}</div>
            </div>
            <div>Unknown</div>
            <div class="playnow">
                <div>play now</div>
                <div class="playnowimg"><img class="invert" src="musicplayer.svg" alt=""></div>
            </div>
        </li>`;
    }

    Array.from(document.querySelector(".songnames").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", () => {
            playmusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    });

    play.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play();
            play.src = "pause.svg"
        } else {
            currentsong.pause();
            play.src = "musicplayer.svg"
        }
    })

    currentsong.addEventListener("timeupdate", () => {
        document.querySelector(".playtime").innerHTML = `${formatTime(currentsong.currentTime)}/${formatTime(currentsong.duration)}`
        document.querySelector(".circle").style.left = ((currentsong.currentTime) / (currentsong.duration)) * 100 + "%"
        let g = ((currentsong.currentTime) / (currentsong.duration)) * 100
        document.querySelector(".seekbar").style.background =
            `linear-gradient(to right, red ${g}%, #252525 ${g}%)`;
    })

    document.querySelector(".seekbar").addEventListener("click", e => {
        let f = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = f + "%";
        document.querySelector(".seekbar").style.background =
            `linear-gradient(to right, red ${f}%, #252525 ${f}%)`;
        currentsong.currentTime = (currentsong.duration) * f / 100;
    })

    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })

    document.querySelector(".cross").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-1000%"
    })

    previous.addEventListener("click", () => {
        let currentFile = decodeURIComponent(currentsong.src.split("/").pop());
        let index = song.indexOf(currentFile);
        if (index > 0) playmusic(song[index - 1]);
    })

    next.addEventListener("click", () => {
        let currentFile = decodeURIComponent(currentsong.src.split("/").pop());
        let index = song.indexOf(currentFile);
        if (index < song.length - 1) playmusic(song[index + 1]);
    })

    document.querySelector(".volup").addEventListener("click", e => {
        let f = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circlel").style.left = f - 5 + "px";
        document.querySelector(".volup").style.background =
            `linear-gradient(to right, #eea51d ${f}%, #252525 ${f}%)`;
        currentsong.volume = parseInt(f) / 100;
    })

    currentsong.addEventListener("ended", () => {
        let currentFile = decodeURIComponent(currentsong.src.split("/").pop());
        let index = song.indexOf(currentFile);
        if (index < song.length - 1) {
            playmusic(song[index + 1]);
        } else {
            play.src = "musicplayer.svg";
        }
    })
}

playsong();
