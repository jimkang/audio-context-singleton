/* global webkitAudioContext */

function AudioContextSingleton(ctorOpts) {
  var audioContext;
  var resolvedPromise = Promise.resolve();

  return {
    getCurrentContext,
    getNewContext,
  };

  function getCurrentContext(done) {
    if (audioContext) {
      resolvedPromise.then(() => done(null, audioContext));
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
      if (ctorOpts && ctorOpts.offline) {
        audioContext = new OfflineAudioContext(opts);
      } else {
        if (typeof AudioContext === 'function') {
          audioContext = new AudioContext(opts);
        } else {
          audioContext = new webkitAudioContext(opts);
        }
      }
      done(null, audioContext);
    }
  }
}

module.exports = AudioContextSingleton;
