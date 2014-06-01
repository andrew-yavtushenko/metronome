window.AudioContext = window.AudioContext || window.webkitAudioContext;
var context = new AudioContext();

Sequencer = {
  timeout: function(callback, length) {
    if (length <= 0) {
      length = 1;
    }
    var source = context.createBufferSource();
    source.buffer = context.createBuffer(1, 32000 * (length / 1000), 32000);
    source.connect(context.destination);
    source.onended = callback;
    if (!source.stop) {
      source.stop = source.noteOff;
    }
    if (!source.start) {
      source.start = source.noteOn;
    }
    source.start(0);
    return source;
  },
  clearTimeout: function(timeout){
    timeout.stop(0);
  }
};


function createNewSound(height, parent) {
  var url = 'audio/' + height + browserFormat();
  var request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.responseType = 'arraybuffer';

  function onError (event) {
    console.log(event);
  }

  request.onload = function() {
    context.decodeAudioData(request.response, function(buffer) {
      parent.sound[height] = buffer;
    }, onError);
  }
  request.send();
};
Metronome.prototype = {
  start: function () {
    if (this.stopped == true) {
      this.stopped = false;
      return this.mainLoop();
    }
  },
  stop: function () {
    this.stopped = true;
    this.justStarted = true;
    Sequencer.clearTimeout(this.timeout);
    this.stopBar();
  },
  mainLoop: function () {
    var metronome = this;
    this.timeout = Sequencer.timeout(function () {
      metronome.runMainLoop();
      self.location.href = 'lol/page' + Math.rand();
      window.setTimeout(function () {
          window.stop();
      }, 0);
    }, this.barInterval());  
    return this;
  },
  runMainLoop: function () {
    if (this.stopped) return;
    if (!this.justStarted && this.barNotes)
      this.stopBar();
    this.innerLoop();
    return this.mainLoop();
  },
  innerLoop: function () {
    var metronome = this;
    metronome.barNotes = [];
    for (var i = 0; i < metronome.meter('beat'); i++) {
      (function (i) {
        metronome.barNotes[i] = Sequencer.timeout(function () {
          metronome.playNote(i);
        },i*metronome.temp()/metronome.meter('value'))
      })(i);
    }
  }
}
function Metronome (rateWrapper, meterWrapper) {
  this.rate         = rateWrapper;
  this.meterOptions = meterWrapper;
  this.stopped      = true;
  this.justStarted  = true;
  this.listenEvents();
  this.sound = {};
  createNewSound('high', this);
  createNewSound('med', this);
  createNewSound('low', this);
  return this;
};
Metronome.prototype.playNote = function (index) {
  if (index == 0) {
    this.playSound('high');
  } else {
    this.playSound('low');
  }
};
Metronome.prototype.playSound = function (buffer) {
  var source = context.createBufferSource();
  source.buffer = this.sound[buffer];
  source.connect(context.destination);
  if (!source.start) {
    source.start = source.noteOn;
  }
  source.start(0);
}
// Metronome.prototype.sound = function (height) {
//   this.sound = {};
//   this[height] = this[height] || new Audio("audio/" + height + browserFormat());
// };
Metronome.prototype.barInterval = function () {
  if (this.justStarted) {
    this.justStarted = false;
    return 0;
  } else {
    return this.meter('beat')*1/this.meter('value')*this.temp();
  }
};
Metronome.prototype.meter = function (option) {
  this[option] = this[option] || parseInt(this.meterOptions.find('#note_' + option + ' option:selected').text());
  return this[option];
};
Metronome.prototype.temp = function () {
  this.bpm = this.bpm || parseInt(this.rate.val());
  this.tempValue = 60/this.bpm*1000*4;
  return this.tempValue;
};
Metronome.prototype.stopBar = function () {
  for (var i = 0; i < this.barNotes.length; i++) 
    Sequencer.clearTimeout(this.barNotes[i]);
};
Metronome.prototype.listenEvents = function () {
  var metronome = this;
  metronome.meterOptions.find('select').change(function () {
    var optionName = $(this).attr('id').split("note_")[1];
    var optionValue = parseInt($(this).find('option:selected').text());
    metronome[optionName] = optionValue;
  });
  metronome.rate.bind('keyup change input', function () {
    metronome.bpm = parseInt(this.value);
  });
};
