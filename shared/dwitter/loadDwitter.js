var c = document.querySelector("#c");

c.width = 1920;
c.height = 1080;
var x = c.getContext("2d");

setupPolyfills(x);

var S = Math.sin;
var C = Math.cos;
var T = Math.tan;
function R(r,g,b,a) {
  a = a === undefined ? 1 : a;
  return "rgba("+(r|0)+","+(g|0)+","+(b|0)+","+a+")";
}

var time = 0;
var frame = 0;

var src = (dweet + "").replace(/(function dweet\(t\) {|}$)/g, "");
newCode(src);

function loop() {
  if (playing){
    requestAnimationFrame(loop);
  }
  time = frame/FPS;
  if(time * FPS | 0 == frame - 1){
    time += 0.000001;
  }
  frame++;

  try {
    if (window.navigator.userAgent.indexOf("Edge") > -1 && (dweet + "").match(/c\s*\.\s*(width|height)\s*(=|\+=|-=|\*=|\/=|%=|\**=|<<=|>>=|>>>=|&=|\^=|\|=)/) != null) {
      x.beginPath();
      x.resetTransform();
      x.clearRect(0, 0, c.width, c.height);
    }
    dweet(time);
  } catch (e) {
    throw e;
  }
}
loop();

function setupPolyfills(x) {
  if (typeof x.resetTransform === "undefined") {
    x.resetTransform = function() {
      this.setTransform(1, 0, 0, 1, 0, 0);
    };
  }

  if (typeof x.ellipse === "undefined") {
    x.ellipse = function(x, y, rx, ry, rotation, startAngle, endAngle, antiClockwise) {
      this.save();
      this.translate(x, y);
      this.rotate(rotation);
      this.scale(rx, ry);
      this.arc(0, 0, 1, startAngle, endAngle, antiClockwise);
      this.restore();
    };
  }

  // Internet Explorer Math stuff
  // Mostly from https://www.developer.mozilla.org
  let polyfills = {
    cosh: function(v) {
      return (Math.pow(Math.E, v) + Math.pow(Math.E, -v)) / 2;
    },
    acosh: function(v) {
      return Math.log(v + Math.sqrt(v * v - 1));
    },
    asinh: function(x) {
      if (x === -Infinity) {
        return x;
      } else {
        return Math.log(x + Math.sqrt(x * x + 1));
      }
    },
    atanh: function(x) {
      return Math.log((1+x)/(1-x)) / 2;
    },
    cbrt: function(x) {
      var y = Math.pow(Math.abs(x), 1/3);
      return x < 0 ? -y : y;
    },
    clz32: function(x) {
      if (x == null || x === 0) {
        return 32;
      }
      return 31 - Math.floor(Math.log(x >>> 0) * Math.LOG2E);
    },
    expm1: function(x) {
      return Math.exp(x) - 1;
    },
    fround: (function (array) {
      return function(x) {
        return array[0] = x, array[0];
      };
    })(new Float32Array(1)),
    hypot: function() {
      var y = 0, i = arguments.length;
      while (i--) y += arguments[i] * arguments[i];
      return Math.sqrt(y);
    },
    imul: function(a, b) {
      var aHi = (a >>> 16) & 0xffff;
      var aLo = a & 0xffff;
      var bHi = (b >>> 16) & 0xffff;
      var bLo = b & 0xffff;
      return ((aLo * bLo) + (((aHi * bLo + aLo * bHi) << 16) >>> 0) | 0);
    },
    log1p: function(x) {
      return Math.log(1 + x);
    },
    log2: function(x) {
      return Math.log(x) * Math.LOG2E;
    },
    log10: function(x) {
      return Math.log(x) * Math.LOG10E;
    },
    sign: function(x) {
      return ((x > 0) - (x < 0)) || +x;
    },
    sinh: function(x) {
      return (Math.exp(x) - Math.exp(-x)) / 2;
    },
    tanh: function(x){
      var a = Math.exp(+x), b = Math.exp(-x);
      return a == Infinity ? 1 : b == Infinity ? -1 : (a - b) / (a + b);
    },
    trunc: function(v) {
      v = +v;
      if (!isFinite(v)) return v;

      return (v - v % 1)   ||   (v < 0 ? -0 : v === 0 ? v : 0);
    }
  };
  for (var key in polyfills) {
    if (polyfills.hasOwnProperty(key)) {
      if (typeof Math[key] === "undefined") {
        Math[key] = polyfills[key];
      }
    }
  }
}

browserGlobals = {};
Object.keys(window).forEach(key => {
  browserGlobals[key] = true;
});
