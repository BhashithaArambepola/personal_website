// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

require = (function (modules, cache, entry) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof require === "function" && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof require === "function" && require;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }
      
      localRequire.resolve = resolve;

      var module = cache[name] = new newRequire.Module;

      modules[name][0].call(module.exports, localRequire, module, module.exports);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module() {
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  // Override the current require with this new one
  return newRequire;
})({2:[function(require,module,exports) {
var btnNewMember = document.querySelector('#btnSubmit');
var frmMember = document.querySelector('#contactForm');
var txtName = document.querySelector('#cname');
var txtEmail = document.querySelector('#cemail');
var txtMsg = document.querySelector('#cmessage');
//check validation-------------------------------------------------
setEnableForm_mem(false);
frmMember.addEventListener('submit', function (e) {
    e.preventDefault();
    var inputElms = [txtName, txtEmail, txtMsg];
    var invalidInputElms = inputElms.filter(function (elm) { return !elm.classList.contains('is-valid'); });
    if (invalidInputElms.length > 0) {
        invalidInputElms.forEach(function (elm) { return elm.classList.add('is-invalid'); });
        invalidInputElms[0].focus();
        return;
    }
    /* Todo: Let's send the data to the backend for saving, right? */
});
function setEnableForm_mem(enable) {
    if (enable === void 0) { enable = true; }
    for (var _i = 0, _a = frmMember.elements; _i < _a.length; _i++) {
        var element = _a[_i];
        if (element instanceof HTMLInputElement || element instanceof HTMLButtonElement) {
            element.disabled = !enable;
        }
    }
}
btnNewMember.addEventListener('click', function () {
    setEnableForm_mem();
    frmMember.reset();
    txtName.focus();
});
function checkValidityOfNIC() {
    return /^\d{9}[Vv]$/.test(txtName.value);
}
function checkValidityOfMemberName() {
    return /^.+$/.test(txtEmail.value);
}
function checkValidityOfContact() {
    return /^\d{3}-\d{7}$/.test(txtMsg.value);
}
txtName.addEventListener('input', checkValidity_mem);
txtEmail.addEventListener('input', checkValidity_mem);
txtMsg.addEventListener('input', checkValidity_mem);
function checkValidity_mem(e) {
    e.target.classList.remove('is-valid', 'is-invalid');
    if (e.target === txtName) {
        checkValidityOfNIC() ? txtName.classList.add('is-valid') : txtName.classList.add('is-invalid');
    }
    else if (e.target === txtEmail) {
        checkValidityOfMemberName() ? txtEmail.classList.add('is-valid') : txtEmail.classList.add('is-invalid');
    }
    else {
        checkValidityOfContact() ? txtMsg.classList.add('is-valid') : txtMsg.classList.add('is-invalid');
    }
}

},{}],0:[function(require,module,exports) {
var global = (1, eval)('this');
var OldModule = module.bundle.Module;
function Module() {
  OldModule.call(this);
  this.hot = {
    accept: function (fn) {
      this._acceptCallback = fn || function () {};
    },
    dispose: function (fn) {
      this._disposeCallback = fn;
    }
  };
}

module.bundle.Module = Module;

if (!module.bundle.parent && typeof WebSocket !== 'undefined') {
  var ws = new WebSocket('ws://localhost:35441/');
  ws.onmessage = function(event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      data.assets.forEach(function (asset) {
        hmrApply(global.require, asset);
      });

      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.require, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        window.location.reload();
      }
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + 'data.error.stack');
    }
  };
}

function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || (Array.isArray(dep) && dep[dep.length - 1] === id)) {
        parents.push(+k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  if (cached && cached.hot._disposeCallback) {
    cached.hot._disposeCallback();
  }

  delete bundle.cache[id];
  bundle(id);

  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallback) {
    cached.hot._acceptCallback();
    return true;
  }

  return getParents(global.require, id).some(function (id) {
    return hmrAccept(global.require, id)
  });
}
},{}]},{},[0,2])