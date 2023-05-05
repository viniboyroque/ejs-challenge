//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const req = require("express/lib/request");
const ejs = require("ejs");
const _= require("lodash");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));


mongoose.connect("mongodb+srv://viniciusroque:test123@cluster0.bdkql0f.mongodb.net/blogDB");


//Default Content///////////////////////
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";




//Mongoose Setup/////////////

//Post Schema and Model /////////////////////////



const postSchema = new mongoose.Schema({
  postTitle: {
    type: String,
    required: true
  },
  postBody: {
    type: String,
    required: true,
    maxLength: 200 
  }

});

const Post = mongoose.model("Post", postSchema);

//Default Data on startup/////////////////

const demoPost = new Post({
  postTitle: "Demo Post",
  postBody: "Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique."
});



const postArray = [demoPost];


//Home Page




app.get("/", function(req, res) {

  
  
  Post.find().then(function (postsDB) {
    
    if (postsDB.length === 0) {
      Post.insertMany(postArray).then(function () {
        console.log("Successfully saved defult posts to DB");
        
      })
      .catch(function (err) {
        console.log(err);
      });
      
      res.redirect("/");

    } else {
      res.render("home", {postArray: postsDB, postBody: postsDB.postBody, postTitle: postsDB.postTitle});
      };
      
    });

    
  
  

});



//About Page

app.get("/about", function (req, res) {
  res.render("about", {aboutContent: aboutContent});
});


//Contact Page

app.get("/contact", function (req, res) {
  res.render("contact", {contactContent: contactContent});
});

//Compose Page

app.get("/compose", function (req, res) {
  res.render("compose");
});

app.post ("/compose", function(req, res) {

  const postTitle = req.body.postTitle;
  const postBody = req.body.postBody;



  const post = new Post({ 
    postTitle: postTitle,
    postBody: postBody
  });
  post.save();
  res.redirect("/");
});

app.post("/delete", function(req, res) {
  const checkedPost = req.body.checkbox;
  

  
    Post.findByIdAndDelete(checkedPost).then(function () {
      console.log("Successfully saved defult items to DB");
      res.redirect("/");
    }).catch(function (err) {
      console.log(err);
    });
  
  });

//Params test

app.get ("/posts/:postName", function(req, res) {
  let postSelect = 
 _.lowerCase(req.params.postName);
  

  postArray.forEach(function(post) {
    const storedTitle = _.lowerCase(post.postTitle)

    if (postSelect === 
      storedTitle) {
       res.render("post", {postTitle: post.postTitle, postBody: post.postBody, postId: post._id });
     };
  });
  // for (let i = 0; i < postArray.length; i++) {
  //   if (postSelect === 
  //    _.lowerCase(postArray[i].postTitle)) {
  //     console.log("its a match!");
  //     res.render("post", {postTitle: postArray[i].postTitle, postBody: postArray[i].postBody});
  //   } else {
  //     console.log("not a match!")
  //     res.redirect("/");
  //   };
    
  // };
});

// Run Server

app.listen(process.env.PORT || 4000, function(){
  console.log("Server started on port 3000."); console.log("its a match!");
  
});














app.listen(3000, function() {
  console.log("Server started on port 3000");
});
