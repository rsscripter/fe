var express = require('express');
//var favicon = require('serve-favicon');
var app = express();
var async = require('async')
var request = require('request');
var mail = require('./mail')
var bodyParser = require('body-parser')

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'))

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies

// views -- render ejs views
app.get('/home', function (req, res) {
  res.render('pages/home')
});

app.get('/about', function (req, res) {

  async.waterfall(
    [
      // read the remote file for all image names
      function (callback) {
        request.get("https://raw.githubusercontent.com/rsscripter/feweb/master/about.txt", function (error, response, body) {
          if (!error && response.statusCode == 200) {
            callback(null, body);
          }
        });
      },
    ],
    // send image urls into view
    function (err, info) {
      res.render('pages/about', { info: info })
    }
  );

});

app.get('/contact', function (req, res) {
  res.render('pages/contact')
});

/* app.get('/services', function (req, res) {
  res.render('pages/services')
}); */

app.get('/', function (req, res) {
  res.render('template/template')
});

app.post('/mail', function (req, res) {
  mail.sendmail(req.body.name + ' - Papa Website', JSON.stringify(req.body))
  res.render('pages/mail')
});


app.get('/inventory', function (req, res) {
  async.waterfall(
    [
      // read the remote file for all image names
      function (callback) {
        request.get("https://raw.githubusercontent.com/rsscripter/feweb/master/coding_stuff/images.gill", function (error, response, body) {
          if (!error && response.statusCode == 200) {
            callback(null, body);
          }
        });
      },
      // compile machine objects
      function (pic_names, callback) {
        machines = []
        pic_names.split('\n').forEach(pic_name => {
          machines.push(
            {
              pic: "https://raw.githubusercontent.com/rsscripter/feweb/master/" + pic_name,
              title : pic_name.substring( 0, pic_name.lastIndexOf('.') ),
              desc: "https://raw.githubusercontent.com/rsscripter/feweb/master/" + pic_name.substring( 0, pic_name.lastIndexOf('.') ) + ".txt",
            }
          )
        });
        callback(null, machines);
      },
    ],
    // send machine objects into view
    function (err, machines) {
      res.render('pages/inventory', { machines: machines })
    }
  );
});

// Listen
const port = process.env.PORT || 8080;
app.listen(port);
console.log('Listening on localhost:' + port);
