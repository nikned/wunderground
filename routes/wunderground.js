var express = require('express');
var router = express.Router();
var WeatherUGClient = require('../wundergroundclient');
var URL = require('url');

var request = require('request');


// Temp API key
var apikey = "7bb74ba21daa6994";


// in order to test client
var debug = false;

// Create Client
var wunderground = new WeatherUGClient(apikey, debug, 10, 'minute');

router.get('/', function (req, res) {
    res.end('Please provide city and state params in request ! \n' +
        '(Refer: ReadMe for using api services!)');
});


router.get('/conditions', function (req, res) {
    var query = URL.parse(req.url).query;
    console.log('query: ' + query);

    var maskedUrl = req.query.state + '/' + req.query.city;
    wunderground.conditions(maskedUrl, function (err, obj) {
        if (err || (res.statusCode != 200)) {
            console.log(err);
            return;

        }
        var conditions = JSON.parse(obj);

        console.log('retrieved conditions for ',
            conditions.current_observation.display_location.city, ',',
            conditions.current_observation.display_location.state, 'successfully.');


        res.render('populateweather', { title: 'populateweather!', data: JSON.parse(JSON.stringify([callback(false, conditions)]))});
        res.end(res);

    });


});


/*encountered blocking situation with async, unable to debug blocking issue and callbacks.
 //switching to wait.for solution
 ------------------------------------------------------------------------------------------------------------------------------------------------------------------------
 router.get('/listcities', function (req, res, next) {
 var string = req.body.code;
 console.log("enterred request execution -- first part");
 // var maskedUrl = req.query.state + '/' + req.query.city;
 var fs = require('fs');
 var cities_list = {};
 var citiesinfo = [];
 cities_list = JSON.parse(fs.readFileSync('./listcities.json'));
 async.forEach(
 Object.keys(cities_list),
 function (entry, callback) {
 console.log("enterred async loop");
 //The second argument (callback) is the "task callback" for a specific messageId
 var key = cities_list[entry];
 //if (validateinput(key.city,key.state,callback)) {
 var maskedUrl = key.state + '/' + key.city;

 wunderground.conditions(maskedUrl, function (err, obj) {
 if (err || (res.statusCode != 200)) {
 console.log(err);
 return;

 }
 var conditions = JSON.parse(obj);
 console.log('retrieved conditions for ',
 conditions.current_observation.display_location.city, ',',
 conditions.current_observation.display_location.state, 'successfully.');
 citiesinfo.push(conditions);
 console.log("pushed values");
 return;
 });
 //}
 console.log("enterred second execution");

 }, function (err) {
 if (err) return next(err);
 res.json({
 success: true,
 message: ' message(s) was deleted.'
 });
 console.log("enterred last final execution");

 });
 });
 ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

 */


/* GET Populate default cities page. */
router.get('/listcities', function (req, res) {

    var fs = require('fs');
    var cities_list = {};
    var citiesInfo = [];

    cities_list = JSON.parse(fs.readFileSync('./listcities.json'));
    //execute parallel, 2 endpoints, wait for results
    var maskedUrl;
    console.log("here-1");
    var temp = 1;
    for (var i = 0, len = cities_list.length; i < len; ++i) {
        maskedUrl = cities_list[i].state + '/' + cities_list[i].city;
        wunderground.conditions(maskedUrl, function (err, obj) {

            if (err || (res.statusCode != 200)) {
                console.log(err);
                return;

            }
            var conditions = JSON.parse(obj);
            var render_attribs = {};
            console.log('retrieved conditions for ', conditions.current_observation.display_location.city, ',', conditions.current_observation.display_location.state, 'successfully.');
            render_attribs.city = conditions.current_observation.display_location.city;
            render_attribs.state = conditions.current_observation.display_location.state;
            render_attribs.info = (conditions.current_observation.weather) + ', ' +
                (conditions.current_observation.temperature_string);
            citiesInfo.push(render_attribs);
            temp++;
            //---- temp fix for callback issues --//
            if (temp == cities_list.length) {
                res.render('populateweather', { title: 'weather information of cities !', data: JSON.parse(JSON.stringify(citiesInfo))/*JSON.parse(JSON.stringify(citiesInfo))*/});
                res.end();
            }

        });


    }


});

/*
 populating required attributes of a weather payload

 */
function callback(err, conditions) {

    if (!err) {

        var render_attribs = {};

        render_attribs.name = conditions.current_observation.display_location.city;
        render_attribs.state = conditions.current_observation.display_location.state;
        render_attribs.info = (conditions.current_observation.weather) + ', ' +
            (conditions.current_observation.temperature_string);

    }
    return render_attribs;

}


module.exports = router;