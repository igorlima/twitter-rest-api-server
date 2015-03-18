var rewire  = require('rewire'),
    assert  = require('assert'),
    twitter = rewire('./twitter.js'),
    mocks   = require('./twitter-spec-mock-data.js');

describe('twitter module', function(){
  describe('simplify function', function(){
    var simplify;
   
    before(function() {
      simplify = twitter.__get__('simplify');
    });

    it('should be defined', function(){
      assert.ok(simplify);
    });

    describe('simplify a tweet', function(){
      var tweet, mock;
     
      before(function() {
        mock = mocks[0];
        tweet = simplify(mock);
      });

      it('should have 4 properties', function() {
        assert.equal( Object.keys(tweet).length, 4 );
      });

      it('should have date property', function() {
        assert.ok(tweet.date);
      });

      it('should have id property', function() {
        assert.ok(tweet.id);
      });

      it('should have user property', function() {
        assert.ok(tweet.user);
      });

      it('should have id property within user', function() {
        assert.ok(tweet.user.id);
      });

      it('should have tweet property', function() {
        assert.ok(tweet.tweet);
      });
     
      describe('format dates as `MMMM Do YYYY, h:mm:ss a`', function() {
        var revert;

        describe('English format', function() {
          before(function() {
            revert = twitter.__set__('process.env.MomentLang', 'en');
            tweet = simplify(mock);
          });

          it('should be `March 6th 2015, 2:29:13 am`', function() {
            assert.equal(tweet.date, 'March 6th 2015, 2:29:13 am');
          });

          after(function(){
            revert();
          });
        });

        describe('Brazilian format', function() {
          before(function() {
            revert = twitter.__set__('process.env.MomentLang', 'pt-br');
            tweet = simplify(mock);
          });

          it('should be `Março 6º 2015, 2:29:13 am`', function() {
            assert.equal(tweet.date, 'Março 6º 2015, 2:29:13 am');
          });
         
          after(function(){
            revert();
          });
          
        });
      });

    });

  });
  
  describe('retrieve timeline feed', function() {
    var revert;
    before(function() {
      revert = twitter.__set__("T.get", function( api, query, callback ) {
        callback( null, mocks);
      });
    });

    describe('igorribeirolima timeline', function() {
      var tweets;
      before(function(done){
        twitter('igorribeirolima', function(err, data) {
          tweets = data;
          done();
        });
      });

      it('should have 19 tweets', function() {
        assert.equal(tweets.length, 19);
      });

    });

    after(function() {
      revert();
    });

   });
});
