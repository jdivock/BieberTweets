
if (Meteor.isClient) {
  Tweet = new Meteor.Collection("tweet");

  var startup = (new Date()).getTime();
  Template.display.tweets = function () {
    return Tweet.find({added: {$gt: startup}});
  };

  // Template.tweet.rendered = function() {
  //   $("#" + this.data._id).html(
  //     '<div class="text">'
  //       + this.data.text 
  //       + '<div class="author"> - ' 
  //       + this.data.author 
  //       + "</div></div>");
    
  // };
}