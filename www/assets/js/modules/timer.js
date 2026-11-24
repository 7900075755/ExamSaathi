/**
 * ExamSaathi Timer Module
 * Countdown timer with callbacks, warning threshold, and bar fill.
 */
const Timer = (() => {
  let _interval = null;
  let _remaining = 0;
  let _total = 0;
  let _callbacks = {};
  let _paused = false;

  function start({ seconds, onTick, onWarn, onExpire, warnAt = 300 }) {
    stop();
    _remaining = seconds;
    _total = seconds;
    _paused = false;
    _callbacks = { onTick, onWarn, onExpire };

    if (onTick) onTick(_remaining, _total);

    _interval = setInterval(() => {
      if (_paused) return;
      _remaining--;

      if (_callbacks.onTick) _callbacks.onTick(_remaining, _total);
      if (_remaining <= warnAt && _remaining > 0 && _callbacks.onWarn) _callbacks.onWarn(_remaining);
      if (_remaining <= 0) {
        stop();
        if (_callbacks.onExpire) _callbacks.onExpire();
      }
    }, 1000);
  }

  function stop() {
    if (_interval) { clearInterval(_interval); _interval = null; }
  }

  function pause() { _paused = true; }
  function resume() { _paused = false; }
  function getRemaining() { return _remaining; }
  function getTotal() { return _total; }
  function getElapsed() { return _total - _remaining; }

  function format(seconds) {
    if (seconds < 0) seconds = 0;
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
    return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  }

  function formatElapsed() { return format(_total - _remaining); }

  return { start, stop, pause, resume, getRemaining, getTotal, getElapsed, format, formatElapsed };
})();

window.Timer = Timer;
