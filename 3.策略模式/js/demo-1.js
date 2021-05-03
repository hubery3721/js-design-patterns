/**
 * 常规思路
 */
// var calculateBonus = function(performanceLevel, salary) {
//   if (performanceLevel === 'S') {
//     return salary * 4;
//   }
//   if (performanceLevel === 'A') {
//     return salary * 3;
//   }
//   if (performanceLevel === 'B') {
//     return salary * 2;
//   }
//   if (performanceLevel === 'C') {
//     return salary * 1;
//   }
//   if (performanceLevel === 'D') {
//     return salary * 0.8;
//   }
// };
// var p1 = calculateBonus('B', 20000);
// var p2 = calculateBonus('S', 6000);
// var p3 = calculateBonus('D', 6000);
// console.log(p1, p2, p3)


/**
 * 策略模式
 */
// var performanceS = function() {};
// performanceS.prototype.calculate = function(salary) {
//   return salary * 4;
// };
// var performanceA = function() {};
// performanceA.prototype.calculate = function(salary) {
//   return salary * 3;
// };

// // function performanceA() {
// //   return {
// //     calculate: function(salary) {
// //       return salary * 3;
// //     }
// //   }
// // }
// var performanceB = function() {};
// performanceB.prototype.calculate = function(salary) {
//   return salary * 2;
// };

// function Bonus() {
//   this.salary = null;
//   this.strategy = null;
// }

// Bonus.prototype.setSalary = function(salary) {
//   this.salary = salary
// }
// Bonus.prototype.setStrategy = function(strategy) {
//   this.strategy = strategy
// }
// Bonus.prototype.getBonus = function() {
//   return this.strategy.calculate(this.salary)
// }

// var bonus = new Bonus()
// bonus.setSalary(20000)
// bonus.setStrategy(new performanceB())
// var p1 = bonus.getBonus()
// console.log(p1)
// bonus.setSalary(6000)
// bonus.setStrategy(new performanceS())
// var p2 = bonus.getBonus()
// console.log(p2)


/**
 * JS版的策略模式
 */

var strategies = {
  "S": function(salary) {
    return salary * 4;
  },
  "A": function(salary) {
    return salary * 3;
  },
  "B": function(salary) {
    return salary * 2;
  },
  "C": function(salary) {
    return salary * 1;
  },
  "D": function(salary) {
    return salary * 0.8;
  },
}

var calculateBonus = function(level, salary) {
  return strategies[level](salary)
}
var p1 = calculateBonus('B', 20000);
var p2 = calculateBonus('S', 6000);
var p3 = calculateBonus('D', 6000);
console.log(p1, p2, p3)