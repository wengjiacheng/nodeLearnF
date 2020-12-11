// function MyPromise(executor) {
//   var self = this;
//   this.status = 'pending';
//   this.data = undefined;
//   this.onFulfillCallback = [];
//   this.onRejectedCallback = [];
//   // promise 状态确定后就不会改变，所以resolve函数和reject函数要判断当前状态是否是pending
//   function resolve(value) {
//     setTimeout(function () {
//       if (self.status === 'pending') {
//         self.status = 'fulfill';
//         self.data = value;
//         for (var i = 0; i < self.onFulfillCallback.length; i++) {
//           self.onFulfillCallback[i](value);
//         }
//       }
//     }, 0);
//   }
//   function reject(reason) {
//     setTimeout(function () {
//       if (self.status === 'pending') {
//         self.status = 'rejected';
//         self.data = reason;
//         for (var i = 0; i < self.onRejectedCallback.length; i++) {
//           self.onRejectedCallback[i](reason);
//         }
//       }
//     }, 0);
//   }
//   try {
//     executor(resolve, reject);
//   } catch (e) {
//     reject(e);
//   }
// }

const { node } = require('webpack');

// MyPromise.prototype.then = function (fulfillFun, rejectFun) {
//   var self = this;
//   if (self.status === 'fulfill') {
//     return new MyPromise(function (resolve, reject) {
//       var x = fulfillFun(self.data);
//       if (x instanceof MyPromise) {
//         x.then(resolve, reject);
//       }
//       resolve(x);
//     });
//   }

//   if (self.status === 'rejected') {
//     return new MyPromise(function (resolve, reject) {
//       var x = rejectFun(self.data);
//       if (x instanceof MyPromise) {
//         x.then(resolve, reject);
//       }
//       resolve(x);
//     });
//   }

//   if (self.status === 'pending') {
//     return new MyPromise(function (resolve, reject) {
//       self.onFulfillCallback.push(function (value) {
//         var x = fulfillFun(value);
//         if (x instanceof MyPromise) {
//           x.then(resolve, reject);
//         }
//         resolve(x);
//       });
//       self.onRejectedCallback.push(function (reason) {
//         var x = rejectFun(reason);
//         if (x instanceof MyPromise) {
//           x.then(resolve, reject);
//         }
//         resolve(x);
//       });
//     });
//   }
// };

// const light = (color, deley) => {
//   return new MyPromise((resolve) => {
//     setTimeout(() => {
//       console.log(color);
//       resolve();
//     }, deley);
//   });
// };

// const step = async () => {
//   light('red', 1000)
//     .then(() => light('yellow', 1000))
//     .then(() => light('green', 1000))
//     .then(() => step);
// };

// step();

// 控制请求数量
function delay(time) {
  return new Promise((resolve) => {
    console.log('request');
    setTimeout(resolve, time);
  });
}
class RequestControl {
  constructor(limit = 5, request = delay) {
    this.limit = limit;
    this.currentCount = 0;
    this.request = request;
    this.requestQueue = [];
  }
  async fetch(...arg) {
    if (this.currentCount >= this.limit) {
      await this.breakpoint();
    }
    try {
      this.currentCount++;
      const result = await this.request(arg);
      return result;
    } catch (e) {
      return e;
    } finally {
      console.log(this.currentCount, '数量');
      this.currentCount--;
      this.next();
    }
  }

  breakpoint() {
    const p = new Promise((resolve) => {
      this.requestQueue.push(resolve);
    });
    return p;
  }

  next() {
    if (this.requestQueue.length === 0) {
      return;
    }
    this.requestQueue.shift()();
  }
}

// const requestControl = new RequestControl();
// for (let i = 0; i < 30; i++) {
//   requestControl.fetch(1000);
// }

