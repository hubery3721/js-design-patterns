var arr = ['张三', '18', '河南郑州', '2020年8月2日']

// 转化成我们需要的格式
function arrObjAdapter(arr) {
  return {
    name: arr[0],
    age: arr[1],
    address: arr[2],
    time: arr[3]

  }
}

console.log(arr);
var adapterData = arrObjAdapter(arr);
console.log(adapterData);