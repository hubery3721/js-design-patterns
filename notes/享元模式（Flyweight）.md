###1.定义
> 运用共享技术来有效地支持大量细粒度对象的复用，以减少创建的对象的数量。

###2.核心
享元模式的主要思想是共享细粒度对象，也就是说如果系统中存在多个相同的对象，那么只需共享一份就可以了，不必每个都去实例化每一个对象，这样来精简内存资源，提升性能和效率。

Fly 意为苍蝇，Flyweight 指轻蝇量级，指代对象粒度很小。

###3.实现

3.1文件上传 demo-1 ~ demo-4

享元模式的通用结构

* 用一个对象工厂在真正需要的时候返回对象
* 用一个管理器来记录对象相关的外部状态，使这些外部状态通过某个钩子和共享对象联系起来

```js
// demo-1/demo-3
// 常规思路
var id = 0;
// 创建一个上传入口方法
window.startUpload = function(uploadType, files) { // uploadType 区分是控件还是 flash 
  for (var i = 0, file; file = files[i++];) {
    var uploadObj = new Upload(uploadType, file.fileName, file.fileSize);
    uploadObj.init(id++); // 给 upload 对象设置一个唯一的 id 
    console.log(`第${id}个upload对象`)
  }
};

// 新建一个Upload类
var Upload = function(uploadType, fileName, fileSize) {
  this.uploadType = uploadType;
  this.fileName = fileName;
  this.fileSize = fileSize;
  this.dom = null;
};
Upload.prototype.init = function(id) {
  var that = this;
  this.id = id;
  this.dom = document.createElement('div');
  this.dom.innerHTML =
    '<span>文件名称:' + this.fileName + ', 文件大小: ' + this.fileSize + '</span>' +
    '<button class="delFile">删除</button>';
  this.dom.querySelector('.delFile').onclick = function() {
    that.delFile();
  }
  document.body.appendChild(this.dom);
};

// 添加一个删除方法
Upload.prototype.delFile = function() {
  if (this.fileSize < 3000) {
    return this.dom.parentNode.removeChild(this.dom);
  }
  if (window.confirm('确定要删除该文件吗? ' + this.fileName)) {
    return this.dom.parentNode.removeChild(this.dom);
  }
};

// 以下为调用代码
startUpload('plugin', [{
    fileName: '1.txt',
    fileSize: 1000
  },
  {
    fileName: '2.html',
    fileSize: 3000
  },
  {
    fileName: '3.txt',
    fileSize: 5000
  }
]);
startUpload('flash', [{
    fileName: '4.txt',
    fileSize: 1000
  },
  {
    fileName: '5.html',
    fileSize: 3000
  },
  {
    fileName: '6.txt',
    fileSize: 5000
  }
]);
```

```js
// 享元模式重构
// demo-2/demo-4
// 创建一个上传方法
var id = 0;
window.startUpload = function(uploadType, files) {
  for (var i = 0, file; file = files[i++];) {
    var uploadObj = uploadManager.add(++id, uploadType, file.fileName, file.fileSize);
  }
};

// 创建个Upload类
var Upload = function(uploadType) {
  this.uploadType = uploadType;
};

Upload.prototype.delFile = function(id) {
  uploadManager.setExternalState(id, this); // (1) 
  if (this.fileSize < 3000) {
    return this.dom.parentNode.removeChild(this.dom);
  }
  if (window.confirm('确定要删除该文件吗? ' + this.fileName)) {
    return this.dom.parentNode.removeChild(this.dom);
  }
};

// 用工厂实例化对象
var UploadFactory = (function() {
  var createdFlyWeightObjs = {};
  return {
    create: function(uploadType) {
      if (createdFlyWeightObjs[uploadType]) {
        return createdFlyWeightObjs[uploadType];
      } else {
        console.log(`第${id}个upload对象`)
        return createdFlyWeightObjs[uploadType] = new Upload(uploadType);
      }
    }
  }
})();

// 创建一个管理器封装外部状态
var uploadManager = (function() {
  var uploadDatabase = {};
  return {
    add: function(id, uploadType, fileName, fileSize) {
      var flyWeightObj = UploadFactory.create(uploadType);
      var dom = document.createElement('div');
      dom.innerHTML =
        '<span>文件名称:' + fileName + ', 文件大小: ' + fileSize + '</span>' +
        '<button class="delFile">删除</button>';
      dom.querySelector('.delFile').onclick = function() {
        flyWeightObj.delFile(id);
      }
      document.body.appendChild(dom);
      uploadDatabase[id] = {
        fileName: fileName,
        fileSize: fileSize,
        dom: dom
      };
      return flyWeightObj;
    },
    setExternalState: function(id, flyWeightObj) {
      var uploadData = uploadDatabase[id];
      for (var i in uploadData) {
        flyWeightObj[i] = uploadData[i];
      }
    }
  }
})();

// 以下为调用代码
startUpload('plugin', [{
    fileName: '1.txt',
    fileSize: 1000
  },
  {
    fileName: '2.html',
    fileSize: 3000
  },
  {
    fileName: '3.txt',
    fileSize: 5000
  }
]);
startUpload('flash', [{
    fileName: '4.txt',
    fileSize: 1000
  },
  {
    fileName: '5.html',
    fileSize: 3000
  },
  {
    fileName: '6.txt',
    fileSize: 5000
  }
]);
```

3.2 考驾照 demo-5 demo6

我们去驾考的时候，如果给每个考试的人都准备一辆车，那考场就挤爆了，考点都堆不下考试车，因此驾考现场一般会有几辆车给要考试的人依次使用。如果考生人数少，就分别少准备几个自动档和手动档的驾考车，考生多的话就多准备几辆。如果考手动档的考生比较多，就多准备几辆手动档的驾考车。

