//安全模式创建的工厂方法函数
let UserFactory = function(role) {
  //   if (this instanceof UserFactory) {
  //     var s = new this[role]();
  //     return s;
  //   } else {
  //     return new UserFactory(role);
  //   }
}

//工厂方法函数的原型中设置所有对象的构造函数
UserFactory.prototype = {
  SuperAdmin: function() {
    this.name = "超级管理员"
    this.permissions = ['首页', '通讯录', '发现页', '应用数据', '权限管理']
  },
  Admin: function() {
    this.name = "管理员"
    this.permissions = ['首页', '通讯录', '发现页', '应用数据']
  },
  NormalUser: function() {
    this.name = '普通用户'
    this.permissions = ['首页', '通讯录', '发现页']
  }
}

//调用
// let superAdmin = UserFactory('SuperAdmin');
let factory = new UserFactory()
let superAdmin = new factory.SuperAdmin()
let admin = UserFactory('Admin')
let normalUser = UserFactory('NormalUser')

console.log(superAdmin)
console.log(superAdmin.name, superAdmin.permissions)