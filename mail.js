var http = require('http');
var querystring = require('querystring');
module.exports = {

    sendmail(subject, body) {

        var postData = querystring.stringify({
            subject: subject,
            body: body
        });

        var options = {
            hostname: 'mgillwebservice.herokuapp.com',
            port: 80,
            //hostname: 'localhost',
            //port: 3000,
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': postData.length
            }
        };

        var req = http.request(options, function (res, response) {
            console.log('STATUS:', res.statusCode);
            console.log('HEADERS:', JSON.stringify(res.headers));
            res.setEncoding('utf8');
            
        });

        req.on('error', function (e) {
            console.log('Problem with request:', e.message);
        });
        req.write(postData);
        req.end();
    }
}