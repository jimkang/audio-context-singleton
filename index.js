/* global webkitAudioContext */

function AudioContextSingleton(ctorOpts) {
  var audioContext;
  var resolvedPromise = Promise.resolve();

  return {
    getCurrentContext,
    getNewContext,
  };

  function getCurrentContext() {
    var { done } = organizeParams.apply(null, arguments);
    if (audioContext) {
      // Warning: opts passed to getCurrentContext are ignored in this case.
      // TODO: Think about what to do about this.
      resolvedPromise.then(() => done(null, audioContext));
    } else {
      getNewContext.apply(null, arguments);
    }
  }

  function getNewContext() {
    var { opts, done } = organizeParams.apply(null, arguments);

    if (audioContext && audioContext.state !== 'closed') {
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

function organizeParams(firstParam, secondParam) {
  var done, opts;
  if (typeof firstParam === 'function') {
    done = firstParam;
  } else if (typeof secondParam === 'function') {
    done = secondParam;
    if (typeof firstParam === 'object') {
      opts = firstParam;
    }
  }
  return { done, opts };
}

module.exports = AudioContextSingleton;
