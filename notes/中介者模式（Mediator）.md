###1.定义
增加一个中介者对象后，所有的相关对象都通过中介者对象来通信，而不是互相引用，所以当一个对象发生改变时，只需要通知中介者对象即可

###2.核心
是解除对象与对象之间的紧耦合关系，而且可以独立地改变它们之间的交互。中介者模式使网状的多对多关系变成了相对简单的一对多关系

![IMAGE](resources/18D9EEE40D7EAF117BF0092FB53AF8C3.jpg =300x300)    ![IMAGE](resources/C0A61E7BB1D0E3FDB84E05D25142E1AE.jpg =300x300)

###3.实现

3.1 机场调度塔
![IMAGE](resources/795D6456D137CBAE6B6858D76BC81E6A.jpg =350x613)

中介者也被称为调停者，我们想象一下机场的指挥塔，如果没有指挥塔的存在，每一架飞机要和方圆100公里内的所有飞机通信，才能确定航线以及飞行状况，后果是不可想象的。现实中的情况是，每架飞机都只需要和指挥塔通信。指挥塔作为调停者，知道每一架飞机的飞行状况，所以它可以安排所有飞机的起降时间，及时做出航线调整。

```js
/***
 * 调度中心
 */
class DispatchingCenter {
  //静态方法
  static getInstance() {
    if (!this.instance) {
      //实例化
      this.instance = new DispatchingCenter();
    }
    return this.instance;
  }
  constructor() {
    // 订阅池
    this.airplanes = [];
    this.name = 'DispatchingCenter'
    if (!DispatchingCenter.instance) {
      //将this挂载到SingletonPerson这个类的instance属性上
      DispatchingCenter.instance = this;
    }
  }
  // 通讯
  trigger(toObj, message) {
    toObj.getMessage(message);
  }
  // 消息通话
  getMessage(message) {
    console.log(this.name, '收到消息：', message);
  }
  // 移除飞机的通讯，在飞机起飞完成或者降落完成
  offAirplane(airplane) {
    const index = this.airplanes.findIndex(item => item.name === airplane.name);
    if (index > -1) {
      this.airplanes.splice(index, 1);
      // 通知最先申请的飞机可以执行申请
      if (this.airplanes.length) {
        const nextAirplane = this.airplanes[this.airplanes.length - 1];
        this.trigger(nextAirplane, '您准备好了吗，可以重新申请' + nextAirplane.willDo);
      }
    }
  }
  isHasAirplane(airplane) {
    return this.airplanes.some(item => item.name === airplane.name)
  }
  /***
   * 申请起飞或者降落
   * @param airplane
   * @param state take-off 起飞， land 是降落，如果有飞机在起飞或者降落则不能在此时起飞或者降落，一次只能有一飞机起飞或者降落
   *        不能起飞或者降落的飞机将进入队列进行等待
   */
  apply(airplane, state) {
    const doingAirplane = this.airplanes.find(item => item.state === 'take-off' || item.state === 'land');
    // 自己在进行起飞或者降落中又进行申请
    if (doingAirplane && doingAirplane.name === airplane.name) {
      this.trigger(airplane, '别闹...');
    } else if (doingAirplane) { // 有飞机在起码或者降落
      this.trigger(airplane, `${doingAirplane.name}正在${doingAirplane.state},请耐心等待`);
      if (!this.isHasAirplane(airplane)) {
        airplane.state = 'waiting';
        airplane.willDo = state;
        this.airplanes.push(airplane)
      }
    } else {
      // 执行降落或者起飞逻辑
      if (this.isHasAirplane(airplane)) {
        const targetAirplane = this.airplanes.find(item => item.name === airplane.name);
        targetAirplane.state = state;
      } else {
        // 申请允许动作
        airplane.state = state;
        this.airplanes.push(airplane);
      }

      this.trigger(airplane, '允许执行');

      this.timer = setTimeout(() => {
        console.log(airplane.name, '完成', airplane.state);
        this.offAirplane(airplane);
        clearTimeout(this.timer);
      }, 1000)
    }
  }
}

class Airplane {
  constructor(name) {
    this.name = name;
    this.dispatchingCenter = DispatchingCenter.getInstance();
  }
  apply(state) {
    this.dispatchingCenter.apply(this, state);
  }
  trigger(toObj, message) {
    this.dispatchingCenter.trigger(toObj, message);
  }
  getMessage(message) {
    console.log(this.name, '收到消息：', message);
  }
}

const airplane_southAir_1 = new Airplane('南方航空公司1号');
const airplane_southAir_2 = new Airplane('南方航空公司2号');
const airplane_eastAir_2 = new Airplane('东方航空公司2号');
const airplane_eastAir_1 = new Airplane('东方航空公司1号');
airplane_southAir_1.apply('take-off');
airplane_southAir_2.apply('take-off');
airplane_eastAir_2.trigger(airplane_eastAir_2.dispatchingCenter, '我想要降落申请');
airplane_eastAir_1.trigger(airplane_eastAir_2, '老兄，降落了吗？');
airplane_eastAir_2.trigger(airplane_eastAir_1, '没呢，准备申请');
airplane_eastAir_2.apply('land');
airplane_eastAir_1.apply('land');
```

