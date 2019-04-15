const AudioContext = window.AudioContext || window.webkitAudioContext;

class AudioVisualizer {
    constructor(audio, canvas, style = {}) {
        this.audioElement = document.querySelector(audio);
        this.audioContext = new AudioContext();
        this.analyser = this.audioContext.createAnalyser();
        this.track = this.audioContext.createMediaElementSource(this.audioElement);
        this.track.connect(this.analyser)
        this.track.connect(this.audioContext.destination);
        this.analyser.fftSize = 2048;
        this.bufferLength = this.analyser.frequencyBinCount;
        this.dataArray = new Uint8Array(this.bufferLength);
        this.analyser.getByteTimeDomainData(this.dataArray);
        this.canvas = document.querySelector(canvas);
        this.ctx = this.canvas.getContext('2d');
        this.style = {};
        this.style.back = style.back || 'rgb(200, 200, 200)';
        this.style.line = style.line || 'rgb(0, 0, 0)';
        this.style.progress = style.progress || 'rgba(255, 255, 255, 0.2)'
        this.style.lineWidth = parseInt(style.lineWidth) || 2;
        this.clicked = false;

        this.canvas.addEventListener("mousemove", e=>this.mousemoveHandler(e));
        this.canvas.addEventListener("touchmove", e=>this.touchmoveHandler(e));

        this.touchmoveHandler = e=>{
            let x = e.touches[0].clientX - this.canvas.offsetLeft;
            this.audioElement.currentTime = Math.floor(this.audioElement.duration * (x / this.canvas.clientWidth));
        }

        this.mousemoveHandler = function (e) {
            e.preventDefault();
            let x = e.clientX - this.canvas.offsetLeft;
            if (this.clicked) this.audioElement.currentTime = Math.floor(this.audioElement.duration * (x / this.canvas.clientWidth));
        }

        this.clickHandler = (clicked, e)=>{
            this.clicked = clicked;
            this.mousemoveHandler(e);
        }

        this.canvas.addEventListener("mousedown", e=>this.clickHandler(true, e))

        this.canvas.addEventListener("mouseup", e=>this.clickHandler(false, e));

        this.canvas.addEventListener("mouseleave", e=>this.clickHandler(false, e));

        this.init();
    }

    init () {
        this.ctx.fillStyle = this.style.back;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.strokeStyle = this.style.line;
        this.ctx.lineWidth = this.style.lineWidth;
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.canvas.height / 2);
        this.ctx.lineTo(this.canvas.width, this.canvas.height / 2);
        this.ctx.stroke();
    }

    pause () {
        this.audioElement.pause();
    }

    draw () {
        requestAnimationFrame((...params)=>this.draw(...params));
        this.analyser.getByteTimeDomainData(this.dataArray);
        this.ctx.fillStyle = this.style.back;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = this.style.progress;
        this.ctx.fillRect(0, 0, Math.floor(this.canvas.width *(this.audioElement.currentTime / this.audioElement.duration)), this.canvas.height);
        this.ctx.strokeStyle = this.style.line;
        this.ctx.lineWidth = this.style.lineWidth;
        this.ctx.beginPath();
        var sliceWidth = this.canvas.width * 1.0 / this.bufferLength;
        var x = 0;
        for(var i = 0; i < this.bufferLength; i++) {
            var v = this.dataArray[i] / 128.0;
            var y = v * this.canvas.height/2;

            if(i === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }

            x += sliceWidth;
        }

        this.ctx.lineTo(this.canvas.width, this.canvas.height/2);
        this.ctx.stroke();
    }

    play() {
        this.audioElement.play();
        this.draw();
    }
}