###1.定义

> 模板方法模式是一种只需使用继承就可以实现的非常简单的模式。

###2.核心

由两部分结构组成：第一部分是~~抽象~~父类，第二部分是具体的实现子类。通常在~~抽象~~父类中封装了子类的算法框架，包括实现一些公共方法以及封装子类中所有方法的执行顺序。子类通过继承这个~~抽象~~类，也继承了整个算法结构，并且可以选择重写父类的方法。

###3.实现

「咖啡与茶」demo-1

如何泡一杯咖啡：
* 烧一壶水
* 用沸水冲泡咖啡
* 把咖啡倒进杯子
* 加糖和牛奶

```js
var Coffee = function() {};
Coffee.prototype.boilWater = function() {
  console.log('把水煮沸');
};
Coffee.prototype.brewCoffeeGriends = function() {
  console.log('用沸水冲泡咖啡');
};
Coffee.prototype.pourInCup = function() {
  console.log('把咖啡倒进杯子');
};
Coffee.prototype.addSugarAndMilk = function() {
  console.log('加糖和牛奶');
};
Coffee.prototype.init = function() {
  this.boilWater();
  this.brewCoffeeGriends();
  this.pourInCup();
  this.addSugarAndMilk();
};
var coffee = new Coffee();
coffee.init();
```

如何泡一杯咖啡：
* 烧一壶水
* 用沸水浸泡茶叶
* 把茶倒进杯子
* 加柠檬

```js
var Tea = function() {};
Tea.prototype.boilWater = function() {
  console.log('把水煮沸');
};
Tea.prototype.steepTeaBag = function() {
  console.log('用沸水浸泡茶叶');
};
Tea.prototype.pourInCup = function() {
  console.log('把茶水倒进杯子');
};
Tea.prototype.addLemon = function() {
  console.log('加柠檬');
};
Tea.prototype.init = function() {
  this.boilWater();
  this.steepTeaBag();
  this.pourInCup();
  this.addLemon();
};
var tea = new Tea();
tea.init();
```

| Coffee        | Tea           |
| ------------- |:-------------:|
| 烧一壶水   | 烧一壶水 | 
| 用沸水冲泡咖啡     |用沸水浸泡茶叶      |
| 把茶倒进杯子| 把茶倒进杯子      |
| 加糖和牛奶 | 加柠檬      |

用模板-方法模式重构

```js
// 创建一个父类 Drink

var Drink = function() {};
Drink.prototype.boilWater = function() {
  console.log('把水煮沸');
};
Drink.prototype.brew = function() {
  //   throw new Error('子类必须重写 brew 方法');
}; // 空方法，应该由子类重写
Drink.prototype.pourInCup = function() {
  //   throw new Error('子类必须重写 pourInCup 方法');
}; // 空方法，应该由子类重写
Drink.prototype.addCondiments = function() {
  //   throw new Error('子类必须重写 addCondiments 方法');
}; // 空方法，应该由子类重写
Drink.prototype.addCondiments = function() {
  throw new Error('子类必须重写 addCondiments 方法');
};
Drink.prototype.customerWantsCondiments = function() {
  return true; // 默认需要调料
};
Drink.prototype.init = function() {
  this.boilWater();
  this.brew();
  this.pourInCup();
  if (this.customerWantsCondiments()) this.addCondiments();
};

// var tea = new Drink()
// tea.init()

// 创建一个子类Coffee
var Coffee = function() {};
Coffee.prototype = new Drink();

Coffee.prototype.brew = function() {
  console.log('用沸水冲泡咖啡');
};
Coffee.prototype.pourInCup = function() {
  console.log('把咖啡倒进杯子');
};
Coffee.prototype.addCondiments = function() {
  console.log('加糖和牛奶');
};
Coffee.prototype.customerWantsCondiments = function() {
  //   console.log('加料');
  //   return true;
  console.log('不加料');
  return false;
};
var Coffee = new Coffee();
Coffee.init();

// 如果想喝茶
var Tea = function() {};
Tea.prototype = new Drink();
Tea.prototype.brew = function() {
  console.log('用沸水浸泡茶叶');
};
Tea.prototype.pourInCup = function() {
  console.log('把茶倒进杯子');
};
Tea.prototype.addCondiments = function() {
  console.log('加柠檬');
};
var tea = new Tea();
tea.init();
```

Drink.prototype.init 被称为模板方法的原因是，该方法中封装了子类的算法框架，它作
为一个算法的模板，指导子类以何种顺序去执行哪些方法。在 Drink.prototype.init 方法中，
算法内的每一个步骤都清楚地展示在我们眼前。

3.2 模板方法模式的使用场景

模板方法模式常被架构师用于搭建项目的框架，架构师定好了框架的骨架，程序员继承框架的结构之后，负责往里面填空

3.3 钩子方法Hook

我们在父类中容易变化的地方放置钩子，钩子可以有一个默认的实现，究竟要不要“挂钩”，这由子类自行决定。钩子方法的返回结果决定了模板方法后面部分的执行步骤，也就是程序接下来的走向，这样一来，程序就拥有了变化的可能。

3.4 「好莱坞原则」demo-2

好莱坞原则就是允许底层组件将自己挂钩到高层组件中，而高层组件会决定什么时候、以何种方式去使用这些底层组件，高层组件对待底层组件的方式，跟演艺公司对待新人演员一样，都是“别调用我们，我们会调用你”。
模板方法模式是好莱坞原则的一个典型使用场景

```js
// 使用好莱坞原则（传参），模板-方法模式的JS改进版
var Drink = function(param) {
  var boilWater = function() {
    console.log('把水煮沸');
  };
  var brew = param.brew || function() {
    throw new Error('必须传递 brew 方法');
  };
  var pourInCup = param.pourInCup || function() {
    throw new Error('必须传递 pourInCup 方法');
  };
  var addCondiments = param.addCondiments || function() {
    throw new Error('必须传递 addCondiments 方法');
  };
  var F = function() {};
  F.prototype.init = function() {
    boilWater();
    brew();
    pourInCup();
    addCondiments();
  };
  return F;
};
var Coffee = Drink({
  brew: function() {
    console.log('用沸水冲泡咖啡');
  },
  pourInCup: function() {
    console.log('把咖啡倒进杯子');
  },
  addCondiments: function() {
    console.log('加糖和牛奶');
  }
});

var Tea = Drink({
  brew: function() {
    console.log('用沸水浸泡茶叶');
  },
  pourInCup: function() {
    console.log('把茶倒进杯子');
  },
  addCondiments: function() {
    console.log('加柠檬');
  }
});
var coffee = new Coffee();
coffee.init();
var tea = new Tea();
tea.init();
```

###4.总结

* 模板方法模式是一种典型的通过封装变化提高系统扩展性的设计模式
* 当子类方法种类和执行顺序都是不变的时候，把这部分抽象逻辑封装到父类的模板方法里面，子类的方法齿根体怎么实现则是可变的
* 拥抱开放-封闭原则
* javascript中，没有必要生搬硬套去实现一个模板方法模式，高阶函数是更好的选择



