###1.定义

工厂模式是用来创建对象的一种~~最常用~~的设计模式。

###2.核心

* 我们不暴露创建对象的具体逻辑，而是将将逻辑封装在一个函数中，那么这个函数就可以被视为一个工厂。
* 工厂模式根据抽象程度的不同可以分为： 简单工厂， 工厂方法和抽象工厂。

###3.实现

3.1 简单工厂模式 demo-1

简单工厂模式又叫静态工厂模式，由一个工厂对象决定创建某一种产品对象类的实例。主要用来创建同一类对象。

```js
function SuperAdmin() {
  this.name = "超级管理员"
  this.permissions = ['首页', '通讯录', '发现页', '应用数据', '权限管理']
}

function Admin() {
  this.name = "管理员"
  this.permissions = ['首页', '通讯录', '发现页', '应用数据']
}

function NormalUser() {
  this.name = '普通用户'
  this.permissions = ['首页', '通讯录', '发现页']
}


var UserFactory = function(role) {

  switch (role) {
    case 'superAdmin':
      return new SuperAdmin();
      break;
    case 'admin':
      return new Admin();
      break;
    case 'user':
      return new NormalUser();
      break;
    default:
      throw new Error('没有这种角色，别瞎填！');
  }
}

//调用
var superAdmin = UserFactory('superAdmin');
var admin = UserFactory('admin')
var normalUser = UserFactory('user')

console.log(superAdmin)
console.log(superAdmin.name, superAdmin.permissions)
```

优化后的ES6版本

```js
class Role {
  constructor(name, permissions) {
    this.name = name;
    this.permissions = permissions
  }

  static getInstance(role) {
    switch (role) {
      case 'superAdmin':
        return new Role("超级管理员", ['首页', '通讯录', '发现页', '应用数据', '权限管理']);
        break;
      case 'admin':
        return new Role("管理员", ['首页', '通讯录', '发现页', '应用数据']);
        break;
      case 'user':
        return new Role('普通用户', ['首页', '通讯录', '发现页']);
        break;
      default:
        throw new Error('没有这种角色，别瞎填！');
    }
  }
}

let superAdmin = Role.getInstance('superAdmin');
let admin = Role.getInstance('admin')
let normalUser = Role.getInstance('user')

console.log(superAdmin)
console.log(superAdmin.name, superAdmin.permissions)
```

3.2 工厂方法&抽象工厂

由于JS中没有抽象类（虽然abstract作为保留关键字），无法像其它面向对象语言一样进行声明。

因此，不再赘述。

###4.总结

工厂模式和单例模式/原型模式一样，都属于创建型的设计模式。

在实际的前端业务中，最常用的简单工厂模式。如果不是超大型的项目，是很难有机会使用到工厂方法模式和抽象工厂方法模式的。





