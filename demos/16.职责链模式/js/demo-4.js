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