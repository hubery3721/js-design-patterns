###1.定义

>发布-订阅者模式其实是观察者模式演变而来的一种新的设计模式，其在观察者模式基础上加了“第三者”，即多了个'事件调度中心'，发布者和订阅者都不知道对方的存在，没有直接关联性（低耦合），他们只通过消息代理进行通信。

###2.核心

* 取代对象之间硬编码的通知机制，一个对象不用再显式地调用另外一个对象的某个接口。
* 与传统的发布-订阅模式实现方式（将订阅者自身当成引用传入发布者）不同，在JS中通常使用注册回调函数的形式来订阅

```js
 ╭─────────────╮                 ╭───────────────╮   Fire Event   ╭──────────────╮
 │             │  Publish Event  │               │───────────────>│              │
 │  Publisher  │────────────────>│ Event Channel │                │  Subscriber  │
 │             │                 │               │<───────────────│              │
 ╰─────────────╯                 ╰───────────────╯    Subscribe   ╰──────────────╯
```

###3.实现

JS中的事件就是经典的发布-订阅模式的实现

```js
// 订阅
document.body.addEventListener('click', function() {
    console.log('click1');
}, false);

document.body.addEventListener('click', function() {
    console.log('click2');
}, false);

// 发布
document.body.click(); // click1  click2
```

如果投资者想买其他基金，比如工银瑞信新能源汽车混合基金、银河创新等多个基金产品，可他们属于不同的基金公司，投资者还得多个基金官网注册-购买-订阅消息，这样一来流程很繁琐，这种场景下观察者模式就不适应了。
怎么办？某宝平台，某天基金平台就充当了调度中心的角色。
投资者可以在这些平台购买基金，当所持有的基金有重大消息时，基金公司会通知这些平台（事件调度中心），平台代理基金公司通知投资者实时关注动态。

```js
// 模拟某宝作为事件调度中心（event channel）
var pubChannel = {
  // type: 'pubsubject',
  // fundList: 基金公司列表
  fundList: Object.create(null),
  subscribe: function(channel, target) {
    // 提供订阅方法
    if (!this.fundList[channel]) {
      this.fundList[channel] = [];
    }
    this.fundList[channel].push(target);
  },
  publish: function(channel, factor) {
    // 提供发布方法
    if (!this.fundList[channel]) return;
    for (let item of this.fundList[channel]) {
      item.notify(factor, channel)
    }
  }
}

// 定义一个基金类（publisher）
function Fund(channel, name) {
  this.channel = channel
  this.name = name
}
// 发布估值消息
Fund.prototype.publish = function(factor, channel) {
  console.log('今天估值是：', factor)
  pubChannel.publish(this.name, factor);
}
Fund.prototype.subscribe = function(target, amount, channel) {
  console.log(target.name + `投资了${this.name}，该客户投资了${amount}` + '，订阅了消息')
  pubChannel.subscribe(this.name, target);
}
Fund.prototype.unSubscribe = function(target) {
  var index = pubChannel.fundList[this.name].find(observer => observer.name === target.name);
  if (index !== -1) {
    console.log(target.name, '取消了订阅', this.name)
    pubChannel.fundList[this.name].splice(index, 1);
  }
}


// 定义一个投资者（subscribe）
// name: 投资者姓名
// amount: 投资金额
function Investor(name, amount) {
  this.name = name;
  this.amount = amount;
}
Investor.prototype.notify = function(msg, channel) {
  if (msg > 0) {
    console.log('***今天估值上涨***');
    console.log(this.name, ': 哈哈哈，开心！')
  } else if (msg < 0) {
    console.log('***今天估值下跌***');
    console.log(this.name, `: 今天[${channel}]估值跌了, 心情沉重`)
  }
}
// 定义两个基金
var fundZS = new Fund('招商', '招商白酒指数基金');
var fundYY = new Fund('招商', '招商医药指数基金');
var fundGX = new Fund('工银', '工银瑞信新能源汽车混合基金');
// 定义投资者
let observer1 = new Investor('远哥', 10000);
let observer2 = new Investor('群哥', 60000);
let observer3 = new Investor('perse哥', 600);


// 三个投资者定义订阅信息
fundZS.subscribe(observer1, 5000);
fundZS.subscribe(observer2, 40000);
fundYY.subscribe(observer3, 5000);
fundYY.subscribe(observer1, 20000);
fundGX.subscribe(observer2, 20000);
fundYY.unSubscribe(observer1, 20000);
// 基金估值分析报告发布
// fundZS.publish(3.4);
// fundYY.publish(-8.0);
fundGX.publish(11.5);
// fundZS.publish(-.80);
```

###4.总结



