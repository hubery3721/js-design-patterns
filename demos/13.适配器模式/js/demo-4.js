/**
 * 这是一段“闻起来”就很奇怪的代码
 */
function getEnv() {
  return 'app' // 'browser', 'wx'
}

function noop() {};

function share() {
  switch (getEnv()) {
    case 'app':
      appSDK.jsBridge('share');
      break;
    case 'browser':
      noop();
      break;
    case 'wx':
      wxSDK.onMenuShareTimeline();
      wxSDK.onMenuShareAppMessage();
      break;
  }
}

function openUrl() {
  switch (getEnv()) {}
}


/**
 * 外观模式
 */

let appAdapter = {
  share: () => {
    appSDK.jsBridge('share');
  },
  openUrl: () => {}
}

const wxAdapter = {
  share: () => {
    wxSDK.onMenuShareTimeline();
    wxSDK.onMenuShareTimeline();
  },
  openUrl: () => {}
}

const browserAdapter = {
  share: () => {
    noop();
  },
  openUrl: () => {}
}

function share() {
  let sdk = null;
  switch (getEnv()) {
    case 'app':
      sdk = appAdapter;
      break;
    case 'browser':
      sdk = browserAdapter;
      break;
    case 'wx':
      sdk = wxAdapter;
      break;
  }

  sdk.share();
}

// 定义高层一致性接口
// share()

function facade() {
  return { app: appAdapter, wx: wxAdapter, browser: browserAdapter } [getEnv()];
}

facade()





/**
 * I am 策略模式 Strategy
 */

// context
class SDKadapter {
  constructor(env) {
    this.env = env
    this.adapters = {}
  }

  set(adapters) {
    this.adapters = adapters
  }

  get() {
    return this.adapters[this.env]
  }
}

// strategies
var strategies = {
  app: appAdapter,
  wx: wxAdapter,
  browser: browserAdapter
}

var sdkAdapter = new SDKadapter(getEnv())
sdkAdapter.set(strategies)
var sdk = sdkAdapter.get()
sdk.share()