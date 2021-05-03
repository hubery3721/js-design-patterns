// 定义一个基金类 被观察者
function Fund(name, type) {
  this.name = name //基金名称
  this.type = type //基金类型
  this.observers = [] //韭菜们...
}

// 增加一个update/publish方法
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