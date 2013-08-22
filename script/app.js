function browserFormat () {
  if ($.browser.safari) {
    return ".mp3";
  } else {
    return ".ogg";
  }
}

$(document).ready(function () {
  window.addEventListener('touchstart', function() {
    var buffer = context.createBuffer(1, 1, 22050);
    var source = context.createBufferSource();
    source.buffer = buffer;
    source.connect(context.destination);
    source.noteOn(0);

  }, false);
  var rate, metronome;
  var rateTrigger = $("#rate");
  var meterTrigger = $("#meter");
  metronome = new Metronome(rateTrigger, meterTrigger);

  $("#start").click(function (){
    if ($("#rate").val()) {
      metronome.start();
      return false;
    }
  });
  $("#stop").click(function (){
    metronome.stop();
    return false;
  });
;})
