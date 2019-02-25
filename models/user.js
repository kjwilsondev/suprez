const mongoose = require('mongoose');
const Schema   = mongoose.Schema;
const bcrypt   = require('bcrypt');

// User Model
const UserSchema = new Schema({
    username: { type: String, required: true },
    password: { type: String, required: true }
    // age: { type: Number }
});

// Password
UserSchema.pre('save', function(next) {
    let user = this;

    // hashing password
    bcrypt.hash(user.password, 10, function (err, hash) {
        if (err) return next(err);

        user.password = hash;
        next();
    })
});

// Authenticating User
UserSchema.statics.authenticate = function(username, password, next) {
    // checks if user exists
    User.findOne({ username: username })
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

const User = mongoose.model('User', UserSchema);
module.exports = User;
