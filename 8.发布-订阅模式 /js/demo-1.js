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
  var index = pubChannel.fundList[this.name].findIndex(observer => observer.name === target.name);
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
fundYY.publish(-8.0);
// fundGX.publish(11.5);
// fundZS.publish(-.80);