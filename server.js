const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const passportLocal = require('passport-local').Strategy;
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const db = require('./models');
const User = db.users;
const app = express();

//Middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// db.sequelize.sync();

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}))

app.use(cookieParser("secretcode"));
app.use(passport.initialize());
app.use(passport.session());
require('./passportConfig')(passport);

app.use(session({
    secret: "secretcode",
    resave: true,
    saveUninitialized: true,
    maxAge: 3600000
}));

//Routes

app.post('/login', (req, res, next) => {
    passport.authenticate("local",
        (err, user, info) => {
            if (err) throw err;
            if (user === false) {
                return res.send(info);
            }
            else {
                req.logIn(user, () => {
                    if (user !== false) {
                        console.log(info);
                        return res.send(user); 
                    }
                    else if (user === false) {
                        return res.send(info);
                    }
                })
            }
        })(req, res, next);
});

app.post('/register', (req, res) => {
    User.findOne({
        where: { email: req.body.email }
    }).then(async (user) => {

        if (user === null) {
            const hashPassword = await bcrypt.hash(req.body.password, 10);
            const newUser = {
                name: req.body.name,
                email: req.body.email,
                password: hashPassword
            }
            User.create(newUser)
                .then({ message: "User created sucessfully" })
                .catch((err) => console.log(err))
        }
        else {
            console.log(user)
            console.log("User already exists");
        }
    })
        .catch(err => console.log(err))
})

app.get('/dashboard/:id', (req, res) => {
    User.findOne({
        where: { email: req.body.email }
    }).then(res.redirect("http://localhost:3000/dashboard"))
})


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running at port ${PORT}`)
})