中介者模式看起来有点像发布-订阅模式，区别在于
* 发布-订阅，单方面传递消息，发布者Publisher发出消息，订阅者Subscribe接出消息
* 中介者，所有参与者都可以发消息，接收消息

3.2 商城购物车 demo-2 / demo-3

购买手机需求：
* 可以选择手机颜色、内存、数量
* 如果用户未选择，禁用按钮并提示
* 当库存不足时显示不足，反之点击加入购物车

```js
// HTML部分
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>15.中介者模式 - 商城购物车</title>
</head>

<body>
  选择颜色: <select id="colorSelect">
    <option value="">请选择</option>
    <option value="red">红色</option>
    <option value="blue">蓝色</option>
  </select>
  选择内存: <select id="memorySelect">
    <option value="">请选择</option>
    <option value="32G">32G</option>
    <option value="16G">16G</option>
  </select>
  输入购买数量: <input type="text" id="numberInput" /><br />
  您选择了颜色: <div id="colorInfo"></div><br />
  您选择了内存: <div id="memoryInfo"></div><br />
  您输入了数量: <div id="numberInfo"></div><br />
  <button id="nextBtn" disabled="true">请选择手机颜色,内存和购买数量</button>
</body>
<script src="./js/demo-2.js"></script>

</html>
```

按照需求瞎写一通，代码屎山

