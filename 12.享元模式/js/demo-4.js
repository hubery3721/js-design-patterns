// 创建一个上传入口方法
let id = 0
let startUpload = (uploadType, files) => { // uploadType 区分是控件还是 flash 
  for (let i = 0, file; file = files[i++];) {
    var uploadObj = uploadManager.add(++id, uploadType, file.fileName, file.fileSize);
  }
};

// 新建一个Upload类
class Upload {
  constructor(uploadType) {
    this.uploadType = uploadType;
    this.dom = null;
  }

  //   init(id) {
  //     this.id = id;
  //     this.dom = document.createElement('div');
  //     this.dom.innerHTML =
  //       '<span>文件名称:' + this.fileName + ', 文件大小: ' + this.fileSize + '</span>' +
  //       '<button class="delFile">删除</button>';
  //     this.dom.querySelector('.delFile').onclick = () => {
  //       this.delFile();
  //     }
  //     document.body.appendChild(this.dom);
  //   }

  // 添加一个删除方法
  delFile(id) {
    uploadManager.setExternalState(id, this); // (1) 
    if (this.fileSize < 3000) {
      return this.dom.parentNode.removeChild(this.dom);
    }
    if (window.confirm('确定要删除该文件吗? ' + this.fileName)) {
      return this.dom.parentNode.removeChild(this.dom);
    }
  };
}

// 用工厂实例化对象
let createdFlyWeightObjs = {}

let UploadFactory = (uploadType) => {
  if (createdFlyWeightObjs[uploadType]) {
    return createdFlyWeightObjs[uploadType];
  } else {
    console.log(`第${id}个upload对象`)
    return createdFlyWeightObjs[uploadType] = new Upload(uploadType);
  }
}

// 创建一个管理器封装外部状态
class UploadManager {
  constructor() {
    this.uploadDatabase = {}
  }

  add(id, uploadType, fileName, fileSize) {
    var flyWeightObj = UploadFactory(uploadType);
    var dom = document.createElement('div');
    dom.innerHTML =
      '<span>文件名称:' + fileName + ', 文件大小: ' + fileSize + '</span>' +
      '<button class="delFile">删除</button>';
    dom.querySelector('.delFile').onclick = function() {
      flyWeightObj.delFile(id);
    }
    document.body.appendChild(dom);
    this.uploadDatabase[id] = {
      fileName: fileName,
      fileSize: fileSize,
      dom: dom
    };
    return flyWeightObj;
  }
  setExternalState(id, flyWeightObj) {
    var uploadData = this.uploadDatabase[id];
    for (var i in uploadData) {
      flyWeightObj[i] = uploadData[i];
    }
  }
}

let uploadManager = new UploadManager()


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