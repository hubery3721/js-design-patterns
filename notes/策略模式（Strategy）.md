###1.定义

定义一系列的算法，把它们一个个封装起来，并且使它们可以相互替换

_“**并且使它们可以相互替换**”， 这句话在很大程度上是相对于静态类型语言而言的。 因为静态类型语言中有类型检
查机制， 所以各个策略类需要实现同样的接口。 当它们的真正类型被隐藏在接口后面时， 它们才能被相互替换。
而在 JavaScript 这种“类型模糊” 的语言中没有这种困扰， 任何对象都可以被替换使用。 因此， JavaScript 中的“ 可以相互替换使用” 表现为它们具有相同的目标和意图。_

###2.核心

* 将算法的使用和算法的实现分离开来。
* 一个基于策略模式的程序至少由两部分组成：
* 第一个部分是一组策略类， 策略类封装了具体的算法， 并负责具体的计算过程。
* 第二个部分是环境类Context， Context接受客户的请求，随后把请求委托给某一个策略类。 要做到这点， 说明Context 中要维持对某个策略对象的引用

###3.实现

计算年终奖 demo-1/demo-2（注：案例内纯属虚构！）

3.1 常规思路

```js
var calculateBonus = function(performanceLevel, salary) {
  if (performanceLevel === 'S') {
    return salary * 4;
  }
  if (performanceLevel === 'A') {
    return salary * 3;
  }
  if (performanceLevel === 'B') {
    return salary * 2;
  }
  if (performanceLevel === 'C') {
    return salary * 1;
  }
  if (performanceLevel === 'D') {
    return salary * 0.8;
  }
};
var p1 = calculateBonus('B', 20000);
var p2 = calculateBonus('S', 6000);
var p3 = calculateBonus('D', 6000);
console.log(p1, p2, p3)
```

3.2 使用策略模式重构代码

```js
var performanceS = function() {};
performanceS.prototype.calculate = function(salary) {
  return salary * 4;
};
var performanceA = function() {};
performanceA.prototype.calculate = function(salary) {
  return salary * 3;
};

var performanceB = function() {};
performanceB.prototype.calculate = function(salary) {
  return salary * 2;
};

function Bonus() {
  this.salary = null;
  this.strategy = null;
}

Bonus.prototype.setSalary = function(salary) {
  this.salary = salary
}
Bonus.prototype.setStrategy = function(strategy) {
  this.strategy = strategy
}
Bonus.prototype.getBonus = function() {
  return this.strategy.calculate(this.salary)
}

var bonus = new Bonus()
bonus.setSalary(20000)
bonus.setStrategy(new performanceB())
var p1 = bonus.getBonus()
console.log(p1)
bonus.setSalary(6000)
bonus.setStrategy(new performanceS())
var p2 = bonus.getBonus()
console.log(p2)
```

3.3 JS版的策略模式

```js
var strategies = {
  "S": function(salary) {
    return salary * 4;
  },
  "A": function(salary) {
    return salary * 3;
  },
  "B": function(salary) {
    return salary * 2;
  },
  "C": function(salary) {
    return salary * 1;
  },
  "D": function(salary) {
    return salary * 0.8;
  },
}

var calculateBonus = function(level, salary) {
  return strategies[level](salary)
}
var p1 = calculateBonus('B', 20000);
var p2 = calculateBonus('S', 6000);
var p3 = calculateBonus('D', 6000);
console.log(p1, p2, p3)
```

通过使用策略模式重构代码， 我们消除了原程序中大片的条件分支语句。 所有跟计算奖金有

关的逻辑不再放在 Context 中， 而是分布在各个策略对象中。 Context 并没有计算奖金的能力， 而

是把这个职责委托给了某个策略对象。 每个策略对象负责的算法已被各自封装在对象内部。 当我

们对这些策略对象发出“ 计算奖金” 的请求时， 它们会返回各自不同的计算结果， 这正是对象多

态性的体现， 也是“ 它们可以相互替换” 的目的。 替换 Context 中当前保存的策略对象， 便能执

行不同的算法来得到我们想要的结果。

3.4 策略模式（ES6）

```js
// 环境类context，接收客户请求
class Bonus {
  constructor() {
    this.salary = null;
    this.strategy = null;
  }

  setSalary(salary) {
    this.salary = salary
  }

  setStrategy(strategy) {
    this.strategy = strategy
  }

  getBonus() {
    return this.strategy(this.salary)
  }
}

// 算法策略，定义不同的算法
let strategies = {
  "S": (salary) => {
    return salary * 4;
  },
  "A": (salary) => {
    return salary * 3;
  },
  "B": (salary) => {
    return salary * 2;
  },
  "C": (salary) => {
    return salary * 1;
  },
  "D": (salary) => {
    return salary * 0.8;
  },
}
let bonus = new Bonus()
bonus.setSalary(20000)
bonus.setStrategy(strategies['B'])
let p1 = bonus.getBonus()
bonus.setSalary(6000)
bonus.setStrategy(strategies['S'])
let p2 = bonus.getBonus()
console.log(p1, p2)
```

###4.应用场景

4.1 表单验证 demo-3/demo-4

