###1.定义
>使多个对象都有机会处理请求，从而避免请求的发送者和接收者之间的耦合关系，将这些对象连成一条链，并沿着这条链传递该请求，直到有一个对象处理它为止。

###2.核心
职责链模式的名字非常形象，一系列可能会处理请求的对象被连接成一条链，请求在这些对象之间依次传递，直到遇到一个可以处理它的对象，我们把这些对象称为链中的节点

现实中的职责链：
上班挤公交。因为公交车上人实在太多了，经常上车后却找不到售票员在哪，所以只好把两块钱硬币往前面递。除非你运气够好，站在你前面的第一个人就是售票员，否则，你的硬币通常要在N个人手上传递，才能最终到达售票员的手里。

![IMAGE](resources/AF6E4D50DAA21E30C646172E732A28DE.jpg =700x356)

###3.实现

3.1 场景一 电商网站 demo-1/demo-2

购物方式：
* 押金500，送100优惠券
* 押金200，送50优惠券
* 押金0
规则：
* 有库存时下单成功，无库存失败
* 如果选择押金500，但未交足500押金，则降级下个方式，依此类推

```js
/**
 * orderType： 表示订单类型（ 定金用户或者普通购买用户）， code 的值为 1 的时候是 500 元定金用户， 为 2 的时候是 200 元定金用户， 为 3 的时候是普通购买用户。
 * pay： 表示用户是否已经支付定金， 值为 true 或者 false, 虽然用户已经下过 500 元定金的订单， 但如果他一直没有支付定金， 现在只能降级进入普通购买模式。
 * stock： 表示当前用于普通购买的手机库存数量， 已经支付过 500 元或者 200 元定金的用户不受此限制。
 */

// 以下是一段没有灵魂的代码

var order = function(orderType, pay, stock) {
  if (orderType === 1) { // 500 元定金购买模式
    if (pay === true) { // 已支付定金
      console.log('500 元定金预购, 得到 100 优惠券');
    } else { // 未支付定金，降级到普通购买模式
      if (stock > 0) { // 用于普通购买的手机还有库存
        console.log('普通购买, 无优惠券');
      } else {
        console.log('手机库存不足');
      }
    }
  } else if (orderType === 2) { // 200 元定金购买模式
    if (pay === true) {
      console.log('200 元定金预购, 得到 50 优惠券');
    } else {
      if (stock > 0) {
        console.log('普通购买, 无优惠券');
      } else {
        console.log('手机库存不足');
      }
    }
  } else if (orderType === 3) {
    if (stock > 0) {
      console.log('普通购买, 无优惠券');
    } else {
      console.log('手机库存不足');
    }
  }
};
order(1, true, 0); // 输出： 500 元定金预购, 得到 100 优惠券
order(1, false, 500); // 输出： 500 元定金预购, 得到 100 优惠券
```

引入职责链

