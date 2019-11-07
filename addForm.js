// Open a form by ID and log the responses to each question.
var form = FormApp.openById('1qUmyETTHaX-dwCZNKZJATLHQmGyS9WHosiKbigsLKaI');
var formResponses = form.getResponses();
for (var i = 0; i < formResponses.length; i++) {
  var formResponse = formResponses[i];
  var itemResponses = formResponse.getItemResponses();
  for (var j = 0; j < itemResponses.length; j++) {
    var itemResponse = itemResponses[j];
    Logger.log('Response #%s to the question "%s" was "%s"',
        (i + 1).toString(),
        itemResponse.getItem().getTitle(),
        itemResponse.getResponse());
  }
}


// For a multiple choice question with options: "Always true", "Sometimes true", and "Never",
// award half credit for responses that answered "Sometimes true".
var formResponses = FormApp.getActiveForm().getResponses();
// Go through each form response
for (var i = 0; i < formResponses.length; i++) {
  var response = formResponses[i];
  var items = FormApp.getActiveForm().getItems();
  // Assume it's the first item
  var item = items[0];
  var itemResponse = response.getGradableResponseForItem(item);
  // Give half credit for "Sometimes true".
  if (itemResponse != null && itemResponse.getResponse() == 'Sometimes true') {
    var points = item.asMultipleChoiceItem().getPoints();
    itemResponse.setScore(points * .5);
    // This saves the grade, but does not submit to Forms yet.
    response.withItemGrade(itemResponse);
  }
}
// Grades are actually submitted to Forms here.
FormApp.getActiveForm().submitGrades(formResponses);