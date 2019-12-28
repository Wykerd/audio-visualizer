// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"../index.js":[function(require,module,exports) {
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var AudioContext = window.AudioContext || window.webkitAudioContext;

var AudioVisualizer =
/*#__PURE__*/
function () {
  /**
   * Create the AudioVisualizer object
   * @param {HTMLAudioElement} audio Audio element
   * @param {HTMLCanvasElement} canvas Canvas to use to draw the visualizeation
   * @param {*} style Override the default styles.
   * @example
   * new AudioVisualizer(document.querySelector('audio'), document.querySelector('canvas'));
   */
  function AudioVisualizer(audio, canvas) {
    var _this = this;

    var style = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    _classCallCheck(this, AudioVisualizer);

    this.audioElement = audio;

    try {
      this.audioContext = new AudioContext();
      this.analyser = this.audioContext.createAnalyser();
      this.track = this.audioContext.createMediaElementSource(this.audioElement);
      this.track.connect(this.analyser);
      this.track.connect(this.audioContext.destination);
      this.analyser.fftSize = 2048;
      this.bufferLength = this.analyser.frequencyBinCount;
      this.dataArray = new Uint8Array(this.bufferLength);
      this.analyser.getByteTimeDomainData(this.dataArray);
    } catch (error) {
      console.error(error);
      console.warn('Outdated browser, cannot visualize! Using random generator'); // Add fallback

      this.audioContext = {};

      this.audioContext.resume = function () {
        return new Promise(function (resolve) {
          return resolve();
        });
      };

      this.sineWaveOffset = 0;
    }

    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d');
    this.style = {};
    this.style.back = style.back || 'rgb(200, 200, 200)';
    this.style.line = style.line || 'rgb(0, 0, 0)';
    this.style.progress = style.progress || 'rgba(255, 255, 255, 0.2)';
    this.style.lineWidth = parseInt(style.lineWidth) || 2;
    this.clicked = false;
    this.canvas.addEventListener("mousemove", function (e) {
      return _this.mousemoveHandler(e);
    });
    this.canvas.addEventListener("touchmove", function (e) {
      return _this.touchmoveHandler(e);
    });

    this.touchmoveHandler = function (e) {
      var x = e.touches[0].clientX - _this.canvas.offsetLeft;
      _this.audioElement.currentTime = Math.floor(_this.audioElement.duration * (x / _this.canvas.clientWidth));
    };

    this.mousemoveHandler = function (e) {
      e.preventDefault();
      var x = e.clientX - this.canvas.offsetLeft;
      if (this.clicked) this.audioElement.currentTime = Math.floor(this.audioElement.duration * (x / this.canvas.clientWidth));
    };

    this.clickHandler = function (clicked, e) {
      _this.clicked = clicked;

      _this.mousemoveHandler(e);
    };

    this.canvas.addEventListener("mousedown", function (e) {
      return _this.clickHandler(true, e);
    });
    this.canvas.addEventListener("mouseup", function (e) {
      return _this.clickHandler(false, e);
    });
    this.canvas.addEventListener("mouseleave", function (e) {
      return _this.clickHandler(false, e);
    });
    this.init();
  }
  /**
   * @private
   */


  _createClass(AudioVisualizer, [{
    key: "init",
    value: function init() {
      this.ctx.fillStyle = this.style.back;
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.strokeStyle = this.style.line;
      this.ctx.lineWidth = this.style.lineWidth;
      this.ctx.beginPath();
      this.ctx.moveTo(0, this.canvas.height / 2);
      this.ctx.lineTo(this.canvas.width, this.canvas.height / 2);
      this.ctx.stroke();
    }
    /**
     * Trigger the pause method on the audio element linked to the visualizer
     */

  }, {
    key: "pause",
    value: function pause() {
      return this.audioElement.pause();
    }
    /**
     * @private
     */

  }, {
    key: "draw",
    value: function draw() {
      var _this2 = this;

      window.requestAnimationFrame(function () {
        return _this2.draw.apply(_this2, arguments);
      });

      if (this.analyser) {
        this.analyser.getByteTimeDomainData(this.dataArray);
        this.ctx.fillStyle = this.style.back;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = this.style.progress;
        this.ctx.fillRect(0, 0, Math.floor(this.canvas.width * (this.audioElement.currentTime / this.audioElement.duration)), this.canvas.height);
        this.ctx.strokeStyle = this.style.line;
        this.ctx.lineWidth = this.style.lineWidth;
        this.ctx.beginPath();
        var sliceWidth = this.canvas.width * 1.0 / this.bufferLength;
        var x = 0;

        for (var i = 0; i < this.bufferLength; i++) {
          var v = this.dataArray[i] / 128.0;
          var y = v * this.canvas.height / 2;

          if (i === 0) {
            this.ctx.moveTo(x, y);
          } else {
            this.ctx.lineTo(x, y);
          }

          x += sliceWidth;
        }

        this.ctx.lineTo(this.canvas.width, this.canvas.height / 2);
        this.ctx.stroke();
      } else if (!this.audioElement.paused) {
        this.sineWaveOffset--;
        this.ctx.fillStyle = this.style.back;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = this.style.progress;
        this.ctx.fillRect(0, 0, Math.floor(this.canvas.width * (this.audioElement.currentTime / this.audioElement.duration)), this.canvas.height);
        this.ctx.strokeStyle = this.style.line;
        this.ctx.lineWidth = this.style.lineWidth;
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.canvas.height / 2);
        var modifier = Math.floor(Math.random() * Math.random() * (this.canvas.height / 2));
        var randomLength = 10 + Math.floor(Math.random() * 20);

        for (var _i = 0; _i < this.canvas.width; _i++) {
          this.ctx.lineTo(_i * randomLength, Math.sin((Math.floor(this.sineWaveOffset / Math.floor(Math.random() * 2)) + _i) * (180 / Math.PI)) * (this.canvas.height / 2 - this.canvas.height / 8 - modifier) + this.canvas.height / 2);
        }

        this.ctx.stroke();
      } else {
        this.ctx.fillStyle = this.style.back;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.strokeStyle = this.style.line;
        this.ctx.lineWidth = this.style.lineWidth;
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.canvas.height / 2);
        this.ctx.lineTo(this.canvas.width, this.canvas.height / 2);
        this.ctx.stroke();
      }
    }
    /**
     * Trigger the play method of the audio element linked with the visualizer
     */

  }, {
    key: "play",
    value: function play() {
      return this.audioElement.play();
    }
  }]);

  return AudioVisualizer;
}();

module.exports = AudioVisualizer;
},{}],"../../../../../usr/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "36165" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../../../../usr/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","../index.js"], null)
//# sourceMappingURL=/audio-visualizer.80dfb952.js.map