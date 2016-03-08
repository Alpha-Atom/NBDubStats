var array = Array.apply(null, {length: 24}).map(Number.call, Number).map(function(n){return n+1});
var labels = Array.apply(null, {length:24}).map(Number.call, Number).map(function(n){return n+":00"});
var prev_t1 = -1;
var prev_t2 = -1;
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
$("#update").on('click', function(e) {
  populate_table(e);
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
  return sval;
};
var populate_table = function(e) {
  e.preventDefault();
  sval = update_sval();
  t1 = sval[0]-1;
  t2 = sval[1];
  count = $("#count").val();
  sort = $("#sortby").val();
  switch (sort) {
      case "Total Score":
          sort = "ud";
          break;
      case "Grabs":
          sort = "gr";
          break;
      case "Plays":
          sort = "pl";
          break;
      case "Percentage Updubbed":
          sort = "pct";
          break;
  }
  c_slug = "";
  if (count != "") {
    c_slug = "c=" + count;
  }
  if (t1 == 0 && t2 == 24) {
    t_slug = "";
  } else {
    t_slug = "t1=" + t1 + "&t2=" + t2
  }
  s_slug = "sort=" + sort;
  total_slug = "mattcoles.io:3000/dubstats/?" + s_slug + ((t_slug != "") ? "&" + t_slug : "") + ((c_slug != "") ? "&" + c_slug : "");
  console.log(total_slug);
  e.target.blur();
}
update_sval();
