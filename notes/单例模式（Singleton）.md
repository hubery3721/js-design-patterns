###1.定义

保证一个类有且仅有一个实例，并提供一个访问它的全局访问点

###2.核心

确保只有一个实例，并提供全局访问

###3.实现

简单单例 demo-1/demo-2

```js
var Singleton = function(name) {
  this.name = name;
  this.instance = null;
};
Singleton.prototype.getName = function() {
  return this.name
};
Singleton.getInstance = function(name) {
  if (!this.instance) {
    this.instance = new Singleton(name);
  }
  return this.instance;
};
var person1 = Singleton.getInstance('攀少1');
var person2 = Singleton.getInstance('攀少2');

console.log(person1.getName())
// console.log(person2.getName())
// console.log(person1 === person2); // true
```

```js
class Singleton {
  constructor(name) {
    this.name = name;
  }
  static getInstance(name) {
    if (!this.instance) {
      this.instance = new Singleton(name);
    }
    return this.instance;
  }
  getName() {
    return this.name;
  }
}

let person1 = Singleton.getInstance('攀少1')
let person2 = Singleton.getInstance('攀少2')
let person3 = new Singleton('攀少2')

console.log(person1.getName())
console.log(person2.getName())
// console.log(person3.getName())
console.log(person1 === person2); // true
```

_缺点：创建对象只能通过getInstance创建，增加了这个类的不透明性。Singleton的使用者必须知道这是一个单例类，跟以往通过new方式来获取对象不同。_

透明单例 demo-3/demo-4

```js
var Singleton = function(name) {
  this.name = name;
};

Singleton.prototype.getName = function() {
  return this.name
};

var ProxySingletonSingleton = (function() {
  var instance;
  return function(html) {
    if (!instance) {
      instance = new Singleton(html);
    }
    return instance;
  }
})();
var person1 = new ProxySingletonSingleton('攀少1');
var person2 = new ProxySingletonSingleton('攀少2');
console.log(person1.getName())
console.log(person2.getName())
console.log(person1 === person2); // true
```

```js
var createDiv = (function() {
  var instance;
  var createDiv = function(html) {
    if (instance) {
      return instance;
    }
    this.html = html;
    this.init();
    return instance = this;
  };
  createDiv.prototype.init = function() {
    var div = document.createElement('div');
    div.innerHTML = this.html;
    document.body.appendChild(div);
  };
  return createDiv;
})();

var a = new createDiv('div1');
var b = new createDiv('div2');

console.log(a === b); // true
```

_缺点：createDiv的构造函数实际上负责了两件事情。第一件事是创建对象和初始化init方法，第二件事是保证只有一个对象。违背了单一职责_

惰性单例 demo-5

```js
  var createDiv = function() {
    var div = document.createElement('div');
    div.innerHTML = 'this is div';
    document.body.appendChild(div);
  };

  var getSingleInstance = function(fn) {
    var instance;
    return function() {
      return instance || (instance = fn.apply(this, arguments))
    }
  }

  var createIframe = function() {
    var iframe = document.createElement('iframe');
    iframe.innerHTML = 'this is iframe';
    document.body.appendChild(iframe);
  };


  var a = getSingleInstance(createDiv)();
  var b = getSingleInstance(createIframe)();

  console.log(a === b); // true
```

单例模式的应用 demo-6

```html
<!DOCTYPE html>
<html lang="zh-cn">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>2.单例模式 -- 惰性单例应用</title>
</head>

<body>

  <button id="loginBtn">登录</button>
  <button id="loginBtn2">登录2</button>
  <button id="close">关闭弹窗</button>
  <script src="./js/demo-6.js"></script>

</body>
</html>
```

```js
var loginLayer = (function() {
  var div = document.createElement('div');
  div.innerHTML = '我是登录浮窗';
  div.style.display = 'none';
  div.style.width = '500px';
  div.style.height = '300px';
  div.style.border = '1px solid #ddd';
  document.body.appendChild(div);
  return div;
})();
document.getElementById('loginBtn').onclick = function() {
  loginLayer.style.display = 'block';
};
```

_缺点：加载页面完成后，登录弹窗就被创建完成，但是如果用户不想点击登录的话，弹窗用不上，造成不必要的资源浪费_

```js
// 惰性弹窗
var creatLoginLayer = function() {
  var div = document.createElement('div');
  div.id = 'loginLayer'
  div.innerHTML = '我是登录浮窗';
  div.style.display = 'none';
  div.style.width = '500px';
  div.style.height = '300px';
  div.style.border = '1px solid #ddd';
  document.body.appendChild(div);
  return div
}

document.getElementById('loginBtn2').onclick = function() {
  var loginLayer = creatLoginLayer()
  loginLayer.style.display = 'block';
};
```

_缺点：达到了惰性目的，失去了单例效果，频繁操作节点造成资浪费_

```js
// 惰性弹窗 单例
var creatLoginLayer = (function() {
  var div
  return function() {
    if (!div) {
      div = document.createElement('div');
      div.id = 'loginLayer'
      div.innerHTML = '我是登录浮窗';
      div.style.display = 'none';
      div.style.width = '500px';
      div.style.height = '300px';
      div.style.border = '1px solid #ddd';
      document.body.appendChild(div);
    }
    return div
  }
})()
```

