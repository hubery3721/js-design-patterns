// 没有灵魂的代码

// var username = document.getElementById('username'),
//   password = document.getElementById('password'),
//   submitBtn = document.getElementById('submitBtn');
// var formSubmit = function() {
//   if (username.value === '') {
//     return alert('用户名不能为空');
//   }
//   if (password.value === '') {
//     return alert('密码不能为空');
//   }
//   // var param = {
//   //   username: username.value,
//   //   password: password.value
//   // }
//   // ajax('http:// xxx.com/login', param); // ajax 具体实现略
//   console.log("提交成功！")
// }
// submitBtn.onclick = function() {
//   formSubmit();
// }


// “优化”后的代码
// var validate = function() {
//   if (username.value === '') {
//     alert('用户名不能为空');
//     return false;
//   }
//   if (password.value === '') {
//     alert('密码不能为空');
//     return false;
//   }
// }
// var formSubmit = function() {
//   if (validate() === false) { // 校验未通过
//     return;
//   }
//   // var param = {
//   //   username: username.value,
//   //   password: password.value
//   // }
//   // ajax('http:// xxx.com/login', param);
//   console.log("提交成功！")
// }
// submitBtn.onclick = function() {
//   formSubmit();
// }

// 优化后的代码
Function.prototype.before = function(beforefn) {
  var __self = this;
  return function() {
    if (beforefn.apply(this, arguments) === false) {
      // beforefn 返回 false 的情况直接 return，不再执行后面的原函数
      return;
    }
    return __self.apply(this, arguments);
  }
}
var validate = function() {
  if (username.value === '') {
    alert('用户名不能为空');
    return false;
  }
  if (password.value === '') {
    alert('密码不能为空');
    return false;
  }
}
var formSubmit = function() {
  // var param = {
  //   username: username.value,
  //   password: password.value
  // }
  // ajax('http:// xxx.com/login', param);
  console.log("提交成功！")
}
formSubmit = formSubmit.before(validate);
submitBtn.onclick = function() {
  formSubmit();
}