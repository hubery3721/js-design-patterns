let id = 0;
// 创建一个上传入口方法
let startUpload = (uploadType, files) => { // uploadType 区分是控件还是 flash 
  for (var i = 0, file; file = files[i++];) {
    var uploadObj = new Upload(uploadType, file.fileName, file.fileSize);
    uploadObj.init(id++); // 给 upload 对象设置一个唯一的 id 
    console.log(`第${id}个upload对象`)
  }
};

// 新建一个Upload类
class Upload {
  constructor(uploadType, fileName, fileSize) {
    this.uploadType = uploadType;
    this.fileName = fileName;
    this.fileSize = fileSize;
    this.dom = null;
  }

  init(id) {
    this.id = id;
    this.dom = document.createElement('div');
    this.dom.innerHTML =
      '<span>文件名称:' + this.fileName + ', 文件大小: ' + this.fileSize + '</span>' +
      '<button class="delFile">删除</button>';
    this.dom.querySelector('.delFile').onclick = () => {
      this.delFile();
    }
    document.body.appendChild(this.dom);
  }

  // 添加一个删除方法
  delFile() {
    if (this.fileSize < 3000) {
      return this.dom.parentNode.removeChild(this.dom);
    }
    if (window.confirm('确定要删除该文件吗? ' + this.fileName)) {
      return this.dom.parentNode.removeChild(this.dom);
    }
  };
}

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