class Validator {
  constructor() {
    this.cache = [];
    this.strategies = {
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
    }
  }
  add(dom, rules) {
    for (let i = 0, rule; rule = rules[i++];) {
      let strategyAry = rule.strategy.split(':')
      let errorMsg = rule.errorMsg
      this.cache.push(() => {
        let strategy = strategyAry.shift();
        strategyAry.unshift(dom.value)
        strategyAry.push(errorMsg)
        return this.strategies[strategy].apply(dom, strategyAry)
      })
    }
  }
  start() {
    for (let i = 0, validatorFunc; validatorFunc = this.cache[i++];) {
      let errorMsg = validatorFunc()
      if (errorMsg) {
        return errorMsg
      }
    }
  }
}


// 以下为业务代码
let registerForm = document.getElementById('registerForm');

registerForm.onsubmit = () => {
  let validator = new Validator()
  validator.add(registerForm.userName, [{
    strategy: 'isNonEmpty',
    errorMsg: '用户名不能为空'
  }, {
    strategy: 'minLength:4',
    errorMsg: '用户名长度不能小于 4 位'
  }])
  validator.add(registerForm.password, [{
    strategy: 'minLength:6',
    errorMsg: '密码长度不能小于 6 位'
  }]);
  validator.add(registerForm.phoneNumber, [{
    strategy: 'isMobile',
    errorMsg: '手机号码格式不正确'
  }]);

  let errorMsg = validator.start()
  if (errorMsg) {
    alert(errorMsg)
    return false
  }
  alert('验证通过，提交！')
}