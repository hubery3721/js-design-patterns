/**
 * orderType： 表示订单类型（ 定金用户或者普通购买用户）， code 的值为 1 的时候是 500 元定金用户， 为 2 的时候是 200 元定金用户， 为 3 的时候是普通购买用户。
 * pay： 表示用户是否已经支付定金， 值为 true 或者 false, 虽然用户已经下过 500 元定金的订单， 但如果他一直没有支付定金， 现在只能降级进入普通购买模式。
 * stock： 表示当前用于普通购买的手机库存数量， 已经支付过 500 元或者 200 元定金的用户不受此限制。
 */

// 引入职责链

// var order500 = function(orderType, pay, stock) {
//   if (orderType === 1 && pay === true) {
//     console.log('500 元定金预购, 得到 100 优惠券');
//   } else {
//     order200(orderType, pay, stock); // 将请求传递给 200 元订单
//   }
// };
// // 200 元订单
// var order200 = function(orderType, pay, stock) {
//   if (orderType === 2 && pay === true) {
//     console.log('200 元定金预购, 得到 50 优惠券');
//   } else {
//     orderNormal(orderType, pay, stock); // 将请求传递给普通订单
//   }
// };
// // 普通购买订单
// var orderNormal = function(orderType, pay, stock) {
//   if (stock > 0) {
//     console.log('普通购买, 无优惠券');
//   } else {
//     console.log('手机库存不足');
//   }
// };
// // 测试结果：
// order500(1, true, 500); // 输出：500 元定金预购, 得到 100 优惠券
// order500(1, false, 500); // 输出：普通购买, 无优惠券
// order500(2, true, 500); // 输出：200 元定金预购, 得到 500 优惠券
// order500(3, false, 500); // 输出：普通购买, 无优惠券
// order500(3, false, 0); // 输出：手机库存不足

// 缺点：违背开闭原则，比如增加一种预存300的方式，或者修改预存200的优惠额度，都很麻烦

// 引入装饰器，继续优化
var order500 = function(orderType, pay, stock) {
  if (orderType === 1 && pay === true) {
    console.log('500 元定金预购，得到 100 优惠券');
  } else {
    return 'nextSuccessor'; // 我不知道下一个节点是谁，反正把请求往后面传递
  }
};
var order200 = function(orderType, pay, stock) {
  if (orderType === 2 && pay === true) {
    console.log('200 元定金预购，得到 50 优惠券');
  } else {
    return 'nextSuccessor'; // 我不知道下一个节点是谁，反正把请求往后面传递
  }
};
var orderNormal = function(orderType, pay, stock) {
  if (stock > 0) {
    console.log('普通购买，无优惠券');
  } else {
    console.log('手机库存不足');
  }
};
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