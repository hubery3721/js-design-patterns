/**
 * i 当前索引
 * n 当前元素
 */
// $.each([1, 2, 3], function(i, n) {
//   console.log('当前下标为： ' + i);
//   console.log('当前值为:' + n);
// });


/**
 * 用js实现一下
 */
// var each = function(arr, callback) {
//   for (var i = 0, j = arr.length; i < j; i++) {
//     callback.call(arr[i], i, arr[i])
//   }
// }
// each([1, 2, 3], function(i, n) {
//   console.log('当前下标为： ' + i);
//   console.log('当前值为:' + n);
// });


/**
 * jQuery each实现
 */
// 不需要关心obj的内部结构
JEach = function(obj, callback) {

  function isArrayLike(obj) {
    //  是否存在length 属性
    var length = !!obj && "length" in obj && obj.length,
      type = jQuery.type(obj);
    // 排除function window 
    if (type === "function" || jQuery.isWindow(obj)) {
      return false;
    }
    // 数组判断： type === "array"  类数组判断：存在length属性值； length值为数字且大于0； obj[length - 1] 存在； 
    return type === "array" || length === 0 ||
      typeof length === "number" && length > 0 && (length - 1) in obj;
  }


  var value,
    i = 0,
    length = obj.length,
    isArray = isArrayLike(obj);

  if (isArray) { // 迭代类数组
    for (; i < length; i++) {
      value = callback.call(obj[i], i, obj[i]);
      if (value === false) {
        break;
      }
    }
  } else {
    for (var name in obj) { // 迭代 object 对象
      value = callback.call(obj[name], name, obj[name]);
      i++
      if (value === false) {
        break;
      }
    }
  }
  return obj;
};

var arguments = { name: "perse", sex: "male", length: 0 }


JEach(arguments, function(i, n) {
  console.log('当前下标为： ' + i);
  console.log('当前值为:' + n);
});