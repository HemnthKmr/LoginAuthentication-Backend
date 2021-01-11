const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const passportLocal = require('passport-local').Strategy;
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
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
app.use(flash());
require('./passportConfig')(passport);

app.use(session({
    secret: "secretcode",
    resave: true,
    saveUninitialized: true,
    maxAge: 3600000
}));

//Routes

app.post('/login', (req, res, next) => {
    passport.authenticate("local",{
        successRedirect: 'http://localhost:3000/dashboard',
        failureRedirect: 'http://localhost:3000/login'
    },
         (err, data) => {
        if (err) throw err;
        if (data === null) res.send("No User Exists");
        else {
            req.logIn(data,() => {
                if(data !== false){
                    console.log("Successfully authenticated");
                    return res.redirect("http://localhost:3000/dashboard")
                }
                else{
                    console.log("password Doesnt Match");
                    return res.redirect("http://localhost:3000/login")
                }
            })
        }
    })(req, res, next);
});

app.post('/register', (req, res) => {
    User.findOne({
        where: { email: req.body.email }
    }).then( async (data) => {
        if(data === null){
                    const hashPassword = await bcrypt.hash(req.body.password, 10);
                    const newUser = {
                        name: req.body.name,
                        email: req.body.email,
                        password: hashPassword
                    }
                    await User.create(newUser)
                        .then(res.redirect("http://localhost:3000/login"))
                        .catch((err) => console.log(err))
                }
        if(data !== null){
            console.log("User already exists");
            res.redirect("http://localhost:3000/register")
        }
    })
        .catch(err => console.log(err))
})

app.get('/dashboard/:id', (req,res) => {
    User.findOne({
        where: { email: req.body.email }
}).then(res.redirect("http://localhost:3000/dashboard"))
})



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running at port ${PORT}`)
})