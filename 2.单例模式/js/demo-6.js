// 创建弹窗
// var loginLayer = (function() {
//   var div = document.createElement('div');
//   console.log("create")
//   div.innerHTML = '我是登录浮窗';
//   div.style.display = 'none';
//   div.style.width = '500px';
//   div.style.height = '300px';
//   div.style.border = '1px solid #ddd';
//   document.body.appendChild(div);
//   return div;
// })();


// 惰性弹窗
// var creatLoginLayer = function() {
//   var div = document.createElement('div');
//   div.id = 'loginLayer'
//   div.innerHTML = '我是登录浮窗';
//   div.style.display = 'none';
//   div.style.width = '500px';
//   div.style.height = '300px';
//   div.style.border = '1px solid #ddd';
//   document.body.appendChild(div);
//   return div
// }

// 惰性弹窗 单例
var creatLoginLayer = (function() {
  var div
  return function() {
    if (!div) {
      div = document.createElement('div');
      div.id = 'loginLayer'
      div.innerHTML = '我是登录浮窗';
      div.style.display = 'none';
      div.style.width = '500px';
      div.style.height = '300px';
      div.style.border = '1px solid #ddd';
      document.body.appendChild(div);
    }
    return div
  }
})()

document.getElementById('loginBtn').onclick = function() {
  loginLayer.style.display = 'block';
};

document.getElementById('loginBtn2').onclick = function() {
  var loginLayer = creatLoginLayer()
  loginLayer.style.display = 'block';
};
document.getElementById('loginBtn3').onclick = function() {
  var loginLayer = creatLoginLayer()
  loginLayer.style.display = 'block';
};

document.getElementById('close').onclick = function() {
  var loginLayer = document.getElementById("loginLayer")
  loginLayer.style.display = 'none';
};