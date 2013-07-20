Tweet = new Meteor.Collection("tweet");

if (Meteor.isClient) {
  var startup = (new Date()).getTime();
  Template.display.tweets = function () {
    return Tweet.find();
  };

  Template.tweet.rendered = function() {
    $("#" + this.data._id).html(
      '<div class="text">'
        + this.data.text 
        + '<div class="author"> - ' 
        + this.data.author 
        + "</div></div>");
    
  };
}