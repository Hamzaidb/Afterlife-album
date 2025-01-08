const tracksName = [
    "Ethereal",
    "Timeless Echoes",
    "Celestial Void",
    "Resonance",
    "Astral Bloom",
    "Obsidian",
    "Transient Waves",
    "Aurora",
    "Infinite",
    "Phantom Realm",
    "Eclipse Reverie",
    "Our End",
    "Serenity"
];


const tracklist = [];
for (let i = 1; i <= 12; i++) {
    const track = {
        title: tracksName[i],
        duration: `${Math.floor(Math.random() * 4) + 1}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
        file: `../music/Eternity.mp3`,
        style: "Melodic House/Techno",
    };
    tracklist.push(track);
}

let currentTrackIndex = 0;
let rotation = 0;

const vinyle = document.getElementById("vinyle-img");
const audiotrack = document.getElementById("audio");
const trackTitle = document.getElementById("track-title");
const trackTime = document.getElementById("track-time");
const trackStyle = document.getElementById("track-style");

let isDragging = false;
let startY;

vinyle.addEventListener('mousedown', (e) => {
    isDragging = true;
    startY = e.clientY;
});

document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;

    const deltaY = e.clientY - startY;

    if (deltaY > 50) {
        nextTrack();
        isDragging = false;
    } else if (deltaY < -50) {
        previousTrack();
        isDragging = false;
    }
});

document.addEventListener('mouseup', () => {
    isDragging = false;
});

function nextTrack() {
    changeTrack("next")
}

function previousTrack() {
    changeTrack("previous")
}

function changeTrack(direction) {
    direction === "next" ? rotation += 30 : rotation -= 30;
    vinyle.style.transform = `translate(-45%, 0) rotate(${rotation}deg)`;

    if (direction === "next") {
        currentTrackIndex = (currentTrackIndex + 1) % tracklist.length;
    } else {
        currentTrackIndex = (currentTrackIndex - 1 + tracklist.length) % tracklist.length;
    }

    updateTrack(currentTrackIndex);
    stopTrack();
}

function updateTrack(currentTrackIndex) {
    const track = tracklist[currentTrackIndex];
    trackTitle.textContent = `${currentTrackIndex + 1} - ${track.title}`;
    trackTime.textContent = `Time : ${track.duration}`;
    trackStyle.textContent = track.style;

    audiotrack.src = track.file;
}

function stopTrack() {
    playBtn.classList.remove('pause');
    bars.forEach(bar => bar.style.animationPlayState = 'paused');
    isPlaying = false;
}

updateTrack(0)