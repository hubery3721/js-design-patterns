// 装饰函数
// window.onload = function() {
//   console.log(1);
// }
// var _onload = window.onload || function() {};
// window.onload = function() {
//   _onload();
//   console.log(2);
// }

// 问题来了
// var _getElementById = document.getElementById;
// document.getElementById = function(id) {
//   console.log(1);
//   return _getElementById(id); // (1) 
// }
// var button = document.getElementById('button');

// 此时_getElementById 是一个全局函数，当调用一个全局函数时， this 是指向 window 的， 而 document.getElementById 方法的内部实现需要
// 使用 this 引用， this 在这个方法内预期是指向 document， 而不是 window, 这是错误发生的原因，所以使用现在的方式给函数增加功能并不保险。

// 解决方式
// var _getElementById = document.getElementById;
// document.getElementById = function(id) {
//   console.log(1);
//   return _getElementById.apply(document, arguments)
// }
// var button = document.getElementById('button');

// 装饰函数解决问题
Function.prototype.before = function(beforefn) {
  var __self = this; // 保存原函数的引用
  return function() { // 返回包含了原函数和新函数的"代理"函数
    beforefn.apply(this, arguments); // 执行新函数，且保证 this 不被劫持，新函数接受的参数也会被原封不动地传入原函数，新函数在原函数之前执行
    return __self.apply(this, arguments); // 执行原函数并返回原函数的执行结果，并且保证 this 不被劫持
  }
}
Function.prototype.after = function(afterfn) {
  var __self = this;
  return function() {
    var ret = __self.apply(this, arguments);
    afterfn.apply(this, arguments);
    return ret;
  }
};

// document.getElementById = document.getElementById.before(function() {
//   console.log(0);
// });
// var button = document.getElementById('button');


// window.onload = function() {
//   console.log(1);
// }
window.onload = (window.onload || function() {
  console.log(1.5)
}).after(function() {
  console.log(2);
}).after(function() {
  console.log(3);
}).after(function() {
  console.log(4);
});