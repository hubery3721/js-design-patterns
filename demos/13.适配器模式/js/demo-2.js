// 老的运费
function Shipping() {
  this.request = function(zipStart, zipEnd, weight) {
    // ...
    return "49.75元";
  }
}

// 新的运费
function AdvancedShipping() {
  this.login = function(credentials) { /* ... */ };
  this.setStart = function(start) { /* ... */ };
  this.setDestination = function(destination) { /* ... */ };
  this.calculate = function(weight) {
    return "59.50元";
  };
}

// 适配器接口
function ShippingAdapter(credentials) {
  var shipping = new AdvancedShipping();

  shipping.login(credentials);

  return {
    request: function(zipStart, zipEnd, weight) {
      shipping.setStart(zipStart);
      shipping.setDestination(zipEnd);
      return shipping.calculate(weight);
    }
  };
}


// 日志记录函数
var log = (function() {
  var log = "";

  return {
    add: function(msg) {
      log += msg + "\n";
    },
    show: function() {
      console.info("%c%s", "color:red; font-size:18px", log);
      log = "";
    }
  }
})();

function run() {
  // 老的运费对象和接口
  // var shipping = new Shipping();
  // var cost = shipping.request("78701", "10010", "5公斤");
  // log.add("老的运费: " + cost);

  // var s1 = new AdvancedShipping()
  // s1.setStart("78701")

  var credentials = {
    token: "30a8-6ee1"
  };
  var adapter = new ShippingAdapter(credentials);

  //新的运费象和相应的适配器接口
  cost = adapter.request("78701", "10010", "5公斤");
  log.add("新的运费: " + cost);

  log.show();
}
run();