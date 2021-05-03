// 常规思路
// var button1 = document.getElementById('button1')
// var button2 = document.getElementById('button2')
// var button3 = document.getElementById('button3')

// button1.onclick = function() {
//   console.log('刷新菜单目录');
// }
// button2.onclick = function() {
//   console.log('添加子菜单');
// }
// button3.onclick = function() {
//   console.log('删除子菜单');
// }

// 引入传统面向对象的命令模式
var button1 = document.getElementById('button1')
var button2 = document.getElementById('button2')
var button3 = document.getElementById('button3')

// 定义一个命令函数
var setCommand = function(button, command) {
  button.onclick = function() {
    command.execute();
  }
};

// 燏哥干的活
var MenuBar = {
  refresh: function() {
    console.log('刷新菜单目录');
  }
};
var RefreshMenuBarCommand = function(receiver) {
  this.receiver = receiver;
};
RefreshMenuBarCommand.prototype.execute = function() {
  this.receiver.refresh();
};

// 丹荆干的活
var SubMenu = {
  add: function() {
    console.log('增加子菜单');
  },
  del: function() {
    console.log('删除子菜单');
  }
};
var AddSubMenuCommand = function(receiver) {
  this.receiver = receiver;
};
AddSubMenuCommand.prototype.execute = function() {
  this.receiver.add();
};
var DelSubMenuCommand = function(receiver) {
  this.receiver = receiver;
};
DelSubMenuCommand.prototype.execute = function() {
  this.receiver.del();
};

// 最后就是把命令接收者传入到 command 对象中，并且把 command 对象安装到 button 上面：
var refreshMenuBarCommand = new RefreshMenuBarCommand(MenuBar);
var addSubMenuCommand = new AddSubMenuCommand(SubMenu);
var delSubMenuCommand = new DelSubMenuCommand(SubMenu);

setCommand(button1, refreshMenuBarCommand);
setCommand(button2, addSubMenuCommand);
setCommand(button3, delSubMenuCommand);