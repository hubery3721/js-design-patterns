 // JS中的命令模式 - callback版
 //  var button1 = document.getElementById('button1')
 //  var button2 = document.getElementById('button2')
 //  var button3 = document.getElementById('button3')

 //  var setCommand = function(button, fn) {
 //    button.onclick = fn;
 //  };
 //  var MenuBar = {
 //    refresh: function() {
 //      console.log('刷新菜单界面');
 //    }
 //  };
 //  var SubMenu = {
 //    add: function() {
 //      console.log('增加子菜单');
 //    },
 //    del: function() {
 //      console.log('删除子菜单');
 //    }
 //  };
 //  setCommand(button1, MenuBar.refresh);
 //  setCommand(button2, SubMenu.add);
 //  setCommand(button3, SubMenu.del);

 // JS中的命令模式 - respect版
 var button1 = document.getElementById('button1')
 var button2 = document.getElementById('button2')
 var button3 = document.getElementById('button3')

 var setCommand = function(button, command) {
   button.onclick = function() {
     command.execute();
   }
 };
 var MenuBar = {
   refresh: function() {
     console.log('刷新菜单界面');
   }
 };
 var SubMenu = {
   add: function() {
     console.log('增加子菜单');
   },
   del: function() {
     console.log('删除子菜单');
   }
 };
 var RefreshMenuBarCommand = function(receiver) {
   return {
     execute: function() {
       receiver.refresh();
     }
   }
 };
 var refreshMenuBarCommand = RefreshMenuBarCommand(MenuBar);
 var AddSubMenuCommand = function(receiver) {
   return {
     execute: function() {
       receiver.add();
     }
   }
 };
 var addSubMenuCommand = AddSubMenuCommand(SubMenu);
 var DelSubMenuCommand = function(receiver) {
   return {
     execute: function() {
       receiver.del();
     }
   }
 };
 var delSubMenuCommand = DelSubMenuCommand(SubMenu);
 setCommand(button1, refreshMenuBarCommand);
 setCommand(button2, addSubMenuCommand);
 setCommand(button3, delSubMenuCommand);