var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require('mongoose');

//DB setup
mongoose.connect("mongodb://mongo:27017/yelp_camp", {useMongoClient: true});

var Campground = require('./models/campground'),
    Comment    = require('./models/comment'),
    seedDB     = require('./seeds');

// seedDB();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + "/public"));

app.set("view engine", "ejs");

app.get("/", function(req, resp) {
    resp.render("landing");
})

app.get("/campgrounds", function(req, resp) {
    Campground.find(function(err, campgrounds) {
        if(!err) {
            resp.render("campgrounds/index", {campgrounds:campgrounds});
        }
    });
});

app.get("/campgrounds/new", function(req, resp) {
    resp.render("campgrounds/new");
});

app.post("/campgrounds", function(req, resp) {
    var name = req.body.name;
    var image = req.body.image;
    Campground.create({
        name:name, url:image
    }, function(err, campground) {
        if(!err) {
            console.log("Created");
            console.log(campground);
        }
        resp.redirect("/campgrounds");
    });
});

app.get("/campgrounds/:id", function(req, resp) {
    Campground.findById(req.params.id).populate("comments").exec(function(err, campground) {
        resp.render("campgrounds/show", {campground:campground});
    });
});

// Comments routes
app.get("/campgrounds/:id/comments/new", function(req, resp) {
    Campground.findById(req.params.id).populate("comments").exec(function(err, campground) {
        resp.render("comments/new", {campground:campground});
    });
});

app.post("/campgrounds/:id/comments", function(req, resp) {
    Campground.findById(req.params.id, function(err, campground){
        if(err) {
            console.log(err);
            resp.redirect("/campgrounds");
        }
        else {
            Comment.create(req.body.comment, function(err, comment){
                if(err) {
                    console.log(err);
                }
                else {
                    campground.comments.push(comment);
                    campground.save();
                    resp.redirect("/campgrounds/"+campground._id);
                }
            });
        }
    });
});


app.listen(80, function() {
    console.log("Yelp camp app started on port 80");
});
