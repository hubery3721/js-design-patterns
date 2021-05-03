###1.定义

> 装饰者模式能够在不改变对象自身的基础上，在程序运行期间给对象动态地添加职责。跟继承相比，装饰者是一种更轻便灵活的做法，这是一种“即用即付”的方式

###2.核心

是为对象动态加入行为，经过多重包装，可以形成一条装饰链

###3.实现

3.1 飞机大战 demo-1

飞机大战的游戏，随着经验值的增加，我们操作的飞机对象可以升级成更厉害的飞机，一开始这些飞机只能发射普通的子弹，升到第二级时可以发射导弹，升到第三级时可以发射原子弹。

```js
// 创建一个飞机类
var Plane = function() {}
Plane.prototype.fire = function() {
  console.log('发射普通子弹');
}

// 再来两个装饰类
var MissileDecorator = function(plane) {
  this.plane = plane;
}
MissileDecorator.prototype.fire = function() {
  this.plane.fire();
  console.log('发射导弹');
}
var AtomDecorator = function(plane) {
  this.plane = plane;
}
AtomDecorator.prototype.fire = function() {
  this.plane.fire();
  console.log('发射原子弹');
}

/**
 * 导弹类和原子弹类的构造函数都接受参数 plane 对象， 并且保存好这个参数， 
 * 在它们的 fire方法中， 除了执行自身的操作之外， 还调用 plane 对象的 fire 方法。
 */

// 调用代码
var plane = new Plane();
plane = new MissileDecorator(plane);
plane = new AtomDecorator(plane);
plane.fire();

// 闻起来有点怪的代码
// var plane = new Plane()
// plane.__proto__.fire = function() {
//   console.log('发射普通子弹');
//   console.log('发射导弹');
//   console.log('发射原子弹');
// }
// plane.fire()
```

JS版的装饰器

```js
// JS版的装饰器
var plane = {
  fire: function() {
    console.log('发射普通子弹');
  }
}
var missileDecorator = function() {
  console.log('发射导弹');
}
var atomDecorator = function() {
  console.log('发射原子弹');
}
var fire1 = plane.fire;
plane.fire = function() {
  fire1();
  missileDecorator();
}
var fire2 = plane.fire;
plane.fire = function() {
  fire2();
  atomDecorator();
}
plane.fire();
```

* JavaScript 语言动态改变对象相当容易，我们可以直接改写对象或者对象的某个方法，并不需要使用“类”来实现装饰者模式
* 拥抱开放-封闭原则

3.2 AOP 装饰函数 demo-2

```js
// 装饰函数
// AOP 面向切面编程，和OOP一样，属于一种编程泛式
window.onload = function() {
  console.log(1);
}
var _onload = window.onload || function() {};
window.onload = function() {
  _onload();
  console.log(2);
}
```

以上代码存在的2个问题

* 必须维护_onload 这个中间变量，虽然看起来并不起眼，但如果函数的装饰链较长，或者需要装饰的函数变多，这些中间变量的数量也会越来越多。
* this 被劫持的问题，在 window.onload 的例子中没有这个烦恼，是因为调用普通函数_onload 时，this 也指向 window，跟调用 window.onload 时一样（函数作为对象的方法被调用时，this 指向该对象，所以此处 this 也只指向 window）。

```js
var _getElementById = document.getElementById; 
document.getElementById = function( id ){ 
 alert (1); 
 return _getElementById( id ); // (1) 
} 
var button = document.getElementById( 'button' );
```

解决方式

```js
var _getElementById = document.getElementById;
document.getElementById = function(id) {
  alert(1);
  return _getElementById.apply(document, arguments)
}
var button = document.getElementById('button');
```

引入装饰函数解决问题

```js
Function.prototype.before = function(beforefn) {
  var __self = this; // 保存原函数的引用
  return function() { // 返回包含了原函数和新函数的"代理"函数
    beforefn.apply(this, arguments); // 执行新函数，且保证 this 不被劫持，新函数接受的参数
    // 也会被原封不动地传入原函数，新函数在原函数之前执行
    return __self.apply(this, arguments); // 执行原函数并返回原函数的执行结果，
    // 并且保证 this 不被劫持
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

document.getElementById = document.getElementById.before(function() {
  alert(1);
});
var button = document.getElementById('button');


window.onload = function() {
  alert(1);
}
window.onload = (window.onload || function() {}).after(function() {
  alert(2);
}).after(function() {
  alert(3);
}).after(function() {
  alert(4);
});
```

