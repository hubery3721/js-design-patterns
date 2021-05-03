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