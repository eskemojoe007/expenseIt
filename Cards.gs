/* global CardService PropertiesService getSheetUrl */
var FIELDNAMES = ['Date', 'Amount', 'Description', 'Spreadsheet URL'];

/**
 * Returns an array corresponding to the given object and desired ordering of keys.
 *
 * @param {Object} obj Object whose values will be returned as an array.
 * @param {String[]} keys An array of key names in the desired order.
 * @returns {Object[]}
 */
function objToArray(obj, keys) {
  return keys.map(function (key) {
    return obj[key];
  });
}

/**
 * Logs form inputs into a spreadsheet given by URL from form.
 * Then displays edit card.
 *
 * @param {Event} e An event object containing form inputs and parameters.
 * @returns {Card} Card with the desired outputs
 */
function submitForm(e) {
  var res = e.formInput;
  try {
    // Make sure all the fields are specified.
    FIELDNAMES.forEach(function (fieldName) {
      if (!res[fieldName]) {
        throw new Error('Gotta fill out the whole form...dude!');
      }
    });
    // Get the sheet reference by url, and activate
    var sheet = SpreadsheetApp
      .openByUrl((res['Spreadsheet URL']))
      .getActiveSheet();

    // Add the form info, skip the URL
    sheet.appendRow(objToArray(res, FIELDNAMES.slice(0, FIELDNAMES.length - 1)));

    // Set the properties
    PropertiesService.getUserProperties().setProperties({'SPREADSHEET_URL': res['Spreadsheet URL']});

    // return card object.
    return createExpensesCard([null, null, null, getSheetUrl()],
      'Logged expense successfully!').build();
  } catch (err) {
    // On error...need to specify an error to the statusSection
    if (err === 'Exception: Invalid argument: url') {
      err = 'Invalid URL';
      res['Spreadsheet URL'] = null;
    }
    // return filled card but with error and existing values
    return createExpensesCard(objToArray(res, FIELDNAMES), 'Error: ' + err).build();
  }
}


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
  var submitLocal = CardService.newAction().setFunctionName('submitForm');
  var submitButton = CardService.newTextButton()
    .setText('Submit')
    .setOnClickAction(submitLocal);
  section.addWidget(CardService.newButtonSet().addButton(submitButton));

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
