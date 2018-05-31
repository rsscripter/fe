var https = require('https');
var fs = require('fs');

module.exports = {
    fetch_urls() {
        // for downloading entire file
        var request = https.get("https://raw.githubusercontent.com/rsscripter/feweb/master/" + "files.txt", function (response) {
            response.pipe(fs.createWriteStream("files.txt"));
        });
        return 'done'
        /*  var request = require('request');
         request.get("https://raw.githubusercontent.com/rsscripter/feweb/master/files.txt", function (error, response, body) {
             if (!error && response.statusCode == 200) {
                 var csv = body;
                 console.log(body)
                 // Continue with your processing here.
             }
         }); */
    }
}