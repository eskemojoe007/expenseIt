/**

*/
function getContextualAddOn(event) {
  var card = CardService.newCardBuilder();
  card.setHeader(CardService.newCardHeader().setTitle("Log Your Expense"));

  var section = CardService.newCardSection();

  section.addWidget(
    CardService.newTextInput()
      .setFieldName("Date")
      .setTitle("Date")
  );
  section.addWidget(
    CardService.newTextInput()
      .setFieldName("Amount")
      .setTitle("Amount")
  );
  section.addWidget(
    CardService.newTextInput()
      .setFieldName("Description")
      .setTitle("Description")
  );
  section.addWidget(
    CardService.newTextInput()
      .setFieldName("Spreadsheet URL")
      .setTitle("Spreadsheet URL")
  );

  card.addSection(section);

  return [card.build()];
}
