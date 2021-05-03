###1.定义

>将一个请求封装为一个对象，从而使我们可用不同的请求对客户进行参数化；对请求排队或者记录请求日志，以及支持可撤销的操作。

###2.核心

有时候需要向某些对象发送请求，但是并不知道请求的接收者是谁，也不知道被请求的操作是什么，此时希望用一种松耦合的方式来设计软件，使得请求发送者和请求接收者能够消除彼此之间的耦合关系。

简单来说，不直接调用类的内部方法，而是通过给“指令函数”传递参数，由“指令函数”来调用类的内部方法。

###3.实现

先举个通俗例子：
假设有一个快餐店，而我是该餐厅的点餐服务员，那么我一天的工作应该是这样的：当某位客人点餐或者打来订餐电话后，我会把他的需求都写在清单上，然后交给厨房，客人不用关心是哪些厨师帮他炒菜。我们餐厅还可以满足客人需要的定时服务，比如客人可能当前正在回家的路上，要求 1 个小时后才开始炒他的菜，只要订单还在，厨师就不会忘记。客人也可以很方便地打电话来撤销订单。另外如果有太多的客人点餐，厨房可以按照订单的顺序排队炒菜。
*这些记录着订餐信息的清单*，便是命令模式中的命令对象。

*命令模式是最简单和优雅的模式之一，命令模式中的命令（command）指的是一个执行某些特定事情的指令。*

3.1 菜单程序 demo1/demo2

```js
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
</head>

<body>
  <button id="button1">点击按钮1</button>
  // 常规思路
  <script>
    var button1 = document.getElementById('button1')

    button1.onclick = function () {
      console.log('刷新菜单目录');
    }
  </script>
</body>

</html>
```

当一个大型项目中，进行项目分工：

- 我负责写HTML

- 燏哥写刷新菜目录的功能

- 丹荆写添加子菜单的功能

```js
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
```

JavaScript 作为将函数作为一等对象的语言，跟策略模式一样，命令模式也早已融入到了JavaScript 语言之中。运算块不一定要封装在 command.execute 方法中，也可以封装在普通函数中。
函数作为一等对象，本身就可以被四处传递。即使我们依然需要请求“接收者”，那也未必使用面向对象的方式，闭包可以完成同样的功能。

**命令模式的由来，其实是回调（callback）函数的一个面向对象的替代品。**

```js
 // JS中的命令模式 - callback版
   var button1 = document.getElementById('button1')
   var button2 = document.getElementById('button2')
   var button3 = document.getElementById('button3')

   var setCommand = function(button, fn) {
     button.onclick = fn;
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
   setCommand(button1, MenuBar.refresh);
   setCommand(button2, SubMenu.add);
   setCommand(button3, SubMenu.del);
```

```js
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
```

命令模式在js中的应用

```js
// execCommand 浏览器封装富文本操作，复制，加粗选中文字等
document.execCommand("bold")
document.execCommand("undo")
```

###4.总结

* 命令对象于执行对象分开，解耦
* 符合开放封闭原则