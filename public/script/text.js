function abbrList() {
  var abbrList = document.getElementsByTagName('abbr');
  var desList = {};
  for (var i = 0; i < abbrList.length; i++) {
    var title = abbrList[i].getAttribute('title');
    var text = abbrList[i].lastChild.nodeValue;
    desList[text] = title;
  }
  var destElement = document.createElement('dl');
  for (var key in desList) {
    var dtElement = document.createElement('dt');
    var dtText = document.createTextNode(key);
    dtElement.appendChild(dtText);
    var ddElement = document.createElement('dd');
    var ddText = document.createTextNode(desList[key]);
    ddElement.appendChild(ddText);
    destElement.appendChild(dtElement);
    destElement.appendChild(ddElement);
  }
  document.body.appendChild(destElement);
}

addLoadEvent(abbrList);
