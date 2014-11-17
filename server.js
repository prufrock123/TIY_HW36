/**
 * Module dependencies.
 */

function startServer() {
    var express = require('express'),
        http = require('http'),
        path = require('path'),
        app = express(),
        methodOverride = require('method-override'),
        request = require('request'),
        Firebase = require('firebase'),
        packagesRef = new Firebase('https://burning-inferno-529.firebaseio.com'),
        _ = require('lodash');

    /**
     * LOAD TWILIO STUFF
     */
    var twilio = require("./node_modules/twilio");
    var accountData = {
        authToken: process.env.authToken,
        sid: process.env.sid,
        phoneNumber: process.env.phoneNumber,
        twilioPhoneNumber: process.env.twilioPhoneNumber
    };
    if(!accountData.authToken || !accountData.sid){
        accountData = require("./stuff.js").data;
    };
    var client = twilio(accountData.sid, accountData.authToken);
    var bodyParser = require('body-parser');
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }))
    ////////

    function querify(queryParamsObject) {
        return '?' + _.map(queryParamsObject || {}, function(val, key) {
            return key + '=' + val
        }).join('&');
    }

    // adds a new rule to proxy a localUrl -> webUrl
    // i.e. proxify ('/my/server/google', 'http://google.com/')
    function proxify(localUrl, webUrl) {
        app.get(localUrl, function(req, res) {
            var url = [
                webUrl,
                querify(req.query)
            ].join("");

            req.pipe(request(url)).pipe(res);
        });
    }

    // Old Twilio routing function
        // function sendTwilioSMS() {
        //     app.get('/TwilioTest/', function(req, res) {
        //         client.messages.create({
        //             body: "You have received a package. Reply yes for home delivery.",
        //             to: accountData.phoneNumber,
        //             from: accountData.twilioPhoneNumber
        //                 // mediaUrl: ""
        //         }, function(err, message) {
        //             // console.log(err, message)
        //             res.send(message)
        //         });
                
        //     })
        // }

    function sendTwilioSMS(number, message) {
        client.sendMessage({
            body: message || "You have received a package. Reply yes for home delivery.",
            // to: accountData.phoneNumber,
            to: number,
            from: accountData.twilioPhoneNumber
                // mediaUrl: ""
        }, function(err, message) {});
    }

    function receiveTwilioSMS() {
        app.post('/message/', function(req, res) {
            var resp = new twilio.TwimlResponse();
            if (req.body.Body.trim().toLowerCase() === 'yes' ) {
                var fromNum = req.body.From.substring(1);
                console.log(fromNum);
                // console.log(fromNum.toString())
                // fromNum.toString();
                console.log("trying");
                resp.message('Thank you, we will deliver your package between 6-9 PM');
                // $.when(
                    packagesRef.orderByChild('phoneNumber').equalTo(fromNum).on('child_added', function(snapshot){
                    console.log(snapshot.key());
                    console.log(snapshot.val());
                    var delivery = snapshot.val().deliveryChoice
                    delivery.set('Home Delivery');

                    // return snapshot.val().deliveryChoice
                    // })
                // ).then(function(delivery){
                    // delivery.set('Home Delivery');
                // })
            })
            // resp.message('We will deliver!');
            res.writeHead(200, {
                'Content-Type':'text/xml'
            })
            res.end(resp.toString());
        });
    }

    /*
    Better Twilio Stuff!
     */
    function newPackageSMS() {
        var newItems = false;
        var newTask = {};

        packagesRef.on('child_added', function(dataSnapshot) {
            if (!newItems) return;
            console.log(dataSnapshot.val());
            newTask.number = +dataSnapshot.child('phoneNumber').val();
            // console.log(newTask.number);
            sendTwilioSMS(newTask.number);
        });
        packagesRef.once('value', function(dataSnapshot) {
            newItems = true;
        });
    }


    // sendTwilioSMS();
    newPackageSMS();
    receiveTwilioSMS();

    // add your proxies here.
    //
    // examples:
    // proxify('/yummly/recipes', 'http://api.yummly.com/v1/api/recipes');
    // proxify('/brewery/styles', 'https://api.brewerydb.com/v2/styles');

    // all environments
    app.set('port', process.argv[3] || process.env.PORT || 3000);
    app.use(methodOverride());
    app.use(express.static(path.join(__dirname, '')));

    http.createServer(app).listen(app.get('port'), function() {
        console.log('Express server listening on port ' + app.get('port'));
    });
}

module.exports.startServer = startServer;
