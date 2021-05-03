// 创建一个飞机类
// var Plane = function() {}
// Plane.prototype.fire = function() {
//   console.log('发射普通子弹');
// }

// // 再来两个装饰类
// var MissileDecorator = function(plane) {
//   this.plane = plane;
// }
// MissileDecorator.prototype.fire = function() {
//   this.plane.fire();
//   console.log('发射导弹');
// }
// var AtomDecorator = function(plane) {
//   this.plane = plane;
// }
// AtomDecorator.prototype.fire = function() {
//   this.plane.fire();
//   console.log('发射原子弹');
// }

/**
 * 导弹类和原子弹类的构造函数都接受参数 plane 对象， 并且保存好这个参数， 
 * 在它们的 fire方法中， 除了执行自身的操作之外， 还调用 plane 对象的 fire 方法。
 */

// 调用代码
// var plane = new Plane();
// plane = new MissileDecorator(plane);
// plane = new AtomDecorator(plane);
// plane.fire();

// 闻起来有点怪的代码
// var plane = new Plane()
// plane.fire = function() {
//   console.log('发射普通子弹');
//   console.log('发射导弹');
//   console.log('发射原子弹');
// }
// plane.fire()

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