var express = require('express');
var app = express();
var fs = require("fs");

app.get('/dubstats/', function (req, res) {
  var time1 = req.query.t1 || -1;
  var time2 = req.query.t2 || -1;

  json = fs.readFileSync("output.json");
  songs = JSON.parse(json);
  if (time1 == -1 && time2 == -1) {
    res.send(songs);
  } else {
    songs_only = {};
    Object.keys(songs).forEach(function (key) {
      if (key == "generated") {
        songs_only[key] = songs[key];
      } else {
        timestamphours = (new Date(songs[key]["timestamp"])).getUTCHours();
        if (timestamphours >= time1 && timestamphours < time2) {
          songs_only[key] = songs[key];
        }
      }
    });
    res.send(songs_only);
  }
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
