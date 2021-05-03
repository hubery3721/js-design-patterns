// 按照需求瞎写一通
var colorSelect = document.getElementById('colorSelect'),
  numberInput = document.getElementById('numberInput'),
  memorySelect = document.getElementById('memorySelect'),
  colorInfo = document.getElementById('colorInfo'),
  numberInfo = document.getElementById('numberInfo'),
  memoryInfo = document.getElementById('memoryInfo'),
  nextBtn = document.getElementById('nextBtn');

var goods = { // 手机库存
  "red|32G": 3, // 红色 32G，库存数量为 3 
  "red|16G": 0,
  "blue|32G": 1,
  "blue|16G": 6
};
colorSelect.onchange = function() {
  var color = this.value,
    memory = memorySelect.value,
    stock = goods[color + '|' + memory];
  number = numberInput.value, // 数量
    colorInfo.innerHTML = color;
  if (!color) {
    nextBtn.disabled = true;
    nextBtn.innerHTML = '请选择手机颜色';
    return;
  }
  if (!memory) {
    nextBtn.disabled = true;
    nextBtn.innerHTML = '请选择内存大小';
    return;
  }
  if (number < 0 || !number) { // 输入购买数量是否为正整数
    nextBtn.disabled = true;
    nextBtn.innerHTML = '请输入正确的购买数量';
    return;
  }
  if (number > stock) { // 当前选择数量没有超过库存量
    nextBtn.disabled = true;
    nextBtn.innerHTML = '库存不足';
    return;
  }
  nextBtn.disabled = false;
  nextBtn.innerHTML = '放入购物车';
};

numberInput.onchange = function() {
  var color = colorSelect.value, // 颜色
    number = parseInt(this.value), // 数量
    memory = memorySelect.value,
    stock = goods[color + '|' + memory];
  numberInfo.innerHTML = number;
  if (!color) {
    nextBtn.disabled = true;
    nextBtn.innerHTML = '请选择手机颜色';
    return;
  }
  if (!memory) {
    nextBtn.disabled = true;
    nextBtn.innerHTML = '请选择内存大小';
    return;
  }
  if (number < 0 || !number) { // 输入购买数量是否为正整数
    nextBtn.disabled = true;
    nextBtn.innerHTML = '请输入正确的购买数量';
    return;
  }
  if (number > stock) { // 当前选择数量没有超过库存量
    nextBtn.disabled = true;
    nextBtn.innerHTML = '库存不足';
    return;
  }
  nextBtn.disabled = false;
  nextBtn.innerHTML = '放入购物车';
};


memorySelect.onchange = function() {
  var color = colorSelect.value, // 颜色
    number = numberInput.value, // 数量
    memory = this.value,
    stock = goods[color + '|' + memory]; // 该颜色手机对应的当前库存
  memoryInfo.innerHTML = memory;
  if (!color) {
    nextBtn.disabled = true;
    nextBtn.innerHTML = '请选择手机颜色';
    return;
  }
  if (!memory) {
    nextBtn.disabled = true;
    nextBtn.innerHTML = '请选择内存大小';
    return;
  }
  if (number < 0 || !number) { // 输入购买数量是否为正整数
    nextBtn.disabled = true;
    nextBtn.innerHTML = '请输入正确的购买数量';
    return;
  }
  if (number > stock) { // 当前选择数量没有超过库存量
    nextBtn.disabled = true;
    nextBtn.innerHTML = '库存不足';
    return;
  }
  nextBtn.disabled = false;
  nextBtn.innerHTML = '放入购物车';
};