```js
/**
 * orderType： 表示订单类型（ 定金用户或者普通购买用户）， code 的值为 1 的时候是 500 元定金用户， 为 2 的时候是 200 元定金用户， 为 3 的时候是普通购买用户。
 * pay： 表示用户是否已经支付定金， 值为 true 或者 false, 虽然用户已经下过 500 元定金的订单， 但如果他一直没有支付定金， 现在只能降级进入普通购买模式。
 * stock： 表示当前用于普通购买的手机库存数量， 已经支付过 500 元或者 200 元定金的用户不受此限制。
 */

// 引入职责链

var order500 = function(orderType, pay, stock) {
  if (orderType === 1 && pay === true) {
    console.log('500 元定金预购, 得到 100 优惠券');
  } else {
    order200(orderType, pay, stock); // 将请求传递给 200 元订单
  }
};
// 200 元订单
var order200 = function(orderType, pay, stock) {
  if (orderType === 2 && pay === true) {
    console.log('200 元定金预购, 得到 50 优惠券');
  } else {
    orderNormal(orderType, pay, stock); // 将请求传递给普通订单
  }
};
// 普通购买订单
var orderNormal = function(orderType, pay, stock) {
  if (stock > 0) {
    console.log('普通购买, 无优惠券');
  } else {
    console.log('手机库存不足');
  }
};
// // 测试结果：
// order500(1, true, 500); // 输出：500 元定金预购, 得到 100 优惠券
// order500(1, false, 500); // 输出：普通购买, 无优惠券
// order500(2, true, 500); // 输出：200 元定金预购, 得到 500 优惠券
// order500(3, false, 500); // 输出：普通购买, 无优惠券
// order500(3, false, 0); // 输出：手机库存不足

// 缺点：违背开闭原则，比如增加一种预存300的方式，或者修改预存200的优惠额度，都很麻烦

// 引入装饰器，继续优化
// Chain.prototype.setNextSuccessor 指定在链中的下一个节点
// Chain.prototype.passRequest 传递请求给某个节点
var Chain = function(fn) {
  this.fn = fn;
  this.successor = null;
};
Chain.prototype.setNextSuccessor = function(successor) {
  return this.successor = successor;
};
Chain.prototype.passRequest = function() {
  var ret = this.fn.apply(this, arguments);
  if (ret === 'nextSuccessor') {
    return this.successor && this.successor.passRequest.apply(this.successor, arguments);
  }
  return ret;
};
// 现在我们把 3 个订单函数分别包装成职责链的节点：
var chainOrder500 = new Chain(order500);
var chainOrder200 = new Chain(order200);
var chainOrderNormal = new Chain(orderNormal);
// 然后指定节点在职责链中的顺序：
chainOrder500.setNextSuccessor(chainOrder200);
chainOrder200.setNextSuccessor(chainOrderNormal);

// 最后把请求传递给第一个节点：
chainOrder500.passRequest(1, true, 500); // 输出：500 元定金预购，得到 100 优惠券
chainOrder500.passRequest(1, false, 500); // 输出：普通购买，无优惠券
chainOrder500.passRequest(2, true, 500); // 输出：200 元定金预购，得到 50 优惠券
chainOrder500.passRequest(3, true, 500); // 输出：普通购买，无优惠券
chainOrder500.passRequest(1, false, 0); // 输出：手机库存不足
```

看起来像不像装饰器? :))

3.2 异步职责链 demo-3

比如我们要在节点函数中发起一个ajax异步请求，异步请求返回的结果才能决定是否继续在职责链中passRequest
这时候让节点函数同步返回"nextSuccessor"已经没有意义了，所以要给Chain类再增加一个原型方法Chain.prototype.next，表示手动传递请求给职责链中的下一个节点

```js
/**
 * orderType： 表示订单类型（ 定金用户或者普通购买用户）， code 的值为 1 的时候是 500 元定金用户， 为 2 的时候是 200 元定金用户， 为 3 的时候是普通购买用户。
 * pay： 表示用户是否已经支付定金， 值为 true 或者 false, 虽然用户已经下过 500 元定金的订单， 但如果他一直没有支付定金， 现在只能降级进入普通购买模式。
 * stock： 表示当前用于普通购买的手机库存数量， 已经支付过 500 元或者 200 元定金的用户不受此限制。
 */

// 引入职责链

var order500 = function(orderType, pay, stock) {
  if (orderType === 1 && pay === true) {
    console.log('500 元定金预购，得到 100 优惠券');
  } else {
    return 'nextSuccessor'; // 我不知道下一个节点是谁，反正把请求往后面传递
  }
};
var order200 = function(orderType, pay, stock) {
  // 用setTimeout模拟ajax请法庭
  setTimeout(() => {
    console.warn("下单的人太多啦，要排队！")
    if (orderType === 2 && pay === true) {
      console.log('200 元定金预购，得到 50 优惠券');
    } else {
      this.next()
    }
  }, 2000);
};
var orderNormal = function(orderType, pay, stock) {
  if (stock > 0) {
    console.log('普通购买，无优惠券');
  } else {
    console.log('手机库存不足');
  }
};

// 引入装饰器，继续优化
// Chain.prototype.setNextSuccessor 指定在链中的下一个节点
// Chain.prototype.passRequest 传递请求给某个节点
var Chain = function(fn) {
  this.fn = fn;
  this.successor = null;
};
Chain.prototype.setNextSuccessor = function(successor) {
  return this.successor = successor;
};

// 画重点

Chain.prototype.next = function() {
  return this.successor && this.successor.passRequest.apply(this.successor, arguments);
};
Chain.prototype.passRequest = function() {
  var ret = this.fn.apply(this, arguments);
  if (ret === 'nextSuccessor') {
    return this.successor && this.successor.passRequest.apply(this.successor, arguments);
  }
  return ret;
};
// 现在我们把 3 个订单函数分别包装成职责链的节点：
var chainOrder500 = new Chain(order500);
var chainOrder200 = new Chain(order200);
var chainOrderNormal = new Chain(orderNormal);
// 然后指定节点在职责链中的顺序：
chainOrder500.setNextSuccessor(chainOrder200).setNextSuccessor(chainOrderNormal);

// 最后把请求传递给第一个节点：
chainOrder500.passRequest(1, true, 500); // 输出：500 元定金预购，得到 100 优惠券
chainOrder500.passRequest(1, false, 500); // 输出：普通购买，无优惠券
chainOrder500.passRequest(2, true, 500); // 输出：200 元定金预购，得到 50 优惠券
chainOrder500.passRequest(3, true, 500); // 输出：普通购买，无优惠券
chainOrder500.passRequest(1, false, 0); // 输出：手机库存不足
```

