function browserFormat () {
  if ($.browser.safari) {
    return ".mp3";
  } else {
    return ".ogg";
  }
}

$(document).ready(function () {
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
