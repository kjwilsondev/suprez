const mongoose = require('mongoose');
const Schema   = mongoose.Schema;
const bcrypt   = require('bcrypt');

var http       = require('http');
var giphy      = require('giphy-api')();

// Keyword Model
const KeywordSchema = new Schema({
    word: { type: String, required: true },
    // age: { type: Number }
});

// Authenticating User
KeywordSchema.statics.authenticate = function(word, next) {
    // checks if keyword exists
    Keyword.findOne({ word: word })
        .exec(function (err, user) {
            if (err) {
                return next(err)
            } else if (!user) {
                var err = new Error('User not found');
                err.status = 401;
                return next(err);
            }
            // checks password
            bcrypt.compare(password, user.password, function (err, result) {
                if (result == true) {
                    return next(null, user);
                } else {
                    return next();
                }
            });
        });
}

const Keyword = mongoose.model('Keyword', KeywordSchema);
module.exports = Keyword;

// // Password
// UserSchema.pre('save', function(next) {
//     let user = this;

//     // hashing password
//     bcrypt.hash(user.password, 10, function (err, hash) {
//         if (err) return next(err);

//         user.password = hash;
//         next();
//     })
// });

// COPIED FROM GIPH.JS

// // GIPHY API - Stickers
// router.get('/stickers', function (req, res) {
//     var queryString = req.query.term;
//     console.log(queryString);
//     // removes white spaces and restricted characters
//     var term = encodeURIComponent(queryString);
//     // putting the search term into GIPHY API
//     var url  = 'http://api.giphy.com/v1/stickers/search?q=' + term + '&api_key=' + process.env.APIKEY

//     http.get(url, function(response) {

//         // sets response to utf8
//         response.setEncoding('utf8');

//         var body = '';

//         response.on('data', function(d) {
//             // continuously updates stream with data from giphy
//             body += d;
//         });

//         response.on('end', function() {
//             // retrieves finished data and parses it (JSON)
//             var parsed = JSON.parse(body);
//             // THIS LINE IS IMPORTANT
//             console.log(parsed.data[0].url)
//             // renders the home template and pass gif data to template
//             res.render('gif-sticker', {gifs: parsed.data})
//         });

//     });
// })

// router.get('/stickers', function(req, res) {
//     giphy.search(req.query.term, function (err, response) {
//         res.render('gif-sticker', {gifs: response.data})
//     });
// });
