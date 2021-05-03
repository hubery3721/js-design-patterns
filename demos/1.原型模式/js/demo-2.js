const engineer = {
  name: "大傻崩",
  age: 18,
  skills: "vueJS",
  doWork: function() {
    console.log(`${this.sex} ${this.name}使用${this.skills}开发`);
  }
}

function createWebEngineer(name) {
  function Engineer() {};

  Engineer.prototype = engineer;
  let webEngineer = new Engineer();
  webEngineer.sex = name;
  return webEngineer;
}


let webEngineer = createWebEngineer("直男");
let webEngineer2 = createWebEngineer("直男2");

console.log("webEngineer:", webEngineer);
webEngineer2.doWork();