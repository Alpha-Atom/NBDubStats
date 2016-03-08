var Redis = require("ioredis");
var redis = new Redis();
var fs = require("fs");

var processing = function () {
  var stream = redis.scanStream();
  var keys = [];
  var commands = [];

  stream.on('data', function (result) {
    for (var i = 0; i < result.length; i++) {
      keys.push(result[i]);
    }
  });

  stream.on('end', function() {
    var final_object = {};
    for (var j = 0; j < keys.length; j++) {
      commands.push(['hgetall', keys[j]]);
    }
    redis.multi(commands).exec(function(err, results) {
      for (var k = 0; k < results.length; k++) {
        if (results[k][0] == null) {
          var allkeys = results[k][1];
          for (var x = 0; x < allkeys.length/2; x++) {
            var timestamp = allkeys[x*2];
            var playinfo = JSON.parse(allkeys[x*2+1]);
            var main_key = playinfo.songinfo.type + "_" + playinfo.songinfo.fkid;
            if (final_object.hasOwnProperty(main_key)) {
              final_object[main_key]["plays"] = final_object[main_key]["plays"]+1;
            } else {
              final_object[main_key] = {
                "song_name": playinfo.songinfo.name,
                "score": playinfo.score,
                "plays": 1,
                "grabs": playinfo.grabs
              }
            }
          }
        }
      }
	fs.writeFile('../api/output.json', JSON.stringify(final_object, null, '\t'), (err) => {
	  if (err) throw err;
	  console.log('It\'s saved!');
      process.exit();
	});
    });
  });
}

processing();
