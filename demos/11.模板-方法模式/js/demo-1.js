/**
 * 泡咖啡
 * 烧一壶水
 * 用沸水冲泡咖啡
 * 把咖啡倒进杯子
 * 加糖和牛奶
 */
// var Coffee = function() {};
// Coffee.prototype.boilWater = function() {
//   console.log('把水煮沸');
// };
// Coffee.prototype.brewCoffeeGriends = function() {
//   console.log('用沸水冲泡咖啡');
// };
// Coffee.prototype.pourInCup = function() {
//   console.log('把咖啡倒进杯子');
// };
// Coffee.prototype.addSugarAndMilk = function() {
//   console.log('加糖和牛奶');
// };
// Coffee.prototype.init = function() {
//   this.boilWater();
//   this.brewCoffeeGriends();
//   this.pourInCup();
//   this.addSugarAndMilk();
// };
// var coffee = new Coffee();
// coffee.init();

/**
 * 泡咖啡
 * 烧一壶水
 * 用沸水浸泡茶叶
 * 把茶倒进杯子
 * 加柠檬
 */

// var Tea = function() {};
// Tea.prototype.boilWater = function() {
//   console.log('把水煮沸');
// };
// Tea.prototype.steepTeaBag = function() {
//   console.log('用沸水浸泡茶叶');
// };
// Tea.prototype.pourInCup = function() {
//   console.log('把茶水倒进杯子');
// };
// Tea.prototype.addLemon = function() {
//   console.log('加柠檬');
// };
// Tea.prototype.init = function() {
//   this.boilWater();
//   this.steepTeaBag();
//   this.pourInCup();
//   this.addLemon();
// };
// var tea = new Tea();
// tea.init();

// TODO...

// 创建一个父类 Drink

var Drink = function() {
  console.log("1")
};
Drink.prototype.boilWater = function() {
  console.log('把水煮沸');
};
Drink.prototype.brew = function() {
  // throw new Error('子类必须重写 brew 方法');
}; // 空方法，应该由子类重写
Drink.prototype.pourInCup = function() {
  // throw new Error('子类必须重写 pourInCup 方法');
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
var Coffee = function() {
  // console.log("2")
};
Coffee.prototype = new Drink();
Coffee.prototype.constructor = Coffee;
// Coffee.prototype.brew = function() {
//   console.log('用沸水冲泡咖啡');
// };
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
var coffee = new Coffee();
console.log(coffee.constructor)
coffee.init();

// 如果想喝茶
// var Tea = function() {};
// Tea.prototype = new Drink();
// Tea.prototype.brew = function() {
//   console.log('用沸水浸泡茶叶');
// };
// Tea.prototype.pourInCup = function() {
//   console.log('把茶倒进杯子');
// };
// Tea.prototype.addCondiments = function() {
//   console.log('加柠檬');
// };
// var tea = new Tea();
// tea.init();