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

    if (audioContext) {
      audioContext.close().then(passNewContext);
    } else {
      passNewContext();
    }

    function passNewContext() {
      var acOpts;
      if (opts && opts.sampleRate) {
        acOpts = { sampleRate: opts.sampleRate };
      }
      if (typeof AudioContext === 'function') {
        audioContext = new AudioContext(acOpts);
      } else {
        audioContext = new webkitAudioContext(acOpts);
      }
      done(null, audioContext);
    }
  }
}

module.exports = AudioContextSingleton;
