const AudioVisualizer = require('../index.js');

const canvas = document.querySelector('canvas');
canvas.width = window.screen.width

const audiovisualizer = new AudioVisualizer(document.querySelector('audio'), canvas, { back: '#1c2541', line: '#f56476', progress: 'rgba(211, 76, 85, 0.2)' });

const btn = document.querySelector('button');
btn.onclick = () => { audiovisualizer.audioContext.resume().then(() => { audiovisualizer.play(); audiovisualizer.draw(); }) }

audiovisualizer.audioElement.addEventListener("play", () => {
    btn.onclick = () => audiovisualizer.pause();
    btn.textContent = 'Pause'
});

audiovisualizer.audioElement.addEventListener("pause", () => {
    btn.onclick = () => audiovisualizer.play();
    btn.textContent = 'Play'
});