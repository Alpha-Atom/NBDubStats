var DubAPI = require("dubapi");
var Redis = require("ioredis");
var userName = "DubStatsBot";
var passWord = process.argv[2];
var redis = new Redis();

new DubAPI({username: userName, password: passWord}, function (err, bot) {
  if (err) return console.error(err);

  console.log("Running DubAPI v" + bot.version);

  function connect() {
    bot.connect("nightblue3");
  }

  bot.on('connected', function(name) {
    console.log("Successfully connected to " + name + "!");
  });

  bot.on('disconnected', function(name) {
    console.log("Unexpected disconnect, reconnecting...");
    setTimeout(connect, 15000);
  });

  bot.on('error', function(err) {
    console.error(err);
  });

  bot.on(bot.events.roomPlaylistUpdate, function(data) {
     var lastplayed = data.lastPlay;
     if (lastplayed === undefined) {
       return;
     }
     var tscore = lastplayed.score.updubs - lastplayed.score.downdubs;
     var tgrabs = lastplayed.score.grabs;
     var trackname = lastplayed.media.name;
     var fkid = lastplayed.media.fkid;
     var userNum = bot.getUsers().length;
     var timestamp = Date.now();
     var hashname = "song:" + lastplayed.media.type + ":" + fkid;

     console.log("Last played was track: " + trackname + " id: " + fkid);
     console.log("Total score was: " + tscore + " also grabs: " + tgrabs);
     console.log("There are currently: " + userNum + " users in the room.");

     var hashobject = {
       songinfo: lastplayed.media,
       score: tscore,
       grabs: tgrabs,
       users: userNum
     };

     redis.hset(hashname, timestamp, JSON.stringify(hashobject));
  });

  process.on('SIGINT', function() {
    console.log("Caught interrupt signal.");
    bot.disconnect();
    process.exit();
  });

  connect();
});
