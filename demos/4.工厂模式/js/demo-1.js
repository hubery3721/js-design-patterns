// function SuperAdmin() {
//   this.name = "超级管理员"
//   this.permissions = ['首页', '通讯录', '发现页', '应用数据', '权限管理']
// }

// function Admin() {
//   this.name = "管理员"
//   this.permissions = ['首页', '通讯录', '发现页', '应用数据']
// }

// function NormalUser() {
//   this.name = '普通用户'
//   this.permissions = ['首页', '通讯录', '发现页']
// }


// var UserFactory = function(role) {

//   switch (role) {
//     case 'superAdmin':
//       return new SuperAdmin();
//       break;
//     case 'admin':
//       return new Admin();
//       break;
//     case 'user':
//       return new NormalUser();
//       break;
//     default:
//       throw new Error('没有这种角色，别瞎填！');
//   }
// }

//调用
var superAdmin = UserFactory('superAdmin');
var admin = UserFactory('admin')
var normalUser = UserFactory('user')

console.log(superAdmin)
console.log(superAdmin.name, superAdmin.permissions)

/**
 * ES6 版本
 */

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
let s1 = new superAdmin()
let superAdmin = Role.getInstance('superAdmin');
let admin = Role.getInstance('admin')
let normalUser = Role.getInstance('user')

console.log(superAdmin)
console.log(superAdmin.name, superAdmin.permissions)