// 模拟双向链表
class Node {
  constructor(data) {
    this.data = data;
    this.next = null;
    this.prev = null;
  }
}
class DoubleLinkeList {
  constructor() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }
  add(data) {
    const node = new Node(data);
    if (!this.head) {
      this.head = node;
      this.tail = node;
    }
    node.prev = this.tail;
    this.tail.next = node;
    this.tail = node;
    this.length++;
  }
  addAt(data, index) {
    const node = new Node(data);
    const current = head;
    const count = 1;
    if (index === 0) {
      this.head.prev = node;
      node.next = this.head;
      this.head = node;
      return;
    }
    while (current) {
      current = current.next;
      if (index === count) {
        node.prev = current.prev;
        current.prev.next = node;
        node.next = current;
        current.prev = node;
      }
      count++;
    }
    this.length++;
  }
  remove(item) {
    const current = this.head;
    while (current) {
      if (current.data === item) {
        if (current === this.head && current === this.tail) {
          this.head = null;
          this.tail = null;
        } else if (current === this.head) {
          this.head = this.head.next;
          this.head.prev = null;
        } else if (current === this.tail) {
          this.tail = this.tail.prev;
          this.tail.next = null;
        } else {
          current.prev.next = current.next;
          current.next.prev = current.prev;
        }
      }
      current = current.next;
    }
    this.length--;
  }
  removeAt(index) {
    const current = this.head;
    const count = 1;
    if (index === 0) {
      this.head = this.head.next;
      this.head.prev = null;
    }
    while (current) {
      current = current.next;
      if (current === this.tail) {
        this.tail = this.tail.prev;
        this.tail.next = null;
      } else if (count === index) {
        current.prev.next = current.next;
        current.next.prev = current.prev;
      }
      count++;
    }
    this.length--;
  }
  reverse() {
    let current = this.head;
    let prev = null;
    while (current) {
      let next = current.next;
      current.next = prev;
      current.prev = next;
      prev = current;
      current = next;
    }
    this.tail = this.head;
    this.head = prev;
  }
  swap(index1, index2) {
    if (index1 > index2) {
      return this.swap(index2.index1);
    }
    let current = this.head;
    let firstNode = null;
    let count = 0;
    while (current) {
      if (count === index1) {
        firstNode = current;
      }
      if (count === index2) {
        let temp = current.data;
        current.data = firstNode.data;
        firstNode.data = temp;
      }
      current = current.next;
      count++;
    }
  }
  isEmpty() {
    return this.length === 0;
  }
  length() {
    return this.length;
  }
  //遍历
  traverse(fn) {
    let current = this.head;
    while (current) {
      fn(current);
      current = current.next;
    }
    return true;
  }
  find(item) {
    let current = this.head;
    let count = 0;
    while (current) {
      if (current.data === item) {
        return count;
      }
      current = current.next;
      count++;
    }
    return false;
  }
}

// 大数字相加
function bigNumSum(num1, num2) {
  const arr1 = num1.split('').reverse();
  const arr2 = num2.split('').reverse();
  const length = arr1.length > arr2.length ? arr1.length : arr2.length;
  const result = Array(length + 1).fill(0);
  for (let i = 0; i < length; i++) {
    const first = arr1[i] == null ? 0 : arr1[i];
    const second = arr2[i] == null ? 0 : arr2[i];
    const sum = Number(first) + Number(second) + result[i];
    const temp = sum >= 10 ? sum - 10 : sum;
    result[i] = temp;
    result[i + 1] = sum >= 10 ? 1 : 0;
  }
  if (result[result.length - 1] === 0) {
    result.pop();
  }
  return result.reverse().join('');
}

// 二叉数
class TreeNode {
  constructor(key) {
    this.key = key;
    this.right = null;
    this.left = null;
  }
}

