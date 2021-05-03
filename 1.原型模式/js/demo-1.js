const engineer = {
  name: "工程师",
  age: 18,
  skills: "",
  doWork: function() {
    console.log(`${this.name}使用${this.skills}开发`);
  }
}

function test() {

}
test.prototype.doWork = function() {
  // console.log(`${this.name}使用${this.skills}开发`);
}

var test1 = new test()
let webEngineer = Object.create(engineer);
let webEngineer1 = Object.create(engineer);

console.log('webEngineer:', webEngineer.__proto__ === engineer);

webEngineer.skills = "html,js,css";
delete webEngineer.name
webEngineer.doWork();
webEngineer1.doWork();
console.log('webEngineer:', webEngineer.doWork === webEngineer1.doWork);