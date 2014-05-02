//
// Weather UnderGround  API Client


var request = require('request');
var util = require('util');
var RateLimiter = require('limiter').RateLimiter;
//Using rate limiter , as this api is free and have limited calls per minute by default.
// limter provides a basic request rate , and count requests per minute and do increment/reset limit after each successful request.
var rateCount = 10;
var rateTime = 'minute';
var limiter = new RateLimiter(rateCount, rateTime);

var wundergroundclient = function (apikey, debug, rateCount, rateTime) {
    if (rateCount && rateTime) {
        console.log('reseting rate : ' + rateCount + ' per ' + rateTime);
        limiter = new RateLimiter(rateCount, rateTime);
    }

    var format = ".json";
    console.log('Wunderground Client initialized, debug enbaled: ' + debug + ', rateCount: ' + rateCount + ', rateTime: ' + rateTime);

    var host = 'http://api.wunderground.com/api/' + apikey;

    if (debug) console.log('Host: ' + host);
    var get = function (callback, params, path) {
        var url = host + path;
        if (debug) console.log('get: ' + url);

        // Throttle requests
        limiter.removeTokens(1, function (err, callbacks) {
            // errors out only if there are  request more than the maximum number of
            // requests we set in the constructor

            console.log('running limited request' + limiter.getTokensRemaining());
            request(url, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    if (debug) console.log('response body: ' + body);
                    callback(error, body);
                }
                else if (error) {
                    console.log('error: ' + err);
                }

            });
        });


    };


    this.conditions = function (query, callback) {
        var path = "/conditions/q/" + query + format;
        get(callback, null, path);
    };
    this.requestmasker = function (query, callback) {
        var path;
        var maskedUrl;
        var url;
        var maskedUrls = [];
        for (var i = 0, len = query.length; i < len; ++i) {
            maskedUrl = query[i].state + '/' + query[i].city;
            path = "/conditions/q/" + maskedUrl + format;

            //url= host + path;
            maskedUrls.push(JSON.stringify(get(callback, null, path)));
        }

        return maskedUrls;

    };

};

module.exports = wundergroundclient;