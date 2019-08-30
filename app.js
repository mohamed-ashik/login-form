const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const encrypt = require('mongoose-encryption');

const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser : true});

const userSchema = new mongoose.Schema({
    userName: String,
    password: String 
});

const secret = "Thisisourlittlesecret";

userSchema.plugin(encrypt, {secret: secret, encryptedFields: ["password"]});

const User = new mongoose.model("User", userSchema); 

app.get("/", function(req, res){
    res.render("register");
});

app.get("/login", function(req, res){
    res.render("login");
});


app.post("/", function(req, res){
    const newUser = new User({
        userName: req.body.username,
        password: req.body.password
    });
    
    newUser.save(function(err){
       if(err){
           console.log(err);
       }
       else{
           res.render("reg_Success");
       }
    });
});

app.post("/login", function(req, res){
    const userName = req.body.username;
    const password = req.body.password;

    User.findOne({userName: userName}, function(err, foundUser){
        if(err){
            console.log(err);
            
        }
        else{
            if(foundUser.password === password){
                res.render("login_success");
            }
            else{
                res.render("login-incorrect")
            }
            
        }
    });
});

app.listen("3000", function(req, res){
    console.log("server started on port 3000");
    
});
