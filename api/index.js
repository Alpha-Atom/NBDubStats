var express = require('express');
var app = express();
var fs = require("fs");

app.get('/dubstats/', function (req, res) {
  var time1 = req.query.t1 || -1;
  var time2 = req.query.t2 || -1;

  json = fs.readFileSync("output.json");
  songs = JSON.parse(json);
  if (t1 == -1 && t2 == -1) {
    res.send(json);
  } else {
    songs_only = 
    Object.keys(obj).forEach(function (key) {
      var timestamp = 
    });
  }
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
