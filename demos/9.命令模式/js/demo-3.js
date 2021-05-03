// execCommand 浏览器封装富文本操作，复制，加粗选中文字等

var button1 = document.getElementById('btn1')
var button2 = document.getElementById('btn2')
var button3 = document.getElementById('btn3')
var button4 = document.getElementById('btn4')


button1.onclick = function(e) {
  e.preventDefault();
  document.execCommand("Bold")
}
button2.onclick = function() {
  document.execCommand("Italic")
}
button3.onclick = function() {
  document.execCommand("Undo")
}
button4.onclick = function() {
  document.execCommand("foreColor", false, '#ff0000')
}