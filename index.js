/* global webkitAudioContext */

var callNextTick = require('call-next-tick');

function AudioContextSingleton() {
  var audioContext;

  return {
    getCurrentContext,
    getNewContext
  };

  function getCurrentContext(done) {
    if (audioContext) {
      callNextTick(done, null, audioContext);
    } else {
      getNewContext(done);
    }
  }

  function getNewContext(done) {
    if (audioContext) {
      audioContext.close().then(passNewContext);
    } else {
      passNewContext();
    }

    function passNewContext() {
      if (typeof AudioContext === 'function') {
        audioContext = new AudioContext();
      } else {
        audioContext = new webkitAudioContext();
      }
      done(null, audioContext);
    }
  }
}

module.exports = AudioContextSingleton;