3.3 装饰器的应用场景 统计上报 demo-3

在项目开发中，需要在点击事件中增加数据上报功能

```js
// 这是一段没有灵魂的代码
<html> 
 <button tag="login" id="button">点击打开登录浮层</button> 
 <script> 
 var showLogin = function(){ 
 console.log( '打开登录浮层' ); 
 singleCustomEvent( this.getAttribute( 'tag' ) ); 
 } 
 var singleCustomEvent = function( tag ){ 
 console.log( '上报标签为: ' + tag ); 
 // (new Image).src = 'http:// xxx.com/report?tag=' + tag; // 真正的上报代码略
 } 
 document.getElementById( 'button' ).onclick = showLogin; 
 </script> 
</html>
```

引入装饰器函数，实现了登录和统计上报的解耦

```js
<html> 
 <button tag="login" id="button">点击打开登录浮层</button> 
 <script> 
 Function.prototype.after = function( afterfn ){ 
 var __self = this; 
 return function(){ 
 var ret = __self.apply( this, arguments ); 
 afterfn.apply( this, arguments ); 
 return ret; 
 } 
 }; 
 var showLogin = function(){ 
 console.log( '打开登录浮层' ); 
 } 
 var singleCustomEvent = function(){ 
 console.log( '上报标签为: ' + this.getAttribute( 'tag' ) ); 
 } 
 showLogin = showLogin.after( singleCustomEvent ); // 打开登录浮层之后上报数据
 document.getElementById( 'button' ).onclick = showLogin; 
 </script> 
</html>
```

3.4 装饰器的应用场景二 表单校验 demo-4

一段没有灵魂的代码

```js
var username = document.getElementById('username'),
  password = document.getElementById('password'),
  submitBtn = document.getElementById('submitBtn');
var formSubmit = function() {
  if (username.value === '') {
    return alert('用户名不能为空');
  }
  if (password.value === '') {
    return alert('密码不能为空');
  }
  // var param = {
  //   username: username.value,
  //   password: password.value
  // }
  // ajax('http:// xxx.com/login', param); // ajax 具体实现略
  console.log("提交成功！")
}
submitBtn.onclick = function() {
  formSubmit();
}
```

“优化”后的代码

```js
var validate = function() {
  if (username.value === '') {
    alert('用户名不能为空');
    return false;
  }
  if (password.value === '') {
    alert('密码不能为空');
    return false;
  }
}
var formSubmit = function() {
  if (validate() === false) { // 校验未通过
    return;
  }
  // var param = {
  //   username: username.value,
  //   password: password.value
  // }
  // ajax('http:// xxx.com/login', param);
  console.log("提交成功！")
}
submitBtn.onclick = function() {
  formSubmit();
}
```

真·优化后的代码

```js
Function.prototype.before = function(beforefn) {
  var __self = this;
  return function() {
    if (beforefn.apply(this, arguments) === false) {
      // beforefn 返回 false 的情况直接 return，不再执行后面的原函数
      return;
    }
    return __self.apply(this, arguments);
  }
}
var validate = function() {
  if (username.value === '') {
    alert('用户名不能为空');
    return false;
  }
  if (password.value === '') {
    alert('密码不能为空');
    return false;
  }
}
var formSubmit = function() {
  // var param = {
  //   username: username.value,
  //   password: password.value
  // }
  // ajax('http:// xxx.com/login', param);
  console.log("提交成功！")
}
formSubmit = formSubmit.before(validate);
submitBtn.onclick = function() {
  formSubmit();
}
```

###4.总结

* 装饰者模式和代理模式在结构上看起来非常相像，两者的共同点在于描述了怎样为对象提供一定程度上的间接引用，它们的实现部分都保留了对另外一个对象的引用，并且向那个对象发送请求。
* 区别在于两者之间的意图和设计目的：

| 代理模式       | 装饰者模式  |
|:-------------  | -----:|
|  强调代理Proxy与本体之间的关系，主要为了控制对本体的访问      |   为对象动态加入行为 |
|  通常只有一层代理-本体的引用     |    经常会形成一条长长的装饰链 |
|  可以静态的表达（编译时决定）     |    运行时决定 |

* 适配器模式主要用来解决两个已有接口之间不匹配的问题，它不考虑这些接口是怎样实现的，也不考虑它们将来可能会如何演化。适配器模式不需要改变已有的接口，就能够使它们协同作用。
* 外观模式的作用倒是和适配器比较相似，有人把外观模式看成一组对象的适配器，但外
观模式最显著的特点是定义了一个新的接口。