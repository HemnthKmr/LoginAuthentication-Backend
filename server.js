const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const passportLocal = require('passport-local');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const session = require('express-session');

const app = express();

//Middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true})) 

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

//Routes

app.post('/login', (req,res) => {
    console.log(req.body);
})
app.post('/register', (req,res) => {
    console.log(req.body);
})

app.post('/user', (req,res) => {})

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running at port ${PORT}`)
})