var Singleton = function(name) {
  this.name = name;
  this.instance = null;
};
Singleton.prototype.getName = function() {
  return this.name
};
Singleton.getInstance = function(name) {
  if (!this.instance) {
    this.instance = new Singleton(name);
  }
  return this.instance;
};
var person1 = Singleton.getInstance('攀少1');
var person2 = Singleton.getInstance('攀少2');

console.log(person1.getName())
console.log(person2.getName())
console.log(person1 === person2); // true