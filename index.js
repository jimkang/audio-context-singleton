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

  function getNewContext(firstParam, secondParam) {
    var sampleRate = undefined;
    var opts;
    var done;

    if (typeof firstParam === 'function') {
      done = firstParam;
    } else if (typeof secondParam === 'function') {
      done = secondParam;
      if (typeof firstParam === 'object') {
        opts = firstParam;
      }
    }

    if (opts) {
      sampleRate = opts.sampleRate;
    }

    if (audioContext) {
      audioContext.close().then(passNewContext);
    } else {
      passNewContext();
    }

    function passNewContext() {
      if (typeof AudioContext === 'function') {
        audioContext = new AudioContext({ sampleRate });
      } else {
        audioContext = new webkitAudioContext({ sampleRate });
      }
      done(null, audioContext);
    }
  }
}

module.exports = AudioContextSingleton;
