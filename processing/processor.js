var Redis = require("ioredis");
var redis = new Redis();

Redis.Command.setReplyTransformer('hgetall', function (result) {
  if (Array.isArray(result)) {
    var obj = {};
    for (var i = 0; i < result.length; i += 2) {
      obj[result[i]] = result[i + 1];
    }
    return obj;
  }
  return result;
});

var process = function () {
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
        var oKeys = Object.keys(results[k]);
        for (var ii = 0; ii < oKeys.length; ii++) {
          var playinfo = JSON.parse(results[k][oKeys[ii]]);
          console.log(playinfo.songinfo.name);
        }
      }
    });
  });
}

process();
