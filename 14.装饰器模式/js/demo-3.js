 // 这是一段没有灵魂的代码
 //  var showLogin = function() {
 //    console.log('打开登录浮层');
 //    singleCustomEvent(this.getAttribute('tag'));
 //  }
 //  var singleCustomEvent = function(tag) {
 //    console.log('上报标签为: ' + tag);
 //    // (new Image).src = 'http:// xxx.com/report?tag=' + tag; // 真正的上报代码略
 //  }
 //  document.getElementById('button').onclick = showLogin;


 /**
  * AOP装饰函数进行解耦
  */

 Function.prototype.after = function(afterfn) {
   var __self = this;
   return function() {
     var _self = this
     var ret = __self.apply(this, arguments);
     setInterval(() => {
       if (this.end == true) afterfn.apply(_self, arguments);
     }, 500)
     return ret;
   }
 };
 var showLogin = function() {
   setTimeout(() => {
     this.end = true
     console.log('打开登录浮层');
   }, 1000)
 }
 var singleCustomEvent = function() {
   console.log('上报标签为: ' + this.getAttribute('tag'));
 }
 showLogin = showLogin.after(singleCustomEvent); // 打开登录浮层之后上报数据
 document.getElementById('button').onclick = showLogin;