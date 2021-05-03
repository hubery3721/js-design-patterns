/**
 * 常规思路
 */

// var registerForm = document.getElementById('registerForm');
// registerForm.onsubmit = function() {
//   if (registerForm.userName.value === '') {
//     alert('用户名不能为空');
//     return false;
//   }
//   if (registerForm.userName.value.length < 4) {
//     alert('用户名长度不能小于 4 位');
//     return false;
//   }
//   if (registerForm.password.value.length < 6) {
//     alert('密码长度不能少于 6 位');
//     return false;
//   }
//   if (!/(^1[3|5|8][0-9]{9}$)/.test(registerForm.phoneNumber.value)) {
//     alert('手机号码格式不正确');
//     return false;
//   }
//   alert("验证通过，提交！")
// }

/***********************策略对象**************************/
var strategies = {
  isNonEmpty: function(value, errorMsg) {
    if (value === '') {
      return errorMsg;
    }
  },
  minLength: function(value, length, errorMsg) {
    if (value.length < length) {
      return errorMsg;
    }
  },
  isMobile: function(value, errorMsg) {
    if (!/(^1[3|5|8][0-9]{9}$)/.test(value)) {
      return errorMsg;
    }
  }
};
/***********************Validator 类**************************/
var Validator = function() {
  this.cache = [];
};
Validator.prototype.add = function(dom, rules) {
  var self = this;
  for (var i = 0, rule; rule = rules[i++];) {
    (function(rule) {
      var strategyAry = rule.strategy.split(':'); // ['isNonEmpty']
      var errorMsg = rule.errorMsg; //'用户名不能为空'
      self.cache.push(function() {
        var strategy = strategyAry.shift(); // 'isNonEmpty'
        strategyAry.unshift(dom.value); //[hbc]
        strategyAry.push(errorMsg); //[hbc, '用户名不能为空']
        return strategies[strategy].apply(dom, strategyAry);
      });
    })(rule)
  }
};
Validator.prototype.start = function() {
  for (var i = 0, validatorFunc; validatorFunc = this.cache[i++];) {
    var errorMsg = validatorFunc();
    if (errorMsg) {
      return errorMsg;
    }
  }
};
/***********************客户调用代码**************************/
var registerForm = document.getElementById('registerForm');
var validataFunc = function() {
  var validator = new Validator();
  validator.add(registerForm.userName, [{
    strategy: 'isNonEmpty',
    errorMsg: '用户名不能为空'
  }, {
    strategy: 'minLength:4',
    errorMsg: '用户名长度不能小于 4 位'
  }]);
  validator.add(registerForm.password, [{
    strategy: 'minLength:6',
    errorMsg: '密码长度不能小于 6 位'
  }]);
  validator.add(registerForm.phoneNumber, [{
    strategy: 'isMobile',
    errorMsg: '手机号码格式不正确'
  }]);
  var errorMsg = validator.start();
  return errorMsg;
}
registerForm.onsubmit = function() {
  var errorMsg = validataFunc();
  if (errorMsg) {
    alert(errorMsg);
    return false;
  }
  alert("验证通过，提交！")
};