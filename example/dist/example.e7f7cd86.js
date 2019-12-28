parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"S3PC":[function(require,module,exports) {
function t(t,i){if(!(t instanceof i))throw new TypeError("Cannot call a class as a function")}function i(t,i){for(var e=0;e<i.length;e++){var s=i[e];s.enumerable=s.enumerable||!1,s.configurable=!0,"value"in s&&(s.writable=!0),Object.defineProperty(t,s.key,s)}}function e(t,e,s){return e&&i(t.prototype,e),s&&i(t,s),t}var s=window.AudioContext||window.webkitAudioContext,n=function(){function i(e,n){var a=this,h=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{};t(this,i),this.audioElement=e;try{this.audioContext=new s,this.analyser=this.audioContext.createAnalyser(),this.track=this.audioContext.createMediaElementSource(this.audioElement),this.track.connect(this.analyser),this.track.connect(this.audioContext.destination),this.analyser.fftSize=2048,this.bufferLength=this.analyser.frequencyBinCount,this.dataArray=new Uint8Array(this.bufferLength),this.analyser.getByteTimeDomainData(this.dataArray)}catch(c){console.error(c),console.warn("Outdated browser, cannot visualize! Using random generator"),this.audioContext={},this.audioContext.resume=function(){return new Promise(function(t){return t()})},this.sineWaveOffset=0}this.canvas=n,this.ctx=this.canvas.getContext("2d"),this.style={},this.style.back=h.back||"rgb(200, 200, 200)",this.style.line=h.line||"rgb(0, 0, 0)",this.style.progress=h.progress||"rgba(255, 255, 255, 0.2)",this.style.lineWidth=parseInt(h.lineWidth)||2,this.clicked=!1,this.canvas.addEventListener("mousemove",function(t){return a.mousemoveHandler(t)}),this.canvas.addEventListener("touchmove",function(t){return a.touchmoveHandler(t)}),this.touchmoveHandler=function(t){var i=t.touches[0].clientX-a.canvas.offsetLeft;a.audioElement.currentTime=Math.floor(a.audioElement.duration*(i/a.canvas.clientWidth))},this.mousemoveHandler=function(t){t.preventDefault();var i=t.clientX-this.canvas.offsetLeft;this.clicked&&(this.audioElement.currentTime=Math.floor(this.audioElement.duration*(i/this.canvas.clientWidth)))},this.clickHandler=function(t,i){a.clicked=t,a.mousemoveHandler(i)},this.canvas.addEventListener("mousedown",function(t){return a.clickHandler(!0,t)}),this.canvas.addEventListener("mouseup",function(t){return a.clickHandler(!1,t)}),this.canvas.addEventListener("mouseleave",function(t){return a.clickHandler(!1,t)}),this.init()}return e(i,[{key:"init",value:function(){this.ctx.fillStyle=this.style.back,this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height),this.ctx.strokeStyle=this.style.line,this.ctx.lineWidth=this.style.lineWidth,this.ctx.beginPath(),this.ctx.moveTo(0,this.canvas.height/2),this.ctx.lineTo(this.canvas.width,this.canvas.height/2),this.ctx.stroke()}},{key:"pause",value:function(){return this.audioElement.pause()}},{key:"draw",value:function(){var t=this;if(window.requestAnimationFrame(function(){return t.draw.apply(t,arguments)}),this.analyser){this.analyser.getByteTimeDomainData(this.dataArray),this.ctx.fillStyle=this.style.back,this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height),this.ctx.fillStyle=this.style.progress,this.ctx.fillRect(0,0,Math.floor(this.canvas.width*(this.audioElement.currentTime/this.audioElement.duration)),this.canvas.height),this.ctx.strokeStyle=this.style.line,this.ctx.lineWidth=this.style.lineWidth,this.ctx.beginPath();for(var i=1*this.canvas.width/this.bufferLength,e=0,s=0;s<this.bufferLength;s++){var n=this.dataArray[s]/128*this.canvas.height/2;0===s?this.ctx.moveTo(e,n):this.ctx.lineTo(e,n),e+=i}this.ctx.lineTo(this.canvas.width,this.canvas.height/2),this.ctx.stroke()}else if(this.audioElement.paused)this.ctx.fillStyle=this.style.back,this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height),this.ctx.strokeStyle=this.style.line,this.ctx.lineWidth=this.style.lineWidth,this.ctx.beginPath(),this.ctx.moveTo(0,this.canvas.height/2),this.ctx.lineTo(this.canvas.width,this.canvas.height/2),this.ctx.stroke();else{this.sineWaveOffset--,this.ctx.fillStyle=this.style.back,this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height),this.ctx.fillStyle=this.style.progress,this.ctx.fillRect(0,0,Math.floor(this.canvas.width*(this.audioElement.currentTime/this.audioElement.duration)),this.canvas.height),this.ctx.strokeStyle=this.style.line,this.ctx.lineWidth=this.style.lineWidth,this.ctx.beginPath(),this.ctx.moveTo(0,this.canvas.height/2);for(var a=Math.floor(Math.random()*Math.random()*(this.canvas.height/2)),h=10+Math.floor(20*Math.random()),c=0;c<this.canvas.width;c++)this.ctx.lineTo(c*h,Math.sin((Math.floor(this.sineWaveOffset/Math.floor(2*Math.random()))+c)*(180/Math.PI))*(this.canvas.height/2-this.canvas.height/8-a)+this.canvas.height/2);this.ctx.stroke()}}},{key:"play",value:function(){return this.audioElement.play()}}]),i}();module.exports=n;
},{}],"Focm":[function(require,module,exports) {
var e=require("../index.js"),n=document.querySelector("canvas");n.width=window.screen.width;var t=new e(document.querySelector("audio"),n,{back:"#1c2541",line:"#f56476",progress:"rgba(211, 76, 85, 0.2)"}),o=document.querySelector("button");o.onclick=function(){t.audioContext.resume().then(function(){t.play(),t.draw()})},t.audioElement.addEventListener("play",function(){o.onclick=function(){return t.pause()},o.textContent="Pause"}),t.audioElement.addEventListener("pause",function(){o.onclick=function(){return t.play()},o.textContent="Play"});
},{"../index.js":"S3PC"}]},{},["Focm"], null)
//# sourceMappingURL=/example.e7f7cd86.js.map