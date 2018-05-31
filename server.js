var express = require('express');
var favicon = require('serve-favicon');
var path = require('path');
var app = express();
var inventory = require('./inventory')
var bodyParser = require('body-parser')
var fs = require('fs')
var async = require('async')
var https = require('https');
var request = require('request');

app.set('view engine', 'ejs');

// views -- render ejs views
app.get('/inventory', function (req, res) {

  async.waterfall(
    [
      // read the remote file for all image names
      function (callback) {
        request.get("https://raw.githubusercontent.com/rsscripter/feweb/master/files.txt", function (error, response, body) {
          if (!error && response.statusCode == 200) {
            callback(null, body);
          }
        });
      },
      // add the base url for full image paths
      function (pics, callback) {
        curls = []
        pics.split('\n').forEach(pic => {
          curls.push("https://raw.githubusercontent.com/rsscripter/feweb/master/" + pic)
        });
        callback(null, curls);
      },
    ],
    // send image urls into view
    function (err, urls) {
      console.log(urls);
      res.render('inventory' , { urls: urls })
    }
  );
});

// Listen
const port = process.env.PORT || 3000;
app.listen(port);
console.log('Listening on localhost:' + port);