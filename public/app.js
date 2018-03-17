

function scrapeNews () {
      console.log('in scrapeNews');
      var data={};
    $.getJSON("/scrape", function(data) {
        console.log('successfully scraped');
        console.log('data from the scrape', data);
        getNews();

    });
}
//__________________________________________________________________________
function getNews () {
  console.log('in getNews');
    $.getJSON("/News", function(data) {
      console.log(data);
      // For each one
      for (var i = 0; i < data.length; i++) {
          // Display the information on the page
          $("#news").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "</p>");
          $("#news").append("<a data-id='" + data[i]._id + "' href='"   + data[i].link + "' target='about_blank'>" + data[i].link + "</a>");
          console.log('\n\nappending News to page');
      }
    });
}

scrapeNews();
//__________________________________________________________________________
// Whenever someone clicks the P Divs
$(document).on("click", "p", function() {
  // Clear out the notes section 
  $("#notes").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the News
  $.ajax({
    method: "GET",
    url: "/News/" + thisId
  })
    // Add notes
    .done(function(data) {
      console.log(data);
      // The title of the News
      $("#notes").append("<p class='title'>" + data.title + "</p>");
      // An input to enter a new title
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the News saved to it
      $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");
      // A button to delete a new note, with the id of the News saved to it
      $("#notes").append("<button data-id='" + data._id + "' id='deletenote'>Delete Note</button>");
      // If there's a note in the News
      if (data.note) {
        // Place the body of the note in the body text
        $("#bodyinput").val(data.note.body);
      }
    });
});
//_____________________________________________________________________________
// Onclick for save note
$(document).on("click", "#savenote", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/News/" + thisId,
    data: {
      // Value taken from note text
      body: $("#bodyinput").val()
    }
  })
    .done(function(data) {
      // Empty the notes section
      $("#notes").empty();
    });

  // Also, remove the values entered in the textarea for note entry
  $("#bodyinput").val("");
});
//______________________________________________________________________________
// Onclick for delete note
$(document).on("click", "#deletenote", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");
  //console.log('delete id', thisId);

  $.ajax({
    method: "DELETE",
    url: "/delete/" + thisId,
  })
    // done!! 
    .done(function(data) {
      // Log the response
      console.log('app.js delete - data',data);
      // Empty the notes section
      $("#notes").empty();
    });

  // Remove the values entered for notes
  $("#bodyinput").val("");
});