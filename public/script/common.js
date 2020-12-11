function insertAfter(newNode, targetNode) {
  var parent = targetNode.parentNode;
  if (parent.lastChild === targetNode) {
    parent.appenChild(newNode);
  } else {
    parent.insertBefore(newNode, targetNode.nextSibling);
  }
}

function addLoadEvent(fun) {
  var oldOnload = window.onload;
  if (typeof window.onload !== 'function') {
    window.onload = fun;
  } else {
    window.onload = function () {
      oldOnload();
      fun();
    };
  }
}
