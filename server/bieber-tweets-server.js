
if (Meteor.isServer) {
	Tweet = new Meteor.Collection("tweet");

	Meteor.startup(function() {
		// code to run on server at startup
		var twit = new twitter({
			consumer_key: Meteor.settings.TBT_CONSUMER_KEY,
			consumer_secret: Meteor.settings.TBT_CONSUMER_SECRET_KEY,
			access_token_key: Meteor.settings.TBT_ACCESS_TOKEN,
			access_token_secret: Meteor.settings.TBT_ACCESS_TOKEN_SECRET
		});
//testsadf
		var Fiber = Npm.require('fibers');

		twit.stream('statuses/filter', {track: 'bieber'}, function(stream) {
			stream.on('data', function(data) {
				Fiber(function() {
					var now = (new Date()).getTime();
					if (!data.user) {
						//console.log(data);
					} else {
						// console.log({
						// 	text: data.text,
						// 	author: '@' + data.user.screen_name,
						// 	added: now
						// });
						Tweet.insert({
							text: data.text,
							author: '@' + data.user.screen_name,
							added: now,
							timestamp: moment(now).format('MM/DD/YYYY, h:mm:ss a')
						});

						//console.log(Tweet.find());
					}
				}).run();
			});
		});
	});
}

Meteor.setInterval(function() {
	// remove any tweets that have gone off screen
	var now = (new Date()).getTime()
	var tweets = Tweet.find({});
	tweets.forEach(function(tweet) {
		if (now > tweet.added + 2000) {
			Tweet.remove(tweet._id);
		}
	});

	//console.log(Tweet.find());
}, 1000/20);