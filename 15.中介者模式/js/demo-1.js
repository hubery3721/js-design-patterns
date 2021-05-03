/***
 * 调度中心
 */
class DispatchingCenter {
  //静态方法
  static getInstance() {
    if (!this.instance) {
      //实例化
      this.instance = new DispatchingCenter();
    }
    return this.instance;
  }
  constructor() {
    // 订阅池
    this.airplanes = [];
    this.name = 'DispatchingCenter'
    if (!DispatchingCenter.instance) {
      //将this挂载到SingletonPerson这个类的instance属性上
      DispatchingCenter.instance = this;
    }
  }
  // 通讯
  trigger(toObj, message) {
    toObj.getMessage(message);
  }
  // 消息通话
  getMessage(message) {
    console.log(this.name, '收到消息：', message);
  }
  // 移除飞机的通讯，在飞机起飞完成或者降落完成
  offAirplane(airplane) {
    const index = this.airplanes.findIndex(item => item.name === airplane.name);
    if (index > -1) {
      this.airplanes.splice(index, 1);
      // 通知最先申请的飞机可以执行申请
      if (this.airplanes.length) {
        const nextAirplane = this.airplanes[this.airplanes.length - 1];
        this.trigger(nextAirplane, '您准备好了吗，可以重新申请' + nextAirplane.willDo);
      }
    }
  }
  isHasAirplane(airplane) {
    return this.airplanes.some(item => item.name === airplane.name)
  }
  /***
   * 申请起飞或者降落
   * @param airplane
   * @param state take-off 起飞， land 是降落，如果有飞机在起飞或者降落则不能在此时起飞或者降落，一次只能有一飞机起飞或者降落
   *        不能起飞或者降落的飞机将进入队列进行等待
   */
  apply(airplane, state) {
    const doingAirplane = this.airplanes.find(item => item.state === 'take-off' || item.state === 'land');
    // 自己在进行起飞或者降落中又进行申请
    if (doingAirplane && doingAirplane.name === airplane.name) {
      this.trigger(airplane, '别闹...');
    } else if (doingAirplane) { // 有飞机在起码或者降落
      this.trigger(airplane, `${doingAirplane.name}正在${doingAirplane.state},请耐心等待`);
      if (!this.isHasAirplane(airplane)) {
        airplane.state = 'waiting';
        airplane.willDo = state;
        this.airplanes.push(airplane)
      }
    } else {
      // 执行降落或者起飞逻辑
      if (this.isHasAirplane(airplane)) {
        const targetAirplane = this.airplanes.find(item => item.name === airplane.name);
        targetAirplane.state = state;
      } else {
        // 申请允许动作
        airplane.state = state;
        this.airplanes.push(airplane);
      }

      this.trigger(airplane, '允许执行');

      this.timer = setTimeout(() => {
        console.log(airplane.name, '完成', airplane.state);
        this.offAirplane(airplane);
        clearTimeout(this.timer);
      }, 1000)
    }
  }
}

class Airplane {
  constructor(name) {
    this.name = name;
    this.dispatchingCenter = DispatchingCenter.getInstance();
  }
  apply(state) {
    this.dispatchingCenter.apply(this, state);
  }
  trigger(toObj, message) {
    this.dispatchingCenter.trigger(toObj, message);
  }
  getMessage(message) {
    console.log(this.name, '收到消息：', message);
  }
}

const airplane_southAir_1 = new Airplane('南方航空公司1号');
const airplane_southAir_2 = new Airplane('南方航空公司2号');
const airplane_eastAir_2 = new Airplane('东方航空公司2号');
const airplane_eastAir_1 = new Airplane('东方航空公司1号');
airplane_southAir_1.apply('take-off');
airplane_southAir_2.apply('take-off');
airplane_eastAir_2.trigger(airplane_eastAir_2.dispatchingCenter, '我想要降落申请');
airplane_eastAir_1.trigger(airplane_eastAir_2, '老兄，降落了吗？');
airplane_eastAir_2.trigger(airplane_eastAir_1, '没呢，准备申请');
airplane_eastAir_2.apply('land');
airplane_eastAir_1.apply('land');