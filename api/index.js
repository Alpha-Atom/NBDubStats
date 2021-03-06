var express = require('express');
var Redis = require('ioredis');
var redis = new Redis();
var app = express();
var fs = require("fs");

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/dubstats/', function (req, res) {
  var time1 = req.query.t1 || -1;
  var time2 = req.query.t2 || -1;
  var sort_by = req.query.sort || "ud";
  var count = req.query.c  || 0;

  json = fs.readFileSync("output.json");
  songs = JSON.parse(json);
  return_obj = {
    "generated": songs["generated"],
    "songs": []
  }
  songs_array = [];
  seen = {};
  index = 0;
  if (time1 == -1) {
    Object.keys(songs).forEach(function (key,index) {
      if (key != "generated") {
        var key_seen = key.split("_").slice(1).join("_");
        songs[key].fkidtype = key_seen;
        if (seen[key_seen] === undefined) {
          seen[key_seen] = songs_array.length;
          songs_array.push(songs[key]);
        } else {
          var tmp = songs_array[seen[key_seen]];
          var pct_up = Math.floor(((Number.parseInt(tmp.pct_up) * Number.parseInt(tmp.plays)) + Number.parseInt(songs[key]["pct_up"])) / (Number.parseInt(tmp.plays+1)));
          var avg_score = Math.floor(((Number.parseInt(tmp.score) * Number.parseInt(tmp.plays)) + Number.parseInt(songs[key]["score"])) / (Number.parseInt(tmp.plays+1)));
          var avg_grabs = Math.floor(((Number.parseInt(tmp.grabs) * Number.parseInt(tmp.plays)) + Number.parseInt(songs[key]["grabs"])) / (Number.parseInt(tmp.plays+1)));
          tmp.pct_up = pct_up;
          tmp.score = avg_score;
          tmp.grabs = avg_grabs;
          tmp.plays = tmp.plays+1;
          songs_array[seen[key_seen]] = tmp;
        }
      }
    });
  } else {
    Object.keys(songs).forEach(function (key,index) {
      if (key != "generated") {
        timestamphours = (new Date(Number.parseFloat(songs[key]["timestamp"]))).getUTCHours();
        if (timestamphours >= time1 && timestamphours < time2) {
          var key_seen = key.split("_").slice(1).join("_");
          songs[key].fkidtype = key_seen;
          if (seen[key_seen] === undefined) {
            seen[key_seen] = songs_array.length;
            songs_array.push(songs[key]);
          } else {
            var tmp = songs_array[seen[key_seen]];
            var pct_up = Math.floor(((Number.parseInt(tmp.pct_up) * Number.parseInt(tmp.plays)) + Number.parseInt(songs[key]["pct_up"])) / (Number.parseInt(tmp.plays+1)));
            var avg_score = Math.floor(((Number.parseInt(tmp.score) * Number.parseInt(tmp.plays)) + Number.parseInt(songs[key]["score"])) / (Number.parseInt(tmp.plays+1)));
            var avg_grabs = Math.floor(((Number.parseInt(tmp.grabs) * Number.parseInt(tmp.plays)) + Number.parseInt(songs[key]["grabs"])) / (Number.parseInt(tmp.plays+1)));
            tmp.pct_up = pct_up;
            tmp.score = avg_score;
            tmp.grabs = avg_grabs;
            tmp.plays = tmp.plays+1;
            songs_array[seen[key_seen]] = tmp;
          }
        }
      }
    });
  }
  if (sort_by == "ud") {
    songs_array.sort(sort_ud);
  } else if (sort_by == "pl") {
    songs_array.sort(sort_pl);
  } else if (sort_by == "gr") {
    songs_array.sort(sort_gr);
  } else if (sort_by == "pct") {
    songs_array.sort(sort_pct);
  } else {
    songs_array.sort(sort_ud);
  }
  if (count > 0) {
    return_obj.songs = songs_array.slice(0,count);
  } else {
    return_obj.songs = songs_array;
  }
  if (time1 == -1 && time2 == -1) {
    res.send(return_obj);
  } else {
    res.send(return_obj);
  }
});

app.get('/song/', function (req, res) {
  var fkidtype = req.query.s || "";
  if (fkidtype == "") {
    res.send({
      "error": "Please supply a song fkid and type."
    });
  } else {
    var slug = ("song:" + req.query.s).replace(/(youtube|soundcloud)_/, "$1:");
    redis.hgetall(slug).then(function (result) {
      return_obj = {};
      Object.keys(result).forEach(function (key,index) {
        return_obj[key] = JSON.parse(result[key]);
      });
      res.send(return_obj);
    });
  }
});

var sort_pct = function ( a, b ) {
  if (a.pct_up > b.pct_up) {
    return -1;
  } else if (a.pct_up < b.pct_up) {
    return 1;
  } else {
    if (a.score > b.score) {
      return -1;
    } else if (a.score < b.score) {
      return 1;
    } else {
      if (a.grabs > b.grabs) {
        return -1;
      } else if (a.grabs < b.grabs) {
        return 1;
      } else {
        if (a.plays > b.plays) {
          return -1;
        } else if (a.plays < b.plays) {
          return 1;
        } else {
          return 0;
        }
      }
    }
  }
}

var sort_ud = function ( a, b ) {
  if (a.score > b.score) {
    return -1;
  } else if (a.score < b.score) {
    return 1;
  } else {
    if (a.grabs > b.grabs) {
      return -1;
    } else if (a.grabs < b.grabs) {
      return 1;
    } else {
      if (a.pct_up > b.pct_up) {
        return -1;
      } else if (a.pct_up < b.pct_up) {
        return 1;
      } else {
        if (a.plays > b.plays) {
          return -1;
        } else if (a.plays < b.plays) {
          return 1;
        } else {
          return 0;
        }
      }
    }
  }
}

var sort_pl = function ( a, b ) {
  if (a.plays > b.plays) {
    return -1;
  } else if (a.plays < b.plays) {
    return 1;
  } else {
    if (a.score > b.score) {
      return -1;
    } else if (a.score < b.score) {
      return 1;
    } else {
      if (a.grabs > b.grabs) {
        return -1;
      } else if (a.grabs < b.grabs) {
        return 1;
      } else {
        if (a.pct_up > b.pct_up) {
          return -1;
        } else if (a.pct_up < b.pct_up) {
          return 1;
        } else {
          return 0;
        }
      }
    }
  }
}

var sort_gr = function ( a, b ) {
  if (a.grabs > b.grabs) {
    return -1;
  } else if (a.grabs < b.grabs) {
    return 1;
  } else {
    if (a.score > b.score) {
      return -1;
    } else if (a.score < b.score) {
      return 1;
    } else {
      if (a.pct_up > b.pct_up) {
        return -1;
      } else if (a.pct_up < b.pct_up) {
        return 1;
      } else {
        if (a.plays > b.plays) {
          return -1;
        } else if (a.plays < b.plays) {
          return 1;
        } else {
          return 0;
        }
      }
    }
  }
}

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
