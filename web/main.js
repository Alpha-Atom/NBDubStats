var array = Array.apply(null, {length: 24}).map(Number.call, Number).map(function(n){return n+1});
var labels = Array.apply(null, {length:24}).map(Number.call, Number).map(function(n){return n+":00"});
var mySlider = $("input.slider").slider({
  ticks:array,
  ticks_labels:labels,
  range:true,
  tooltip:'hide'
});
mySlider.slider('setValue', [0,0]);
