var createDiv = (function() {
  var instance;
  var createDiv = function(html) {
    if (instance) {
      return instance;
    }
    this.html = html;
    this.init();
    return instance = this;
  };
  createDiv.prototype.init = function() {
    var div = document.createElement('div');
    div.innerHTML = this.html;
    document.body.appendChild(div);
  };
  return createDiv;
})();

var a = new createDiv('div1');
var b = new createDiv('div2');

console.log(a === b); // true