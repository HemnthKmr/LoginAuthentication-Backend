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
            },(email,password,done) => {
            User.findOne({ 
                where:{email: email}
            }).then( (data) => {
                if(data === null){
                    return done(null,false);
                }
                if(data !== null)
                {
                    bcrypt.compare(password,data.password, (err, result)=> {
                        if(err) return done(null, false);
                        if(result === true){
                            return done(null,data);
                        }
                        else{
                            return done(null,false);
                        }
                    });
                }
            })
            .catch(err => console.log(err));
        }));


passport.serializeUser((data,cb) => {
    cb(null,data.id);
});

passport.deserializeUser((id,cb)=> {
    User.findOne({ 
        where: {id: id}
    }).then((err,data) => {
        cb(err,data)
    });
});
}