var express = require('express');
//var favicon = require('serve-favicon');
var app = express();
var async = require('async')
var request = require('request');

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'))

// views -- render ejs views
app.get('/home', function (req, res) {
  res.render('pages/home')
});

app.get('/about', function (req, res) {
  res.render('pages/about')
});

app.get('/contact', function (req, res) {
  res.render('pages/contact')
});

app.get('/', function (req, res) {
  res.render('pages/template')
});

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
    function (err, machines) {
      res.render('pages/inventory' , { machines : machines })
    }
  );
});

// Listen
const port = process.env.PORT || 3000;
app.listen(port);
console.log('Listening on localhost:' + port);