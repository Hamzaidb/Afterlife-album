const playBtn = document.querySelector('.play-btn');
const audio = document.getElementById('audio');
const timer = document.querySelector('.timer');
const bars = document.querySelectorAll('.bar');

let isPlaying = false;

bars.forEach(bar => bar.style.animationPlayState = 'running');
bars.forEach(bar => {
    setTimeout(() => {
        bar.style.animationPlayState = 'paused';
    }, 500);
});

playBtn.addEventListener('click', () => {
    if (isPlaying) {
        audio.pause();
        playBtn.classList.remove('pause');
        bars.forEach(bar => bar.style.animationPlayState = 'paused');
    } else {
        audio.play();
        playBtn.classList.add('pause');
        bars.forEach(bar => bar.style.animationPlayState = 'running');
    }
    isPlaying = !isPlaying;
});

audio.addEventListener('timeupdate', () => {
    const minutes = Math.floor(audio.currentTime / 60);
    const seconds = Math.floor(audio.currentTime % 60).toString().padStart(2, '0');
    timer.textContent = `${minutes}:${seconds}`;
});

audio.addEventListener('ended', () => {
    isPlaying = false;
    playBtn.classList.remove('pause');
    bars.forEach(bar => bar.style.animationPlayState = 'paused');
    timer.textContent = '0:00';
});