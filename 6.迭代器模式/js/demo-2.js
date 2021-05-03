/**
 * 迭代器
 */
class Iterator {
  constructor(arr) {
    this.list = arr;
    this.index = 0
  }
  next() {
    if (this.hasNext()) {
      return this.list[this.index++]
    }
    return null
  }
  hasNext() {
    if (this.index >= this.list.length) {
      return false
    }
    return true
  }
}

const iterator = new Iterator({ "a": 1, "b": 2, "c": 4 });
while (iterator.hasNext()) {
  console.log(iterator.next());
}