```js
// 常规思路
// 假设奇数考生手动档，偶数号考生自动档
var candidateNum = 10   // 考生数量
var examCarNum = 0      // 驾考车的数量

/* 驾考车构造函数 */
function ExamCar(carType) {
    examCarNum++
    this.carId = examCarNum
    this.carType = carType ? '手动档' : '自动档'
}

ExamCar.prototype.examine = function(candidateId) {
    console.log('考生- ' + candidateId + ' 在' + this.carType + '驾考车- ' + this.carId + ' 上考试')
}

for (var candidateId = 1; candidateId <= candidateNum; candidateId++) {
    var examCar = new ExamCar(candidateId % 2)
    examCar.examine(candidateId)
}

console.log('驾考车总数 - ' + examCarNum)
```

```js
// Flyweight
/* 驾考车构造函数 */
function ExamCar(carType) {
  examCarNum++
  this.carId = examCarNum
  this.carType = carType ? '手动档' : '自动档'
}

ExamCar.prototype.examine = function(candidateId) {
  console.log('考生- ' + candidateId + ' 在' + this.carType + '驾考车- ' + this.carId + ' 上考试')
}

var examCarFlyweight = {}

// 创建一个工厂
function ExamCarFactory() {
  return {
    getCar: function(id) {
      let type = id % 2
      if (examCarFlyweight[type]) {
        return examCarFlyweight[type]
      } else {
        return examCarFlyweight[type] = new ExamCar(type)
      }
    }
  }
}

for (var candidateId = 1; candidateId <= candidateNum; candidateId++) {
  var examCarFactory = new ExamCarFactory()
  var examCar = examCarFactory.getCar(candidateId);
  examCar.examine(candidateId)
}

console.log('驾考车总数 - ' + examCarNum)
```

虽然案例中用了享元模式共享内部状态，但是没有管理外部状态
享元模式的主要思想是细粒度对象的共享和复用，因此对之前的驾考例子，我们可以继续改进一下：

享元模式的主要思想是细粒度对象的共享和复用，因此对之前的驾考例子，我们可以继续改进一下：

1. 如果某考生正在使用一辆驾考车，那么这辆驾考车的状态就是被占用，其他考生只能选择剩下未被占用状态的驾考车；
2. 如果某考生对驾考车的使用完毕，那么将驾考车开回考点，驾考车的状态改为未被占用，供给其他考生使用；
3. 如果所有驾考车都被占用，那么其他考生只能等待正在使用驾考车的考生使用完毕，直到有驾考车的状态变为未被占用；
4. 组织单位可以根据考生数量多准备几辆驾考车，比如手动档考生比较多，那么手动档驾考车就应该比自动档驾考车多准备几辆；

```js
let examCarNum = 0 // 驾考车总数

/* 驾考车对象 */
class ExamCar {
  constructor(carType) {
    examCarNum++
    this.carId = examCarNum
    this.carType = carType ? '手动档' : '自动档'
    this.usingState = false // 是否正在使用
  }

  /* 在本车上考试 */
  examine(candidateId) {
    return new Promise((resolve => {
      this.usingState = true
      console.log(`考生- ${ candidateId } 开始在${ this.carType }驾考车- ${ this.carId } 上考试`)
      setTimeout(() => {
        this.usingState = false
        console.log(`%c考生- ${ candidateId } 在${ this.carType }驾考车- ${ this.carId } 上考试完毕`, 'color:#f40')
        resolve() // 0~2秒后考试完毕
      }, Math.random() * 2000)
    }))
  }
}

/* 手动档汽车对象池 */
ManualExamCarPool = {
  _pool: [], // 驾考车对象池
  _candidateQueue: [], // 考生队列

  /* 注册考生 ID 列表 */
  registCandidates(candidateList) {
    candidateList.forEach(candidateId => this.registCandidate(candidateId))
  },

  /* 注册手动档考生 */
  registCandidate(candidateId) {
    const examCar = this.getManualExamCar() // 找一个未被占用的手动档驾考车
    if (examCar) {
      examCar.examine(candidateId) // 开始考试，考完了让队列中的下一个考生开始考试
        .then(() => {
          const nextCandidateId = this._candidateQueue.length && this._candidateQueue.shift()
          nextCandidateId && this.registCandidate(nextCandidateId)
        })
    } else this._candidateQueue.push(candidateId)
  },

  /* 注册手动档车 */
  initManualExamCar(manualExamCarNum) {
    for (let i = 1; i <= manualExamCarNum; i++) {
      this._pool.push(new ExamCar(true))
    }
  },

  /* 获取状态为未被占用的手动档车 */
  getManualExamCar() {
    return this._pool.find(car => !car.usingState)
  }
}

ManualExamCarPool.initManualExamCar(3) // 一共有3个驾考车
ManualExamCarPool.registCandidates([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
```

###4.总结

享元模式的优缺点:
优点:
* 由于减少了系统中的对象数量，提高了程序运行效率和性能，精简了内存占用，加快运行速度；
* 外部状态相对独立，不会影响到内部状态，所以享元对象能够在不同的环境被共享；
缺点:
* 引入了共享对象，使对象结构变得复杂
* 共享对象的创建、销毁等需要维护，带来额外的复杂度（如果需要把共享对象维护起来的话）

享元模式的适用场景:
* 如果一个程序中大量使用了相同或相似对象，那么可以考虑引入享元模式；
* 如果使用了大量相同或相似对象，并造成了比较大的内存开销；
* 对象的大多数状态可以被转变为外部状态；
* 剥离出对象的外部状态后，可以使用相对较少的共享对象取代大量对象；

写在最后，
### 在一些程序中，如果引入享元模式对系统的性能和内存的占用影响不大时，比如目标对象不多，或者场景比较简单，则不需要引入，以免适得其反。

