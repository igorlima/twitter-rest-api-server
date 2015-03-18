var express      = require('express'),
    tweets       = require('./twitter.js'),
    response     = function(req, res, err, data) {
      if (req.query.callback) {
        res.jsonp(err || data);
      } else {
        res.json(err || data);
      }
    };

var app = express()
  .use(express.static(__dirname + './'))
  .get('/twitter/timeline/:user', function(req, res) {
    tweets(req.params.user, function(err, data) {
      response(req, res, err, data);
    });
  })
  .listen(process.env.PORT || 5000);