```js
// 按照需求瞎写一通
var colorSelect = document.getElementById('colorSelect'),
  numberInput = document.getElementById('numberInput'),
  memorySelect = document.getElementById('memorySelect'),
  colorInfo = document.getElementById('colorInfo'),
  numberInfo = document.getElementById('numberInfo'),
  memoryInfo = document.getElementById('memoryInfo'),
  nextBtn = document.getElementById('nextBtn');

var goods = { // 手机库存
  "red|32G": 3, // 红色 32G，库存数量为 3 
  "red|16G": 0,
  "blue|32G": 1,
  "blue|16G": 6
};
colorSelect.onchange = function() {
  var color = this.value,
    memory = memorySelect.value,
    stock = goods[color + '|' + memory];
  number = numberInput.value, // 数量
    colorInfo.innerHTML = color;
  if (!color) {
    nextBtn.disabled = true;
    nextBtn.innerHTML = '请选择手机颜色';
    return;
  }
  if (!memory) {
    nextBtn.disabled = true;
    nextBtn.innerHTML = '请选择内存大小';
    return;
  }
  if (number < 0 || !number) { // 输入购买数量是否为正整数
    nextBtn.disabled = true;
    nextBtn.innerHTML = '请输入正确的购买数量';
    return;
  }
  if (number > stock) { // 当前选择数量没有超过库存量
    nextBtn.disabled = true;
    nextBtn.innerHTML = '库存不足';
    return;
  }
  nextBtn.disabled = false;
  nextBtn.innerHTML = '放入购物车';
};

numberInput.onchange = function() {
  var color = colorSelect.value, // 颜色
    number = parseInt(this.value), // 数量
    memory = memorySelect.value,
    stock = goods[color + '|' + memory];
  numberInfo.innerHTML = number;
  if (!color) {
    nextBtn.disabled = true;
    nextBtn.innerHTML = '请选择手机颜色';
    return;
  }
  if (!memory) {
    nextBtn.disabled = true;
    nextBtn.innerHTML = '请选择内存大小';
    return;
  }
  if (number < 0 || !number) { // 输入购买数量是否为正整数
    nextBtn.disabled = true;
    nextBtn.innerHTML = '请输入正确的购买数量';
    return;
  }
  if (number > stock) { // 当前选择数量没有超过库存量
    nextBtn.disabled = true;
    nextBtn.innerHTML = '库存不足';
    return;
  }
  nextBtn.disabled = false;
  nextBtn.innerHTML = '放入购物车';
};


memorySelect.onchange = function() {
  var color = colorSelect.value, // 颜色
    number = numberInput.value, // 数量
    memory = this.value,
    stock = goods[color + '|' + memory]; // 该颜色手机对应的当前库存
  memoryInfo.innerHTML = memory;
  if (!color) {
    nextBtn.disabled = true;
    nextBtn.innerHTML = '请选择手机颜色';
    return;
  }
  if (!memory) {
    nextBtn.disabled = true;
    nextBtn.innerHTML = '请选择内存大小';
    return;
  }
  if (number < 0 || !number) { // 输入购买数量是否为正整数
    nextBtn.disabled = true;
    nextBtn.innerHTML = '请输入正确的购买数量';
    return;
  }
  if (number > stock) { // 当前选择数量没有超过库存量
    nextBtn.disabled = true;
    nextBtn.innerHTML = '库存不足';
    return;
  }
  nextBtn.disabled = false;
  nextBtn.innerHTML = '放入购物车';
};
```

引入中介者模式，消灭屎山

```js
// 引入中介者模式
var goods = { // 手机库存
  "red|32G": 3,
  "red|16G": 0,
  "blue|32G": 1,
  "blue|16G": 6
};
var mediator = (function() {
  var colorSelect = document.getElementById('colorSelect'),
    memorySelect = document.getElementById('memorySelect'),
    numberInput = document.getElementById('numberInput'),
    colorInfo = document.getElementById('colorInfo'),
    memoryInfo = document.getElementById('memoryInfo'),
    numberInfo = document.getElementById('numberInfo'),
    nextBtn = document.getElementById('nextBtn');
  return {
    changed: function(obj) {
      var color = colorSelect.value, // 颜色
        memory = memorySelect.value, // 内存
        number = parseInt(numberInput.value), // 数量
        stock = goods[color + '|' + memory]; // 颜色和内存对应的手机库存数量
      if (obj === colorSelect) { // 如果改变的是选择颜色下拉框
        colorInfo.innerHTML = color;
      } else if (obj === memorySelect) {
        memoryInfo.innerHTML = memory;
      } else if (obj === numberInput) {
        numberInfo.innerHTML = number;
      }
      if (!color) {
        nextBtn.disabled = true;
        nextBtn.innerHTML = '请选择手机颜色';
        return;
      }
      if (!memory) {
        nextBtn.disabled = true;
        nextBtn.innerHTML = '请选择内存大小';
        return;
      }
      if (number < 0 || !number) { // 输入购买数量是否为正整数
        nextBtn.disabled = true;
        nextBtn.innerHTML = '请输入正确的购买数量';
        return;
      }
      if (number > stock) { // 当前选择数量没有超过库存量
        nextBtn.disabled = true;
        nextBtn.innerHTML = '库存不足';
        return;
      }
      nextBtn.disabled = false;
      nextBtn.innerHTML = '放入购物车';
    }

  }
})();
// 事件函数：
colorSelect.onchange = function() {
  mediator.changed(this);
};
memorySelect.onchange = function() {
  mediator.changed(this);
};
numberInput.oninput = function() {
  mediator.changed(this);
};
```

###4.总结

* 中介者模式也是迎合迪米特法则的一种实现，拥抱最少知识原则
* 对象之间几乎不知道彼此的存在，它们 只能通过中介者对象来互相影响对方。

