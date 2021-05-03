// Adaptee 被适配对象1
class Usb {
  constructor() {};
  showInfo() {
    return {
      name: 'usb',
      info: 'usb info'
    };
  };
};

// Adaptee 被适配对象2
class Tc {
  constructor() {}
  showInfo() {
    return 'Tc signal'
  };
};

// Adapter 适配器
class SignalAdapter {
  showInfo(supporter) {

    if (supporter instanceof Usb) {
      const infoObj = supporter.showInfo();
      return infoObj.info + '转换成了电信号';
    } else if (supporter instanceof Tc) {
      const infoMsg = supporter.showInfo();
      return infoMsg + '转换成了电信号';
    }
    return '';
  };
};

// var usb = new Usb()
// console.log(usb.showInfo.info)
// var tc = new Tc()
// console.log(tc.showInfo)

// Client 使用者
class Client {
  getInfo() {
    const signalAdapter = new SignalAdapter();
    const info = signalAdapter.showInfo(new Usb());
    // const info = signalAdapter.showInfo(new Tc());
    console.log('final info:', info);
  };
};
const c = new Client();
c.getInfo();