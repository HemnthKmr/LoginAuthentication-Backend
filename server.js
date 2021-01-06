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

app.use(session({
    secret: "secretcode",
    resave: true,
    saveUninitialized: true
}));

app.use(cookieParser("secretcode"));
app.use(passport.initialize());
app.use(passport.session());
require('./passportConfig')(passport);

//Routes

app.post('/login', (req, res, next) => {
    passport.authenticate("local",(err,data) => {
        if(err) throw err;
        if(!data) res.send("No User Exists");
        else{
            req.logIn((data, err) => {
                if(err) throw err;
                res.send("Successfully authenticated");
                console.log(req.data);
            })
        }
    }) (req,res,next);
});

app.post('/register', (req, res) => {
    User.findOne({
        where: { email: req.body.email }
    }).then(() => {
        console.log("User already exists");
        res.redirect("http://localhost:3000/register")
    })
        .catch(async () => {
            const hashPassword = await bcrypt.hash(req.body.password, 10);
            const newUser = {
                name: req.body.name,
                email: req.body.email,
                password: hashPassword
            }
            await User.create(newUser)
                .then(res.redirect("http://localhost:3000/login"))
                .catch((err) => console.log(err))
        });
})

app.get('/user', (req, res) => { res.send(req.data)})

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running at port ${PORT}`)
})