```js
/**
 * 常规思路
 */

var registerForm = document.getElementById('registerForm');
registerForm.onsubmit = function() {
  if (registerForm.userName.value === '') {
    alert('用户名不能为空');
    return false;
  }
  if (registerForm.userName.value.length < 4) {
    alert('用户名长度不能小于 4 位');
    return false;
  }
  if (registerForm.password.value.length < 6) {
    alert('密码长度不能少于 6 位');
    return false;
  }
  if (!/(^1[3|5|8][0-9]{9}$)/.test(registerForm.phoneNumber.value)) {
    alert('手机号码格式不正确');
    return false;
  }
  alert("验证通过，提交！")
}
```

```js
/**
 * 策略模式
 */


/***********************策略对象**************************/
var strategies = {
  isNonEmpty: function(value, errorMsg) {
    if (value === '') {
      return errorMsg;
    }
  },
  minLength: function(value, length, errorMsg) {
    if (value.length < length) {
      return errorMsg;
    }
  },
  isMobile: function(value, errorMsg) {
    if (!/(^1[3|5|8][0-9]{9}$)/.test(value)) {
      return errorMsg;
    }
  }
};
/***********************Validator 类**************************/
var Validator = function() {
  this.cache = [];
};
Validator.prototype.add = function(dom, rules) {
  var self = this;
  for (var i = 0, rule; rule = rules[i++];) {
    (function(rule) {
      var strategyAry = rule.strategy.split(':'); // ['isNonEmpty']
      var errorMsg = rule.errorMsg; //'用户名不能为空'
      self.cache.push(function() {
        var strategy = strategyAry.shift(); // 'isNonEmpty'
        strategyAry.unshift(dom.value); //[hbc]
        strategyAry.push(errorMsg); //[hbc, '用户名不能为空']
        return strategies[strategy].apply(dom, strategyAry);
      });
    })(rule)
  }
};
Validator.prototype.start = function() {
  for (var i = 0, validatorFunc; validatorFunc = this.cache[i++];) {
    var errorMsg = validatorFunc();
    if (errorMsg) {
      return errorMsg;
    }
  }
};
/***********************客户调用代码**************************/
var registerForm = document.getElementById('registerForm');
var validataFunc = function() {
  var validator = new Validator();
  validator.add(registerForm.userName, [{
    strategy: 'isNonEmpty',
    errorMsg: '用户名不能为空'
  }, {
    strategy: 'minLength:4',
    errorMsg: '用户名长度不能小于 4 位'
  }]);
  validator.add(registerForm.password, [{
    strategy: 'minLength:6',
    errorMsg: '密码长度不能小于 6 位'
  }]);
  validator.add(registerForm.phoneNumber, [{
    strategy: 'isMobile',
    errorMsg: '手机号码格式不正确'
  }]);
  var errorMsg = validator.start();
  return errorMsg;
}
registerForm.onsubmit = function() {
  var errorMsg = validataFunc();
  if (errorMsg) {
    alert(errorMsg);
    return false;
  }
  alert("验证通过，提交！")
};
```

4.2 表单验证（ES6）

```js
class Validator {
  constructor() {
    this.cache = [];
    this.strategies = {
      isNonEmpty: function(value, errorMsg) {
        if (value === '') {
          return errorMsg;
        }
      },
      minLength: function(value, length, errorMsg) {
        if (value.length < length) {
          return errorMsg;
        }
      },
      isMobile: function(value, errorMsg) {
        if (!/(^1[3|5|8][0-9]{9}$)/.test(value)) {
          return errorMsg;
        }
      }
    }
  }
  add(dom, rules) {
    for (let i = 0, rule; rule = rules[i++];) {
      let strategyAry = rule.strategy.split(':')
      let errorMsg = rule.errorMsg
      this.cache.push(() => {
        let strategy = strategyAry.shift();
        strategyAry.unshift(dom.value)
        strategyAry.push(errorMsg)
        return this.strategies[strategy].apply(dom, strategyAry)
      })
    }
  }
  start() {
    for (let i = 0, validatorFunc; validatorFunc = this.cache[i++];) {
      let errorMsg = validatorFunc()
      if (errorMsg) {
        return errorMsg
      }
    }
  }
}


// 以下为业务代码
let registerForm = document.getElementById('registerForm');

registerForm.onsubmit = () => {
  let validator = new Validator()
  validator.add(registerForm.userName, [{
    strategy: 'isNonEmpty',
    errorMsg: '用户名不能为空'
  }, {
    strategy: 'minLength:4',
    errorMsg: '用户名长度不能小于 4 位'
  }])

  let errorMsg = validator.start()
  if (errorMsg) {
    alert(errorMsg)
    return false
  }
  alert('验证通过，提交！')
}
```

###4.优点&缺点

优点：

* 策略模式利用组合、委托和多态等技术和思想，可以作为if/else判断的另一种表现形式，在达到相同目的的同时，极大的减少了代码量以及代码维护成本。
* 策略模式提供了对开放—封闭原则的完美支持，将算法封装在独立的strategy 中，使得它们易于切换，易于理解，易于扩展。
* 策略模式中的算法也可以复用在系统的其他地方，从而避免许多重复的复制粘贴工作。
* 在策略模式中利用组合和委托来让Context拥有执行算法的能力，这也是继承的一种更轻便的替代方案。

缺点：
尽管采用策略模式能够封装很多算法， 但是对于用户， 也就是没有参与封装的其他开发者来说， 他们并不知道有哪些方法可以使用， 如果不去阅读这些算法， 很容易走回以前的老套路或者重复封装。 这也是策略模式一个比较大的缺点。违背了最少知识原则





