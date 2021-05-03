  var createDiv = function() {
    var div = document.createElement('div');
    div.innerHTML = 'this is div';
    document.body.appendChild(div);
  };

  var getSingleInstance = function(fn) {
    var instance;
    return function() {
      return instance || (instance = fn.apply(this, arguments))
    }
  }

  var createIframe = function() {
    var iframe = document.createElement('iframe');
    iframe.innerHTML = 'this is iframe';
    document.body.appendChild(iframe);
  };


  var a = getSingleInstance(createDiv)();
  var b = getSingleInstance(createIframe)();

  console.log(a === b); // true