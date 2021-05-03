// 常规思路
var candidateNum = 10 // 考生数量
var examCarNum = 0 // 驾考车的数量

/* 驾考车构造函数 */
function ExamCar(carType) {
  examCarNum++
  this.carId = examCarNum
  this.carType = carType ? '手动档' : '自动档'
}

ExamCar.prototype.examine = function(candidateId) {
  console.log('考生- ' + candidateId + ' 在' + this.carType + '驾考车- ' + this.carId + ' 上考试')
}

for (var candidateId = 1; candidateId <= candidateNum; candidateId++) {
  var examCar = new ExamCar(candidateId % 2)
  examCar.examine(candidateId)
}

console.log('驾考车总数 - ' + examCarNum)


// Flyweight 版
// var candidateNum = 10 // 考生数量
// var examCarNum = 0 // 驾考车的数量

// /* 驾考车构造函数 */
// function ExamCar(carType) {
//   examCarNum++
//   this.carId = examCarNum
//   this.carType = carType ? '手动档' : '自动档'
// }

// ExamCar.prototype.examine = function(candidateId) {
//   console.log('考生- ' + candidateId + ' 在' + this.carType + '驾考车- ' + this.carId + ' 上考试')
// }

// var examCarFlyweight = {}

// // 创建一个工厂
// function ExamCarFactory() {
//   return {
//     getCar: function(id) {
//       let type = id % 2
//       if (examCarFlyweight[type]) {
//         return examCarFlyweight[type]
//       } else {
//         return examCarFlyweight[type] = new ExamCar(type)
//       }
//     }
//   }
// }

// for (var candidateId = 1; candidateId <= candidateNum; candidateId++) {
//   var examCarFactory = new ExamCarFactory()
//   var examCar = examCarFactory.getCar(candidateId);
//   examCar.examine(candidateId)
// }

// console.log('驾考车总数 - ' + examCarNum)