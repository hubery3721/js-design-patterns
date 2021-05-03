###1.定义

> 适配器模式（有时候也称包装器Warpper）将一个类的接口适配成用户所期待的。一个适配允许通常因为接口不兼容而不能在一起工作的类工作在一起，做法是将类自己的接口包裹在一个已存在的类中。

应用场景：
当我们试图调用模块或者对象的某个接口时，却发现这个接口的格式并不符合目前的需求。
这时候有两种解决办法，第一种是修改原来的接口实现，但如果原来的模块很复杂，或者我们拿
到的模块是一段别人编写的经过压缩的代码，修改原接口就显得不太现实了。第二种办法是创建
一个适配器，将原接口转换为客户希望的另一个接口，客户只需要和适配器打交道。

###2.核心

![IMAGE](resources/2B230B94ED86AF519BB21165FFA03CD6.jpg =687x370)
* Client 使用者：调用Adapter来请求服务
* Adapter 适配器：实现了客户所期望或知道的接口
* Adaptee 被适配者：与客户期望或知道的接口不同

解决两个已有接口之间不匹配的问题

###3.实现

3.1 USB/TC 转电信号

```js
// Adaptee 被适配对象1
class Usb {
  constructor() {};
  showInfo() {
    return {
      name: 'usb',
      info: 'usb info'
    };
  };
};

// Adaptee 被适配对象2
class Tc {
  showInfo() {
    return 'Tc signal'
  };
};

// Adapter 适配器
class SignalAdapter {
  showInfo(supporter) {

    if (supporter instanceof Usb) {
      const infoObj = supporter.showInfo();
      return infoObj.info + '转换成了电信号';
    } else if (supporter instanceof Typec) {
      const infoMsg = supporter.showInfo();
      return infoMsg + '转换成了电信号';
    }
    return '';
  };
};

// var usb = new Usb()
// console.log(usb.showInfo.info)
// var tc = new Tc()
// console.log(tc.showInfo)

// Client 使用者
class Client {
  getInfo() {
    const signalAdapter = new SignalAdapter();
    // const info = signalAdapter.showInfo(new Usb());
    const info = signalAdapter.showInfo(new Tc());
    console.log('final info:', info);
  };
};
const c = new Client();
c.getInfo();
```

* 完成了信息的转换，也把usb对象中的对象类型数据结构转换成了字符串。这就是最简单的适配器模式。
* 适配器模式就是加一层，使得原来的信息得到有效的转换成一个新的数据，以适配现需求。

3.2 demo-2 购物车结算

在线购物车的部分功能，其中的Shipping对象用来计算运输成本。旧的Shipping对象将被替换为新的改进的Shipping对象，该对象更加安全，价格也有所提高。

新的对象被命名为AdvancedShipping，并且具有与客户端程序不同的接口。**ShippingAdapter通过将旧的Shipping接口映射（自适应）到新的AdvancedShipping接口，允许客户端程序在没有改变任何API的情况下继续运行**。日志函数用来收集和显示结果。

```js
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
```

3.3 日常运用 demo-3

```js
var arr = ['张三', '18', '河南郑州', '2020年8月2日']

// 转化成我们需要的格式
function arrObjAdapter(arr) {
  return {
    name: arr[0],
    age: arr[1],
    address: arr[2],
    time: arr[3]

  }
}

console.log(arr);
var adapterData = arrObjAdapter(arr);
console.log(adapterData);
```

3.4 番外篇 外观模式 demo-4

* 为一组子系统提供一个简单便利的访问入口。
* 隔离客户与复杂子系统之间的联系，客户不用去了解子系统的细节。

```js
/**
 * 这是一段“闻起来”就很奇怪的代码
 */
function getEnv() {
  return 'app' // 'browser', 'wx'
}

function noop() {};

function share() {
  switch (getEnv()) {
    case 'app':
      appSDK.jsBridge('share');
      break;
    case 'browser':
      noop();
      break;
    case 'wx':
      wxSDK.onMenuShareTimeline();
      wxSDK.onMenuShareAppMessage();
      break;
  }
}

function openUrl() {
  switch (getEnv()) {}
}


/**
 * 外观模式
 */

const appAdapter = {
  share: () => {
    appSDK.jsBridge('share');
  },
  openUrl: () => {}
}

const wxAdapter = {
  share: () => {
    wxSDK.onMenuShareTimeline();
    wxSDK.onMenuShareTimeline();
  },
  openUrl: () => {}
}

const browserAdapter = {
  share: () => {
    noop();
  },
  openUrl: () => {}
}

function share() {
  let sdk = null;
  switch (getEnv()) {
    case 'app':
      sdk = appAdapter;
      break;
    case 'browser':
      sdk = browserAdapter;
      break;
    case 'wx':
      sdk = wxAdapter;
      break;
  }

  sdk.share();
}

// 定义高层一致性接口
// share()

function  facade() {
  return { app: appAdapter, wx: wxAdapter, browser: browserAdapter } [getEnv()];
}





/**
 * I am 策略模式 Strategy
 */

// context
class SDKadapter {
  constructor(env) {
    this.env = env
    this.adapters = {}
  }

  set(adapters) {
    this.adapters = adapters
  }

  get() {
    return this.adapters[this.env]
  }
}

// strategies
var strategies = {
  app: appAdapter,
  wx: wxAdapter,
  browser: browserAdapter
}

var sdkAdapter = new SDKadapter(getEnv())
sdkAdapter.share()
```

![IMAGE](resources/37BBEEC22CCD00E1D3EBDEBBD12A6B50.jpg =1167x675)

###4.总结

如果有以下情况出现时，建议使用适配器模式：

* 使用一个已经存在的对象，但其方法或属性接口不符合你的要求。
* 你想创建一个可复用的对象，该对象可以与其它不相关的对象或不可见对象（即接口方法或属性不兼容的对象）协同工作。
* 想使用已经存在的对象，但是不能对每一个都进行原型继承以匹配它的接口。对象适配器可以适配它的父对象接口方法或属性
* 需要一个统一的输出接口，但是输入类型却不可预知





