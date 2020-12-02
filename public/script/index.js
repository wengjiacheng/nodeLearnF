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

function Mammal(name) {
  this.name = name
}

Mammal.prototype.get_name = function () {
  return this.name
}

function Cat(name) {
  this.name = name
  this.saying = 'meow'
}
Cat.inherits(Mammal).method('purr', function (n) {
  var result = ''
  for (var i = 0; i < n; i++) {
    if (result) {
      result += '-'
    }
    result += 'r'
  }
  return result
})

const cat = new Cat('cc')
console.log(cat)

// 原型继承
// 构造一个基础的对象，
// 构造函数的机制构造新的对象，构造函数的prototype = 基础对象
const mammalP = {
  name: 'Herb MammalP',
  get_name: function () {
    return this.name
  },
}

const catP = Object.beget(mammalP)
catP.name = 'kitty'
catP.purr = function (n) {
  var result = ''
  for (var i = 0; i < n; i++) {
    if (result) {
      result += '-'
    }
    result += 'r'
  }
  return result
}
