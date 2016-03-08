var array = Array.apply(null, {length: 24}).map(Number.call, Number).map(function(n){return n+1});
var labels = Array.apply(null, {length:24}).map(Number.call, Number).map(function(n){return n+":00"});
var mySlider = $("input.slider").slider({
  ticks:array,
  ticks_labels:labels,
  range:true,
  tooltip:'hide'
});
mySlider.slider('setValue', [0,24]);
var e = mySlider.slider().on('slide', update_sval).data('slider');
$("body").on('click', function() {
  update_sval();
});
var update_sval = function () {
  sval = e.getValue();
  time1 = (sval[0]-1)+":00";
  time2 = (sval[1]-1)+":59";
  if (time1 == "0:00") {
    time1 = "the start of the day";
  }
  if (time2 == "23:59") {
    time2 = "the end of the day";
  }
  output = "Currently showing songs played from " + time1 + " until " + time2 + ".";
  $("#sval").html("<small>" + output + "</small>");
};
update_sval();