class BinarySearchTree {
  constructor() {
    this.root = null;
  }
  insert(key) {
    function insertNode(root, newNode) {
      if (newNode.key < root.key) {
        if (root.left == null) {
          root.left = newNode;
        } else {
          insertNode(root.left, newNode);
        }
      } else {
        if (root.right == null) {
          root.right = newNode;
        } else {
          insertNode(root.right, newNode);
        }
      }
    }
    const node = new TreeNode(key);
    if (this.root == null) {
      this.root = node;
    } else {
      insertNode(this.root, node);
    }
  }
  search() {}
  inOrderTraverse(callback) {
    function inOrderTraverseNode(node, callback) {
      if (node !== null) {
        inOrderTraverseNode(node.left, callback);
        callback(node);
        inOrderTraverseNode(node.right, callback);
      }
    }
    inOrderTraverseNode(this.root, callback);
  }
  preOrderTraverse(callback) {
    function preOrderTraverseNode(node, callback) {
      if (node !== null) {
        callback(node);
        preOrderTraverseNode(node.left, callback);
        preOrderTraverseNode(node.right, callback);
      }
    }
    preOrderTraverseNode(this.root, callback);
  }
  postOrderTraverse(callback) {
    function postOrderTraverseNode(node, callback) {
      if (node !== null) {
        postOrderTraverseNode(node.left, callback);
        postOrderTraverseNode(node.right, callback);
        callback(node);
      }
    }
    postOrderTraverseNode(this.root, callback);
  }
  min() {
    function findMin(node) {
      while (node && node.left !== null) {
        node = node.left;
      }
      return node;
    }
  }
  max() {
    while (node && node.right !== null) {
      node = node.right;
    }
    return node;
  }
  search(key) {
    function searchNode(node, key) {
      if (node == null) {
        return false;
      }
      if (key < node.key) {
        return searchNode(node.left, key);
      } else if (key > node.key) {
        return searchNode(node.right, key);
      } else {
        return true;
      }
    }
  }
  remove(key) {
    root = removeNode(this.root, key);
    function removeNode(node, key) {
      if (node === null) {
        return null;
      }
      if (key < node.key) {
        node.left = removeNode(node.left, key);
        return node;
      } else if (key > node.key) {
        node.right = removeNode(node.right, key);
        return node;
      } else {
        if (node.left === null && node.right === null) {
          node = null;
          return node;
        }
        if (node.left === null) {
          node = node.right;
          return node;
        }
        if (node.right === null) {
          node = node.left;
          return node;
        }
        const aux = findMinNode(node.right);
        node.key = aux.key;
        node.right = removeNode(node.right, aux.key);
        return node;
      }
    }
    function findMinNode(node) {
      while (node && node.left !== null) {
        node = node.left;
      }
      return node;
    }
  }
}

const tree = new BinarySearchTree();

// 字典
class Dictionary {
  constructor() {
    this.items = {};
  }
  set(key, value) {
    this.items[key] = value;
  }
  delete(key) {
    if (this.has(key)) {
      delete this.items[key];
      return true;
    }
    return false;
  }
  has(key) {
    return key in this.items;
  }
  get(key) {
    return this.items[key];
  }
  clear() {
    this.items = {};
  }
  size() {
    return this.keys().length;
  }
  keys() {
    return Object.keys(this.items);
  }
  values() {
    return Object.keys(this.items).map((key) => {
      return this.items[key];
    });
  }
  getItems() {
    return this.items;
  }
}

// 栈类
class Stack {
  constructor() {
    this.items = [];
  }
  push(element) {
    this.items.push(element);
  }
  pop() {
    return this.items.pop();
  }
  peek() {
    return this.items[this.size() - 1];
  }
  isEmpty() {
    return this.size() === 0;
  }
  clear() {
    this.items = [];
  }
  size() {
    return this.items.length;
  }
}

// 队列类
class Queue {
  constructor() {
    this.items = [];
  }
  enqueue(element) {
    this.items.push(element);
  }
  dequeue() {
    return this.items.shift();
  }
  front() {
    return this.items[0];
  }
  isEmpty() {
    return this.size() === 0;
  }
  size() {
    return this.items.length;
  }
}

// 图类
class Graph {
  constructor() {
    this.vertices = [];
    this.adjList = new Dictionary();
  }
  addVertex(v) {
    this.vertices.push(v);
    this.adjList.set(v, []);
  }
  addEdge(v, w) {
    this.adjList.get(v).push(w);
    this.adjList.get(w).push(v);
  }
  toString() {
    let s = '';
    for (let i = 0; i < this.vertices.length; i++) {
      s += this.vertices[i] + '->';
      for (let j = 0; j < this.adjList.get(this.vertices[i]).length; j++) {
        s += this.adjList.get(this.vertices[i])[j] + ' ';
      }
      s += '\n';
    }
    return s;
  }
}

const graph = new Graph();
const vertices = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
for (let i = 0; i < vertices.length; i++) {
  graph.addVertex(vertices[i]);
}
graph.addEdge('A', 'B');
graph.addEdge('A', 'C');
graph.addEdge('A', 'D');
graph.addEdge('C', 'D');
graph.addEdge('C', 'G');
graph.addEdge('D', 'G');
graph.addEdge('D', 'H');
graph.addEdge('B', 'E');
graph.addEdge('B', 'F');
graph.addEdge('E', 'I');
console.log(graph.toString());
