/**
 * 虚拟代理
 */

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
    flower.setName('宝马')
    target.proxySendFlower(flower);
  }
};

var Fool = {
  proxySendFlower: function(flower) {
    Muse.listenGoodMood(function() {
      Muse.receiveFlower(flower)
    })
  }
}
var Muse = {
  receiveFlower: function(flower) {
    console.log('收到：' + flower.getName());
    console.log('emm, 心情不错')
  },
  listenGoodMood: function(fn) {
    // 心情美丽的时候
    setTimeout(function() {
      fn()
    }, 6 * 1000)
  }

};
Perse.sendFlower(Fool);