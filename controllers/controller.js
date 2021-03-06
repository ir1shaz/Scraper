// my functions for the routing of the app
var express = require('express');
var router = express.Router();
var mongoose = require("mongoose");

// Scrappin 
var request = require("request");
var cheerio = require("cheerio");

// Mongoose mpromise, bluebird promises
var Promise = require("bluebird");
mongoose.Promise = Promise;

// Requiring my Note and News models
var Note = require("../models/Note.js");
var News = require("../models/News.js");

//Mongod DB
var dbURI = 'mongodb://localhost/webscraping';

if (process.env.NODE_ENV === 'production') {
    dbURI= "mongodb://heroku_w677159l:cn2kbl6l1cogrv4vf13g13iug8@ds133158.mlab.com:33158/heroku_w677159l";
}

// mongoose DB
mongoose.connect(dbURI);
var db = mongoose.connection;

//Mongoose errors
db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

// Mongoose logged in message
db.once("open", function() {
  console.log("Mongoose connection successful.");
});

//redirect to /index
router.get('/', function (req, res) {
  res.redirect('/index');
});

router.get('/index', function (req, res) {
    res.render("index");
  });
//_______________________________________________________________________

// A GET request to scrape the News
router.get("/scrape", function(req, res) {
  // First, we grab the body of the html with request 
  request("http://www.espn.com/", function(error, response, html) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(html);
    $("p.title").each(function(i, element) {

      // Save an empty result object
      var result = {};

      // Add the text and href of every link, and save them as properties of the result object 
      result.title = $(this).children("a").text();
      result.link = $(this).children("a").attr("href");
      // save News title and link if it is News and not a comment
      if (result.link.slice(0,4) == "http") {
        if (result.title && result.link) {
            //If a document exists with title, don't add it to the db
            News.find({ title: result.title }, function(err, exists) {
                if (exists.length) {
                    console.log('News already exists');
                }
                else {

                    // Using our News model, create a new entry, passing the result object to the entry (the title and link)
                    var entry = new News(result);

                    // Now, save that entry to the db
                    entry.save(function(err, doc) {
                      // Log any errors
                      if (err) {
                        console.log(err);
                      }
                      // Or log the doc
                      else {
                        console.log(doc);
                      }
                    });
                }
            });
        }
      }
    });

  });
  // Tell the browser that we finished scraping the text
  res.json({});
});
//________________________________________________________________________

// This will get the News we scraped from the mongoDB
router.get("/News", function(req, res) {
  // Grab every doc in the News array
  News.find({}, function(error, doc) {
    // Log any errors
    if (error) {
      console.log(error);
    }
    // Or send the doc to the browser as a json object
    else {
      res.json(doc);
    }
  });
});
//_________________________________________________________________________

// Grab an News by it's ObjectId
router.get("/News/:id", function(req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  News.findOne({ "_id": req.params.id })
  // ..and populate all of the notes associated with it
  .populate("note")
  // now, execute our query
  .exec(function(error, doc) {
    // Log any errors
    if (error) {
      console.log(error);
    }
    // Otherwise, send the doc to the browser as a json object
    else {
      res.json(doc);
    }
  });
});
//_________________________________________________________________________

// Create a new note or replace an existing note
router.post("/News/:id", function(req, res) {
  // Create a new note and pass the req.body to the entry
  var newNote = new Note(req.body);

  // And save the new note the db
  newNote.save(function(error, doc) {
    // Log any errors
    if (error) {
      console.log(error);
    }
    // Otherwise
    else {
      // Use the News id to find and update it's note
      News.findOneAndUpdate({ "_id": req.params.id }, { "note": doc._id })
      // Execute the above query
      .exec(function(err, doc) {
        // Log any errors
        if (err) {
          console.log(err);
        }
        else {
          // Or send the document to the browser
          res.send(doc);
        }
      });
    }
  });
});

router.delete("/delete/:id", function (req, res) {

  News.findById(req.params.id, function(err, News) {
      Note.findByIdAndRemove(News.note, function(err,note){
        News.findOneAndUpdate({ "_id": req.params.id }, { "note": "" })
          .exec(function(err,doc) {
          console.log('\n\ndelete route - News' + News + "\n");
          console.log('\n');
          res.send(News);
          });
      });
  });

});


module.exports = router;
