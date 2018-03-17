// Require mongoose
var mongoose = require("mongoose");
//_____________________________________________
// Create Schema class
var Schema = mongoose.Schema;
//_____________________________________________

// Create News schema
var Newschema = new Schema({
  // title is a required string
  title: {
    type: String,
    required: true
  },
  // link is a required string
  link: {
    type: String,
    required: true
  },
  // This only saves one note's ObjectId, ref refers to the Note model
  note: {
    type: Schema.Types.ObjectId,
    ref: "Note"
  }
});
//_____________________________________________
// Create the News model with the Newschema
var News = mongoose.model("News", Newschema);


// Export the model
module.exports = News;
