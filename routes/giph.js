const express = require('express');
const router  = express.Router();
const User    = require('../models/user');
const auth    = require('./helpers/auth');
var dotenv    = require('dotenv').config();

var http      = require('http');
var giphy     = require('giphy-api')();

// GIPHY API - Gifs
router.get('/', function (req, res) {
    var queryString = req.query.term;
    console.log(queryString);
    // removes white spaces and restricted characters
    var term = encodeURIComponent(queryString);
    // putting the search term into GIPHY API
    var url  = 'http://api.giphy.com/v1/gifs/search?q=' + term + '&api_key=' + process.env.APIKEY

    // console.log(url);

    http.get(url, function(response) {

        // sets response to utf8
        response.setEncoding('utf8');

        var body = '';

        response.on('data', function(d) {
            // continuously updates stream with data from giphy
            body += d;
        });

        response.on('end', function() {
            // retrieves finished data and parses it (JSON)
            var parsed = JSON.parse(body);
            console.log(parsed.data[0].url)
            // renders the home template and pass gif data to template
            res.render('gif-home', {gifs: parsed.data})
        });

    });
})

router.get('/', function(req, res) {
    giphy.search(req.query.term, function (err, response) {
        res.render('gif-home', {gifs: response.data})
    });
});

// GIPHY API - Stickers
router.get('/stickers', function (req, res) {
    var queryString = req.query.term;
    console.log(queryString);
    // removes white spaces and restricted characters
    var term = encodeURIComponent(queryString);
    // putting the search term into GIPHY API
    var url  = 'http://api.giphy.com/v1/stickers/search?q=' + term + '&api_key=' + process.env.APIKEY

    http.get(url, function(response) {

        // sets response to utf8
        response.setEncoding('utf8');

        var body = '';

        response.on('data', function(d) {
            // continuously updates stream with data from giphy
            body += d;
        });

        response.on('end', function() {
            // retrieves finished data and parses it (JSON)
            var parsed = JSON.parse(body);
            console.log(parsed.data[0].url)
            // renders the home template and pass gif data to template
            res.render('gif-sticker', {gifs: parsed.data})
        });

    });
})

router.get('/stickers', function(req, res) {
    giphy.search(req.query.term, function (err, response) {
        res.render('gif-sticker', {gifs: response.data})
    });
});


module.exports = router;