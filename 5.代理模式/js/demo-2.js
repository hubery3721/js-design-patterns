/**
 * 保护代理
 */

var Flower = function() {};
Flower.prototype.setName = function(name) {
  this.name = name || '我是一朵花！'
}

Flower.prototype.getName = function() {
  return this.name
}
var Perse = {
  sendFlower: function(target) {
    var flower = new Flower();
    flower.setName('牛粪上拔的')
    // flower.setName('')
    target.proxySendFlower(flower);
  }
};

var Fool = {
  proxySendFlower: function(flower) {
    if (Muse.favorite(flower)) {
      Muse.receiveFlower(flower)
    } else {
      console.log("还是算了吧")
    }
  }
}
var Muse = {
  receiveFlower: function(flower) {
    console.log('收到花：' + flower.getName());
    console.log('emm, 心情不错')
  },
  favorite: function(item) {
    if (item.name.indexOf('钻石') != -1) {
      return true
    } else {
      return false
    }
  }

};
Perse.sendFlower(Fool);