var radio_home = document.getElementById("radio_home");

  function makeRadioButton(name, value, text) {

    var label = document.createElement("label");
    var radio = document.createElement("input");
    radio.type = "radio";
    radio.name = name;
    radio.value = value;

    label.appendChild(radio);

    label.appendChild(document.createTextNode(text));
    return label;
  }
  var yes_button = makeRadioButton("yesbutton", "yes", "Oh yea! do it!");
  radio_home.appendChild(yes_button);