3.3 JS版的职责链，用AOP装饰函数来实现职责链 demo-4

```js
/**
 * orderType： 表示订单类型（ 定金用户或者普通购买用户）， code 的值为 1 的时候是 500 元定金用户， 为 2 的时候是 200 元定金用户， 为 3 的时候是普通购买用户。
 * pay： 表示用户是否已经支付定金， 值为 true 或者 false, 虽然用户已经下过 500 元定金的订单， 但如果他一直没有支付定金， 现在只能降级进入普通购买模式。
 * stock： 表示当前用于普通购买的手机库存数量， 已经支付过 500 元或者 200 元定金的用户不受此限制。
 */

// 引入职责链

var order500 = function(orderType, pay, stock) {
  if (orderType === 1 && pay === true) {
    console.log('500 元定金预购，得到 100 优惠券');
  } else {
    return 'nextSuccessor'; // 我不知道下一个节点是谁，反正把请求往后面传递
  }
};
var order200 = function(orderType, pay, stock) {
  // 用setTimeout模拟ajax请法庭
  if (orderType === 2 && pay === true) {
    console.log('200 元定金预购，得到 50 优惠券');
  } else {
    return 'nextSuccessor';
  }
};
var orderNormal = function(orderType, pay, stock) {
  if (stock > 0) {
    console.log('普通购买，无优惠券');
  } else {
    console.log('手机库存不足');
  }
};

// 用AOP来实现职责链
Function.prototype.after = function(fn) {
  var self = this;
  return function() {
    var ret = self.apply(this, arguments);
    if (ret === 'nextSuccessor') {
      return fn.apply(this, arguments);
    }
    return ret;
  }
};
var order = order500.after(order200).after(orderNormal)
// 现在我们把 3 个订单函数分别包装成职责链的节点：

// 最后把请求传递给第一个节点：
order(1, true, 500); // 输出：500 元定金预购，得到 100 优惠券
order(1, false, 500); // 输出：普通购买，无优惠券
order(2, true, 500); // 输出：200 元定金预购，得到 50 优惠券
order(3, true, 500); // 输出：普通购买，无优惠券
order(1, false, 0); // 输出：手机库存不足
```

###4.总结

优点：
* 解耦了请求发送者与N个接收者之间的复杂关系，由于不知道链中的哪个节点可以处理你发出的请求，所以你只需把请求传递给第一个节点即可
* 可以手动指定起始节点，请求瓶不是非得从链中的第个节点开始传递
  比如案例中购买普通订单，可以直接使用 

```js
orderNormal.passRequest(1, false, 500) // 普通购买，无优惠券
```

缺点：

\* 在一次请求传递过程中，大部分节点瓶没有起到实质性的作用，仅仅是让请求传递下去，造成性能上的损耗

