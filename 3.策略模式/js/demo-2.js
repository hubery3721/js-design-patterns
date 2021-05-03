class Bonus {
  constructor() {
    this.salary = null;
    this.strategy = null;
  }

  setSalary(salary) {
    this.salary = salary
  }

  setStrategy(strategy) {
    this.strategy = strategy
  }

  getBonus() {
    return this.strategy(this.salary)
  }
}

let strategies = {
  "S": (salary) => {
    return salary * 4;
  },
  "A": (salary) => {
    return salary * 3;
  },
  "B": (salary) => {
    return salary * 2;
  },
  "C": (salary) => {
    return salary * 1;
  },
  "D": (salary) => {
    return salary * 0.8;
  },
}
let bonus = new Bonus()
bonus.setSalary(20000)
bonus.setStrategy(strategies['B'])
let p1 = bonus.getBonus()
bonus.setSalary(6000)
bonus.setStrategy(strategies['S'])
let p2 = bonus.getBonus()
console.log(p1, p2)