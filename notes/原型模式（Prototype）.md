###1.定义

原型模式是用于创建对象的一种模式。

 原型模式不单是一种设计模式，也被称为一种编程泛型。

###2.核心

不需要关心对象的具体类型，而是找到一个对象，然后通过克隆来创建一个一模一样的的对象。

 原型模式的真正目的并非在于需要得到一个一模一样的对象，而是提供了一种便捷的方式去创建某个类型的对象，克隆只是创建这个对象的过程与手段。

###3.实现

1.Object.create()

```js
/**
 * 原型模式使用
 * Object.create
 * **/
const engineer = {
  name :"工程师",
  age : 18,
  skills :"",
  doWork : function(){
    console.log(`${this.name}使用${this.skills}开发`);
  }
}

let webEngineer = Object.create(engineer);

console.log('webEngineer:',webEngineer);

webEngineer.skills = "html,js,css";
webEngineer.name = "纯情的攀少";
webEngineer.doWork();//纯情的攀少使用html,js,css开发
console.log('webEngineer:',webEngineer);
```

2\. 使用prototype来创建对象变量

```js
/***
 * 使用prototype来创建web实例对象
 * @param name
 * @returns {createWebEngineer.Engineer}
 */
 const engineer = {
  name :"工程师",
  age : 18,
  skills :"",
  doWork : function(){
    console.log(`${this.name}使用${this.skills}开发`);
  }
}
 
function createWebEngineer(name){
  function Engineer(){};
 
  Engineer.prototype = engineer;
  let webEngineer = new Engineer();
  webEngineer.name = name;
  return webEngineer;
}


let webEngineer = createWebEngineer("纯情的攀少");

console.log("webEngineer:",webEngineer);
webEngineer.doWork();
```

3\. 原型模式的实现关键，在于语言本身是否提供了clone方法

```js
var Plane = function(){ 
 this.blood = 100; 
 this.attackLevel = 1; 
 this.defenseLevel = 1; 
}; 
var plane = new Plane(); 
plane.blood = 500; 
plane.attackLevel = 10; 
plane.defenseLevel = 7; 
var clonePlane = Object.create( plane ); 
console.log( clonePlane ); // 输出：Object {blood: 500, attackLevel: 10, defenseLevel: 7}
```

###3. 解决问题

它主要面对的问题是：“某些结构复杂的对象”的创建工作；由于需求的变化，这些对象经常面临着剧烈的变化，但是他们却拥有比较稳定一致的接口。

###4. 优点&缺点

优点：一个对象通过new的方法来生成，在初始化过程中需要很复杂的处理，或者当new方试也无法马上得到想要的对象内容。直接使用快照方式直接以某个对象的当前状态来生成了另外的一个对象，这中间就省去了大量复杂的初始化工作，性能比较高。

缺点：原型模式可能会造成逻辑上的一些推理阻碍，由于不是直接new生成的，有时候在推理上可能造成麻烦。