// Require mongoose
var mongoose = require("mongoose");
//_____________________________________________

// Create a schema class
var Schema = mongoose.Schema;
//_____________________________________________

// Create the Note schema
var NoteSchema = new Schema({
  // Just a string
  title: {
    type: String
  },
  // Just a string
  body: {
    type: String
  }
});
//_____________________________________________

// Create the Note model with the NoteSchema
var Note = mongoose.model("Note", NoteSchema);

// Export the Note model
module.exports = Note;
