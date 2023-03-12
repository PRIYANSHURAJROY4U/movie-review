//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
var _ = require("lodash");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const passport = require("passport");
const passportLocalMongoose = require('passport-local-mongoose');
const session = require('express-session');


mongoose.connect("mongodb+srv://movieforu1234:Havedb4321@cluster0.6wwu37r.mongodb.net/blogDB");
// mongoose.set('strictQuery', false);

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "EMAIL:: priyanshurajroy02659@gmail.com , CONTACT NO : 8252407817, BILLING ADDRESS:: NIT JALANDHAR";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.use(session({
  secret: "cookies are not tasty",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

const userSchema = new mongoose.Schema ({
  username:String,
  name:String,
  email:String,
  password:String
});
userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User",userSchema)

passport.use(User.createStrategy());

passport.serializeUser(function(user, done) {
    done(null, user.id);

});


passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});




const blogSchema = new mongoose.Schema ({
  title:String,
  content:String
});

const Blog = mongoose.model("Blog",blogSchema)



app.post("/compose",function(req,res){
 const post = new Blog ({
   title:req.body.writen,
   content:req.body.text1
 });

 post.save(function(err){
   if (!err) {
     res.redirect("/");
   }
 });
 });


app.get("/",function(req,res){
Blog.find({},function(err,posts){
  res.render("home" ,{hometext:homeStartingContent,newposts:posts});
});
});

app.get("/about",function(req,res){
  res.render("about",{abouttext:aboutContent});
});

app.get("/contact",function(req,res){
  res.render("contact",{contacttext:contactContent});
});

app.get("/compose",function(req,res){
  // if (req.isAuthenticated()) {
  res.render("compose");
// }
});

app.get("/register", function(req,res){
  res.render("register");
});

app.get("/login",function(req,res){
  res.render("login");
});

app.post("/register", function(req,res){

User.register({name:req.body.name,username:req.body.username},req.body.password,function(err,user){
  if (err) {
      console.log(err);
  } else {
    passport.authenticate("local")(req,res,function(){
      // if (req.isAuthenticated) {
        res.redirect("/about");
        // console.log("hello");
      // }
      // console.log(err);
    });
  }
});
  });
  // console.log(err);

  app.post("/login",function(req,res){
    const user =  new User ({
      name:req.body.name,
      username:req.body.username,
      password:req.body.password
    });
     req.login(user, function(err){
       if (!err) {
         passport.authenticate("local")(req,res,function(){
           
           res.redirect("/");
         });
       }
     });
  });
// console.log(err);



app.get("/posts/:post_Id",function(req,res){
  const requestedpostid = _.lowerCase(req.params.post_Id);

  Blog.findOne({_id : requestedpostid}, function(err,post){
    if (!err) {
      res.render("post", {
      title: post.title,
      content: post.content
    });
    }



});
});



























app.listen(3000, function() {
  console.log("Server started on port 3000");
});
