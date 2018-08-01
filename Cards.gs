/* global CardService */
var FIELDNAMES = ['Date', 'Amount', 'Description', 'Spreadsheet URL'];

function createFormSection(section, inputNames, optPrefills) {
  // Add a widget for each inputNames...fill if found with prefill
  for (var i = 0; i < inputNames.length; i++) {
    var widget = CardService.newTextInput()
      .setFieldName(inputNames[i])
      .setTitle(inputNames[i]);
    if (optPrefills && optPrefills[i]) {
      widget.setValue(optPrefills[i]);
    }
    section.addWidget(widget);
  }
  return section;
}

function createExpensesCard(optPrefills, optStatus) {
  // Create the basic Card
  var colorStatus;
  var card = CardService.newCardBuilder();
  card.setHeader(CardService.newCardHeader().setTitle('Log Your Expense'));

  // If we have a status add a section for the status
  if (optStatus) {
    // If the status is in the first slot of the array
    if (optStatus.indexOf('Error: ') === 0) {
      colorStatus = "<font color='#FF0000'>" + optStatus + '</font>';
    } else {
      colorStatus = "<font color='#228B22'>" + optStatus + '</font>';
    }
    var statusSection = CardService.newCardSection();
    statusSection.addWidget(
      CardService.newTextParagraph().setText('<b>' + colorStatus + '</b>')
    );
    card.addSection(statusSection);
  }

  // Add Actual Form
  var formSection = createFormSection(
    CardService.newCardSection(),
    FIELDNAMES,
    optPrefills
  );
  card.addSection(formSection);

  return card;
}
