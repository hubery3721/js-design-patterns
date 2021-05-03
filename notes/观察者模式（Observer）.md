###1.定义

>定义对象间的一种一对多的依赖关系，当一个对象的状态发生改变时，所有依赖于它的对象都将得到通知。

###2.核心

一对多，强耦合（strong coupling）

两种主体：

Subject：被观察者

Observer：观察者

```js
 ╭─────────────╮  Fire Event  ╭──────────────╮
 │             │─────────────>│              │
 │   Subject   │              │   Observer   │
 │             │<─────────────│              │
 ╰─────────────╯  Subscribe   ╰──────────────╯
```

###3.实现

举个栗子：

比如，2020年基金热。
投资者可以订阅闭市估值分析报告、收益率触达消息，这样每天的闭市之后，发个通知给投资者，让他们知道今天的估值如何，当收益率达到20 %的时候，发止盈消息通知投资者止盈；当收益率达到-30%的时候，发止跌消息通知投资者止跌。其实这就是我们今天要讲的内容，观察者模式和发布订阅者模式。

上面这个场景中，基金市场就是Subject 而投资者们是Observer；当收益有变动时，投资者作为Observer 向Subject订阅（subscribe）；而当基金收益变化时候呢，通知到投资者，就是Subject 在 notify Observer

当然可能有不止一个不止一个投资者，即 Observer 可以有很多个。

![observers.png](resources/258DFA547CD276E84189A3FE4958A00A.png)

demo-1

```js
// 定义一个基金类 被观察者
function Fund(name, type) {
  this.name = name //基金名称
  this.type = type //基金类型
  this.observers = [] //韭菜们...
}

// 增加一个update/publish方法
Fund.prototype.publish = function(factor) {
  console.log('今天估值是：', factor)
  this.observers.forEach(function(observer) { // item(money)
    observer.notify(factor);
  })
}

Fund.prototype.publish = function(factor) {
  console.log('---Subject---')
  console.log('今天估值是：', factor)
  console.log('')
  this.observers.forEach(function(observer) { // item(money)
    observer.notify(factor);
  })
}

// 定义一个订阅入口
Fund.prototype.subscribe = function(target) {
  // 观察者订况了消息
  console.log(target.name + '订阅了消息')
  // targrt.list.push(fn)
  this.observers.push(target);
}

// 取消订阅方法(非必需)
Fund.prototype.unSubscribe = function(target) {
  var index = this.observers.find(observer => observer.name === target.name);
  if (index !== -1) {
    console.log(target.name, '取消了订阅')
    this.observers.splice(index, 1);
  }
}



// 定义观察者类（韭菜们。。。）
// name: 投资者姓名
// amount: 投资金额
// attitude: 投资者心态

const attitudeMap = {
  "A": "不经风雨，不见彩虹",
  "B": "哼，一切尽在掌控之中",
  "C": "被伤过的心还能爱谁",
}

function Investor(name, amount, attitude) {
  this.name = name;
  this.amount = amount;
  this.attitude = attitudeMap[attitude];
}
Investor.prototype.notify = function(msg) {
  console.log('---Observer---');
  if (msg > 0) {
    console.log('***今天估值上涨***');
    console.log(this.name, ': 哈哈哈，开心！')
  } else if (msg < 0) {
    console.log('***今天估值跌了***')
    console.log(`${this.name}:${this.attitude}`)
  }
}
// 定义一个基金
let fundZS = new Fund('招商白酒指数基金', '指数型');
// 定义投资者
let observer1 = new Investor('远哥', 10000, 'A');
let observer2 = new Investor('群哥', 60000, 'B');
let observer3 = new Investor('perse哥', 600, 'C');

// 投资者订阅信息
fundZS.subscribe(observer1);
fundZS.subscribe(observer2);
fundZS.subscribe(observer3);

// 基金估值分析报告发布（subject）
// fundZS.publish(3.4);
fundZS.publish(-.80); 
```

###4.总结

* 观察者模式中，观察者 observers 必须知道 Subject 的存在，而 Subject 也保存了所有观察者的记录。
但是，在发布订阅模式中 publishers 发布者 和 subscribers 订阅者可能并不知道对方的存在。他们只是通过消息和broker进行沟通。
* 在发布订阅模式中，组件之间松耦合。而观察者模式中，组件之间强耦合。
* 观察者模式中，代码实现通常是同步的 —— Subject 通常会直接调用观察者 Observer 的方法（函数）；而发布订阅者模式中，代码实现可以是异步的。
* 广义的观察者模式和发布订阅模式中，观察者模式的代码实现通常在同一个应用中；而发布订阅模式则可以跨应用 —— 消息中间件。

