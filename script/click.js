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
    window.clearTimeout(this.timeout);
    this.stopBar();
  },
  mainLoop: function () {
    var click = this;
    this.timeout = window.setTimeout(function() {
      click.runMainLoop();
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
      (function(i) {
        metronome.barNotes[i] = window.setTimeout(function() {
          metronome.playNote(i);
        },i*metronome.temp()/metronome.meter('value'))
      })(i);
    }
  }
}
function Metronome(rateWrapper, meterWrapper) {
  this.rate         = rateWrapper;
  this.meterOptions = meterWrapper;
  this.stopped      = true;
  this.justStarted  = true;
  this.listenEvents();
  this.sound('high');
  this.sound('med');
  this.sound('low');
  return this;
};
Metronome.prototype.playNote = function(index) {
  if (index == 0) {
    this.sound('high').play();
  } else {
    this.sound('low').play();
  }
};
Metronome.prototype.sound = function(height){
  this[height] = this[height] || new Audio("audio/" + height + browserFormat());
  return this[height];
};
Metronome.prototype.barInterval = function (){
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
Metronome.prototype.stopBar = function() {
  for (var i = 0; i < this.barNotes.length; i++) 
    window.clearTimeout(this.barNotes[i]);
};
Metronome.prototype.listenEvents = function() {
  var metronome = this;
  metronome.meterOptions.find('select').change(function() {
    var optionName = $(this).attr('id').split("note_")[1];
    var optionValue = parseInt($(this).find('option:selected').text());
    metronome[optionName] = optionValue;
  });
  metronome.rate.bind('keyup change input', function() {
    metronome.bpm = parseInt(this.value);
  });
};
