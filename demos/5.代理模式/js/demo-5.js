/**
 * 不使用代理
 */


var mult = function() {
  console.log('开始计算乘积');
  var a = 1;
  for (var i = 0, l = arguments.length; i < l; i++) {
    a = a * arguments[i];
  }
  return a;
};
// var r1 = mult(2, 3); // 输出：6 
// var r2 = mult(2, 3, 4); // 输出：24
// console.log(r1, r2)

/**
 * 缓存代理
 */
var proxyMult = (function() {
  var cache = {};
  return function() {
    var args = Array.prototype.join.call(arguments, ',');
    if (args in cache) {
      return cache[args];
    }
    return cache[args] = mult.apply(this, arguments);
  }
})();
var r3 = proxyMult(1, 2, 3, 4); // 输出：24 
var r4 = proxyMult(1, 2, 3); // 输出：6
var r5 = proxyMult(1, 2, 3); // 输出：6
console.log(r3, r4, r5)