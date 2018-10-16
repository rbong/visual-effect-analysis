var playing = true;
var FPS = 60;

var browserGlobals = null;

function newCode(code) {
  try {
    eval("function dweet(t) {\n"+code+"\n}");
    window.dweet = dweet;
  } catch (e) {
    window.dweet = function(t) {
      throw e;
    };
    throw e;
  }
}
var timeOffset = 0;
