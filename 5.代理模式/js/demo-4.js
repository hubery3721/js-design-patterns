// var myImage = (function() {
//   var imgNode = document.createElement('img');
//   document.body.appendChild(imgNode);
//   return {
//     setSrc: function(src) {
//       imgNode.src = src;
//     }
//   }
// })();
// var proxyImage = (function() {
//   var img = new Image;
//   img.onload = function() {
//     myImage.setSrc(this.src);
//   }
//   return {
//     setSrc: function(src) {
//       myImage.setSrc('./js/loading.gif');
//       setTimeout(function() {
//         img.src = src;
//       }, 2000)
//     }
//   }
// })();
// proxyImage.setSrc('https://www.youshibeike.com/siteWeb/assets/images/logo.png');
// myImage.setSrc('https://www.youshibeike.com/siteWeb/assets/images/logo.png');

/**
 * 不使用代理
 */
var myImage = (function() {
  var imgNode = document.createElement('img');
  document.body.appendChild(imgNode);
  var img = new Image;
  img.onload = function() {
    imgNode.src = img.src;
  }
  return {
    setSrc: function(src) {
      imgNode.src = './js/loading.gif';
      setTimeout(function() {
        img.src = src;
      }, 2000)
    }
  }
})();
myImage.setSrc('https://www.youshibeike.com/siteWeb/assets/images/logo.png');