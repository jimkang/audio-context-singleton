/* global webkitAudioContext */

function AudioContextSingleton(ctorOpts) {
  var audioContext;

  return {
    getCurrent,
    getNew
  };

  function getCurrent(opts) {
    if (audioContext) {
      return audioContext;
    }

    return getNew(opts);
  }

  function getNew(opts) {
    if (ctorOpts && ctorOpts.offline) {
      audioContext = new OfflineAudioContext(opts);
    } else {
      if (typeof AudioContext === 'function') {
        audioContext = new AudioContext(opts);
      } else {
        audioContext = new webkitAudioContext(opts);
      }
    }
    return audioContext;
  }
}

module.exports = AudioContextSingleton;
