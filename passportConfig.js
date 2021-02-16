const db = require('./models');
const User = db.users;
const bcrypt = require("bcryptjs");
const localStrategy = require('passport-local').Strategy;
const passport = require('passport');

module.exports = (passport) => {
    passport.use(
        new localStrategy(
            {
                usernameField: 'email',
                passwordField: 'password'
            }, (email, password, done) => {
                User.findOne({
                    where: { email: email }
                }).then((user) => {
                    if (user == null) {
                        return done(null, false, { message: `No user exist's` });
                    }
                    if (user !== null) {
                        bcrypt.compare(password, user.password, (err, result) => {
                            if (err) return done(null, false);
                            if (result === true) {
                                return done(null, user, { messsage: `Successfully authenticated` });
                            }
                            else {
                                return done(null, false, { messsage: `Password not match` });
                            }
                        });
                    }
                })
                    .catch(err => console.log(err));
            }));


    passport.serializeUser((user, cb) => {
        cb(null, user.id);
    });

    passport.deserializeUser((id, cb) => {
        User.findOne({
            where: { id: id }
        }).then((err, user) => {
            cb(err, user)
        });
    });
}