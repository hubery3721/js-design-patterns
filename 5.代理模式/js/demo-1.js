/**
 * 初识代理模式
 */

//  无代理模式实现
// var Flower = function() {};
// Flower.prototype.setName = function(name) {
//   this.name = name || '我是一朵花！'
// }
// var Perse = {
//   sendFlower: function(target) {
//     var flower = new Flower();
//     // flower.setName('牛粪上拔的')
//     target.receiveFlower(flower);
//   }
// };
// var Muse = {
//   receiveFlower: function(flower) {
//     console.log('收到花：' + flower);
//   }
// };
// Perse.sendFlower(Muse);

// 引入代理模式

var Flower = function() {};
Flower.prototype.setName = function(name) {
  this.name = name
}
Flower.prototype.getName = function() {
  return this.name
}
var Perse = {
  sendFlower: function(target) {
    var flower = new Flower();
    flower.setName('牛粪上拔的')
    target.proxySendFlower(flower);
  }
};

var Fool = {
  proxySendFlower: function(flower) {
    Muse.receiveFlower(flower)
  }
}
var Muse = {
  receiveFlower: function(flower) {
    console.log('收到花：' + flower.getName());
  }
};
Perse.sendFlower(Fool);