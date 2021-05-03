###1.定义

为一个对象提供一个代用品或占位符，以便控制对它的访问

###2.核心

* 当客户不方便直接访问一个对象或者不满足需要的时候，提供一个替身对象来控制对这个对象的访问，客户实际上访问的是 替身对象。
* 替身对象对请求做出一些处理之后， 再把请求转交给本体对象
* 代理和本体的接口具有一致性，本体定义了关键功能，而代理是提供或拒绝对它的访问，或者在访问本体之前做一些额外的事情

###3.实现

举个栗子:

在四月份的第一天的早晨，攀少遇见了他的百分百女孩，我们暂且称呼攀少的女神为杨小幂。 两天之后， 攀少决定给杨小幂送一束花来表白。 刚好攀少打听到杨小幂和他有一个共同的朋友黄小明，于是内向的攀少决定让黄小明来代替自己完成送花这件事情。

3.1 初识代理模式 demo-1

```js
/**
 * 初识代理模式
 */

//  无代理模式实现
var Flower = function() {};
Flower.prototype.setName = function(name) {
  this.name = name || '我是一朵花！'
}
var Perse = {
  sendFlower: function(target) {
    var flower = new Flower();
    // flower.setName('牛粪上拔的')
    target.receiveFlower(flower);
  }
};
var Muse = {
  receiveFlower: function(flower) {
    console.log('收到花：' + flower);
  }
};
Perse.sendFlower(Muse);

// 引入代理模式

// var Flower = function() {};
// Flower.prototype.setName = function(name) {
//   this.name = name || '我是一朵花！'
// }
// var Perse = {
//   sendFlower: function(target) {
//     var flower = new Flower();
//     flower.setName('牛粪上拔的')
//     target.proxySendFlower(flower.name);
//   }
// };

// var Fool = {
//   proxySendFlower: function(flower) {
//     Muse.receiveFlower(flower)
//   }
// }
// var Muse = {
//   receiveFlower: function(flower) {
//     console.log('收到花：' + flower);
//   }
// };
// Perse.sendFlower(Fool);
```

代理模式主要分为三种：保护代理、虚拟代理、缓存代理

3.1 保护代理 demo-2

保护代理主要实现了访问主体的限制行为

```js
/**
 * 保护代理
 */

var Flower = function() {};
Flower.prototype.setName = function(name) {
  this.name = name || '我是一朵花！'
}

Flower.prototype.getName = function() {
  return this.name
}
var Perse = {
  sendFlower: function(target) {
    var flower = new Flower();
    // flower.setName('牛粪上拔的')
    flower.setName('海洋之心')
    target.proxySendFlower(flower);
  }
};

var Fool = {
  proxySendFlower: function(flower) {
    if (Muse.favorite(flower)) {
      Muse.receiveFlower(flower)
    } else {
      console.log("还是算了吧")
    }
  }
}
var Muse = {
  receiveFlower: function(flower) {
    console.log('收到花：' + flower.getName());
    console.log('emm, 心情不错')
  },
  favorite: function(item) {
    if (item.indexOf('钻石') != -1) {
      return true
    } else {
      return false
    }
  }

};
Perse.sendFlower(Fool);
```

保护代理用于控制不同权限的对象对目标对象的访问， 但在 JavaScript 并不容易实现保护代理， 因为我们无法判断谁访问了某个对象。

3.2 虚拟代理 demo-3、demo-4

虚拟代理把一些开销很大的对象， 延迟到真正需要它的时候才去创建。

```js
/**
 * 虚拟代理
 */

var Flower = function() {};
Flower.prototype.setName = function(name) {
  this.name = name
}
Flower.prototype.getName = function() {
  return this.name
}
var Perse = {
  sendFlower: function(target) {
    var flower = new Flower();
    flower.setName('宝马')
    target.proxySendFlower(flower);
  }
};

var Fool = {
  proxySendFlower: function(flower) {
    Muse.listenGoodMood(function() {
      Muse.receiveFlower(flower)
    })
  }
}
var Muse = {
  receiveFlower: function(flower) {
    console.log('收到花：' + flower.getName());
    console.log('emm, 心情不错')
  },
  listenGoodMood: function(fn) {
    // 心情美丽的时候
    setTimeout(function() {
      fn()
    }, 5 * 1000)
  }

};
Perse.sendFlower(Fool);
```

用虚拟代理实现图片懒加载

```js
var myImage = (function() {
  var imgNode = document.createElement('img');
  document.body.appendChild(imgNode);
  return {
    setSrc: function(src) {
      imgNode.src = src;
    }
  }
})();
var proxyImage = (function() {
  var img = new Image;
  img.onload = function() {
    myImage.setSrc(this.src);
  }
  return {
    setSrc: function(src) {
      myImage.setSrc('./js/loading.gif');
      setTimeout(function() {
        img.src = src;
      }, 2000)
    }
  }
})();
proxyImage.setSrc('https://www.youshibeike.com/siteWeb/assets/images/logo.png');
// myImage.setSrc('https://www.youshibeike.com/siteWeb/assets/images/logo.png');
```

3.3 代理的意义 demo-4

不难发现，即使不需要引入任何模式也能实现这个小小的图片懒加载功能。
代理的意义：
* 拥护单一职责原则/开放-封闭原则
* 给img节点设置src和较片懒加载这2个功能，被隔离在2个不同对象里，如果不需要懒加载（代理），只需要把请求代理改成请求本体即可。

3.4 缓存代理 demo-6

缓存代理可以为一些开销大的运算结果提供暂时的存储， 在下次运算时， 如果传递进来的参数跟之前一致， 则可以直接返回前面存储的运算结果。

```js
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
```

3.5 动态创建代理

通过传入高阶函数这种更加灵活的方式，可以为各种计算方法创建缓存代理。现在这些计算方法被当作参数传入一个专门用于创建缓存代理的工厂中， 这样一来，我们就可以为乘法、加

法、减法等创建缓存代理

```js
/**************** 计算乘积 *****************/
var mult = function() {
  console.log("乘法计算")
  var a = 1;
  for (var i = 0, l = arguments.length; i < l; i++) {
    a = a * arguments[i];
  }
  return a;
};
/**************** 计算加和 *****************/
var plus = function() {
  console.log("加法计算")
  var a = 0;
  for (var i = 0, l = arguments.length; i < l; i++) {
    a = a + arguments[i];
  }
  return a;
};
/**************** 创建缓存代理的工厂 *****************/
var createProxyFactory = function(fn) {
  var cache = {};
  return function() {
    var args = Array.prototype.join.call(arguments, ',');
    if (args in cache) {
      return cache[args];
    }
    return cache[args] = fn.apply(this, arguments);
  }
};
var proxyMult = createProxyFactory(mult),
  proxyPlus = createProxyFactory(plus);
console.log(proxyMult(1, 2, 3, 4)); // 输出：24 
console.log(proxyMult(1, 2, 3, 4)); // 输出：24 
console.log(proxyMult(11, 2, 3, 4)); // 输出：24 
console.log(proxyPlus(1, 2, 3, 4)); // 输出：10 
console.log(proxyPlus(1, 2, 3, 4)); // 输出：10
```

###4.总结

代理模式包括许多小分类， 在 JavaScript 开发中最常用的是虚拟代理和缓存代理。 

虽然代理模式非常有用， 但我们在编写业务代码的时候， 往往不需要去预先猜测是否需要使用代理模式。

当真正发现不方便直接访问某个对象的时候，再使用代理。

拥抱单一职责原则