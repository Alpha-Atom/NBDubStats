var Redis = require("ioredis");
var redis = new Redis();

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
	    console.log(playinfo.songinfo.name);
	  }
	}
      }
      process.exit();
    });
  });
}

processing();
