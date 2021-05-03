class Singleton {
  constructor(name) {
    this.name = name;

    if (!Singleton.instance) {
      return Singleton.instance = this;
    }
    return Singleton.instance;
  }
  // static getInstance(name) {
  //   if (!this.instance) {
  //     this.instance = new Singleton(name);
  //   }
  //   return this.instance;
  // }
  getName() {
    return this.name;
  }
}

// let person1 = Singleton.getInstance('攀少1')
// let person2 = Singleton.getInstance('攀少2')
let person3 = new Singleton('攀少1')
let person4 = new Singleton('攀少2')

// console.log(person1.getName())
// console.log(person2.getName())
// console.log(person3.getName())
console.log(person3 === person4);