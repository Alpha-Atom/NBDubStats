var express = require('express');
var app = express();
var fs = require("fs");

app.get('/dubstats/', function (req, res) {
  var time1 = req.query.t1 || -1;
  var time2 = req.query.t2 || -1;
  var sort_by = req.query.sort || "ud";

  json = fs.readFileSync("output.json");
  songs = JSON.parse(json);
  return_obj = {
    "generated": songs[generated],
    "songs": [];
  }
  songs_array = [];
  if (time1 == -1) {
    Object.keys(songs).forEach(function (key) {
      if (key != "generated") {
        songs_array.push(songs[key]);
      }
    });
  } else {
    Object.keys(songs).forEach(function (key) {
      if (key != "generated") {
        timestamphours = (new Date(songs[key]["timestamp"]).getUTCHours();
        if (timestamphours >= time1 && timestamphours < time2) {
          songs_array.push(songs[key]);
        }
      }
    });
  }
  if (sort_by == "ud") {

  } else if (sort_by == "pl") {

  } else if (sort_by == "gr") {

  } else if (sort_by == "alp") {

  }
  if (time1 == -1 && time2 == -1) {
    res.send(songs);
  } else {
    songs_only = {};
    res.send(songs_only);
  }
});

var sort_ud( a, b ) {
  
}

var sort_pl( a, b ) {

}

var sort_gr( a, b ) {
  
}

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
