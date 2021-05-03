var Singleton = function(name) {
  this.name = name;
};

Singleton.prototype.getName = function() {
  return this.name
};

var ProxySingletonSingleton = (function() {
  var instance;
  return function(name) {
    if (!instance) {
      instance = new Singleton(name);
    }
    return instance;
  }
})();
var person1 = new ProxySingletonSingleton('攀少1');
var person2 = new ProxySingletonSingleton('攀少2');
console.log(person1.getName())
console.log(person2.getName())
console.log(person1 === person2); // true