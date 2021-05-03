###1.定义

迭代器模式是指提供一种方法顺序访问一个聚合对象中的各个元素， 而又不需要暴露该对象的内部表示。

*JS（大部分现代语言）中已经内置了丰富的迭代器，所以迭代器模式也是最不起眼的设计模式之一*

###2.核心

* 迭代器模式可以把迭代的过程从业务逻辑中分离出来
* 不用关心对象的内部构迁，也可以按顺序访问其中的每个元素

###3.实现

3.1 jQurey中的迭代器 demo-1

```js
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
$.each = function(obj, callback) {

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
    for (i in obj) { // 迭代 object 对象
      value = callback.call(obj[i], i, obj[i]);
      if (value === false) {
        break;
      }
    }
  }
  return obj;
};
```

迭代器模式不仅可以迭代数组，还可以迭代一些类数组的对象。比如 arguments、{"0":'a',"1":'b'}等。通过上面的代码可以观察到，无论是内部迭代器还是外部迭代器，只要被

迭代的聚合对象拥有 length 属性而且可以用下标访问，那它就可以被迭代。

3.2 ES6版的迭代器实现

```js
/**
 * 迭代器
 */
class Iterator {
  constructor(arr) {
    this.list = arr;
    this.index = 0
  }
  next() {
    if (this.hasNext()) {
      return this.list[this.index++]
    }
    return null
  }
  hasNext() {
    if (this.index >= this.list.length) {
      return false
    }
    return true
  }
}

const iterator = new Iterator([1,2,3,'a','b']);
while(iterator.hasNext()){
  console.log(iterator.next());
}
```

###4. 总结

迭代器模式相对简单，也是最不算设计模式的一种模式