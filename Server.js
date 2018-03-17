/* Set up the server.js file 
//require npm packages, express, body-parser, methodOverride, path, express-handlebars and the handlebars engine
*/
// Setup my Dependencies
var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var path = require('path');
var exphbs = require('express-handlebars');
var router = require('./controllers/controller.js');

// now ... initialize Express
var app = express();

// setup handlebars templating engine
// set the ".handlebars" engine as the view engine
// set the view file as .handlebars
// set the default layout as "main"
app.engine('handlebars', exphbs({ defaultLayout: 'main', extname: '.handlebars' }));
app.set('view engine', 'handlebars');

// Use morgan and body parser with the app
var logger = require("morgan");
app.use(logger("dev"));

// Serve the app from the "public" folder.
app.use(express.static(process.cwd() + '/public'));

// per google ... BodyParser will make it easy for the server to read data sent to it ... pulled code... 
app.use(bodyParser.urlencoded({ extended: true }));

// MethodOverride.... override with POST having ?_method=DELETE
app.use(methodOverride('_method'));

//
app.use('/', router);

// Set up the port as 4000 for the server
var port = process.env.PORT || 4000;
app.listen(port, function() {
    console.log("App Server is listening on port " + port);
});