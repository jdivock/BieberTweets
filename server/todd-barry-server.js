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

		twit.stream('statuses/sample', function(stream) {
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
							added: now
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
		if (now > tweet.added + 20000) {
			Tweet.remove(tweet._id);
		}
	});

	//console.log(Tweet.find());
}, 1000);