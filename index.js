var DubAPI = require("dubapi");
var userName = "DubStatsBot";
var passWord = process.argv[2];

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
     var score = lastplayed.score.updubs - lastplayed.score.downdubs;
     var grabs = lastplayed.score.grabs;
     var trackname = lastplayed.media.name;
     var fkid = lastplayed.media.fkid;

     console.log("Last played was track: " + trackname + " id: " + fkid);
     console.log("Total score was: " + score + " also grabs: " + grabs);
  });

  connect();
});
