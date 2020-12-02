Object.beget = function (o) {
  function F() {}
  F.prototype = o
  return new F()
}

Function.prototype.method = function (name, fun) {
  this.prototype[name] = fun
  return this
}

// 对于对象来说重要的是它能做什么，而不是它的起源

Function.method('new', function () {
  // 创建一个新对象
  var that = Object.beget(this.prototype)
  // 调用构造函数，将this绑定到新对象上
  var other = this.apply(that, arguments)
  // 返回值不是一个对象，就返回新对象
  return typeof other === 'object' && other ? other : that
})

Function.method('inherits', function (Parent) {
  this.prototype = new Parent()
  return this
})

function insertAfter(newNode, targetNode) {
  var parent = targetNode.parentNode
  if (parent.lastChild === targetNode) {
    parent.appenChild(newNode)
  } else {
    parent.insertBefore(newNode, targetNode.nextSibling)
  }
}

function createGallery() {
  var img = document.createElement('img')
  img.setAttribute('id', 'cover')
  img.setAttribute('src', '/image/back.jpg')
  img.setAttribute('alt', 'cover')
  var para = document.createElement('p')
  para.setAttribute('id', 'description')
  var txt = document.createTextNode('cover')
  para.appendChild(txt)
  var imagegallery = document.getElementById('imagegallery')
  insertAfter(img, imagegallery)
  insertAfter(para, img)
}

function imagegalleryPopuc() {
  if (!document.getElementById) {
    return false
  }
  if (!document.getElementsByTagName) {
    return false
  }
  var imagegallery = document.getElementById('imagegallery')
  if (!imagegallery) {
    return false
  }
  var aList = imagegallery.getElementsByTagName('a')
  for (var i = 0; i < aList.length; i++) {
    aList[i].onclick = function () {
      return !showPic(this)
    }
  }
}

function showPic(wishPic) {
  var cover = document.getElementById('cover')
  if (!cover) {
    return false
  }
  if (cover.nodeName !== 'IMG') {
    return false
  }
  var source = wishPic.getAttribute('href')
  cover.setAttribute('src', source)
  var description = document.getElementById('description')
  if (description) {
    var text = wishPic.getAttribute('title') || ''
    if (description.firstChild.nodeType === 3) {
      description.firstChild.nodeValue = text
    }
  }
  return true
}

function addLoadEvent(fun) {
  var oldOnload = window.onload
  if (typeof window.onload !== 'function') {
    window.onload = fun
  } else {
    window.onload = function () {
      oldOnload()
      fun()
    }
  }
}

addLoadEvent(createGallery)
addLoadEvent(imagegalleryPopuc)
