const tracklist = [];
for (let i = 1; i <= 12; i++) {
  const track = {
    title: `Track ${i}`,
    duration: `${Math.floor(Math.random() * 4) + 1}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
    file: `../music/Track${i}.mp3`,
    style: "Melodic House/Techno",
  };
  tracklist.push(track);
}

let currentTrackIndex = 0;
let rotation = 0;

const vinyle = document.getElementById("vinyle-img");
const audio = document.getElementById("audio");
const trackTitle = document.getElementById("track-title");
const trackTime = document.getElementById("track-time");
const trackStyle = document.getElementById("track-style");

vinyle.addEventListener("click", () => {
  // Rotate the vinyl
  rotation += 30;
  vinyle.style.transform = `rotate(${rotation}deg) translate(-45%, 0)`;

  // Update track
  currentTrackIndex = (currentTrackIndex + 1) % tracklist.length;
  const track = tracklist[currentTrackIndex];
  trackTitle.textContent = `${currentTrackIndex + 1} - ${track.title}`;
  trackTime.textContent = `Time : ${track.duration}`;
  trackStyle.textContent = track.style;

  // Change audio source and play
  audio.src = track.file;
  audio.play();
});
