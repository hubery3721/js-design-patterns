//composite
class Container {
  constructor(id) {
    this.children = []
    this.element = document.createElement('div')
    this.element.id = id
    this.element.style.border = '1px solid black'
    this.element.style.margin = '10px'
    this.element.classList.add('container')
  }

  add(child) {
    this.children.push(child)
    this.element.appendChild(child.getElement())
  }


  hide() {
    this.children.forEach(node => node.hide())
    this.element.style.display = 'none'
  }

  show() {
    this.children.forEach(node => node.show())
    this.element.style.display = ''
  }

  getElement() {
    return this.element
  }

}
// leaf
class Text {
  constructor(text) {
    this.element = document.createElement('p')
    this.element.innerText = text
  }

  add() {
    throw new Error('I am leaf:))')
  }

  hide() {
    this.element.style.display = 'none'
  }

  show() {
    this.element.style.display = ''
  }

  getElement() {
    return this.element
  }
}

// 建立 header 节点
let header = new Container('header')

// 建立两个叶节点
header.add(new Text('标题'))
header.add(new Text('logo'))
// var text3 = new Text('列表')
// header.add(text3)

let main = new Container('main')
main.add(new Text('这是内容1'))
main.add(new Text('这是内容2'))

let page = new Container('page')
page.add(header)
page.add(main)
page.show()


document.body.appendChild(page.getElement())