Tweet = new Meteor.Collection("tweet");

if (Meteor.isServer) {
	Meteor.startup(function() {
		// code to run on server at startup
		var twit = new twitter({
			consumer_key: process.env.TBT_CONSUMER_KEY,
			consumer_secret: process.env.TBT_CONSUMER_SECRET_KEY,
			access_token_key: process.env.TBT_ACCESS_TOKEN,
			access_token_secret: process.env.TBT_ACCESS_TOKEN_SECRET
		});

		var Fiber = Npm.require('fibers');

		twit.stream('statuses/filter', {
			'follow': "17453527",
			'language': 'en'
		}, function(stream) {
			stream.on('data', function(data) {
				Fiber(function() {
					var now = (new Date()).getTime();
					console.log({
						text: data.text,
						author: '@' + data.user.screen_name,
						added: now
					});

					Tweet.insert({
						text: data.text,
						author: '@' + data.user.screen_name,
						added: now
					});
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
		if (now > tweet.added + 4000) {
			Tweet.remove(tweet._id);
		}
	});
}, 1000 / 20);