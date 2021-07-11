/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/@rails/actioncable/app/assets/javascripts/action_cable.js":
/*!********************************************************************************!*\
  !*** ./node_modules/@rails/actioncable/app/assets/javascripts/action_cable.js ***!
  \********************************************************************************/
/***/ (function(__unused_webpack_module, exports) {

(function(global, factory) {
   true ? factory(exports) : 0;
})(this, function(exports) {
  "use strict";
  var adapters = {
    logger: self.console,
    WebSocket: self.WebSocket
  };
  var logger = {
    log: function log() {
      if (this.enabled) {
        var _adapters$logger;
        for (var _len = arguments.length, messages = Array(_len), _key = 0; _key < _len; _key++) {
          messages[_key] = arguments[_key];
        }
        messages.push(Date.now());
        (_adapters$logger = adapters.logger).log.apply(_adapters$logger, [ "[ActionCable]" ].concat(messages));
      }
    }
  };
  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function(obj) {
    return typeof obj;
  } : function(obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };
  var classCallCheck = function(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };
  var createClass = function() {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }
    return function(Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();
  var now = function now() {
    return new Date().getTime();
  };
  var secondsSince = function secondsSince(time) {
    return (now() - time) / 1e3;
  };
  var clamp = function clamp(number, min, max) {
    return Math.max(min, Math.min(max, number));
  };
  var ConnectionMonitor = function() {
    function ConnectionMonitor(connection) {
      classCallCheck(this, ConnectionMonitor);
      this.visibilityDidChange = this.visibilityDidChange.bind(this);
      this.connection = connection;
      this.reconnectAttempts = 0;
    }
    ConnectionMonitor.prototype.start = function start() {
      if (!this.isRunning()) {
        this.startedAt = now();
        delete this.stoppedAt;
        this.startPolling();
        addEventListener("visibilitychange", this.visibilityDidChange);
        logger.log("ConnectionMonitor started. pollInterval = " + this.getPollInterval() + " ms");
      }
    };
    ConnectionMonitor.prototype.stop = function stop() {
      if (this.isRunning()) {
        this.stoppedAt = now();
        this.stopPolling();
        removeEventListener("visibilitychange", this.visibilityDidChange);
        logger.log("ConnectionMonitor stopped");
      }
    };
    ConnectionMonitor.prototype.isRunning = function isRunning() {
      return this.startedAt && !this.stoppedAt;
    };
    ConnectionMonitor.prototype.recordPing = function recordPing() {
      this.pingedAt = now();
    };
    ConnectionMonitor.prototype.recordConnect = function recordConnect() {
      this.reconnectAttempts = 0;
      this.recordPing();
      delete this.disconnectedAt;
      logger.log("ConnectionMonitor recorded connect");
    };
    ConnectionMonitor.prototype.recordDisconnect = function recordDisconnect() {
      this.disconnectedAt = now();
      logger.log("ConnectionMonitor recorded disconnect");
    };
    ConnectionMonitor.prototype.startPolling = function startPolling() {
      this.stopPolling();
      this.poll();
    };
    ConnectionMonitor.prototype.stopPolling = function stopPolling() {
      clearTimeout(this.pollTimeout);
    };
    ConnectionMonitor.prototype.poll = function poll() {
      var _this = this;
      this.pollTimeout = setTimeout(function() {
        _this.reconnectIfStale();
        _this.poll();
      }, this.getPollInterval());
    };
    ConnectionMonitor.prototype.getPollInterval = function getPollInterval() {
      var _constructor$pollInte = this.constructor.pollInterval, min = _constructor$pollInte.min, max = _constructor$pollInte.max, multiplier = _constructor$pollInte.multiplier;
      var interval = multiplier * Math.log(this.reconnectAttempts + 1);
      return Math.round(clamp(interval, min, max) * 1e3);
    };
    ConnectionMonitor.prototype.reconnectIfStale = function reconnectIfStale() {
      if (this.connectionIsStale()) {
        logger.log("ConnectionMonitor detected stale connection. reconnectAttempts = " + this.reconnectAttempts + ", pollInterval = " + this.getPollInterval() + " ms, time disconnected = " + secondsSince(this.disconnectedAt) + " s, stale threshold = " + this.constructor.staleThreshold + " s");
        this.reconnectAttempts++;
        if (this.disconnectedRecently()) {
          logger.log("ConnectionMonitor skipping reopening recent disconnect");
        } else {
          logger.log("ConnectionMonitor reopening");
          this.connection.reopen();
        }
      }
    };
    ConnectionMonitor.prototype.connectionIsStale = function connectionIsStale() {
      return secondsSince(this.pingedAt ? this.pingedAt : this.startedAt) > this.constructor.staleThreshold;
    };
    ConnectionMonitor.prototype.disconnectedRecently = function disconnectedRecently() {
      return this.disconnectedAt && secondsSince(this.disconnectedAt) < this.constructor.staleThreshold;
    };
    ConnectionMonitor.prototype.visibilityDidChange = function visibilityDidChange() {
      var _this2 = this;
      if (document.visibilityState === "visible") {
        setTimeout(function() {
          if (_this2.connectionIsStale() || !_this2.connection.isOpen()) {
            logger.log("ConnectionMonitor reopening stale connection on visibilitychange. visibilityState = " + document.visibilityState);
            _this2.connection.reopen();
          }
        }, 200);
      }
    };
    return ConnectionMonitor;
  }();
  ConnectionMonitor.pollInterval = {
    min: 3,
    max: 30,
    multiplier: 5
  };
  ConnectionMonitor.staleThreshold = 6;
  var INTERNAL = {
    message_types: {
      welcome: "welcome",
      disconnect: "disconnect",
      ping: "ping",
      confirmation: "confirm_subscription",
      rejection: "reject_subscription"
    },
    disconnect_reasons: {
      unauthorized: "unauthorized",
      invalid_request: "invalid_request",
      server_restart: "server_restart"
    },
    default_mount_path: "/cable",
    protocols: [ "actioncable-v1-json", "actioncable-unsupported" ]
  };
  var message_types = INTERNAL.message_types, protocols = INTERNAL.protocols;
  var supportedProtocols = protocols.slice(0, protocols.length - 1);
  var indexOf = [].indexOf;
  var Connection = function() {
    function Connection(consumer) {
      classCallCheck(this, Connection);
      this.open = this.open.bind(this);
      this.consumer = consumer;
      this.subscriptions = this.consumer.subscriptions;
      this.monitor = new ConnectionMonitor(this);
      this.disconnected = true;
    }
    Connection.prototype.send = function send(data) {
      if (this.isOpen()) {
        this.webSocket.send(JSON.stringify(data));
        return true;
      } else {
        return false;
      }
    };
    Connection.prototype.open = function open() {
      if (this.isActive()) {
        logger.log("Attempted to open WebSocket, but existing socket is " + this.getState());
        return false;
      } else {
        logger.log("Opening WebSocket, current state is " + this.getState() + ", subprotocols: " + protocols);
        if (this.webSocket) {
          this.uninstallEventHandlers();
        }
        this.webSocket = new adapters.WebSocket(this.consumer.url, protocols);
        this.installEventHandlers();
        this.monitor.start();
        return true;
      }
    };
    Connection.prototype.close = function close() {
      var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
        allowReconnect: true
      }, allowReconnect = _ref.allowReconnect;
      if (!allowReconnect) {
        this.monitor.stop();
      }
      if (this.isActive()) {
        return this.webSocket.close();
      }
    };
    Connection.prototype.reopen = function reopen() {
      logger.log("Reopening WebSocket, current state is " + this.getState());
      if (this.isActive()) {
        try {
          return this.close();
        } catch (error) {
          logger.log("Failed to reopen WebSocket", error);
        } finally {
          logger.log("Reopening WebSocket in " + this.constructor.reopenDelay + "ms");
          setTimeout(this.open, this.constructor.reopenDelay);
        }
      } else {
        return this.open();
      }
    };
    Connection.prototype.getProtocol = function getProtocol() {
      if (this.webSocket) {
        return this.webSocket.protocol;
      }
    };
    Connection.prototype.isOpen = function isOpen() {
      return this.isState("open");
    };
    Connection.prototype.isActive = function isActive() {
      return this.isState("open", "connecting");
    };
    Connection.prototype.isProtocolSupported = function isProtocolSupported() {
      return indexOf.call(supportedProtocols, this.getProtocol()) >= 0;
    };
    Connection.prototype.isState = function isState() {
      for (var _len = arguments.length, states = Array(_len), _key = 0; _key < _len; _key++) {
        states[_key] = arguments[_key];
      }
      return indexOf.call(states, this.getState()) >= 0;
    };
    Connection.prototype.getState = function getState() {
      if (this.webSocket) {
        for (var state in adapters.WebSocket) {
          if (adapters.WebSocket[state] === this.webSocket.readyState) {
            return state.toLowerCase();
          }
        }
      }
      return null;
    };
    Connection.prototype.installEventHandlers = function installEventHandlers() {
      for (var eventName in this.events) {
        var handler = this.events[eventName].bind(this);
        this.webSocket["on" + eventName] = handler;
      }
    };
    Connection.prototype.uninstallEventHandlers = function uninstallEventHandlers() {
      for (var eventName in this.events) {
        this.webSocket["on" + eventName] = function() {};
      }
    };
    return Connection;
  }();
  Connection.reopenDelay = 500;
  Connection.prototype.events = {
    message: function message(event) {
      if (!this.isProtocolSupported()) {
        return;
      }
      var _JSON$parse = JSON.parse(event.data), identifier = _JSON$parse.identifier, message = _JSON$parse.message, reason = _JSON$parse.reason, reconnect = _JSON$parse.reconnect, type = _JSON$parse.type;
      switch (type) {
       case message_types.welcome:
        this.monitor.recordConnect();
        return this.subscriptions.reload();

       case message_types.disconnect:
        logger.log("Disconnecting. Reason: " + reason);
        return this.close({
          allowReconnect: reconnect
        });

       case message_types.ping:
        return this.monitor.recordPing();

       case message_types.confirmation:
        return this.subscriptions.notify(identifier, "connected");

       case message_types.rejection:
        return this.subscriptions.reject(identifier);

       default:
        return this.subscriptions.notify(identifier, "received", message);
      }
    },
    open: function open() {
      logger.log("WebSocket onopen event, using '" + this.getProtocol() + "' subprotocol");
      this.disconnected = false;
      if (!this.isProtocolSupported()) {
        logger.log("Protocol is unsupported. Stopping monitor and disconnecting.");
        return this.close({
          allowReconnect: false
        });
      }
    },
    close: function close(event) {
      logger.log("WebSocket onclose event");
      if (this.disconnected) {
        return;
      }
      this.disconnected = true;
      this.monitor.recordDisconnect();
      return this.subscriptions.notifyAll("disconnected", {
        willAttemptReconnect: this.monitor.isRunning()
      });
    },
    error: function error() {
      logger.log("WebSocket onerror event");
    }
  };
  var extend = function extend(object, properties) {
    if (properties != null) {
      for (var key in properties) {
        var value = properties[key];
        object[key] = value;
      }
    }
    return object;
  };
  var Subscription = function() {
    function Subscription(consumer) {
      var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var mixin = arguments[2];
      classCallCheck(this, Subscription);
      this.consumer = consumer;
      this.identifier = JSON.stringify(params);
      extend(this, mixin);
    }
    Subscription.prototype.perform = function perform(action) {
      var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      data.action = action;
      return this.send(data);
    };
    Subscription.prototype.send = function send(data) {
      return this.consumer.send({
        command: "message",
        identifier: this.identifier,
        data: JSON.stringify(data)
      });
    };
    Subscription.prototype.unsubscribe = function unsubscribe() {
      return this.consumer.subscriptions.remove(this);
    };
    return Subscription;
  }();
  var Subscriptions = function() {
    function Subscriptions(consumer) {
      classCallCheck(this, Subscriptions);
      this.consumer = consumer;
      this.subscriptions = [];
    }
    Subscriptions.prototype.create = function create(channelName, mixin) {
      var channel = channelName;
      var params = (typeof channel === "undefined" ? "undefined" : _typeof(channel)) === "object" ? channel : {
        channel: channel
      };
      var subscription = new Subscription(this.consumer, params, mixin);
      return this.add(subscription);
    };
    Subscriptions.prototype.add = function add(subscription) {
      this.subscriptions.push(subscription);
      this.consumer.ensureActiveConnection();
      this.notify(subscription, "initialized");
      this.sendCommand(subscription, "subscribe");
      return subscription;
    };
    Subscriptions.prototype.remove = function remove(subscription) {
      this.forget(subscription);
      if (!this.findAll(subscription.identifier).length) {
        this.sendCommand(subscription, "unsubscribe");
      }
      return subscription;
    };
    Subscriptions.prototype.reject = function reject(identifier) {
      var _this = this;
      return this.findAll(identifier).map(function(subscription) {
        _this.forget(subscription);
        _this.notify(subscription, "rejected");
        return subscription;
      });
    };
    Subscriptions.prototype.forget = function forget(subscription) {
      this.subscriptions = this.subscriptions.filter(function(s) {
        return s !== subscription;
      });
      return subscription;
    };
    Subscriptions.prototype.findAll = function findAll(identifier) {
      return this.subscriptions.filter(function(s) {
        return s.identifier === identifier;
      });
    };
    Subscriptions.prototype.reload = function reload() {
      var _this2 = this;
      return this.subscriptions.map(function(subscription) {
        return _this2.sendCommand(subscription, "subscribe");
      });
    };
    Subscriptions.prototype.notifyAll = function notifyAll(callbackName) {
      var _this3 = this;
      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }
      return this.subscriptions.map(function(subscription) {
        return _this3.notify.apply(_this3, [ subscription, callbackName ].concat(args));
      });
    };
    Subscriptions.prototype.notify = function notify(subscription, callbackName) {
      for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
        args[_key2 - 2] = arguments[_key2];
      }
      var subscriptions = void 0;
      if (typeof subscription === "string") {
        subscriptions = this.findAll(subscription);
      } else {
        subscriptions = [ subscription ];
      }
      return subscriptions.map(function(subscription) {
        return typeof subscription[callbackName] === "function" ? subscription[callbackName].apply(subscription, args) : undefined;
      });
    };
    Subscriptions.prototype.sendCommand = function sendCommand(subscription, command) {
      var identifier = subscription.identifier;
      return this.consumer.send({
        command: command,
        identifier: identifier
      });
    };
    return Subscriptions;
  }();
  var Consumer = function() {
    function Consumer(url) {
      classCallCheck(this, Consumer);
      this._url = url;
      this.subscriptions = new Subscriptions(this);
      this.connection = new Connection(this);
    }
    Consumer.prototype.send = function send(data) {
      return this.connection.send(data);
    };
    Consumer.prototype.connect = function connect() {
      return this.connection.open();
    };
    Consumer.prototype.disconnect = function disconnect() {
      return this.connection.close({
        allowReconnect: false
      });
    };
    Consumer.prototype.ensureActiveConnection = function ensureActiveConnection() {
      if (!this.connection.isActive()) {
        return this.connection.open();
      }
    };
    createClass(Consumer, [ {
      key: "url",
      get: function get$$1() {
        return createWebSocketURL(this._url);
      }
    } ]);
    return Consumer;
  }();
  function createWebSocketURL(url) {
    if (typeof url === "function") {
      url = url();
    }
    if (url && !/^wss?:/i.test(url)) {
      var a = document.createElement("a");
      a.href = url;
      a.href = a.href;
      a.protocol = a.protocol.replace("http", "ws");
      return a.href;
    } else {
      return url;
    }
  }
  function createConsumer() {
    var url = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : getConfig("url") || INTERNAL.default_mount_path;
    return new Consumer(url);
  }
  function getConfig(name) {
    var element = document.head.querySelector("meta[name='action-cable-" + name + "']");
    if (element) {
      return element.getAttribute("content");
    }
  }
  exports.Connection = Connection;
  exports.ConnectionMonitor = ConnectionMonitor;
  exports.Consumer = Consumer;
  exports.INTERNAL = INTERNAL;
  exports.Subscription = Subscription;
  exports.Subscriptions = Subscriptions;
  exports.adapters = adapters;
  exports.createWebSocketURL = createWebSocketURL;
  exports.logger = logger;
  exports.createConsumer = createConsumer;
  exports.getConfig = getConfig;
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
});


/***/ }),

/***/ "./node_modules/@stimulus/core/dist/action.js":
/*!****************************************************!*\
  !*** ./node_modules/@stimulus/core/dist/action.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Action": () => (/* binding */ Action),
/* harmony export */   "getDefaultEventNameForElement": () => (/* binding */ getDefaultEventNameForElement)
/* harmony export */ });
/* harmony import */ var _action_descriptor__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./action_descriptor */ "./node_modules/@stimulus/core/dist/action_descriptor.js");

var Action = /** @class */ (function () {
    function Action(element, index, descriptor) {
        this.element = element;
        this.index = index;
        this.eventTarget = descriptor.eventTarget || element;
        this.eventName = descriptor.eventName || getDefaultEventNameForElement(element) || error("missing event name");
        this.eventOptions = descriptor.eventOptions || {};
        this.identifier = descriptor.identifier || error("missing identifier");
        this.methodName = descriptor.methodName || error("missing method name");
    }
    Action.forToken = function (token) {
        return new this(token.element, token.index, (0,_action_descriptor__WEBPACK_IMPORTED_MODULE_0__.parseActionDescriptorString)(token.content));
    };
    Action.prototype.toString = function () {
        var eventNameSuffix = this.eventTargetName ? "@" + this.eventTargetName : "";
        return "" + this.eventName + eventNameSuffix + "->" + this.identifier + "#" + this.methodName;
    };
    Object.defineProperty(Action.prototype, "eventTargetName", {
        get: function () {
            return (0,_action_descriptor__WEBPACK_IMPORTED_MODULE_0__.stringifyEventTarget)(this.eventTarget);
        },
        enumerable: false,
        configurable: true
    });
    return Action;
}());

var defaultEventNames = {
    "a": function (e) { return "click"; },
    "button": function (e) { return "click"; },
    "form": function (e) { return "submit"; },
    "input": function (e) { return e.getAttribute("type") == "submit" ? "click" : "input"; },
    "select": function (e) { return "change"; },
    "textarea": function (e) { return "input"; }
};
function getDefaultEventNameForElement(element) {
    var tagName = element.tagName.toLowerCase();
    if (tagName in defaultEventNames) {
        return defaultEventNames[tagName](element);
    }
}
function error(message) {
    throw new Error(message);
}
//# sourceMappingURL=action.js.map

/***/ }),

/***/ "./node_modules/@stimulus/core/dist/action_descriptor.js":
/*!***************************************************************!*\
  !*** ./node_modules/@stimulus/core/dist/action_descriptor.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "parseActionDescriptorString": () => (/* binding */ parseActionDescriptorString),
/* harmony export */   "stringifyEventTarget": () => (/* binding */ stringifyEventTarget)
/* harmony export */ });
// capture nos.:            12   23 4               43   1 5   56 7      768 9  98
var descriptorPattern = /^((.+?)(@(window|document))?->)?(.+?)(#([^:]+?))(:(.+))?$/;
function parseActionDescriptorString(descriptorString) {
    var source = descriptorString.trim();
    var matches = source.match(descriptorPattern) || [];
    return {
        eventTarget: parseEventTarget(matches[4]),
        eventName: matches[2],
        eventOptions: matches[9] ? parseEventOptions(matches[9]) : {},
        identifier: matches[5],
        methodName: matches[7]
    };
}
function parseEventTarget(eventTargetName) {
    if (eventTargetName == "window") {
        return window;
    }
    else if (eventTargetName == "document") {
        return document;
    }
}
function parseEventOptions(eventOptions) {
    return eventOptions.split(":").reduce(function (options, token) {
        var _a;
        return Object.assign(options, (_a = {}, _a[token.replace(/^!/, "")] = !/^!/.test(token), _a));
    }, {});
}
function stringifyEventTarget(eventTarget) {
    if (eventTarget == window) {
        return "window";
    }
    else if (eventTarget == document) {
        return "document";
    }
}
//# sourceMappingURL=action_descriptor.js.map

/***/ }),

/***/ "./node_modules/@stimulus/core/dist/application.js":
/*!*********************************************************!*\
  !*** ./node_modules/@stimulus/core/dist/application.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Application": () => (/* binding */ Application)
/* harmony export */ });
/* harmony import */ var _dispatcher__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dispatcher */ "./node_modules/@stimulus/core/dist/dispatcher.js");
/* harmony import */ var _router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./router */ "./node_modules/@stimulus/core/dist/router.js");
/* harmony import */ var _schema__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./schema */ "./node_modules/@stimulus/core/dist/schema.js");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArrays = (undefined && undefined.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};



var Application = /** @class */ (function () {
    function Application(element, schema) {
        if (element === void 0) { element = document.documentElement; }
        if (schema === void 0) { schema = _schema__WEBPACK_IMPORTED_MODULE_2__.defaultSchema; }
        this.logger = console;
        this.element = element;
        this.schema = schema;
        this.dispatcher = new _dispatcher__WEBPACK_IMPORTED_MODULE_0__.Dispatcher(this);
        this.router = new _router__WEBPACK_IMPORTED_MODULE_1__.Router(this);
    }
    Application.start = function (element, schema) {
        var application = new Application(element, schema);
        application.start();
        return application;
    };
    Application.prototype.start = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, domReady()];
                    case 1:
                        _a.sent();
                        this.dispatcher.start();
                        this.router.start();
                        return [2 /*return*/];
                }
            });
        });
    };
    Application.prototype.stop = function () {
        this.dispatcher.stop();
        this.router.stop();
    };
    Application.prototype.register = function (identifier, controllerConstructor) {
        this.load({ identifier: identifier, controllerConstructor: controllerConstructor });
    };
    Application.prototype.load = function (head) {
        var _this = this;
        var rest = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            rest[_i - 1] = arguments[_i];
        }
        var definitions = Array.isArray(head) ? head : __spreadArrays([head], rest);
        definitions.forEach(function (definition) { return _this.router.loadDefinition(definition); });
    };
    Application.prototype.unload = function (head) {
        var _this = this;
        var rest = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            rest[_i - 1] = arguments[_i];
        }
        var identifiers = Array.isArray(head) ? head : __spreadArrays([head], rest);
        identifiers.forEach(function (identifier) { return _this.router.unloadIdentifier(identifier); });
    };
    Object.defineProperty(Application.prototype, "controllers", {
        // Controllers
        get: function () {
            return this.router.contexts.map(function (context) { return context.controller; });
        },
        enumerable: false,
        configurable: true
    });
    Application.prototype.getControllerForElementAndIdentifier = function (element, identifier) {
        var context = this.router.getContextForElementAndIdentifier(element, identifier);
        return context ? context.controller : null;
    };
    // Error handling
    Application.prototype.handleError = function (error, message, detail) {
        this.logger.error("%s\n\n%o\n\n%o", message, error, detail);
    };
    return Application;
}());

function domReady() {
    return new Promise(function (resolve) {
        if (document.readyState == "loading") {
            document.addEventListener("DOMContentLoaded", resolve);
        }
        else {
            resolve();
        }
    });
}
//# sourceMappingURL=application.js.map

/***/ }),

/***/ "./node_modules/@stimulus/core/dist/binding.js":
/*!*****************************************************!*\
  !*** ./node_modules/@stimulus/core/dist/binding.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Binding": () => (/* binding */ Binding)
/* harmony export */ });
var Binding = /** @class */ (function () {
    function Binding(context, action) {
        this.context = context;
        this.action = action;
    }
    Object.defineProperty(Binding.prototype, "index", {
        get: function () {
            return this.action.index;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Binding.prototype, "eventTarget", {
        get: function () {
            return this.action.eventTarget;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Binding.prototype, "eventOptions", {
        get: function () {
            return this.action.eventOptions;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Binding.prototype, "identifier", {
        get: function () {
            return this.context.identifier;
        },
        enumerable: false,
        configurable: true
    });
    Binding.prototype.handleEvent = function (event) {
        if (this.willBeInvokedByEvent(event)) {
            this.invokeWithEvent(event);
        }
    };
    Object.defineProperty(Binding.prototype, "eventName", {
        get: function () {
            return this.action.eventName;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Binding.prototype, "method", {
        get: function () {
            var method = this.controller[this.methodName];
            if (typeof method == "function") {
                return method;
            }
            throw new Error("Action \"" + this.action + "\" references undefined method \"" + this.methodName + "\"");
        },
        enumerable: false,
        configurable: true
    });
    Binding.prototype.invokeWithEvent = function (event) {
        try {
            this.method.call(this.controller, event);
        }
        catch (error) {
            var _a = this, identifier = _a.identifier, controller = _a.controller, element = _a.element, index = _a.index;
            var detail = { identifier: identifier, controller: controller, element: element, index: index, event: event };
            this.context.handleError(error, "invoking action \"" + this.action + "\"", detail);
        }
    };
    Binding.prototype.willBeInvokedByEvent = function (event) {
        var eventTarget = event.target;
        if (this.element === eventTarget) {
            return true;
        }
        else if (eventTarget instanceof Element && this.element.contains(eventTarget)) {
            return this.scope.containsElement(eventTarget);
        }
        else {
            return this.scope.containsElement(this.action.element);
        }
    };
    Object.defineProperty(Binding.prototype, "controller", {
        get: function () {
            return this.context.controller;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Binding.prototype, "methodName", {
        get: function () {
            return this.action.methodName;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Binding.prototype, "element", {
        get: function () {
            return this.scope.element;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Binding.prototype, "scope", {
        get: function () {
            return this.context.scope;
        },
        enumerable: false,
        configurable: true
    });
    return Binding;
}());

//# sourceMappingURL=binding.js.map

/***/ }),

/***/ "./node_modules/@stimulus/core/dist/binding_observer.js":
/*!**************************************************************!*\
  !*** ./node_modules/@stimulus/core/dist/binding_observer.js ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "BindingObserver": () => (/* binding */ BindingObserver)
/* harmony export */ });
/* harmony import */ var _action__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./action */ "./node_modules/@stimulus/core/dist/action.js");
/* harmony import */ var _binding__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./binding */ "./node_modules/@stimulus/core/dist/binding.js");
/* harmony import */ var _stimulus_mutation_observers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @stimulus/mutation-observers */ "./node_modules/@stimulus/mutation-observers/dist/index.js");



var BindingObserver = /** @class */ (function () {
    function BindingObserver(context, delegate) {
        this.context = context;
        this.delegate = delegate;
        this.bindingsByAction = new Map;
    }
    BindingObserver.prototype.start = function () {
        if (!this.valueListObserver) {
            this.valueListObserver = new _stimulus_mutation_observers__WEBPACK_IMPORTED_MODULE_2__.ValueListObserver(this.element, this.actionAttribute, this);
            this.valueListObserver.start();
        }
    };
    BindingObserver.prototype.stop = function () {
        if (this.valueListObserver) {
            this.valueListObserver.stop();
            delete this.valueListObserver;
            this.disconnectAllActions();
        }
    };
    Object.defineProperty(BindingObserver.prototype, "element", {
        get: function () {
            return this.context.element;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BindingObserver.prototype, "identifier", {
        get: function () {
            return this.context.identifier;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BindingObserver.prototype, "actionAttribute", {
        get: function () {
            return this.schema.actionAttribute;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BindingObserver.prototype, "schema", {
        get: function () {
            return this.context.schema;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BindingObserver.prototype, "bindings", {
        get: function () {
            return Array.from(this.bindingsByAction.values());
        },
        enumerable: false,
        configurable: true
    });
    BindingObserver.prototype.connectAction = function (action) {
        var binding = new _binding__WEBPACK_IMPORTED_MODULE_1__.Binding(this.context, action);
        this.bindingsByAction.set(action, binding);
        this.delegate.bindingConnected(binding);
    };
    BindingObserver.prototype.disconnectAction = function (action) {
        var binding = this.bindingsByAction.get(action);
        if (binding) {
            this.bindingsByAction.delete(action);
            this.delegate.bindingDisconnected(binding);
        }
    };
    BindingObserver.prototype.disconnectAllActions = function () {
        var _this = this;
        this.bindings.forEach(function (binding) { return _this.delegate.bindingDisconnected(binding); });
        this.bindingsByAction.clear();
    };
    // Value observer delegate
    BindingObserver.prototype.parseValueForToken = function (token) {
        var action = _action__WEBPACK_IMPORTED_MODULE_0__.Action.forToken(token);
        if (action.identifier == this.identifier) {
            return action;
        }
    };
    BindingObserver.prototype.elementMatchedValue = function (element, action) {
        this.connectAction(action);
    };
    BindingObserver.prototype.elementUnmatchedValue = function (element, action) {
        this.disconnectAction(action);
    };
    return BindingObserver;
}());

//# sourceMappingURL=binding_observer.js.map

/***/ }),

/***/ "./node_modules/@stimulus/core/dist/blessing.js":
/*!******************************************************!*\
  !*** ./node_modules/@stimulus/core/dist/blessing.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "bless": () => (/* binding */ bless)
/* harmony export */ });
/* harmony import */ var _inheritable_statics__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./inheritable_statics */ "./node_modules/@stimulus/core/dist/inheritable_statics.js");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __spreadArrays = (undefined && undefined.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};

/** @hidden */
function bless(constructor) {
    return shadow(constructor, getBlessedProperties(constructor));
}
function shadow(constructor, properties) {
    var shadowConstructor = extend(constructor);
    var shadowProperties = getShadowProperties(constructor.prototype, properties);
    Object.defineProperties(shadowConstructor.prototype, shadowProperties);
    return shadowConstructor;
}
function getBlessedProperties(constructor) {
    var blessings = (0,_inheritable_statics__WEBPACK_IMPORTED_MODULE_0__.readInheritableStaticArrayValues)(constructor, "blessings");
    return blessings.reduce(function (blessedProperties, blessing) {
        var properties = blessing(constructor);
        for (var key in properties) {
            var descriptor = blessedProperties[key] || {};
            blessedProperties[key] = Object.assign(descriptor, properties[key]);
        }
        return blessedProperties;
    }, {});
}
function getShadowProperties(prototype, properties) {
    return getOwnKeys(properties).reduce(function (shadowProperties, key) {
        var _a;
        var descriptor = getShadowedDescriptor(prototype, properties, key);
        if (descriptor) {
            Object.assign(shadowProperties, (_a = {}, _a[key] = descriptor, _a));
        }
        return shadowProperties;
    }, {});
}
function getShadowedDescriptor(prototype, properties, key) {
    var shadowingDescriptor = Object.getOwnPropertyDescriptor(prototype, key);
    var shadowedByValue = shadowingDescriptor && "value" in shadowingDescriptor;
    if (!shadowedByValue) {
        var descriptor = Object.getOwnPropertyDescriptor(properties, key).value;
        if (shadowingDescriptor) {
            descriptor.get = shadowingDescriptor.get || descriptor.get;
            descriptor.set = shadowingDescriptor.set || descriptor.set;
        }
        return descriptor;
    }
}
var getOwnKeys = (function () {
    if (typeof Object.getOwnPropertySymbols == "function") {
        return function (object) { return __spreadArrays(Object.getOwnPropertyNames(object), Object.getOwnPropertySymbols(object)); };
    }
    else {
        return Object.getOwnPropertyNames;
    }
})();
var extend = (function () {
    function extendWithReflect(constructor) {
        function extended() {
            var _newTarget = this && this instanceof extended ? this.constructor : void 0;
            return Reflect.construct(constructor, arguments, _newTarget);
        }
        extended.prototype = Object.create(constructor.prototype, {
            constructor: { value: extended }
        });
        Reflect.setPrototypeOf(extended, constructor);
        return extended;
    }
    function testReflectExtension() {
        var a = function () { this.a.call(this); };
        var b = extendWithReflect(a);
        b.prototype.a = function () { };
        return new b;
    }
    try {
        testReflectExtension();
        return extendWithReflect;
    }
    catch (error) {
        return function (constructor) { return /** @class */ (function (_super) {
            __extends(extended, _super);
            function extended() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return extended;
        }(constructor)); };
    }
})();
//# sourceMappingURL=blessing.js.map

/***/ }),

/***/ "./node_modules/@stimulus/core/dist/class_map.js":
/*!*******************************************************!*\
  !*** ./node_modules/@stimulus/core/dist/class_map.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ClassMap": () => (/* binding */ ClassMap)
/* harmony export */ });
var ClassMap = /** @class */ (function () {
    function ClassMap(scope) {
        this.scope = scope;
    }
    ClassMap.prototype.has = function (name) {
        return this.data.has(this.getDataKey(name));
    };
    ClassMap.prototype.get = function (name) {
        return this.data.get(this.getDataKey(name));
    };
    ClassMap.prototype.getAttributeName = function (name) {
        return this.data.getAttributeNameForKey(this.getDataKey(name));
    };
    ClassMap.prototype.getDataKey = function (name) {
        return name + "-class";
    };
    Object.defineProperty(ClassMap.prototype, "data", {
        get: function () {
            return this.scope.data;
        },
        enumerable: false,
        configurable: true
    });
    return ClassMap;
}());

//# sourceMappingURL=class_map.js.map

/***/ }),

/***/ "./node_modules/@stimulus/core/dist/class_properties.js":
/*!**************************************************************!*\
  !*** ./node_modules/@stimulus/core/dist/class_properties.js ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ClassPropertiesBlessing": () => (/* binding */ ClassPropertiesBlessing)
/* harmony export */ });
/* harmony import */ var _inheritable_statics__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./inheritable_statics */ "./node_modules/@stimulus/core/dist/inheritable_statics.js");
/* harmony import */ var _string_helpers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./string_helpers */ "./node_modules/@stimulus/core/dist/string_helpers.js");


/** @hidden */
function ClassPropertiesBlessing(constructor) {
    var classes = (0,_inheritable_statics__WEBPACK_IMPORTED_MODULE_0__.readInheritableStaticArrayValues)(constructor, "classes");
    return classes.reduce(function (properties, classDefinition) {
        return Object.assign(properties, propertiesForClassDefinition(classDefinition));
    }, {});
}
function propertiesForClassDefinition(key) {
    var _a;
    var name = key + "Class";
    return _a = {},
        _a[name] = {
            get: function () {
                var classes = this.classes;
                if (classes.has(key)) {
                    return classes.get(key);
                }
                else {
                    var attribute = classes.getAttributeName(key);
                    throw new Error("Missing attribute \"" + attribute + "\"");
                }
            }
        },
        _a["has" + (0,_string_helpers__WEBPACK_IMPORTED_MODULE_1__.capitalize)(name)] = {
            get: function () {
                return this.classes.has(key);
            }
        },
        _a;
}
//# sourceMappingURL=class_properties.js.map

/***/ }),

/***/ "./node_modules/@stimulus/core/dist/context.js":
/*!*****************************************************!*\
  !*** ./node_modules/@stimulus/core/dist/context.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Context": () => (/* binding */ Context)
/* harmony export */ });
/* harmony import */ var _binding_observer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./binding_observer */ "./node_modules/@stimulus/core/dist/binding_observer.js");
/* harmony import */ var _value_observer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./value_observer */ "./node_modules/@stimulus/core/dist/value_observer.js");


var Context = /** @class */ (function () {
    function Context(module, scope) {
        this.module = module;
        this.scope = scope;
        this.controller = new module.controllerConstructor(this);
        this.bindingObserver = new _binding_observer__WEBPACK_IMPORTED_MODULE_0__.BindingObserver(this, this.dispatcher);
        this.valueObserver = new _value_observer__WEBPACK_IMPORTED_MODULE_1__.ValueObserver(this, this.controller);
        try {
            this.controller.initialize();
        }
        catch (error) {
            this.handleError(error, "initializing controller");
        }
    }
    Context.prototype.connect = function () {
        this.bindingObserver.start();
        this.valueObserver.start();
        try {
            this.controller.connect();
        }
        catch (error) {
            this.handleError(error, "connecting controller");
        }
    };
    Context.prototype.disconnect = function () {
        try {
            this.controller.disconnect();
        }
        catch (error) {
            this.handleError(error, "disconnecting controller");
        }
        this.valueObserver.stop();
        this.bindingObserver.stop();
    };
    Object.defineProperty(Context.prototype, "application", {
        get: function () {
            return this.module.application;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Context.prototype, "identifier", {
        get: function () {
            return this.module.identifier;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Context.prototype, "schema", {
        get: function () {
            return this.application.schema;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Context.prototype, "dispatcher", {
        get: function () {
            return this.application.dispatcher;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Context.prototype, "element", {
        get: function () {
            return this.scope.element;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Context.prototype, "parentElement", {
        get: function () {
            return this.element.parentElement;
        },
        enumerable: false,
        configurable: true
    });
    // Error handling
    Context.prototype.handleError = function (error, message, detail) {
        if (detail === void 0) { detail = {}; }
        var _a = this, identifier = _a.identifier, controller = _a.controller, element = _a.element;
        detail = Object.assign({ identifier: identifier, controller: controller, element: element }, detail);
        this.application.handleError(error, "Error " + message, detail);
    };
    return Context;
}());

//# sourceMappingURL=context.js.map

/***/ }),

/***/ "./node_modules/@stimulus/core/dist/controller.js":
/*!********************************************************!*\
  !*** ./node_modules/@stimulus/core/dist/controller.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Controller": () => (/* binding */ Controller)
/* harmony export */ });
/* harmony import */ var _class_properties__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./class_properties */ "./node_modules/@stimulus/core/dist/class_properties.js");
/* harmony import */ var _target_properties__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./target_properties */ "./node_modules/@stimulus/core/dist/target_properties.js");
/* harmony import */ var _value_properties__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./value_properties */ "./node_modules/@stimulus/core/dist/value_properties.js");



var Controller = /** @class */ (function () {
    function Controller(context) {
        this.context = context;
    }
    Object.defineProperty(Controller.prototype, "application", {
        get: function () {
            return this.context.application;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Controller.prototype, "scope", {
        get: function () {
            return this.context.scope;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Controller.prototype, "element", {
        get: function () {
            return this.scope.element;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Controller.prototype, "identifier", {
        get: function () {
            return this.scope.identifier;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Controller.prototype, "targets", {
        get: function () {
            return this.scope.targets;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Controller.prototype, "classes", {
        get: function () {
            return this.scope.classes;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Controller.prototype, "data", {
        get: function () {
            return this.scope.data;
        },
        enumerable: false,
        configurable: true
    });
    Controller.prototype.initialize = function () {
        // Override in your subclass to set up initial controller state
    };
    Controller.prototype.connect = function () {
        // Override in your subclass to respond when the controller is connected to the DOM
    };
    Controller.prototype.disconnect = function () {
        // Override in your subclass to respond when the controller is disconnected from the DOM
    };
    Controller.blessings = [_class_properties__WEBPACK_IMPORTED_MODULE_0__.ClassPropertiesBlessing, _target_properties__WEBPACK_IMPORTED_MODULE_1__.TargetPropertiesBlessing, _value_properties__WEBPACK_IMPORTED_MODULE_2__.ValuePropertiesBlessing];
    Controller.targets = [];
    Controller.values = {};
    return Controller;
}());

//# sourceMappingURL=controller.js.map

/***/ }),

/***/ "./node_modules/@stimulus/core/dist/data_map.js":
/*!******************************************************!*\
  !*** ./node_modules/@stimulus/core/dist/data_map.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DataMap": () => (/* binding */ DataMap)
/* harmony export */ });
/* harmony import */ var _string_helpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./string_helpers */ "./node_modules/@stimulus/core/dist/string_helpers.js");

var DataMap = /** @class */ (function () {
    function DataMap(scope) {
        this.scope = scope;
    }
    Object.defineProperty(DataMap.prototype, "element", {
        get: function () {
            return this.scope.element;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DataMap.prototype, "identifier", {
        get: function () {
            return this.scope.identifier;
        },
        enumerable: false,
        configurable: true
    });
    DataMap.prototype.get = function (key) {
        var name = this.getAttributeNameForKey(key);
        return this.element.getAttribute(name);
    };
    DataMap.prototype.set = function (key, value) {
        var name = this.getAttributeNameForKey(key);
        this.element.setAttribute(name, value);
        return this.get(key);
    };
    DataMap.prototype.has = function (key) {
        var name = this.getAttributeNameForKey(key);
        return this.element.hasAttribute(name);
    };
    DataMap.prototype.delete = function (key) {
        if (this.has(key)) {
            var name_1 = this.getAttributeNameForKey(key);
            this.element.removeAttribute(name_1);
            return true;
        }
        else {
            return false;
        }
    };
    DataMap.prototype.getAttributeNameForKey = function (key) {
        return "data-" + this.identifier + "-" + (0,_string_helpers__WEBPACK_IMPORTED_MODULE_0__.dasherize)(key);
    };
    return DataMap;
}());

//# sourceMappingURL=data_map.js.map

/***/ }),

/***/ "./node_modules/@stimulus/core/dist/definition.js":
/*!********************************************************!*\
  !*** ./node_modules/@stimulus/core/dist/definition.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "blessDefinition": () => (/* binding */ blessDefinition)
/* harmony export */ });
/* harmony import */ var _blessing__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./blessing */ "./node_modules/@stimulus/core/dist/blessing.js");

/** @hidden */
function blessDefinition(definition) {
    return {
        identifier: definition.identifier,
        controllerConstructor: (0,_blessing__WEBPACK_IMPORTED_MODULE_0__.bless)(definition.controllerConstructor)
    };
}
//# sourceMappingURL=definition.js.map

/***/ }),

/***/ "./node_modules/@stimulus/core/dist/dispatcher.js":
/*!********************************************************!*\
  !*** ./node_modules/@stimulus/core/dist/dispatcher.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Dispatcher": () => (/* binding */ Dispatcher)
/* harmony export */ });
/* harmony import */ var _event_listener__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./event_listener */ "./node_modules/@stimulus/core/dist/event_listener.js");

var Dispatcher = /** @class */ (function () {
    function Dispatcher(application) {
        this.application = application;
        this.eventListenerMaps = new Map;
        this.started = false;
    }
    Dispatcher.prototype.start = function () {
        if (!this.started) {
            this.started = true;
            this.eventListeners.forEach(function (eventListener) { return eventListener.connect(); });
        }
    };
    Dispatcher.prototype.stop = function () {
        if (this.started) {
            this.started = false;
            this.eventListeners.forEach(function (eventListener) { return eventListener.disconnect(); });
        }
    };
    Object.defineProperty(Dispatcher.prototype, "eventListeners", {
        get: function () {
            return Array.from(this.eventListenerMaps.values())
                .reduce(function (listeners, map) { return listeners.concat(Array.from(map.values())); }, []);
        },
        enumerable: false,
        configurable: true
    });
    // Binding observer delegate
    /** @hidden */
    Dispatcher.prototype.bindingConnected = function (binding) {
        this.fetchEventListenerForBinding(binding).bindingConnected(binding);
    };
    /** @hidden */
    Dispatcher.prototype.bindingDisconnected = function (binding) {
        this.fetchEventListenerForBinding(binding).bindingDisconnected(binding);
    };
    // Error handling
    Dispatcher.prototype.handleError = function (error, message, detail) {
        if (detail === void 0) { detail = {}; }
        this.application.handleError(error, "Error " + message, detail);
    };
    Dispatcher.prototype.fetchEventListenerForBinding = function (binding) {
        var eventTarget = binding.eventTarget, eventName = binding.eventName, eventOptions = binding.eventOptions;
        return this.fetchEventListener(eventTarget, eventName, eventOptions);
    };
    Dispatcher.prototype.fetchEventListener = function (eventTarget, eventName, eventOptions) {
        var eventListenerMap = this.fetchEventListenerMapForEventTarget(eventTarget);
        var cacheKey = this.cacheKey(eventName, eventOptions);
        var eventListener = eventListenerMap.get(cacheKey);
        if (!eventListener) {
            eventListener = this.createEventListener(eventTarget, eventName, eventOptions);
            eventListenerMap.set(cacheKey, eventListener);
        }
        return eventListener;
    };
    Dispatcher.prototype.createEventListener = function (eventTarget, eventName, eventOptions) {
        var eventListener = new _event_listener__WEBPACK_IMPORTED_MODULE_0__.EventListener(eventTarget, eventName, eventOptions);
        if (this.started) {
            eventListener.connect();
        }
        return eventListener;
    };
    Dispatcher.prototype.fetchEventListenerMapForEventTarget = function (eventTarget) {
        var eventListenerMap = this.eventListenerMaps.get(eventTarget);
        if (!eventListenerMap) {
            eventListenerMap = new Map;
            this.eventListenerMaps.set(eventTarget, eventListenerMap);
        }
        return eventListenerMap;
    };
    Dispatcher.prototype.cacheKey = function (eventName, eventOptions) {
        var parts = [eventName];
        Object.keys(eventOptions).sort().forEach(function (key) {
            parts.push("" + (eventOptions[key] ? "" : "!") + key);
        });
        return parts.join(":");
    };
    return Dispatcher;
}());

//# sourceMappingURL=dispatcher.js.map

/***/ }),

/***/ "./node_modules/@stimulus/core/dist/event_listener.js":
/*!************************************************************!*\
  !*** ./node_modules/@stimulus/core/dist/event_listener.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "EventListener": () => (/* binding */ EventListener)
/* harmony export */ });
var EventListener = /** @class */ (function () {
    function EventListener(eventTarget, eventName, eventOptions) {
        this.eventTarget = eventTarget;
        this.eventName = eventName;
        this.eventOptions = eventOptions;
        this.unorderedBindings = new Set();
    }
    EventListener.prototype.connect = function () {
        this.eventTarget.addEventListener(this.eventName, this, this.eventOptions);
    };
    EventListener.prototype.disconnect = function () {
        this.eventTarget.removeEventListener(this.eventName, this, this.eventOptions);
    };
    // Binding observer delegate
    /** @hidden */
    EventListener.prototype.bindingConnected = function (binding) {
        this.unorderedBindings.add(binding);
    };
    /** @hidden */
    EventListener.prototype.bindingDisconnected = function (binding) {
        this.unorderedBindings.delete(binding);
    };
    EventListener.prototype.handleEvent = function (event) {
        var extendedEvent = extendEvent(event);
        for (var _i = 0, _a = this.bindings; _i < _a.length; _i++) {
            var binding = _a[_i];
            if (extendedEvent.immediatePropagationStopped) {
                break;
            }
            else {
                binding.handleEvent(extendedEvent);
            }
        }
    };
    Object.defineProperty(EventListener.prototype, "bindings", {
        get: function () {
            return Array.from(this.unorderedBindings).sort(function (left, right) {
                var leftIndex = left.index, rightIndex = right.index;
                return leftIndex < rightIndex ? -1 : leftIndex > rightIndex ? 1 : 0;
            });
        },
        enumerable: false,
        configurable: true
    });
    return EventListener;
}());

function extendEvent(event) {
    if ("immediatePropagationStopped" in event) {
        return event;
    }
    else {
        var stopImmediatePropagation_1 = event.stopImmediatePropagation;
        return Object.assign(event, {
            immediatePropagationStopped: false,
            stopImmediatePropagation: function () {
                this.immediatePropagationStopped = true;
                stopImmediatePropagation_1.call(this);
            }
        });
    }
}
//# sourceMappingURL=event_listener.js.map

/***/ }),

/***/ "./node_modules/@stimulus/core/dist/guide.js":
/*!***************************************************!*\
  !*** ./node_modules/@stimulus/core/dist/guide.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Guide": () => (/* binding */ Guide)
/* harmony export */ });
var Guide = /** @class */ (function () {
    function Guide(logger) {
        this.warnedKeysByObject = new WeakMap;
        this.logger = logger;
    }
    Guide.prototype.warn = function (object, key, message) {
        var warnedKeys = this.warnedKeysByObject.get(object);
        if (!warnedKeys) {
            warnedKeys = new Set;
            this.warnedKeysByObject.set(object, warnedKeys);
        }
        if (!warnedKeys.has(key)) {
            warnedKeys.add(key);
            this.logger.warn(message, object);
        }
    };
    return Guide;
}());

//# sourceMappingURL=guide.js.map

/***/ }),

/***/ "./node_modules/@stimulus/core/dist/index.js":
/*!***************************************************!*\
  !*** ./node_modules/@stimulus/core/dist/index.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Application": () => (/* reexport safe */ _application__WEBPACK_IMPORTED_MODULE_0__.Application),
/* harmony export */   "Context": () => (/* reexport safe */ _context__WEBPACK_IMPORTED_MODULE_1__.Context),
/* harmony export */   "Controller": () => (/* reexport safe */ _controller__WEBPACK_IMPORTED_MODULE_2__.Controller),
/* harmony export */   "defaultSchema": () => (/* reexport safe */ _schema__WEBPACK_IMPORTED_MODULE_3__.defaultSchema)
/* harmony export */ });
/* harmony import */ var _application__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./application */ "./node_modules/@stimulus/core/dist/application.js");
/* harmony import */ var _context__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./context */ "./node_modules/@stimulus/core/dist/context.js");
/* harmony import */ var _controller__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./controller */ "./node_modules/@stimulus/core/dist/controller.js");
/* harmony import */ var _schema__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./schema */ "./node_modules/@stimulus/core/dist/schema.js");




//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/@stimulus/core/dist/inheritable_statics.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@stimulus/core/dist/inheritable_statics.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "readInheritableStaticArrayValues": () => (/* binding */ readInheritableStaticArrayValues),
/* harmony export */   "readInheritableStaticObjectPairs": () => (/* binding */ readInheritableStaticObjectPairs)
/* harmony export */ });
function readInheritableStaticArrayValues(constructor, propertyName) {
    var ancestors = getAncestorsForConstructor(constructor);
    return Array.from(ancestors.reduce(function (values, constructor) {
        getOwnStaticArrayValues(constructor, propertyName).forEach(function (name) { return values.add(name); });
        return values;
    }, new Set));
}
function readInheritableStaticObjectPairs(constructor, propertyName) {
    var ancestors = getAncestorsForConstructor(constructor);
    return ancestors.reduce(function (pairs, constructor) {
        pairs.push.apply(pairs, getOwnStaticObjectPairs(constructor, propertyName));
        return pairs;
    }, []);
}
function getAncestorsForConstructor(constructor) {
    var ancestors = [];
    while (constructor) {
        ancestors.push(constructor);
        constructor = Object.getPrototypeOf(constructor);
    }
    return ancestors.reverse();
}
function getOwnStaticArrayValues(constructor, propertyName) {
    var definition = constructor[propertyName];
    return Array.isArray(definition) ? definition : [];
}
function getOwnStaticObjectPairs(constructor, propertyName) {
    var definition = constructor[propertyName];
    return definition ? Object.keys(definition).map(function (key) { return [key, definition[key]]; }) : [];
}
//# sourceMappingURL=inheritable_statics.js.map

/***/ }),

/***/ "./node_modules/@stimulus/core/dist/module.js":
/*!****************************************************!*\
  !*** ./node_modules/@stimulus/core/dist/module.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Module": () => (/* binding */ Module)
/* harmony export */ });
/* harmony import */ var _context__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./context */ "./node_modules/@stimulus/core/dist/context.js");
/* harmony import */ var _definition__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./definition */ "./node_modules/@stimulus/core/dist/definition.js");


var Module = /** @class */ (function () {
    function Module(application, definition) {
        this.application = application;
        this.definition = (0,_definition__WEBPACK_IMPORTED_MODULE_1__.blessDefinition)(definition);
        this.contextsByScope = new WeakMap;
        this.connectedContexts = new Set;
    }
    Object.defineProperty(Module.prototype, "identifier", {
        get: function () {
            return this.definition.identifier;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Module.prototype, "controllerConstructor", {
        get: function () {
            return this.definition.controllerConstructor;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Module.prototype, "contexts", {
        get: function () {
            return Array.from(this.connectedContexts);
        },
        enumerable: false,
        configurable: true
    });
    Module.prototype.connectContextForScope = function (scope) {
        var context = this.fetchContextForScope(scope);
        this.connectedContexts.add(context);
        context.connect();
    };
    Module.prototype.disconnectContextForScope = function (scope) {
        var context = this.contextsByScope.get(scope);
        if (context) {
            this.connectedContexts.delete(context);
            context.disconnect();
        }
    };
    Module.prototype.fetchContextForScope = function (scope) {
        var context = this.contextsByScope.get(scope);
        if (!context) {
            context = new _context__WEBPACK_IMPORTED_MODULE_0__.Context(this, scope);
            this.contextsByScope.set(scope, context);
        }
        return context;
    };
    return Module;
}());

//# sourceMappingURL=module.js.map

/***/ }),

/***/ "./node_modules/@stimulus/core/dist/router.js":
/*!****************************************************!*\
  !*** ./node_modules/@stimulus/core/dist/router.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Router": () => (/* binding */ Router)
/* harmony export */ });
/* harmony import */ var _module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./module */ "./node_modules/@stimulus/core/dist/module.js");
/* harmony import */ var _stimulus_multimap__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @stimulus/multimap */ "./node_modules/@stimulus/multimap/dist/index.js");
/* harmony import */ var _scope__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./scope */ "./node_modules/@stimulus/core/dist/scope.js");
/* harmony import */ var _scope_observer__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./scope_observer */ "./node_modules/@stimulus/core/dist/scope_observer.js");




var Router = /** @class */ (function () {
    function Router(application) {
        this.application = application;
        this.scopeObserver = new _scope_observer__WEBPACK_IMPORTED_MODULE_3__.ScopeObserver(this.element, this.schema, this);
        this.scopesByIdentifier = new _stimulus_multimap__WEBPACK_IMPORTED_MODULE_1__.Multimap;
        this.modulesByIdentifier = new Map;
    }
    Object.defineProperty(Router.prototype, "element", {
        get: function () {
            return this.application.element;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Router.prototype, "schema", {
        get: function () {
            return this.application.schema;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Router.prototype, "logger", {
        get: function () {
            return this.application.logger;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Router.prototype, "controllerAttribute", {
        get: function () {
            return this.schema.controllerAttribute;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Router.prototype, "modules", {
        get: function () {
            return Array.from(this.modulesByIdentifier.values());
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Router.prototype, "contexts", {
        get: function () {
            return this.modules.reduce(function (contexts, module) { return contexts.concat(module.contexts); }, []);
        },
        enumerable: false,
        configurable: true
    });
    Router.prototype.start = function () {
        this.scopeObserver.start();
    };
    Router.prototype.stop = function () {
        this.scopeObserver.stop();
    };
    Router.prototype.loadDefinition = function (definition) {
        this.unloadIdentifier(definition.identifier);
        var module = new _module__WEBPACK_IMPORTED_MODULE_0__.Module(this.application, definition);
        this.connectModule(module);
    };
    Router.prototype.unloadIdentifier = function (identifier) {
        var module = this.modulesByIdentifier.get(identifier);
        if (module) {
            this.disconnectModule(module);
        }
    };
    Router.prototype.getContextForElementAndIdentifier = function (element, identifier) {
        var module = this.modulesByIdentifier.get(identifier);
        if (module) {
            return module.contexts.find(function (context) { return context.element == element; });
        }
    };
    // Error handler delegate
    /** @hidden */
    Router.prototype.handleError = function (error, message, detail) {
        this.application.handleError(error, message, detail);
    };
    // Scope observer delegate
    /** @hidden */
    Router.prototype.createScopeForElementAndIdentifier = function (element, identifier) {
        return new _scope__WEBPACK_IMPORTED_MODULE_2__.Scope(this.schema, element, identifier, this.logger);
    };
    /** @hidden */
    Router.prototype.scopeConnected = function (scope) {
        this.scopesByIdentifier.add(scope.identifier, scope);
        var module = this.modulesByIdentifier.get(scope.identifier);
        if (module) {
            module.connectContextForScope(scope);
        }
    };
    /** @hidden */
    Router.prototype.scopeDisconnected = function (scope) {
        this.scopesByIdentifier.delete(scope.identifier, scope);
        var module = this.modulesByIdentifier.get(scope.identifier);
        if (module) {
            module.disconnectContextForScope(scope);
        }
    };
    // Modules
    Router.prototype.connectModule = function (module) {
        this.modulesByIdentifier.set(module.identifier, module);
        var scopes = this.scopesByIdentifier.getValuesForKey(module.identifier);
        scopes.forEach(function (scope) { return module.connectContextForScope(scope); });
    };
    Router.prototype.disconnectModule = function (module) {
        this.modulesByIdentifier.delete(module.identifier);
        var scopes = this.scopesByIdentifier.getValuesForKey(module.identifier);
        scopes.forEach(function (scope) { return module.disconnectContextForScope(scope); });
    };
    return Router;
}());

//# sourceMappingURL=router.js.map

/***/ }),

/***/ "./node_modules/@stimulus/core/dist/schema.js":
/*!****************************************************!*\
  !*** ./node_modules/@stimulus/core/dist/schema.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "defaultSchema": () => (/* binding */ defaultSchema)
/* harmony export */ });
var defaultSchema = {
    controllerAttribute: "data-controller",
    actionAttribute: "data-action",
    targetAttribute: "data-target"
};
//# sourceMappingURL=schema.js.map

/***/ }),

/***/ "./node_modules/@stimulus/core/dist/scope.js":
/*!***************************************************!*\
  !*** ./node_modules/@stimulus/core/dist/scope.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Scope": () => (/* binding */ Scope)
/* harmony export */ });
/* harmony import */ var _class_map__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./class_map */ "./node_modules/@stimulus/core/dist/class_map.js");
/* harmony import */ var _data_map__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./data_map */ "./node_modules/@stimulus/core/dist/data_map.js");
/* harmony import */ var _guide__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./guide */ "./node_modules/@stimulus/core/dist/guide.js");
/* harmony import */ var _selectors__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./selectors */ "./node_modules/@stimulus/core/dist/selectors.js");
/* harmony import */ var _target_set__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./target_set */ "./node_modules/@stimulus/core/dist/target_set.js");
var __spreadArrays = (undefined && undefined.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};





var Scope = /** @class */ (function () {
    function Scope(schema, element, identifier, logger) {
        var _this = this;
        this.targets = new _target_set__WEBPACK_IMPORTED_MODULE_4__.TargetSet(this);
        this.classes = new _class_map__WEBPACK_IMPORTED_MODULE_0__.ClassMap(this);
        this.data = new _data_map__WEBPACK_IMPORTED_MODULE_1__.DataMap(this);
        this.containsElement = function (element) {
            return element.closest(_this.controllerSelector) === _this.element;
        };
        this.schema = schema;
        this.element = element;
        this.identifier = identifier;
        this.guide = new _guide__WEBPACK_IMPORTED_MODULE_2__.Guide(logger);
    }
    Scope.prototype.findElement = function (selector) {
        return this.element.matches(selector)
            ? this.element
            : this.queryElements(selector).find(this.containsElement);
    };
    Scope.prototype.findAllElements = function (selector) {
        return __spreadArrays(this.element.matches(selector) ? [this.element] : [], this.queryElements(selector).filter(this.containsElement));
    };
    Scope.prototype.queryElements = function (selector) {
        return Array.from(this.element.querySelectorAll(selector));
    };
    Object.defineProperty(Scope.prototype, "controllerSelector", {
        get: function () {
            return (0,_selectors__WEBPACK_IMPORTED_MODULE_3__.attributeValueContainsToken)(this.schema.controllerAttribute, this.identifier);
        },
        enumerable: false,
        configurable: true
    });
    return Scope;
}());

//# sourceMappingURL=scope.js.map

/***/ }),

/***/ "./node_modules/@stimulus/core/dist/scope_observer.js":
/*!************************************************************!*\
  !*** ./node_modules/@stimulus/core/dist/scope_observer.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ScopeObserver": () => (/* binding */ ScopeObserver)
/* harmony export */ });
/* harmony import */ var _stimulus_mutation_observers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @stimulus/mutation-observers */ "./node_modules/@stimulus/mutation-observers/dist/index.js");

var ScopeObserver = /** @class */ (function () {
    function ScopeObserver(element, schema, delegate) {
        this.element = element;
        this.schema = schema;
        this.delegate = delegate;
        this.valueListObserver = new _stimulus_mutation_observers__WEBPACK_IMPORTED_MODULE_0__.ValueListObserver(this.element, this.controllerAttribute, this);
        this.scopesByIdentifierByElement = new WeakMap;
        this.scopeReferenceCounts = new WeakMap;
    }
    ScopeObserver.prototype.start = function () {
        this.valueListObserver.start();
    };
    ScopeObserver.prototype.stop = function () {
        this.valueListObserver.stop();
    };
    Object.defineProperty(ScopeObserver.prototype, "controllerAttribute", {
        get: function () {
            return this.schema.controllerAttribute;
        },
        enumerable: false,
        configurable: true
    });
    // Value observer delegate
    /** @hidden */
    ScopeObserver.prototype.parseValueForToken = function (token) {
        var element = token.element, identifier = token.content;
        var scopesByIdentifier = this.fetchScopesByIdentifierForElement(element);
        var scope = scopesByIdentifier.get(identifier);
        if (!scope) {
            scope = this.delegate.createScopeForElementAndIdentifier(element, identifier);
            scopesByIdentifier.set(identifier, scope);
        }
        return scope;
    };
    /** @hidden */
    ScopeObserver.prototype.elementMatchedValue = function (element, value) {
        var referenceCount = (this.scopeReferenceCounts.get(value) || 0) + 1;
        this.scopeReferenceCounts.set(value, referenceCount);
        if (referenceCount == 1) {
            this.delegate.scopeConnected(value);
        }
    };
    /** @hidden */
    ScopeObserver.prototype.elementUnmatchedValue = function (element, value) {
        var referenceCount = this.scopeReferenceCounts.get(value);
        if (referenceCount) {
            this.scopeReferenceCounts.set(value, referenceCount - 1);
            if (referenceCount == 1) {
                this.delegate.scopeDisconnected(value);
            }
        }
    };
    ScopeObserver.prototype.fetchScopesByIdentifierForElement = function (element) {
        var scopesByIdentifier = this.scopesByIdentifierByElement.get(element);
        if (!scopesByIdentifier) {
            scopesByIdentifier = new Map;
            this.scopesByIdentifierByElement.set(element, scopesByIdentifier);
        }
        return scopesByIdentifier;
    };
    return ScopeObserver;
}());

//# sourceMappingURL=scope_observer.js.map

/***/ }),

/***/ "./node_modules/@stimulus/core/dist/selectors.js":
/*!*******************************************************!*\
  !*** ./node_modules/@stimulus/core/dist/selectors.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "attributeValueContainsToken": () => (/* binding */ attributeValueContainsToken)
/* harmony export */ });
/** @hidden */
function attributeValueContainsToken(attributeName, token) {
    return "[" + attributeName + "~=\"" + token + "\"]";
}
//# sourceMappingURL=selectors.js.map

/***/ }),

/***/ "./node_modules/@stimulus/core/dist/string_helpers.js":
/*!************************************************************!*\
  !*** ./node_modules/@stimulus/core/dist/string_helpers.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "camelize": () => (/* binding */ camelize),
/* harmony export */   "capitalize": () => (/* binding */ capitalize),
/* harmony export */   "dasherize": () => (/* binding */ dasherize)
/* harmony export */ });
function camelize(value) {
    return value.replace(/(?:[_-])([a-z0-9])/g, function (_, char) { return char.toUpperCase(); });
}
function capitalize(value) {
    return value.charAt(0).toUpperCase() + value.slice(1);
}
function dasherize(value) {
    return value.replace(/([A-Z])/g, function (_, char) { return "-" + char.toLowerCase(); });
}
//# sourceMappingURL=string_helpers.js.map

/***/ }),

/***/ "./node_modules/@stimulus/core/dist/target_properties.js":
/*!***************************************************************!*\
  !*** ./node_modules/@stimulus/core/dist/target_properties.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TargetPropertiesBlessing": () => (/* binding */ TargetPropertiesBlessing)
/* harmony export */ });
/* harmony import */ var _inheritable_statics__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./inheritable_statics */ "./node_modules/@stimulus/core/dist/inheritable_statics.js");
/* harmony import */ var _string_helpers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./string_helpers */ "./node_modules/@stimulus/core/dist/string_helpers.js");


/** @hidden */
function TargetPropertiesBlessing(constructor) {
    var targets = (0,_inheritable_statics__WEBPACK_IMPORTED_MODULE_0__.readInheritableStaticArrayValues)(constructor, "targets");
    return targets.reduce(function (properties, targetDefinition) {
        return Object.assign(properties, propertiesForTargetDefinition(targetDefinition));
    }, {});
}
function propertiesForTargetDefinition(name) {
    var _a;
    return _a = {},
        _a[name + "Target"] = {
            get: function () {
                var target = this.targets.find(name);
                if (target) {
                    return target;
                }
                else {
                    throw new Error("Missing target element \"" + this.identifier + "." + name + "\"");
                }
            }
        },
        _a[name + "Targets"] = {
            get: function () {
                return this.targets.findAll(name);
            }
        },
        _a["has" + (0,_string_helpers__WEBPACK_IMPORTED_MODULE_1__.capitalize)(name) + "Target"] = {
            get: function () {
                return this.targets.has(name);
            }
        },
        _a;
}
//# sourceMappingURL=target_properties.js.map

/***/ }),

/***/ "./node_modules/@stimulus/core/dist/target_set.js":
/*!********************************************************!*\
  !*** ./node_modules/@stimulus/core/dist/target_set.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TargetSet": () => (/* binding */ TargetSet)
/* harmony export */ });
/* harmony import */ var _selectors__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./selectors */ "./node_modules/@stimulus/core/dist/selectors.js");
var __spreadArrays = (undefined && undefined.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};

var TargetSet = /** @class */ (function () {
    function TargetSet(scope) {
        this.scope = scope;
    }
    Object.defineProperty(TargetSet.prototype, "element", {
        get: function () {
            return this.scope.element;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TargetSet.prototype, "identifier", {
        get: function () {
            return this.scope.identifier;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TargetSet.prototype, "schema", {
        get: function () {
            return this.scope.schema;
        },
        enumerable: false,
        configurable: true
    });
    TargetSet.prototype.has = function (targetName) {
        return this.find(targetName) != null;
    };
    TargetSet.prototype.find = function () {
        var _this = this;
        var targetNames = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            targetNames[_i] = arguments[_i];
        }
        return targetNames.reduce(function (target, targetName) {
            return target
                || _this.findTarget(targetName)
                || _this.findLegacyTarget(targetName);
        }, undefined);
    };
    TargetSet.prototype.findAll = function () {
        var _this = this;
        var targetNames = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            targetNames[_i] = arguments[_i];
        }
        return targetNames.reduce(function (targets, targetName) { return __spreadArrays(targets, _this.findAllTargets(targetName), _this.findAllLegacyTargets(targetName)); }, []);
    };
    TargetSet.prototype.findTarget = function (targetName) {
        var selector = this.getSelectorForTargetName(targetName);
        return this.scope.findElement(selector);
    };
    TargetSet.prototype.findAllTargets = function (targetName) {
        var selector = this.getSelectorForTargetName(targetName);
        return this.scope.findAllElements(selector);
    };
    TargetSet.prototype.getSelectorForTargetName = function (targetName) {
        var attributeName = "data-" + this.identifier + "-target";
        return (0,_selectors__WEBPACK_IMPORTED_MODULE_0__.attributeValueContainsToken)(attributeName, targetName);
    };
    TargetSet.prototype.findLegacyTarget = function (targetName) {
        var selector = this.getLegacySelectorForTargetName(targetName);
        return this.deprecate(this.scope.findElement(selector), targetName);
    };
    TargetSet.prototype.findAllLegacyTargets = function (targetName) {
        var _this = this;
        var selector = this.getLegacySelectorForTargetName(targetName);
        return this.scope.findAllElements(selector).map(function (element) { return _this.deprecate(element, targetName); });
    };
    TargetSet.prototype.getLegacySelectorForTargetName = function (targetName) {
        var targetDescriptor = this.identifier + "." + targetName;
        return (0,_selectors__WEBPACK_IMPORTED_MODULE_0__.attributeValueContainsToken)(this.schema.targetAttribute, targetDescriptor);
    };
    TargetSet.prototype.deprecate = function (element, targetName) {
        if (element) {
            var identifier = this.identifier;
            var attributeName = this.schema.targetAttribute;
            this.guide.warn(element, "target:" + targetName, "Please replace " + attributeName + "=\"" + identifier + "." + targetName + "\" with data-" + identifier + "-target=\"" + targetName + "\". " +
                ("The " + attributeName + " attribute is deprecated and will be removed in a future version of Stimulus."));
        }
        return element;
    };
    Object.defineProperty(TargetSet.prototype, "guide", {
        get: function () {
            return this.scope.guide;
        },
        enumerable: false,
        configurable: true
    });
    return TargetSet;
}());

//# sourceMappingURL=target_set.js.map

/***/ }),

/***/ "./node_modules/@stimulus/core/dist/value_observer.js":
/*!************************************************************!*\
  !*** ./node_modules/@stimulus/core/dist/value_observer.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ValueObserver": () => (/* binding */ ValueObserver)
/* harmony export */ });
/* harmony import */ var _stimulus_mutation_observers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @stimulus/mutation-observers */ "./node_modules/@stimulus/mutation-observers/dist/index.js");

var ValueObserver = /** @class */ (function () {
    function ValueObserver(context, receiver) {
        this.context = context;
        this.receiver = receiver;
        this.stringMapObserver = new _stimulus_mutation_observers__WEBPACK_IMPORTED_MODULE_0__.StringMapObserver(this.element, this);
        this.valueDescriptorMap = this.controller.valueDescriptorMap;
        this.invokeChangedCallbacksForDefaultValues();
    }
    ValueObserver.prototype.start = function () {
        this.stringMapObserver.start();
    };
    ValueObserver.prototype.stop = function () {
        this.stringMapObserver.stop();
    };
    Object.defineProperty(ValueObserver.prototype, "element", {
        get: function () {
            return this.context.element;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ValueObserver.prototype, "controller", {
        get: function () {
            return this.context.controller;
        },
        enumerable: false,
        configurable: true
    });
    // String map observer delegate
    ValueObserver.prototype.getStringMapKeyForAttribute = function (attributeName) {
        if (attributeName in this.valueDescriptorMap) {
            return this.valueDescriptorMap[attributeName].name;
        }
    };
    ValueObserver.prototype.stringMapValueChanged = function (attributeValue, name) {
        this.invokeChangedCallbackForValue(name);
    };
    ValueObserver.prototype.invokeChangedCallbacksForDefaultValues = function () {
        for (var _i = 0, _a = this.valueDescriptors; _i < _a.length; _i++) {
            var _b = _a[_i], key = _b.key, name_1 = _b.name, defaultValue = _b.defaultValue;
            if (defaultValue != undefined && !this.controller.data.has(key)) {
                this.invokeChangedCallbackForValue(name_1);
            }
        }
    };
    ValueObserver.prototype.invokeChangedCallbackForValue = function (name) {
        var methodName = name + "Changed";
        var method = this.receiver[methodName];
        if (typeof method == "function") {
            var value = this.receiver[name];
            method.call(this.receiver, value);
        }
    };
    Object.defineProperty(ValueObserver.prototype, "valueDescriptors", {
        get: function () {
            var valueDescriptorMap = this.valueDescriptorMap;
            return Object.keys(valueDescriptorMap).map(function (key) { return valueDescriptorMap[key]; });
        },
        enumerable: false,
        configurable: true
    });
    return ValueObserver;
}());

//# sourceMappingURL=value_observer.js.map

/***/ }),

/***/ "./node_modules/@stimulus/core/dist/value_properties.js":
/*!**************************************************************!*\
  !*** ./node_modules/@stimulus/core/dist/value_properties.js ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ValuePropertiesBlessing": () => (/* binding */ ValuePropertiesBlessing),
/* harmony export */   "propertiesForValueDefinitionPair": () => (/* binding */ propertiesForValueDefinitionPair)
/* harmony export */ });
/* harmony import */ var _inheritable_statics__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./inheritable_statics */ "./node_modules/@stimulus/core/dist/inheritable_statics.js");
/* harmony import */ var _string_helpers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./string_helpers */ "./node_modules/@stimulus/core/dist/string_helpers.js");


/** @hidden */
function ValuePropertiesBlessing(constructor) {
    var valueDefinitionPairs = (0,_inheritable_statics__WEBPACK_IMPORTED_MODULE_0__.readInheritableStaticObjectPairs)(constructor, "values");
    var propertyDescriptorMap = {
        valueDescriptorMap: {
            get: function () {
                var _this = this;
                return valueDefinitionPairs.reduce(function (result, valueDefinitionPair) {
                    var _a;
                    var valueDescriptor = parseValueDefinitionPair(valueDefinitionPair);
                    var attributeName = _this.data.getAttributeNameForKey(valueDescriptor.key);
                    return Object.assign(result, (_a = {}, _a[attributeName] = valueDescriptor, _a));
                }, {});
            }
        }
    };
    return valueDefinitionPairs.reduce(function (properties, valueDefinitionPair) {
        return Object.assign(properties, propertiesForValueDefinitionPair(valueDefinitionPair));
    }, propertyDescriptorMap);
}
/** @hidden */
function propertiesForValueDefinitionPair(valueDefinitionPair) {
    var _a;
    var definition = parseValueDefinitionPair(valueDefinitionPair);
    var type = definition.type, key = definition.key, name = definition.name;
    var read = readers[type], write = writers[type] || writers.default;
    return _a = {},
        _a[name] = {
            get: function () {
                var value = this.data.get(key);
                if (value !== null) {
                    return read(value);
                }
                else {
                    return definition.defaultValue;
                }
            },
            set: function (value) {
                if (value === undefined) {
                    this.data.delete(key);
                }
                else {
                    this.data.set(key, write(value));
                }
            }
        },
        _a["has" + (0,_string_helpers__WEBPACK_IMPORTED_MODULE_1__.capitalize)(name)] = {
            get: function () {
                return this.data.has(key);
            }
        },
        _a;
}
function parseValueDefinitionPair(_a) {
    var token = _a[0], typeConstant = _a[1];
    var type = parseValueTypeConstant(typeConstant);
    return valueDescriptorForTokenAndType(token, type);
}
function parseValueTypeConstant(typeConstant) {
    switch (typeConstant) {
        case Array: return "array";
        case Boolean: return "boolean";
        case Number: return "number";
        case Object: return "object";
        case String: return "string";
    }
    throw new Error("Unknown value type constant \"" + typeConstant + "\"");
}
function valueDescriptorForTokenAndType(token, type) {
    var key = (0,_string_helpers__WEBPACK_IMPORTED_MODULE_1__.dasherize)(token) + "-value";
    return {
        type: type,
        key: key,
        name: (0,_string_helpers__WEBPACK_IMPORTED_MODULE_1__.camelize)(key),
        get defaultValue() { return defaultValuesByType[type]; }
    };
}
var defaultValuesByType = {
    get array() { return []; },
    boolean: false,
    number: 0,
    get object() { return {}; },
    string: ""
};
var readers = {
    array: function (value) {
        var array = JSON.parse(value);
        if (!Array.isArray(array)) {
            throw new TypeError("Expected array");
        }
        return array;
    },
    boolean: function (value) {
        return !(value == "0" || value == "false");
    },
    number: function (value) {
        return parseFloat(value);
    },
    object: function (value) {
        var object = JSON.parse(value);
        if (object === null || typeof object != "object" || Array.isArray(object)) {
            throw new TypeError("Expected object");
        }
        return object;
    },
    string: function (value) {
        return value;
    }
};
var writers = {
    default: writeString,
    array: writeJSON,
    object: writeJSON
};
function writeJSON(value) {
    return JSON.stringify(value);
}
function writeString(value) {
    return "" + value;
}
//# sourceMappingURL=value_properties.js.map

/***/ }),

/***/ "./node_modules/@stimulus/multimap/dist/index.js":
/*!*******************************************************!*\
  !*** ./node_modules/@stimulus/multimap/dist/index.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "IndexedMultimap": () => (/* reexport safe */ _indexed_multimap__WEBPACK_IMPORTED_MODULE_0__.IndexedMultimap),
/* harmony export */   "Multimap": () => (/* reexport safe */ _multimap__WEBPACK_IMPORTED_MODULE_1__.Multimap),
/* harmony export */   "add": () => (/* reexport safe */ _set_operations__WEBPACK_IMPORTED_MODULE_2__.add),
/* harmony export */   "del": () => (/* reexport safe */ _set_operations__WEBPACK_IMPORTED_MODULE_2__.del),
/* harmony export */   "fetch": () => (/* reexport safe */ _set_operations__WEBPACK_IMPORTED_MODULE_2__.fetch),
/* harmony export */   "prune": () => (/* reexport safe */ _set_operations__WEBPACK_IMPORTED_MODULE_2__.prune)
/* harmony export */ });
/* harmony import */ var _indexed_multimap__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./indexed_multimap */ "./node_modules/@stimulus/multimap/dist/indexed_multimap.js");
/* harmony import */ var _multimap__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./multimap */ "./node_modules/@stimulus/multimap/dist/multimap.js");
/* harmony import */ var _set_operations__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./set_operations */ "./node_modules/@stimulus/multimap/dist/set_operations.js");



//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/@stimulus/multimap/dist/indexed_multimap.js":
/*!******************************************************************!*\
  !*** ./node_modules/@stimulus/multimap/dist/indexed_multimap.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "IndexedMultimap": () => (/* binding */ IndexedMultimap)
/* harmony export */ });
/* harmony import */ var _multimap__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./multimap */ "./node_modules/@stimulus/multimap/dist/multimap.js");
/* harmony import */ var _set_operations__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./set_operations */ "./node_modules/@stimulus/multimap/dist/set_operations.js");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();


var IndexedMultimap = /** @class */ (function (_super) {
    __extends(IndexedMultimap, _super);
    function IndexedMultimap() {
        var _this = _super.call(this) || this;
        _this.keysByValue = new Map;
        return _this;
    }
    Object.defineProperty(IndexedMultimap.prototype, "values", {
        get: function () {
            return Array.from(this.keysByValue.keys());
        },
        enumerable: false,
        configurable: true
    });
    IndexedMultimap.prototype.add = function (key, value) {
        _super.prototype.add.call(this, key, value);
        (0,_set_operations__WEBPACK_IMPORTED_MODULE_1__.add)(this.keysByValue, value, key);
    };
    IndexedMultimap.prototype.delete = function (key, value) {
        _super.prototype.delete.call(this, key, value);
        (0,_set_operations__WEBPACK_IMPORTED_MODULE_1__.del)(this.keysByValue, value, key);
    };
    IndexedMultimap.prototype.hasValue = function (value) {
        return this.keysByValue.has(value);
    };
    IndexedMultimap.prototype.getKeysForValue = function (value) {
        var set = this.keysByValue.get(value);
        return set ? Array.from(set) : [];
    };
    return IndexedMultimap;
}(_multimap__WEBPACK_IMPORTED_MODULE_0__.Multimap));

//# sourceMappingURL=indexed_multimap.js.map

/***/ }),

/***/ "./node_modules/@stimulus/multimap/dist/multimap.js":
/*!**********************************************************!*\
  !*** ./node_modules/@stimulus/multimap/dist/multimap.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Multimap": () => (/* binding */ Multimap)
/* harmony export */ });
/* harmony import */ var _set_operations__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./set_operations */ "./node_modules/@stimulus/multimap/dist/set_operations.js");

var Multimap = /** @class */ (function () {
    function Multimap() {
        this.valuesByKey = new Map();
    }
    Object.defineProperty(Multimap.prototype, "values", {
        get: function () {
            var sets = Array.from(this.valuesByKey.values());
            return sets.reduce(function (values, set) { return values.concat(Array.from(set)); }, []);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Multimap.prototype, "size", {
        get: function () {
            var sets = Array.from(this.valuesByKey.values());
            return sets.reduce(function (size, set) { return size + set.size; }, 0);
        },
        enumerable: false,
        configurable: true
    });
    Multimap.prototype.add = function (key, value) {
        (0,_set_operations__WEBPACK_IMPORTED_MODULE_0__.add)(this.valuesByKey, key, value);
    };
    Multimap.prototype.delete = function (key, value) {
        (0,_set_operations__WEBPACK_IMPORTED_MODULE_0__.del)(this.valuesByKey, key, value);
    };
    Multimap.prototype.has = function (key, value) {
        var values = this.valuesByKey.get(key);
        return values != null && values.has(value);
    };
    Multimap.prototype.hasKey = function (key) {
        return this.valuesByKey.has(key);
    };
    Multimap.prototype.hasValue = function (value) {
        var sets = Array.from(this.valuesByKey.values());
        return sets.some(function (set) { return set.has(value); });
    };
    Multimap.prototype.getValuesForKey = function (key) {
        var values = this.valuesByKey.get(key);
        return values ? Array.from(values) : [];
    };
    Multimap.prototype.getKeysForValue = function (value) {
        return Array.from(this.valuesByKey)
            .filter(function (_a) {
            var key = _a[0], values = _a[1];
            return values.has(value);
        })
            .map(function (_a) {
            var key = _a[0], values = _a[1];
            return key;
        });
    };
    return Multimap;
}());

//# sourceMappingURL=multimap.js.map

/***/ }),

/***/ "./node_modules/@stimulus/multimap/dist/set_operations.js":
/*!****************************************************************!*\
  !*** ./node_modules/@stimulus/multimap/dist/set_operations.js ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "add": () => (/* binding */ add),
/* harmony export */   "del": () => (/* binding */ del),
/* harmony export */   "fetch": () => (/* binding */ fetch),
/* harmony export */   "prune": () => (/* binding */ prune)
/* harmony export */ });
function add(map, key, value) {
    fetch(map, key).add(value);
}
function del(map, key, value) {
    fetch(map, key).delete(value);
    prune(map, key);
}
function fetch(map, key) {
    var values = map.get(key);
    if (!values) {
        values = new Set();
        map.set(key, values);
    }
    return values;
}
function prune(map, key) {
    var values = map.get(key);
    if (values != null && values.size == 0) {
        map.delete(key);
    }
}
//# sourceMappingURL=set_operations.js.map

/***/ }),

/***/ "./node_modules/@stimulus/mutation-observers/dist/attribute_observer.js":
/*!******************************************************************************!*\
  !*** ./node_modules/@stimulus/mutation-observers/dist/attribute_observer.js ***!
  \******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AttributeObserver": () => (/* binding */ AttributeObserver)
/* harmony export */ });
/* harmony import */ var _element_observer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./element_observer */ "./node_modules/@stimulus/mutation-observers/dist/element_observer.js");

var AttributeObserver = /** @class */ (function () {
    function AttributeObserver(element, attributeName, delegate) {
        this.attributeName = attributeName;
        this.delegate = delegate;
        this.elementObserver = new _element_observer__WEBPACK_IMPORTED_MODULE_0__.ElementObserver(element, this);
    }
    Object.defineProperty(AttributeObserver.prototype, "element", {
        get: function () {
            return this.elementObserver.element;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AttributeObserver.prototype, "selector", {
        get: function () {
            return "[" + this.attributeName + "]";
        },
        enumerable: false,
        configurable: true
    });
    AttributeObserver.prototype.start = function () {
        this.elementObserver.start();
    };
    AttributeObserver.prototype.stop = function () {
        this.elementObserver.stop();
    };
    AttributeObserver.prototype.refresh = function () {
        this.elementObserver.refresh();
    };
    Object.defineProperty(AttributeObserver.prototype, "started", {
        get: function () {
            return this.elementObserver.started;
        },
        enumerable: false,
        configurable: true
    });
    // Element observer delegate
    AttributeObserver.prototype.matchElement = function (element) {
        return element.hasAttribute(this.attributeName);
    };
    AttributeObserver.prototype.matchElementsInTree = function (tree) {
        var match = this.matchElement(tree) ? [tree] : [];
        var matches = Array.from(tree.querySelectorAll(this.selector));
        return match.concat(matches);
    };
    AttributeObserver.prototype.elementMatched = function (element) {
        if (this.delegate.elementMatchedAttribute) {
            this.delegate.elementMatchedAttribute(element, this.attributeName);
        }
    };
    AttributeObserver.prototype.elementUnmatched = function (element) {
        if (this.delegate.elementUnmatchedAttribute) {
            this.delegate.elementUnmatchedAttribute(element, this.attributeName);
        }
    };
    AttributeObserver.prototype.elementAttributeChanged = function (element, attributeName) {
        if (this.delegate.elementAttributeValueChanged && this.attributeName == attributeName) {
            this.delegate.elementAttributeValueChanged(element, attributeName);
        }
    };
    return AttributeObserver;
}());

//# sourceMappingURL=attribute_observer.js.map

/***/ }),

/***/ "./node_modules/@stimulus/mutation-observers/dist/element_observer.js":
/*!****************************************************************************!*\
  !*** ./node_modules/@stimulus/mutation-observers/dist/element_observer.js ***!
  \****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ElementObserver": () => (/* binding */ ElementObserver)
/* harmony export */ });
var ElementObserver = /** @class */ (function () {
    function ElementObserver(element, delegate) {
        var _this = this;
        this.element = element;
        this.started = false;
        this.delegate = delegate;
        this.elements = new Set;
        this.mutationObserver = new MutationObserver(function (mutations) { return _this.processMutations(mutations); });
    }
    ElementObserver.prototype.start = function () {
        if (!this.started) {
            this.started = true;
            this.mutationObserver.observe(this.element, { attributes: true, childList: true, subtree: true });
            this.refresh();
        }
    };
    ElementObserver.prototype.stop = function () {
        if (this.started) {
            this.mutationObserver.takeRecords();
            this.mutationObserver.disconnect();
            this.started = false;
        }
    };
    ElementObserver.prototype.refresh = function () {
        if (this.started) {
            var matches = new Set(this.matchElementsInTree());
            for (var _i = 0, _a = Array.from(this.elements); _i < _a.length; _i++) {
                var element = _a[_i];
                if (!matches.has(element)) {
                    this.removeElement(element);
                }
            }
            for (var _b = 0, _c = Array.from(matches); _b < _c.length; _b++) {
                var element = _c[_b];
                this.addElement(element);
            }
        }
    };
    // Mutation record processing
    ElementObserver.prototype.processMutations = function (mutations) {
        if (this.started) {
            for (var _i = 0, mutations_1 = mutations; _i < mutations_1.length; _i++) {
                var mutation = mutations_1[_i];
                this.processMutation(mutation);
            }
        }
    };
    ElementObserver.prototype.processMutation = function (mutation) {
        if (mutation.type == "attributes") {
            this.processAttributeChange(mutation.target, mutation.attributeName);
        }
        else if (mutation.type == "childList") {
            this.processRemovedNodes(mutation.removedNodes);
            this.processAddedNodes(mutation.addedNodes);
        }
    };
    ElementObserver.prototype.processAttributeChange = function (node, attributeName) {
        var element = node;
        if (this.elements.has(element)) {
            if (this.delegate.elementAttributeChanged && this.matchElement(element)) {
                this.delegate.elementAttributeChanged(element, attributeName);
            }
            else {
                this.removeElement(element);
            }
        }
        else if (this.matchElement(element)) {
            this.addElement(element);
        }
    };
    ElementObserver.prototype.processRemovedNodes = function (nodes) {
        for (var _i = 0, _a = Array.from(nodes); _i < _a.length; _i++) {
            var node = _a[_i];
            var element = this.elementFromNode(node);
            if (element) {
                this.processTree(element, this.removeElement);
            }
        }
    };
    ElementObserver.prototype.processAddedNodes = function (nodes) {
        for (var _i = 0, _a = Array.from(nodes); _i < _a.length; _i++) {
            var node = _a[_i];
            var element = this.elementFromNode(node);
            if (element && this.elementIsActive(element)) {
                this.processTree(element, this.addElement);
            }
        }
    };
    // Element matching
    ElementObserver.prototype.matchElement = function (element) {
        return this.delegate.matchElement(element);
    };
    ElementObserver.prototype.matchElementsInTree = function (tree) {
        if (tree === void 0) { tree = this.element; }
        return this.delegate.matchElementsInTree(tree);
    };
    ElementObserver.prototype.processTree = function (tree, processor) {
        for (var _i = 0, _a = this.matchElementsInTree(tree); _i < _a.length; _i++) {
            var element = _a[_i];
            processor.call(this, element);
        }
    };
    ElementObserver.prototype.elementFromNode = function (node) {
        if (node.nodeType == Node.ELEMENT_NODE) {
            return node;
        }
    };
    ElementObserver.prototype.elementIsActive = function (element) {
        if (element.isConnected != this.element.isConnected) {
            return false;
        }
        else {
            return this.element.contains(element);
        }
    };
    // Element tracking
    ElementObserver.prototype.addElement = function (element) {
        if (!this.elements.has(element)) {
            if (this.elementIsActive(element)) {
                this.elements.add(element);
                if (this.delegate.elementMatched) {
                    this.delegate.elementMatched(element);
                }
            }
        }
    };
    ElementObserver.prototype.removeElement = function (element) {
        if (this.elements.has(element)) {
            this.elements.delete(element);
            if (this.delegate.elementUnmatched) {
                this.delegate.elementUnmatched(element);
            }
        }
    };
    return ElementObserver;
}());

//# sourceMappingURL=element_observer.js.map

/***/ }),

/***/ "./node_modules/@stimulus/mutation-observers/dist/index.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@stimulus/mutation-observers/dist/index.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AttributeObserver": () => (/* reexport safe */ _attribute_observer__WEBPACK_IMPORTED_MODULE_0__.AttributeObserver),
/* harmony export */   "ElementObserver": () => (/* reexport safe */ _element_observer__WEBPACK_IMPORTED_MODULE_1__.ElementObserver),
/* harmony export */   "StringMapObserver": () => (/* reexport safe */ _string_map_observer__WEBPACK_IMPORTED_MODULE_2__.StringMapObserver),
/* harmony export */   "TokenListObserver": () => (/* reexport safe */ _token_list_observer__WEBPACK_IMPORTED_MODULE_3__.TokenListObserver),
/* harmony export */   "ValueListObserver": () => (/* reexport safe */ _value_list_observer__WEBPACK_IMPORTED_MODULE_4__.ValueListObserver)
/* harmony export */ });
/* harmony import */ var _attribute_observer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./attribute_observer */ "./node_modules/@stimulus/mutation-observers/dist/attribute_observer.js");
/* harmony import */ var _element_observer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./element_observer */ "./node_modules/@stimulus/mutation-observers/dist/element_observer.js");
/* harmony import */ var _string_map_observer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./string_map_observer */ "./node_modules/@stimulus/mutation-observers/dist/string_map_observer.js");
/* harmony import */ var _token_list_observer__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./token_list_observer */ "./node_modules/@stimulus/mutation-observers/dist/token_list_observer.js");
/* harmony import */ var _value_list_observer__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./value_list_observer */ "./node_modules/@stimulus/mutation-observers/dist/value_list_observer.js");





//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/@stimulus/mutation-observers/dist/string_map_observer.js":
/*!*******************************************************************************!*\
  !*** ./node_modules/@stimulus/mutation-observers/dist/string_map_observer.js ***!
  \*******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "StringMapObserver": () => (/* binding */ StringMapObserver)
/* harmony export */ });
var StringMapObserver = /** @class */ (function () {
    function StringMapObserver(element, delegate) {
        var _this = this;
        this.element = element;
        this.delegate = delegate;
        this.started = false;
        this.stringMap = new Map;
        this.mutationObserver = new MutationObserver(function (mutations) { return _this.processMutations(mutations); });
    }
    StringMapObserver.prototype.start = function () {
        if (!this.started) {
            this.started = true;
            this.mutationObserver.observe(this.element, { attributes: true });
            this.refresh();
        }
    };
    StringMapObserver.prototype.stop = function () {
        if (this.started) {
            this.mutationObserver.takeRecords();
            this.mutationObserver.disconnect();
            this.started = false;
        }
    };
    StringMapObserver.prototype.refresh = function () {
        if (this.started) {
            for (var _i = 0, _a = this.knownAttributeNames; _i < _a.length; _i++) {
                var attributeName = _a[_i];
                this.refreshAttribute(attributeName);
            }
        }
    };
    // Mutation record processing
    StringMapObserver.prototype.processMutations = function (mutations) {
        if (this.started) {
            for (var _i = 0, mutations_1 = mutations; _i < mutations_1.length; _i++) {
                var mutation = mutations_1[_i];
                this.processMutation(mutation);
            }
        }
    };
    StringMapObserver.prototype.processMutation = function (mutation) {
        var attributeName = mutation.attributeName;
        if (attributeName) {
            this.refreshAttribute(attributeName);
        }
    };
    // State tracking
    StringMapObserver.prototype.refreshAttribute = function (attributeName) {
        var key = this.delegate.getStringMapKeyForAttribute(attributeName);
        if (key != null) {
            if (!this.stringMap.has(attributeName)) {
                this.stringMapKeyAdded(key, attributeName);
            }
            var value = this.element.getAttribute(attributeName);
            if (this.stringMap.get(attributeName) != value) {
                this.stringMapValueChanged(value, key);
            }
            if (value == null) {
                this.stringMap.delete(attributeName);
                this.stringMapKeyRemoved(key, attributeName);
            }
            else {
                this.stringMap.set(attributeName, value);
            }
        }
    };
    StringMapObserver.prototype.stringMapKeyAdded = function (key, attributeName) {
        if (this.delegate.stringMapKeyAdded) {
            this.delegate.stringMapKeyAdded(key, attributeName);
        }
    };
    StringMapObserver.prototype.stringMapValueChanged = function (value, key) {
        if (this.delegate.stringMapValueChanged) {
            this.delegate.stringMapValueChanged(value, key);
        }
    };
    StringMapObserver.prototype.stringMapKeyRemoved = function (key, attributeName) {
        if (this.delegate.stringMapKeyRemoved) {
            this.delegate.stringMapKeyRemoved(key, attributeName);
        }
    };
    Object.defineProperty(StringMapObserver.prototype, "knownAttributeNames", {
        get: function () {
            return Array.from(new Set(this.currentAttributeNames.concat(this.recordedAttributeNames)));
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(StringMapObserver.prototype, "currentAttributeNames", {
        get: function () {
            return Array.from(this.element.attributes).map(function (attribute) { return attribute.name; });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(StringMapObserver.prototype, "recordedAttributeNames", {
        get: function () {
            return Array.from(this.stringMap.keys());
        },
        enumerable: false,
        configurable: true
    });
    return StringMapObserver;
}());

//# sourceMappingURL=string_map_observer.js.map

/***/ }),

/***/ "./node_modules/@stimulus/mutation-observers/dist/token_list_observer.js":
/*!*******************************************************************************!*\
  !*** ./node_modules/@stimulus/mutation-observers/dist/token_list_observer.js ***!
  \*******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TokenListObserver": () => (/* binding */ TokenListObserver)
/* harmony export */ });
/* harmony import */ var _attribute_observer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./attribute_observer */ "./node_modules/@stimulus/mutation-observers/dist/attribute_observer.js");
/* harmony import */ var _stimulus_multimap__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @stimulus/multimap */ "./node_modules/@stimulus/multimap/dist/index.js");


var TokenListObserver = /** @class */ (function () {
    function TokenListObserver(element, attributeName, delegate) {
        this.attributeObserver = new _attribute_observer__WEBPACK_IMPORTED_MODULE_0__.AttributeObserver(element, attributeName, this);
        this.delegate = delegate;
        this.tokensByElement = new _stimulus_multimap__WEBPACK_IMPORTED_MODULE_1__.Multimap;
    }
    Object.defineProperty(TokenListObserver.prototype, "started", {
        get: function () {
            return this.attributeObserver.started;
        },
        enumerable: false,
        configurable: true
    });
    TokenListObserver.prototype.start = function () {
        this.attributeObserver.start();
    };
    TokenListObserver.prototype.stop = function () {
        this.attributeObserver.stop();
    };
    TokenListObserver.prototype.refresh = function () {
        this.attributeObserver.refresh();
    };
    Object.defineProperty(TokenListObserver.prototype, "element", {
        get: function () {
            return this.attributeObserver.element;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TokenListObserver.prototype, "attributeName", {
        get: function () {
            return this.attributeObserver.attributeName;
        },
        enumerable: false,
        configurable: true
    });
    // Attribute observer delegate
    TokenListObserver.prototype.elementMatchedAttribute = function (element) {
        this.tokensMatched(this.readTokensForElement(element));
    };
    TokenListObserver.prototype.elementAttributeValueChanged = function (element) {
        var _a = this.refreshTokensForElement(element), unmatchedTokens = _a[0], matchedTokens = _a[1];
        this.tokensUnmatched(unmatchedTokens);
        this.tokensMatched(matchedTokens);
    };
    TokenListObserver.prototype.elementUnmatchedAttribute = function (element) {
        this.tokensUnmatched(this.tokensByElement.getValuesForKey(element));
    };
    TokenListObserver.prototype.tokensMatched = function (tokens) {
        var _this = this;
        tokens.forEach(function (token) { return _this.tokenMatched(token); });
    };
    TokenListObserver.prototype.tokensUnmatched = function (tokens) {
        var _this = this;
        tokens.forEach(function (token) { return _this.tokenUnmatched(token); });
    };
    TokenListObserver.prototype.tokenMatched = function (token) {
        this.delegate.tokenMatched(token);
        this.tokensByElement.add(token.element, token);
    };
    TokenListObserver.prototype.tokenUnmatched = function (token) {
        this.delegate.tokenUnmatched(token);
        this.tokensByElement.delete(token.element, token);
    };
    TokenListObserver.prototype.refreshTokensForElement = function (element) {
        var previousTokens = this.tokensByElement.getValuesForKey(element);
        var currentTokens = this.readTokensForElement(element);
        var firstDifferingIndex = zip(previousTokens, currentTokens)
            .findIndex(function (_a) {
            var previousToken = _a[0], currentToken = _a[1];
            return !tokensAreEqual(previousToken, currentToken);
        });
        if (firstDifferingIndex == -1) {
            return [[], []];
        }
        else {
            return [previousTokens.slice(firstDifferingIndex), currentTokens.slice(firstDifferingIndex)];
        }
    };
    TokenListObserver.prototype.readTokensForElement = function (element) {
        var attributeName = this.attributeName;
        var tokenString = element.getAttribute(attributeName) || "";
        return parseTokenString(tokenString, element, attributeName);
    };
    return TokenListObserver;
}());

function parseTokenString(tokenString, element, attributeName) {
    return tokenString.trim().split(/\s+/).filter(function (content) { return content.length; })
        .map(function (content, index) { return ({ element: element, attributeName: attributeName, content: content, index: index }); });
}
function zip(left, right) {
    var length = Math.max(left.length, right.length);
    return Array.from({ length: length }, function (_, index) { return [left[index], right[index]]; });
}
function tokensAreEqual(left, right) {
    return left && right && left.index == right.index && left.content == right.content;
}
//# sourceMappingURL=token_list_observer.js.map

/***/ }),

/***/ "./node_modules/@stimulus/mutation-observers/dist/value_list_observer.js":
/*!*******************************************************************************!*\
  !*** ./node_modules/@stimulus/mutation-observers/dist/value_list_observer.js ***!
  \*******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ValueListObserver": () => (/* binding */ ValueListObserver)
/* harmony export */ });
/* harmony import */ var _token_list_observer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./token_list_observer */ "./node_modules/@stimulus/mutation-observers/dist/token_list_observer.js");

var ValueListObserver = /** @class */ (function () {
    function ValueListObserver(element, attributeName, delegate) {
        this.tokenListObserver = new _token_list_observer__WEBPACK_IMPORTED_MODULE_0__.TokenListObserver(element, attributeName, this);
        this.delegate = delegate;
        this.parseResultsByToken = new WeakMap;
        this.valuesByTokenByElement = new WeakMap;
    }
    Object.defineProperty(ValueListObserver.prototype, "started", {
        get: function () {
            return this.tokenListObserver.started;
        },
        enumerable: false,
        configurable: true
    });
    ValueListObserver.prototype.start = function () {
        this.tokenListObserver.start();
    };
    ValueListObserver.prototype.stop = function () {
        this.tokenListObserver.stop();
    };
    ValueListObserver.prototype.refresh = function () {
        this.tokenListObserver.refresh();
    };
    Object.defineProperty(ValueListObserver.prototype, "element", {
        get: function () {
            return this.tokenListObserver.element;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ValueListObserver.prototype, "attributeName", {
        get: function () {
            return this.tokenListObserver.attributeName;
        },
        enumerable: false,
        configurable: true
    });
    ValueListObserver.prototype.tokenMatched = function (token) {
        var element = token.element;
        var value = this.fetchParseResultForToken(token).value;
        if (value) {
            this.fetchValuesByTokenForElement(element).set(token, value);
            this.delegate.elementMatchedValue(element, value);
        }
    };
    ValueListObserver.prototype.tokenUnmatched = function (token) {
        var element = token.element;
        var value = this.fetchParseResultForToken(token).value;
        if (value) {
            this.fetchValuesByTokenForElement(element).delete(token);
            this.delegate.elementUnmatchedValue(element, value);
        }
    };
    ValueListObserver.prototype.fetchParseResultForToken = function (token) {
        var parseResult = this.parseResultsByToken.get(token);
        if (!parseResult) {
            parseResult = this.parseToken(token);
            this.parseResultsByToken.set(token, parseResult);
        }
        return parseResult;
    };
    ValueListObserver.prototype.fetchValuesByTokenForElement = function (element) {
        var valuesByToken = this.valuesByTokenByElement.get(element);
        if (!valuesByToken) {
            valuesByToken = new Map;
            this.valuesByTokenByElement.set(element, valuesByToken);
        }
        return valuesByToken;
    };
    ValueListObserver.prototype.parseToken = function (token) {
        try {
            var value = this.delegate.parseValueForToken(token);
            return { value: value };
        }
        catch (error) {
            return { error: error };
        }
    };
    return ValueListObserver;
}());

//# sourceMappingURL=value_list_observer.js.map

/***/ }),

/***/ "./node_modules/cable_ready/javascript/action_cable.js":
/*!*************************************************************!*\
  !*** ./node_modules/cable_ready/javascript/action_cable.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "consumer": () => (/* binding */ consumer),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
let consumer

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  setConsumer (value) {
    consumer = value
  }
});


/***/ }),

/***/ "./node_modules/cable_ready/javascript/active_element.js":
/*!***************************************************************!*\
  !*** ./node_modules/cable_ready/javascript/active_element.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
let activeElement

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  get element () {
    return activeElement
  },
  set (element) {
    activeElement = element
  }
});


/***/ }),

/***/ "./node_modules/cable_ready/javascript/cable_ready.js":
/*!************************************************************!*\
  !*** ./node_modules/cable_ready/javascript/cable_ready.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "perform": () => (/* binding */ perform),
/* harmony export */   "performAsync": () => (/* binding */ performAsync),
/* harmony export */   "initialize": () => (/* binding */ initialize)
/* harmony export */ });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ "./node_modules/cable_ready/javascript/utils.js");
/* harmony import */ var _active_element__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./active_element */ "./node_modules/cable_ready/javascript/active_element.js");
/* harmony import */ var _operation_store__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./operation_store */ "./node_modules/cable_ready/javascript/operation_store.js");
/* harmony import */ var _action_cable__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./action_cable */ "./node_modules/cable_ready/javascript/action_cable.js");





const perform = (
  operations,
  options = { emitMissingElementWarnings: true }
) => {
  for (let name in operations) {
    if (operations.hasOwnProperty(name)) {
      const entries = operations[name]
      for (let i = 0; i < entries.length; i++) {
        const operation = entries[i]
        try {
          if (operation.selector) {
            operation.element = operation.xpath
              ? (0,_utils__WEBPACK_IMPORTED_MODULE_0__.xpathToElement)(operation.selector)
              : document[
                  operation.selectAll ? 'querySelectorAll' : 'querySelector'
                ](operation.selector)
          } else {
            operation.element = document
          }
          if (operation.element || options.emitMissingElementWarnings) {
            _active_element__WEBPACK_IMPORTED_MODULE_1__.default.set(document.activeElement)
            const cableReadyOperation = _operation_store__WEBPACK_IMPORTED_MODULE_2__.default.all[name]

            if (cableReadyOperation) {
              cableReadyOperation(operation, name)
            } else {
              console.error(
                `CableReady couldn't find the "${name}" operation. Make sure you haven't misspelled the operation name and that you've added all required operations.`
              )
            }
          }
        } catch (e) {
          if (operation.element) {
            console.error(
              `CableReady detected an error in ${name}: ${e.message}. If you need to support older browsers make sure you've included the corresponding polyfills. https://docs.stimulusreflex.com/setup#polyfills-for-ie11.`
            )
            console.error(e)
          } else {
            console.log(
              `CableReady ${name} failed due to missing DOM element for selector: '${operation.selector}'`
            )
          }
        }
      }
    }
  }
}

const performAsync = (
  operations,
  options = { emitMissingElementWarnings: true }
) => {
  return new Promise((resolve, reject) => {
    try {
      resolve(perform(operations, options))
    } catch (err) {
      reject(err)
    }
  })
}

const initialize = (initializeOptions = {}) => {
  const { consumer } = initializeOptions
  _action_cable__WEBPACK_IMPORTED_MODULE_3__.default.setConsumer(consumer)
}




/***/ }),

/***/ "./node_modules/cable_ready/javascript/enums.js":
/*!******************************************************!*\
  !*** ./node_modules/cable_ready/javascript/enums.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "inputTags": () => (/* binding */ inputTags),
/* harmony export */   "mutableTags": () => (/* binding */ mutableTags),
/* harmony export */   "textInputTypes": () => (/* binding */ textInputTypes)
/* harmony export */ });
const inputTags = {
  INPUT: true,
  TEXTAREA: true,
  SELECT: true
}

const mutableTags = {
  INPUT: true,
  TEXTAREA: true,
  OPTION: true
}

const textInputTypes = {
  'datetime-local': true,
  'select-multiple': true,
  'select-one': true,
  color: true,
  date: true,
  datetime: true,
  email: true,
  month: true,
  number: true,
  password: true,
  range: true,
  search: true,
  tel: true,
  text: true,
  textarea: true,
  time: true,
  url: true,
  week: true
}


/***/ }),

/***/ "./node_modules/cable_ready/javascript/index.js":
/*!******************************************************!*\
  !*** ./node_modules/cable_ready/javascript/index.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Utils": () => (/* reexport module object */ _utils__WEBPACK_IMPORTED_MODULE_1__),
/* harmony export */   "MorphCallbacks": () => (/* reexport module object */ _morph_callbacks__WEBPACK_IMPORTED_MODULE_0__),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _morph_callbacks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./morph_callbacks */ "./node_modules/cable_ready/javascript/morph_callbacks.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils */ "./node_modules/cable_ready/javascript/utils.js");
/* harmony import */ var _operation_store__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./operation_store */ "./node_modules/cable_ready/javascript/operation_store.js");
/* harmony import */ var _cable_ready__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./cable_ready */ "./node_modules/cable_ready/javascript/cable_ready.js");
/* harmony import */ var _stream_from_element__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./stream_from_element */ "./node_modules/cable_ready/javascript/stream_from_element.js");









/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  perform: _cable_ready__WEBPACK_IMPORTED_MODULE_3__.perform,
  performAsync: _cable_ready__WEBPACK_IMPORTED_MODULE_3__.performAsync,
  shouldMorphCallbacks: _morph_callbacks__WEBPACK_IMPORTED_MODULE_0__.shouldMorphCallbacks,
  didMorphCallbacks: _morph_callbacks__WEBPACK_IMPORTED_MODULE_0__.didMorphCallbacks,
  initialize: _cable_ready__WEBPACK_IMPORTED_MODULE_3__.initialize,
  addOperation: _operation_store__WEBPACK_IMPORTED_MODULE_2__.addOperation,
  addOperations: _operation_store__WEBPACK_IMPORTED_MODULE_2__.addOperations,
  get DOMOperations () {
    console.warn(
      'DEPRECATED: Please use `CableReady.operations.jazzHands = ...` instead of `CableReady.DOMOperations.jazzHands = ...`'
    )
    return _operation_store__WEBPACK_IMPORTED_MODULE_2__.default.all
  },
  get operations () {
    return _operation_store__WEBPACK_IMPORTED_MODULE_2__.default.all
  }
});


/***/ }),

/***/ "./node_modules/cable_ready/javascript/morph_callbacks.js":
/*!****************************************************************!*\
  !*** ./node_modules/cable_ready/javascript/morph_callbacks.js ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "shouldMorphCallbacks": () => (/* binding */ shouldMorphCallbacks),
/* harmony export */   "didMorphCallbacks": () => (/* binding */ didMorphCallbacks),
/* harmony export */   "shouldMorph": () => (/* binding */ shouldMorph),
/* harmony export */   "didMorph": () => (/* binding */ didMorph),
/* harmony export */   "verifyNotMutable": () => (/* binding */ verifyNotMutable),
/* harmony export */   "verifyNotPermanent": () => (/* binding */ verifyNotPermanent)
/* harmony export */ });
/* harmony import */ var _enums__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./enums */ "./node_modules/cable_ready/javascript/enums.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils */ "./node_modules/cable_ready/javascript/utils.js");
/* harmony import */ var _active_element__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./active_element */ "./node_modules/cable_ready/javascript/active_element.js");




// Indicates whether or not we should morph an element via onBeforeElUpdated callback
// SEE: https://github.com/patrick-steele-idem/morphdom#morphdomfromnode-tonode-options--node
//
const shouldMorph = operation => (fromEl, toEl) => {
  return !shouldMorphCallbacks
    .map(callback => {
      return typeof callback === 'function'
        ? callback(operation, fromEl, toEl)
        : true
    })
    .includes(false)
}

// Execute any pluggable functions that modify elements after morphing via onElUpdated callback
//
const didMorph = operation => el => {
  didMorphCallbacks.forEach(callback => {
    if (typeof callback === 'function') callback(operation, el)
  })
}

const verifyNotMutable = (detail, fromEl, toEl) => {
  // Skip nodes that are equal:
  // https://github.com/patrick-steele-idem/morphdom#can-i-make-morphdom-blaze-through-the-dom-tree-even-faster-yes
  if (!_enums__WEBPACK_IMPORTED_MODULE_0__.mutableTags[fromEl.tagName] && fromEl.isEqualNode(toEl)) return false
  return true
}

const verifyNotPermanent = (detail, fromEl, toEl) => {
  const { permanentAttributeName } = detail
  if (!permanentAttributeName) return true

  const permanent = fromEl.closest(`[${permanentAttributeName}]`)

  // only morph attributes on the active non-permanent text input
  if (!permanent && (0,_utils__WEBPACK_IMPORTED_MODULE_1__.isTextInput)(fromEl) && fromEl === _active_element__WEBPACK_IMPORTED_MODULE_2__.default.element) {
    const ignore = { value: true }
    Array.from(toEl.attributes).forEach(attribute => {
      if (!ignore[attribute.name])
        fromEl.setAttribute(attribute.name, attribute.value)
    })
    return false
  }

  return !permanent
}

const shouldMorphCallbacks = [verifyNotMutable, verifyNotPermanent]
const didMorphCallbacks = []




/***/ }),

/***/ "./node_modules/cable_ready/javascript/operation_store.js":
/*!****************************************************************!*\
  !*** ./node_modules/cable_ready/javascript/operation_store.js ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "addOperation": () => (/* binding */ addOperation),
/* harmony export */   "addOperations": () => (/* binding */ addOperations),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _operations__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./operations */ "./node_modules/cable_ready/javascript/operations.js");


let operations = _operations__WEBPACK_IMPORTED_MODULE_0__.default

const add = newOperations => {
  operations = { ...operations, ...newOperations }
}

const addOperations = operations => {
  add(operations)
}

const addOperation = (name, operation) => {
  const operations = {}
  operations[name] = operation

  add(operations)
}



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  get all () {
    return operations
  }
});


/***/ }),

/***/ "./node_modules/cable_ready/javascript/operations.js":
/*!***********************************************************!*\
  !*** ./node_modules/cable_ready/javascript/operations.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var morphdom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! morphdom */ "./node_modules/morphdom/dist/morphdom-esm.js");
/* harmony import */ var _morph_callbacks__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./morph_callbacks */ "./node_modules/cable_ready/javascript/morph_callbacks.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils */ "./node_modules/cable_ready/javascript/utils.js");




/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  // DOM Mutations

  append: (operation, callee) => {
    (0,_utils__WEBPACK_IMPORTED_MODULE_2__.processElements)(operation, element => {
      (0,_utils__WEBPACK_IMPORTED_MODULE_2__.before)(element, callee, operation)
      ;(0,_utils__WEBPACK_IMPORTED_MODULE_2__.operate)(operation, () => {
        const { html, focusSelector } = operation
        element.insertAdjacentHTML('beforeend', html || '')
        ;(0,_utils__WEBPACK_IMPORTED_MODULE_2__.assignFocus)(focusSelector)
      })
      ;(0,_utils__WEBPACK_IMPORTED_MODULE_2__.after)(element, callee, operation)
    })
  },

  graft: (operation, callee) => {
    (0,_utils__WEBPACK_IMPORTED_MODULE_2__.processElements)(operation, element => {
      (0,_utils__WEBPACK_IMPORTED_MODULE_2__.before)(element, callee, operation)
      ;(0,_utils__WEBPACK_IMPORTED_MODULE_2__.operate)(operation, () => {
        const { parent, focusSelector } = operation
        const parentElement = document.querySelector(parent)
        if (parentElement) {
          parentElement.appendChild(element)
          ;(0,_utils__WEBPACK_IMPORTED_MODULE_2__.assignFocus)(focusSelector)
        }
      })
      ;(0,_utils__WEBPACK_IMPORTED_MODULE_2__.after)(element, callee, operation)
    })
  },

  innerHtml: (operation, callee) => {
    (0,_utils__WEBPACK_IMPORTED_MODULE_2__.processElements)(operation, element => {
      (0,_utils__WEBPACK_IMPORTED_MODULE_2__.before)(element, callee, operation)
      ;(0,_utils__WEBPACK_IMPORTED_MODULE_2__.operate)(operation, () => {
        const { html, focusSelector } = operation
        element.innerHTML = html || ''
        ;(0,_utils__WEBPACK_IMPORTED_MODULE_2__.assignFocus)(focusSelector)
      })
      ;(0,_utils__WEBPACK_IMPORTED_MODULE_2__.after)(element, callee, operation)
    })
  },

  insertAdjacentHtml: (operation, callee) => {
    (0,_utils__WEBPACK_IMPORTED_MODULE_2__.processElements)(operation, element => {
      (0,_utils__WEBPACK_IMPORTED_MODULE_2__.before)(element, callee, operation)
      ;(0,_utils__WEBPACK_IMPORTED_MODULE_2__.operate)(operation, () => {
        const { html, position, focusSelector } = operation
        element.insertAdjacentHTML(position || 'beforeend', html || '')
        ;(0,_utils__WEBPACK_IMPORTED_MODULE_2__.assignFocus)(focusSelector)
      })
      ;(0,_utils__WEBPACK_IMPORTED_MODULE_2__.after)(element, callee, operation)
    })
  },

  insertAdjacentText: (operation, callee) => {
    (0,_utils__WEBPACK_IMPORTED_MODULE_2__.processElements)(operation, element => {
      (0,_utils__WEBPACK_IMPORTED_MODULE_2__.before)(element, callee, operation)
      ;(0,_utils__WEBPACK_IMPORTED_MODULE_2__.operate)(operation, () => {
        const { text, position, focusSelector } = operation
        element.insertAdjacentText(position || 'beforeend', text || '')
        ;(0,_utils__WEBPACK_IMPORTED_MODULE_2__.assignFocus)(focusSelector)
      })
      ;(0,_utils__WEBPACK_IMPORTED_MODULE_2__.after)(element, callee, operation)
    })
  },

  morph: (operation, callee) => {
    (0,_utils__WEBPACK_IMPORTED_MODULE_2__.processElements)(operation, element => {
      const { html } = operation
      const template = document.createElement('template')
      template.innerHTML = String(html).trim()
      operation.content = template.content
      const parent = element.parentElement
      const ordinal = Array.from(parent.children).indexOf(element)
      ;(0,_utils__WEBPACK_IMPORTED_MODULE_2__.before)(element, callee, operation)
      ;(0,_utils__WEBPACK_IMPORTED_MODULE_2__.operate)(operation, () => {
        const { childrenOnly, focusSelector } = operation
        ;(0,morphdom__WEBPACK_IMPORTED_MODULE_0__.default)(
          element,
          childrenOnly ? template.content : template.innerHTML,
          {
            childrenOnly: !!childrenOnly,
            onBeforeElUpdated: (0,_morph_callbacks__WEBPACK_IMPORTED_MODULE_1__.shouldMorph)(operation),
            onElUpdated: (0,_morph_callbacks__WEBPACK_IMPORTED_MODULE_1__.didMorph)(operation)
          }
        )
        ;(0,_utils__WEBPACK_IMPORTED_MODULE_2__.assignFocus)(focusSelector)
      })
      ;(0,_utils__WEBPACK_IMPORTED_MODULE_2__.after)(parent.children[ordinal], callee, operation)
    })
  },

  outerHtml: (operation, callee) => {
    (0,_utils__WEBPACK_IMPORTED_MODULE_2__.processElements)(operation, element => {
      const parent = element.parentElement
      const ordinal = Array.from(parent.children).indexOf(element)
      ;(0,_utils__WEBPACK_IMPORTED_MODULE_2__.before)(element, callee, operation)
      ;(0,_utils__WEBPACK_IMPORTED_MODULE_2__.operate)(operation, () => {
        const { html, focusSelector } = operation
        element.outerHTML = html || ''
        ;(0,_utils__WEBPACK_IMPORTED_MODULE_2__.assignFocus)(focusSelector)
      })
      ;(0,_utils__WEBPACK_IMPORTED_MODULE_2__.after)(parent.children[ordinal], callee, operation)
    })
  },

  prepend: (operation, callee) => {
    (0,_utils__WEBPACK_IMPORTED_MODULE_2__.processElements)(operation, element => {
      (0,_utils__WEBPACK_IMPORTED_MODULE_2__.before)(element, callee, operation)
      ;(0,_utils__WEBPACK_IMPORTED_MODULE_2__.operate)(operation, () => {
        const { html, focusSelector } = operation
        element.insertAdjacentHTML('afterbegin', html || '')
        ;(0,_utils__WEBPACK_IMPORTED_MODULE_2__.assignFocus)(focusSelector)
      })
      ;(0,_utils__WEBPACK_IMPORTED_MODULE_2__.after)(element, callee, operation)
    })
  },

  remove: (operation, callee) => {
    (0,_utils__WEBPACK_IMPORTED_MODULE_2__.processElements)(operation, element => {
      (0,_utils__WEBPACK_IMPORTED_MODULE_2__.before)(element, callee, operation)
      ;(0,_utils__WEBPACK_IMPORTED_MODULE_2__.operate)(operation, () => {
        const { focusSelector } = operation
        element.remove()
        ;(0,_utils__WEBPACK_IMPORTED_MODULE_2__.assignFocus)(focusSelector)
      })
      ;(0,_utils__WEBPACK_IMPORTED_MODULE_2__.after)(document, callee, operation)
    })
  },

  replace: (operation, callee) => {
    (0,_utils__WEBPACK_IMPORTED_MODULE_2__.processElements)(operation, element => {
      const parent = element.parentElement
      const ordinal = Array.from(parent.children).indexOf(element)
      ;(0,_utils__WEBPACK_IMPORTED_MODULE_2__.before)(element, callee, operation)
      ;(0,_utils__WEBPACK_IMPORTED_MODULE_2__.operate)(operation, () => {
        const { html, focusSelector } = operation
        element.outerHTML = html || ''
        ;(0,_utils__WEBPACK_IMPORTED_MODULE_2__.assignFocus)(focusSelector)
      })
      ;(0,_utils__WEBPACK_IMPORTED_MODULE_2__.after)(parent.children[ordinal], callee, operation)
    })
  },

  textContent: (operation, callee) => {
    (0,_utils__WEBPACK_IMPORTED_MODULE_2__.processElements)(operation, element => {
      (0,_utils__WEBPACK_IMPORTED_MODULE_2__.before)(element, callee, operation)
      ;(0,_utils__WEBPACK_IMPORTED_MODULE_2__.operate)(operation, () => {
        const { text, focusSelector } = operation
        element.textContent = text || ''
        ;(0,_utils__WEBPACK_IMPORTED_MODULE_2__.assignFocus)(focusSelector)
      })
      ;(0,_utils__WEBPACK_IMPORTED_MODULE_2__.after)(element, callee, operation)
    })
  },

  // Element Property Mutations

  addCssClass: (operation, callee) => {
    (0,_utils__WEBPACK_IMPORTED_MODULE_2__.processElements)(operation, element => {
      (0,_utils__WEBPACK_IMPORTED_MODULE_2__.before)(element, callee, operation)
      ;(0,_utils__WEBPACK_IMPORTED_MODULE_2__.operate)(operation, () => {
        const { name } = operation
        element.classList.add(...(0,_utils__WEBPACK_IMPORTED_MODULE_2__.getClassNames)(name || ''))
      })
      ;(0,_utils__WEBPACK_IMPORTED_MODULE_2__.after)(element, callee, operation)
    })
  },

  removeAttribute: (operation, callee) => {
    (0,_utils__WEBPACK_IMPORTED_MODULE_2__.processElements)(operation, element => {
      (0,_utils__WEBPACK_IMPORTED_MODULE_2__.before)(element, callee, operation)
      ;(0,_utils__WEBPACK_IMPORTED_MODULE_2__.operate)(operation, () => {
        const { name } = operation
        element.removeAttribute(name)
      })
      ;(0,_utils__WEBPACK_IMPORTED_MODULE_2__.after)(element, callee, operation)
    })
  },

  removeCssClass: (operation, callee) => {
    (0,_utils__WEBPACK_IMPORTED_MODULE_2__.processElements)(operation, element => {
      (0,_utils__WEBPACK_IMPORTED_MODULE_2__.before)(element, callee, operation)
      ;(0,_utils__WEBPACK_IMPORTED_MODULE_2__.operate)(operation, () => {
        const { name } = operation
        element.classList.remove(...(0,_utils__WEBPACK_IMPORTED_MODULE_2__.getClassNames)(name))
      })
      ;(0,_utils__WEBPACK_IMPORTED_MODULE_2__.after)(element, callee, operation)
    })
  },

  setAttribute: (operation, callee) => {
    (0,_utils__WEBPACK_IMPORTED_MODULE_2__.processElements)(operation, element => {
      (0,_utils__WEBPACK_IMPORTED_MODULE_2__.before)(element, callee, operation)
      ;(0,_utils__WEBPACK_IMPORTED_MODULE_2__.operate)(operation, () => {
        const { name, value } = operation
        element.setAttribute(name, value || '')
      })
      ;(0,_utils__WEBPACK_IMPORTED_MODULE_2__.after)(element, callee, operation)
    })
  },

  setDatasetProperty: (operation, callee) => {
    (0,_utils__WEBPACK_IMPORTED_MODULE_2__.processElements)(operation, element => {
      (0,_utils__WEBPACK_IMPORTED_MODULE_2__.before)(element, callee, operation)
      ;(0,_utils__WEBPACK_IMPORTED_MODULE_2__.operate)(operation, () => {
        const { name, value } = operation
        element.dataset[name] = value || ''
      })
      ;(0,_utils__WEBPACK_IMPORTED_MODULE_2__.after)(element, callee, operation)
    })
  },

  setProperty: (operation, callee) => {
    (0,_utils__WEBPACK_IMPORTED_MODULE_2__.processElements)(operation, element => {
      (0,_utils__WEBPACK_IMPORTED_MODULE_2__.before)(element, callee, operation)
      ;(0,_utils__WEBPACK_IMPORTED_MODULE_2__.operate)(operation, () => {
        const { name, value } = operation
        if (name in element) element[name] = value || ''
      })
      ;(0,_utils__WEBPACK_IMPORTED_MODULE_2__.after)(element, callee, operation)
    })
  },

  setStyle: (operation, callee) => {
    (0,_utils__WEBPACK_IMPORTED_MODULE_2__.processElements)(operation, element => {
      (0,_utils__WEBPACK_IMPORTED_MODULE_2__.before)(element, callee, operation)
      ;(0,_utils__WEBPACK_IMPORTED_MODULE_2__.operate)(operation, () => {
        const { name, value } = operation
        element.style[name] = value || ''
      })
      ;(0,_utils__WEBPACK_IMPORTED_MODULE_2__.after)(element, callee, operation)
    })
  },

  setStyles: (operation, callee) => {
    (0,_utils__WEBPACK_IMPORTED_MODULE_2__.processElements)(operation, element => {
      (0,_utils__WEBPACK_IMPORTED_MODULE_2__.before)(element, callee, operation)
      ;(0,_utils__WEBPACK_IMPORTED_MODULE_2__.operate)(operation, () => {
        const { styles } = operation
        for (let [name, value] of Object.entries(styles))
          element.style[name] = value || ''
      })
      ;(0,_utils__WEBPACK_IMPORTED_MODULE_2__.after)(element, callee, operation)
    })
  },

  setValue: (operation, callee) => {
    (0,_utils__WEBPACK_IMPORTED_MODULE_2__.processElements)(operation, element => {
      (0,_utils__WEBPACK_IMPORTED_MODULE_2__.before)(element, callee, operation)
      ;(0,_utils__WEBPACK_IMPORTED_MODULE_2__.operate)(operation, () => {
        const { value } = operation
        element.value = value || ''
      })
      ;(0,_utils__WEBPACK_IMPORTED_MODULE_2__.after)(element, callee, operation)
    })
  },

  // DOM Events

  dispatchEvent: (operation, callee) => {
    (0,_utils__WEBPACK_IMPORTED_MODULE_2__.processElements)(operation, element => {
      (0,_utils__WEBPACK_IMPORTED_MODULE_2__.operate)(operation, () => {
        const { name, detail } = operation
        ;(0,_utils__WEBPACK_IMPORTED_MODULE_2__.dispatch)(element, name, detail)
      })
    })
  },

  setMeta: (operation, callee) => {
    (0,_utils__WEBPACK_IMPORTED_MODULE_2__.before)(document, callee, operation)
    ;(0,_utils__WEBPACK_IMPORTED_MODULE_2__.operate)(operation, () => {
      const { name, content } = operation
      let meta = document.head.querySelector(`meta[name='${name}']`)
      if (!meta) {
        meta = document.createElement('meta')
        meta.name = name
        document.head.appendChild(meta)
      }
      meta.content = content
    })
    ;(0,_utils__WEBPACK_IMPORTED_MODULE_2__.after)(document, callee, operation)
  },

  // Browser Manipulations

  clearStorage: (operation, callee) => {
    (0,_utils__WEBPACK_IMPORTED_MODULE_2__.before)(document, callee, operation)
    ;(0,_utils__WEBPACK_IMPORTED_MODULE_2__.operate)(operation, () => {
      const { type } = operation
      const storage = type === 'session' ? sessionStorage : localStorage
      storage.clear()
    })
    ;(0,_utils__WEBPACK_IMPORTED_MODULE_2__.after)(document, callee, operation)
  },

  go: (operation, callee) => {
    (0,_utils__WEBPACK_IMPORTED_MODULE_2__.before)(window, callee, operation)
    ;(0,_utils__WEBPACK_IMPORTED_MODULE_2__.operate)(operation, () => {
      const { delta } = operation
      history.go(delta)
    })
    ;(0,_utils__WEBPACK_IMPORTED_MODULE_2__.after)(window, callee, operation)
  },

  pushState: (operation, callee) => {
    (0,_utils__WEBPACK_IMPORTED_MODULE_2__.before)(window, callee, operation)
    ;(0,_utils__WEBPACK_IMPORTED_MODULE_2__.operate)(operation, () => {
      const { state, title, url } = operation
      history.pushState(state || {}, title || '', url)
    })
    ;(0,_utils__WEBPACK_IMPORTED_MODULE_2__.after)(window, callee, operation)
  },

  removeStorageItem: (operation, callee) => {
    (0,_utils__WEBPACK_IMPORTED_MODULE_2__.before)(document, callee, operation)
    ;(0,_utils__WEBPACK_IMPORTED_MODULE_2__.operate)(operation, () => {
      const { key, type } = operation
      const storage = type === 'session' ? sessionStorage : localStorage
      storage.removeItem(key)
    })
    ;(0,_utils__WEBPACK_IMPORTED_MODULE_2__.after)(document, callee, operation)
  },

  replaceState: (operation, callee) => {
    (0,_utils__WEBPACK_IMPORTED_MODULE_2__.before)(window, callee, operation)
    ;(0,_utils__WEBPACK_IMPORTED_MODULE_2__.operate)(operation, () => {
      const { state, title, url } = operation
      history.replaceState(state || {}, title || '', url)
    })
    ;(0,_utils__WEBPACK_IMPORTED_MODULE_2__.after)(window, callee, operation)
  },

  scrollIntoView: (operation, callee) => {
    const { element } = operation
    ;(0,_utils__WEBPACK_IMPORTED_MODULE_2__.before)(element, callee, operation)
    ;(0,_utils__WEBPACK_IMPORTED_MODULE_2__.operate)(operation, () => {
      element.scrollIntoView(operation)
    })
    ;(0,_utils__WEBPACK_IMPORTED_MODULE_2__.after)(element, callee, operation)
  },

  setCookie: (operation, callee) => {
    (0,_utils__WEBPACK_IMPORTED_MODULE_2__.before)(document, callee, operation)
    ;(0,_utils__WEBPACK_IMPORTED_MODULE_2__.operate)(operation, () => {
      const { cookie } = operation
      document.cookie = cookie || ''
    })
    ;(0,_utils__WEBPACK_IMPORTED_MODULE_2__.after)(document, callee, operation)
  },

  setFocus: (operation, callee) => {
    const { element } = operation
    ;(0,_utils__WEBPACK_IMPORTED_MODULE_2__.before)(element, callee, operation)
    ;(0,_utils__WEBPACK_IMPORTED_MODULE_2__.operate)(operation, () => {
      ;(0,_utils__WEBPACK_IMPORTED_MODULE_2__.assignFocus)(element)
    })
    ;(0,_utils__WEBPACK_IMPORTED_MODULE_2__.after)(element, callee, operation)
  },

  setStorageItem: (operation, callee) => {
    (0,_utils__WEBPACK_IMPORTED_MODULE_2__.before)(document, callee, operation)
    ;(0,_utils__WEBPACK_IMPORTED_MODULE_2__.operate)(operation, () => {
      const { key, value, type } = operation
      const storage = type === 'session' ? sessionStorage : localStorage
      storage.setItem(key, value || '')
    })
    ;(0,_utils__WEBPACK_IMPORTED_MODULE_2__.after)(document, callee, operation)
  },

  // Notifications

  consoleLog: (operation, callee) => {
    (0,_utils__WEBPACK_IMPORTED_MODULE_2__.operate)(operation, () => {
      const { message, level } = operation
      level && ['warn', 'info', 'error'].includes(level)
        ? console[level](message || '')
        : console.log(message || '')
    })
  },

  consoleTable: (operation, callee) => {
    (0,_utils__WEBPACK_IMPORTED_MODULE_2__.operate)(operation, () => {
      const { data, columns } = operation
      console.table(data, columns || [])
    })
  },

  notification: (operation, callee) => {
    (0,_utils__WEBPACK_IMPORTED_MODULE_2__.before)(document, callee, operation)
    ;(0,_utils__WEBPACK_IMPORTED_MODULE_2__.operate)(operation, () => {
      const { title, options } = operation
      Notification.requestPermission().then(result => {
        operation.permission = result
        if (result === 'granted') new Notification(title || '', options)
      })
    })
    ;(0,_utils__WEBPACK_IMPORTED_MODULE_2__.after)(document, callee, operation)
  }
});


/***/ }),

/***/ "./node_modules/cable_ready/javascript/stream_from_element.js":
/*!********************************************************************!*\
  !*** ./node_modules/cable_ready/javascript/stream_from_element.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var cable_ready__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! cable_ready */ "./node_modules/cable_ready/javascript/index.js");
/* harmony import */ var _action_cable__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./action_cable */ "./node_modules/cable_ready/javascript/action_cable.js");



class StreamFromElement extends HTMLElement {
  connectedCallback () {
    if (this.preview) return
    if (_action_cable__WEBPACK_IMPORTED_MODULE_1__.consumer) {
      this.channel = _action_cable__WEBPACK_IMPORTED_MODULE_1__.consumer.subscriptions.create(
        {
          channel: 'CableReady::Stream',
          identifier: this.getAttribute('identifier')
        },
        {
          received (data) {
            if (data.cableReady) cable_ready__WEBPACK_IMPORTED_MODULE_0__.default.perform(data.operations)
          }
        }
      )
    } else {
      console.error(
        'The `stream_from` helper cannot connect without an ActionCable consumer.\nPlease run `rails generate cable_ready:stream_from` to fix this.'
      )
    }
  }

  disconnectedCallback () {
    if (this.channel) this.channel.unsubscribe()
  }

  get preview () {
    return (
      document.documentElement.hasAttribute('data-turbolinks-preview') ||
      document.documentElement.hasAttribute('data-turbo-preview')
    )
  }
}

if (!window.customElements.get('stream-from')) {
  window.customElements.define('stream-from', StreamFromElement)
}


/***/ }),

/***/ "./node_modules/cable_ready/javascript/utils.js":
/*!******************************************************!*\
  !*** ./node_modules/cable_ready/javascript/utils.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "isTextInput": () => (/* binding */ isTextInput),
/* harmony export */   "assignFocus": () => (/* binding */ assignFocus),
/* harmony export */   "dispatch": () => (/* binding */ dispatch),
/* harmony export */   "xpathToElement": () => (/* binding */ xpathToElement),
/* harmony export */   "getClassNames": () => (/* binding */ getClassNames),
/* harmony export */   "processElements": () => (/* binding */ processElements),
/* harmony export */   "operate": () => (/* binding */ operate),
/* harmony export */   "before": () => (/* binding */ before),
/* harmony export */   "after": () => (/* binding */ after)
/* harmony export */ });
/* harmony import */ var _enums__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./enums */ "./node_modules/cable_ready/javascript/enums.js");
/* harmony import */ var _active_element__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./active_element */ "./node_modules/cable_ready/javascript/active_element.js");



// Indicates if the passed element is considered a text input.
//
const isTextInput = element => {
  return _enums__WEBPACK_IMPORTED_MODULE_0__.inputTags[element.tagName] && _enums__WEBPACK_IMPORTED_MODULE_0__.textInputTypes[element.type]
}

// Assigns focus to the appropriate element... preferring the explicitly passed selector
//
// * selector - a CSS selector for the element that should have focus
//
const assignFocus = selector => {
  const element =
    selector && selector.nodeType === Node.ELEMENT_NODE
      ? selector
      : document.querySelector(selector)
  const focusElement = element || _active_element__WEBPACK_IMPORTED_MODULE_1__.default.element
  if (focusElement && focusElement.focus) focusElement.focus()
}

// Dispatches an event on the passed element
//
// * element - the element
// * name - the name of the event
// * detail - the event detail
//
const dispatch = (element, name, detail = {}) => {
  const init = { bubbles: true, cancelable: true, detail: detail }
  const evt = new CustomEvent(name, init)
  element.dispatchEvent(evt)
  if (window.jQuery) window.jQuery(element).trigger(name, detail)
}

// Accepts an xPath query and returns the element found at that position in the DOM
//
const xpathToElement = xpath => {
  return document.evaluate(
    xpath,
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  ).singleNodeValue
}

// Return an array with the class names to be used
//
// * names - could be a string or an array of strings for multiple classes.
//
const getClassNames = names => Array(names).flat()

// Perform operation for either the first or all of the elements returned by CSS selector
//
// * operation - the instruction payload from perform
// * callback - the operation function to run for each element
//
const processElements = (operation, callback) => {
  Array.from(
    operation.selectAll ? operation.element : [operation.element]
  ).forEach(callback)
}

// camelCase to kebab-case
//
const kebabize = str => {
  return str
    .split('')
    .map((letter, idx) => {
      return letter.toUpperCase() === letter
        ? `${idx !== 0 ? '-' : ''}${letter.toLowerCase()}`
        : letter
    })
    .join('')
}

// Provide a standardized pipeline of checks and modifications to all operations based on provided options
// Currently skips execution if cancelled and implements an optional delay
//
const operate = (operation, callback) => {
  if (!operation.cancel) {
    operation.delay ? setTimeout(callback, operation.delay) : callback()
    return true
  }
  return false
}

// Dispatch life-cycle events with standardized naming
const before = (target, name, operation) =>
  dispatch(target, `cable-ready:before-${kebabize(name)}`, operation)

const after = (target, name, operation) =>
  dispatch(target, `cable-ready:after-${kebabize(name)}`, operation)




/***/ }),

/***/ "./node_modules/morphdom/dist/morphdom-esm.js":
/*!****************************************************!*\
  !*** ./node_modules/morphdom/dist/morphdom-esm.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
var DOCUMENT_FRAGMENT_NODE = 11;

function morphAttrs(fromNode, toNode) {
    var toNodeAttrs = toNode.attributes;
    var attr;
    var attrName;
    var attrNamespaceURI;
    var attrValue;
    var fromValue;

    // document-fragments dont have attributes so lets not do anything
    if (toNode.nodeType === DOCUMENT_FRAGMENT_NODE || fromNode.nodeType === DOCUMENT_FRAGMENT_NODE) {
      return;
    }

    // update attributes on original DOM element
    for (var i = toNodeAttrs.length - 1; i >= 0; i--) {
        attr = toNodeAttrs[i];
        attrName = attr.name;
        attrNamespaceURI = attr.namespaceURI;
        attrValue = attr.value;

        if (attrNamespaceURI) {
            attrName = attr.localName || attrName;
            fromValue = fromNode.getAttributeNS(attrNamespaceURI, attrName);

            if (fromValue !== attrValue) {
                if (attr.prefix === 'xmlns'){
                    attrName = attr.name; // It's not allowed to set an attribute with the XMLNS namespace without specifying the `xmlns` prefix
                }
                fromNode.setAttributeNS(attrNamespaceURI, attrName, attrValue);
            }
        } else {
            fromValue = fromNode.getAttribute(attrName);

            if (fromValue !== attrValue) {
                fromNode.setAttribute(attrName, attrValue);
            }
        }
    }

    // Remove any extra attributes found on the original DOM element that
    // weren't found on the target element.
    var fromNodeAttrs = fromNode.attributes;

    for (var d = fromNodeAttrs.length - 1; d >= 0; d--) {
        attr = fromNodeAttrs[d];
        attrName = attr.name;
        attrNamespaceURI = attr.namespaceURI;

        if (attrNamespaceURI) {
            attrName = attr.localName || attrName;

            if (!toNode.hasAttributeNS(attrNamespaceURI, attrName)) {
                fromNode.removeAttributeNS(attrNamespaceURI, attrName);
            }
        } else {
            if (!toNode.hasAttribute(attrName)) {
                fromNode.removeAttribute(attrName);
            }
        }
    }
}

var range; // Create a range object for efficently rendering strings to elements.
var NS_XHTML = 'http://www.w3.org/1999/xhtml';

var doc = typeof document === 'undefined' ? undefined : document;
var HAS_TEMPLATE_SUPPORT = !!doc && 'content' in doc.createElement('template');
var HAS_RANGE_SUPPORT = !!doc && doc.createRange && 'createContextualFragment' in doc.createRange();

function createFragmentFromTemplate(str) {
    var template = doc.createElement('template');
    template.innerHTML = str;
    return template.content.childNodes[0];
}

function createFragmentFromRange(str) {
    if (!range) {
        range = doc.createRange();
        range.selectNode(doc.body);
    }

    var fragment = range.createContextualFragment(str);
    return fragment.childNodes[0];
}

function createFragmentFromWrap(str) {
    var fragment = doc.createElement('body');
    fragment.innerHTML = str;
    return fragment.childNodes[0];
}

/**
 * This is about the same
 * var html = new DOMParser().parseFromString(str, 'text/html');
 * return html.body.firstChild;
 *
 * @method toElement
 * @param {String} str
 */
function toElement(str) {
    str = str.trim();
    if (HAS_TEMPLATE_SUPPORT) {
      // avoid restrictions on content for things like `<tr><th>Hi</th></tr>` which
      // createContextualFragment doesn't support
      // <template> support not available in IE
      return createFragmentFromTemplate(str);
    } else if (HAS_RANGE_SUPPORT) {
      return createFragmentFromRange(str);
    }

    return createFragmentFromWrap(str);
}

/**
 * Returns true if two node's names are the same.
 *
 * NOTE: We don't bother checking `namespaceURI` because you will never find two HTML elements with the same
 *       nodeName and different namespace URIs.
 *
 * @param {Element} a
 * @param {Element} b The target element
 * @return {boolean}
 */
function compareNodeNames(fromEl, toEl) {
    var fromNodeName = fromEl.nodeName;
    var toNodeName = toEl.nodeName;
    var fromCodeStart, toCodeStart;

    if (fromNodeName === toNodeName) {
        return true;
    }

    fromCodeStart = fromNodeName.charCodeAt(0);
    toCodeStart = toNodeName.charCodeAt(0);

    // If the target element is a virtual DOM node or SVG node then we may
    // need to normalize the tag name before comparing. Normal HTML elements that are
    // in the "http://www.w3.org/1999/xhtml"
    // are converted to upper case
    if (fromCodeStart <= 90 && toCodeStart >= 97) { // from is upper and to is lower
        return fromNodeName === toNodeName.toUpperCase();
    } else if (toCodeStart <= 90 && fromCodeStart >= 97) { // to is upper and from is lower
        return toNodeName === fromNodeName.toUpperCase();
    } else {
        return false;
    }
}

/**
 * Create an element, optionally with a known namespace URI.
 *
 * @param {string} name the element name, e.g. 'div' or 'svg'
 * @param {string} [namespaceURI] the element's namespace URI, i.e. the value of
 * its `xmlns` attribute or its inferred namespace.
 *
 * @return {Element}
 */
function createElementNS(name, namespaceURI) {
    return !namespaceURI || namespaceURI === NS_XHTML ?
        doc.createElement(name) :
        doc.createElementNS(namespaceURI, name);
}

/**
 * Copies the children of one DOM element to another DOM element
 */
function moveChildren(fromEl, toEl) {
    var curChild = fromEl.firstChild;
    while (curChild) {
        var nextChild = curChild.nextSibling;
        toEl.appendChild(curChild);
        curChild = nextChild;
    }
    return toEl;
}

function syncBooleanAttrProp(fromEl, toEl, name) {
    if (fromEl[name] !== toEl[name]) {
        fromEl[name] = toEl[name];
        if (fromEl[name]) {
            fromEl.setAttribute(name, '');
        } else {
            fromEl.removeAttribute(name);
        }
    }
}

var specialElHandlers = {
    OPTION: function(fromEl, toEl) {
        var parentNode = fromEl.parentNode;
        if (parentNode) {
            var parentName = parentNode.nodeName.toUpperCase();
            if (parentName === 'OPTGROUP') {
                parentNode = parentNode.parentNode;
                parentName = parentNode && parentNode.nodeName.toUpperCase();
            }
            if (parentName === 'SELECT' && !parentNode.hasAttribute('multiple')) {
                if (fromEl.hasAttribute('selected') && !toEl.selected) {
                    // Workaround for MS Edge bug where the 'selected' attribute can only be
                    // removed if set to a non-empty value:
                    // https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/12087679/
                    fromEl.setAttribute('selected', 'selected');
                    fromEl.removeAttribute('selected');
                }
                // We have to reset select element's selectedIndex to -1, otherwise setting
                // fromEl.selected using the syncBooleanAttrProp below has no effect.
                // The correct selectedIndex will be set in the SELECT special handler below.
                parentNode.selectedIndex = -1;
            }
        }
        syncBooleanAttrProp(fromEl, toEl, 'selected');
    },
    /**
     * The "value" attribute is special for the <input> element since it sets
     * the initial value. Changing the "value" attribute without changing the
     * "value" property will have no effect since it is only used to the set the
     * initial value.  Similar for the "checked" attribute, and "disabled".
     */
    INPUT: function(fromEl, toEl) {
        syncBooleanAttrProp(fromEl, toEl, 'checked');
        syncBooleanAttrProp(fromEl, toEl, 'disabled');

        if (fromEl.value !== toEl.value) {
            fromEl.value = toEl.value;
        }

        if (!toEl.hasAttribute('value')) {
            fromEl.removeAttribute('value');
        }
    },

    TEXTAREA: function(fromEl, toEl) {
        var newValue = toEl.value;
        if (fromEl.value !== newValue) {
            fromEl.value = newValue;
        }

        var firstChild = fromEl.firstChild;
        if (firstChild) {
            // Needed for IE. Apparently IE sets the placeholder as the
            // node value and vise versa. This ignores an empty update.
            var oldValue = firstChild.nodeValue;

            if (oldValue == newValue || (!newValue && oldValue == fromEl.placeholder)) {
                return;
            }

            firstChild.nodeValue = newValue;
        }
    },
    SELECT: function(fromEl, toEl) {
        if (!toEl.hasAttribute('multiple')) {
            var selectedIndex = -1;
            var i = 0;
            // We have to loop through children of fromEl, not toEl since nodes can be moved
            // from toEl to fromEl directly when morphing.
            // At the time this special handler is invoked, all children have already been morphed
            // and appended to / removed from fromEl, so using fromEl here is safe and correct.
            var curChild = fromEl.firstChild;
            var optgroup;
            var nodeName;
            while(curChild) {
                nodeName = curChild.nodeName && curChild.nodeName.toUpperCase();
                if (nodeName === 'OPTGROUP') {
                    optgroup = curChild;
                    curChild = optgroup.firstChild;
                } else {
                    if (nodeName === 'OPTION') {
                        if (curChild.hasAttribute('selected')) {
                            selectedIndex = i;
                            break;
                        }
                        i++;
                    }
                    curChild = curChild.nextSibling;
                    if (!curChild && optgroup) {
                        curChild = optgroup.nextSibling;
                        optgroup = null;
                    }
                }
            }

            fromEl.selectedIndex = selectedIndex;
        }
    }
};

var ELEMENT_NODE = 1;
var DOCUMENT_FRAGMENT_NODE$1 = 11;
var TEXT_NODE = 3;
var COMMENT_NODE = 8;

function noop() {}

function defaultGetNodeKey(node) {
  if (node) {
      return (node.getAttribute && node.getAttribute('id')) || node.id;
  }
}

function morphdomFactory(morphAttrs) {

    return function morphdom(fromNode, toNode, options) {
        if (!options) {
            options = {};
        }

        if (typeof toNode === 'string') {
            if (fromNode.nodeName === '#document' || fromNode.nodeName === 'HTML' || fromNode.nodeName === 'BODY') {
                var toNodeHtml = toNode;
                toNode = doc.createElement('html');
                toNode.innerHTML = toNodeHtml;
            } else {
                toNode = toElement(toNode);
            }
        }

        var getNodeKey = options.getNodeKey || defaultGetNodeKey;
        var onBeforeNodeAdded = options.onBeforeNodeAdded || noop;
        var onNodeAdded = options.onNodeAdded || noop;
        var onBeforeElUpdated = options.onBeforeElUpdated || noop;
        var onElUpdated = options.onElUpdated || noop;
        var onBeforeNodeDiscarded = options.onBeforeNodeDiscarded || noop;
        var onNodeDiscarded = options.onNodeDiscarded || noop;
        var onBeforeElChildrenUpdated = options.onBeforeElChildrenUpdated || noop;
        var childrenOnly = options.childrenOnly === true;

        // This object is used as a lookup to quickly find all keyed elements in the original DOM tree.
        var fromNodesLookup = Object.create(null);
        var keyedRemovalList = [];

        function addKeyedRemoval(key) {
            keyedRemovalList.push(key);
        }

        function walkDiscardedChildNodes(node, skipKeyedNodes) {
            if (node.nodeType === ELEMENT_NODE) {
                var curChild = node.firstChild;
                while (curChild) {

                    var key = undefined;

                    if (skipKeyedNodes && (key = getNodeKey(curChild))) {
                        // If we are skipping keyed nodes then we add the key
                        // to a list so that it can be handled at the very end.
                        addKeyedRemoval(key);
                    } else {
                        // Only report the node as discarded if it is not keyed. We do this because
                        // at the end we loop through all keyed elements that were unmatched
                        // and then discard them in one final pass.
                        onNodeDiscarded(curChild);
                        if (curChild.firstChild) {
                            walkDiscardedChildNodes(curChild, skipKeyedNodes);
                        }
                    }

                    curChild = curChild.nextSibling;
                }
            }
        }

        /**
         * Removes a DOM node out of the original DOM
         *
         * @param  {Node} node The node to remove
         * @param  {Node} parentNode The nodes parent
         * @param  {Boolean} skipKeyedNodes If true then elements with keys will be skipped and not discarded.
         * @return {undefined}
         */
        function removeNode(node, parentNode, skipKeyedNodes) {
            if (onBeforeNodeDiscarded(node) === false) {
                return;
            }

            if (parentNode) {
                parentNode.removeChild(node);
            }

            onNodeDiscarded(node);
            walkDiscardedChildNodes(node, skipKeyedNodes);
        }

        // // TreeWalker implementation is no faster, but keeping this around in case this changes in the future
        // function indexTree(root) {
        //     var treeWalker = document.createTreeWalker(
        //         root,
        //         NodeFilter.SHOW_ELEMENT);
        //
        //     var el;
        //     while((el = treeWalker.nextNode())) {
        //         var key = getNodeKey(el);
        //         if (key) {
        //             fromNodesLookup[key] = el;
        //         }
        //     }
        // }

        // // NodeIterator implementation is no faster, but keeping this around in case this changes in the future
        //
        // function indexTree(node) {
        //     var nodeIterator = document.createNodeIterator(node, NodeFilter.SHOW_ELEMENT);
        //     var el;
        //     while((el = nodeIterator.nextNode())) {
        //         var key = getNodeKey(el);
        //         if (key) {
        //             fromNodesLookup[key] = el;
        //         }
        //     }
        // }

        function indexTree(node) {
            if (node.nodeType === ELEMENT_NODE || node.nodeType === DOCUMENT_FRAGMENT_NODE$1) {
                var curChild = node.firstChild;
                while (curChild) {
                    var key = getNodeKey(curChild);
                    if (key) {
                        fromNodesLookup[key] = curChild;
                    }

                    // Walk recursively
                    indexTree(curChild);

                    curChild = curChild.nextSibling;
                }
            }
        }

        indexTree(fromNode);

        function handleNodeAdded(el) {
            onNodeAdded(el);

            var curChild = el.firstChild;
            while (curChild) {
                var nextSibling = curChild.nextSibling;

                var key = getNodeKey(curChild);
                if (key) {
                    var unmatchedFromEl = fromNodesLookup[key];
                    // if we find a duplicate #id node in cache, replace `el` with cache value
                    // and morph it to the child node.
                    if (unmatchedFromEl && compareNodeNames(curChild, unmatchedFromEl)) {
                        curChild.parentNode.replaceChild(unmatchedFromEl, curChild);
                        morphEl(unmatchedFromEl, curChild);
                    } else {
                      handleNodeAdded(curChild);
                    }
                } else {
                  // recursively call for curChild and it's children to see if we find something in
                  // fromNodesLookup
                  handleNodeAdded(curChild);
                }

                curChild = nextSibling;
            }
        }

        function cleanupFromEl(fromEl, curFromNodeChild, curFromNodeKey) {
            // We have processed all of the "to nodes". If curFromNodeChild is
            // non-null then we still have some from nodes left over that need
            // to be removed
            while (curFromNodeChild) {
                var fromNextSibling = curFromNodeChild.nextSibling;
                if ((curFromNodeKey = getNodeKey(curFromNodeChild))) {
                    // Since the node is keyed it might be matched up later so we defer
                    // the actual removal to later
                    addKeyedRemoval(curFromNodeKey);
                } else {
                    // NOTE: we skip nested keyed nodes from being removed since there is
                    //       still a chance they will be matched up later
                    removeNode(curFromNodeChild, fromEl, true /* skip keyed nodes */);
                }
                curFromNodeChild = fromNextSibling;
            }
        }

        function morphEl(fromEl, toEl, childrenOnly) {
            var toElKey = getNodeKey(toEl);

            if (toElKey) {
                // If an element with an ID is being morphed then it will be in the final
                // DOM so clear it out of the saved elements collection
                delete fromNodesLookup[toElKey];
            }

            if (!childrenOnly) {
                // optional
                if (onBeforeElUpdated(fromEl, toEl) === false) {
                    return;
                }

                // update attributes on original DOM element first
                morphAttrs(fromEl, toEl);
                // optional
                onElUpdated(fromEl);

                if (onBeforeElChildrenUpdated(fromEl, toEl) === false) {
                    return;
                }
            }

            if (fromEl.nodeName !== 'TEXTAREA') {
              morphChildren(fromEl, toEl);
            } else {
              specialElHandlers.TEXTAREA(fromEl, toEl);
            }
        }

        function morphChildren(fromEl, toEl) {
            var curToNodeChild = toEl.firstChild;
            var curFromNodeChild = fromEl.firstChild;
            var curToNodeKey;
            var curFromNodeKey;

            var fromNextSibling;
            var toNextSibling;
            var matchingFromEl;

            // walk the children
            outer: while (curToNodeChild) {
                toNextSibling = curToNodeChild.nextSibling;
                curToNodeKey = getNodeKey(curToNodeChild);

                // walk the fromNode children all the way through
                while (curFromNodeChild) {
                    fromNextSibling = curFromNodeChild.nextSibling;

                    if (curToNodeChild.isSameNode && curToNodeChild.isSameNode(curFromNodeChild)) {
                        curToNodeChild = toNextSibling;
                        curFromNodeChild = fromNextSibling;
                        continue outer;
                    }

                    curFromNodeKey = getNodeKey(curFromNodeChild);

                    var curFromNodeType = curFromNodeChild.nodeType;

                    // this means if the curFromNodeChild doesnt have a match with the curToNodeChild
                    var isCompatible = undefined;

                    if (curFromNodeType === curToNodeChild.nodeType) {
                        if (curFromNodeType === ELEMENT_NODE) {
                            // Both nodes being compared are Element nodes

                            if (curToNodeKey) {
                                // The target node has a key so we want to match it up with the correct element
                                // in the original DOM tree
                                if (curToNodeKey !== curFromNodeKey) {
                                    // The current element in the original DOM tree does not have a matching key so
                                    // let's check our lookup to see if there is a matching element in the original
                                    // DOM tree
                                    if ((matchingFromEl = fromNodesLookup[curToNodeKey])) {
                                        if (fromNextSibling === matchingFromEl) {
                                            // Special case for single element removals. To avoid removing the original
                                            // DOM node out of the tree (since that can break CSS transitions, etc.),
                                            // we will instead discard the current node and wait until the next
                                            // iteration to properly match up the keyed target element with its matching
                                            // element in the original tree
                                            isCompatible = false;
                                        } else {
                                            // We found a matching keyed element somewhere in the original DOM tree.
                                            // Let's move the original DOM node into the current position and morph
                                            // it.

                                            // NOTE: We use insertBefore instead of replaceChild because we want to go through
                                            // the `removeNode()` function for the node that is being discarded so that
                                            // all lifecycle hooks are correctly invoked
                                            fromEl.insertBefore(matchingFromEl, curFromNodeChild);

                                            // fromNextSibling = curFromNodeChild.nextSibling;

                                            if (curFromNodeKey) {
                                                // Since the node is keyed it might be matched up later so we defer
                                                // the actual removal to later
                                                addKeyedRemoval(curFromNodeKey);
                                            } else {
                                                // NOTE: we skip nested keyed nodes from being removed since there is
                                                //       still a chance they will be matched up later
                                                removeNode(curFromNodeChild, fromEl, true /* skip keyed nodes */);
                                            }

                                            curFromNodeChild = matchingFromEl;
                                        }
                                    } else {
                                        // The nodes are not compatible since the "to" node has a key and there
                                        // is no matching keyed node in the source tree
                                        isCompatible = false;
                                    }
                                }
                            } else if (curFromNodeKey) {
                                // The original has a key
                                isCompatible = false;
                            }

                            isCompatible = isCompatible !== false && compareNodeNames(curFromNodeChild, curToNodeChild);
                            if (isCompatible) {
                                // We found compatible DOM elements so transform
                                // the current "from" node to match the current
                                // target DOM node.
                                // MORPH
                                morphEl(curFromNodeChild, curToNodeChild);
                            }

                        } else if (curFromNodeType === TEXT_NODE || curFromNodeType == COMMENT_NODE) {
                            // Both nodes being compared are Text or Comment nodes
                            isCompatible = true;
                            // Simply update nodeValue on the original node to
                            // change the text value
                            if (curFromNodeChild.nodeValue !== curToNodeChild.nodeValue) {
                                curFromNodeChild.nodeValue = curToNodeChild.nodeValue;
                            }

                        }
                    }

                    if (isCompatible) {
                        // Advance both the "to" child and the "from" child since we found a match
                        // Nothing else to do as we already recursively called morphChildren above
                        curToNodeChild = toNextSibling;
                        curFromNodeChild = fromNextSibling;
                        continue outer;
                    }

                    // No compatible match so remove the old node from the DOM and continue trying to find a
                    // match in the original DOM. However, we only do this if the from node is not keyed
                    // since it is possible that a keyed node might match up with a node somewhere else in the
                    // target tree and we don't want to discard it just yet since it still might find a
                    // home in the final DOM tree. After everything is done we will remove any keyed nodes
                    // that didn't find a home
                    if (curFromNodeKey) {
                        // Since the node is keyed it might be matched up later so we defer
                        // the actual removal to later
                        addKeyedRemoval(curFromNodeKey);
                    } else {
                        // NOTE: we skip nested keyed nodes from being removed since there is
                        //       still a chance they will be matched up later
                        removeNode(curFromNodeChild, fromEl, true /* skip keyed nodes */);
                    }

                    curFromNodeChild = fromNextSibling;
                } // END: while(curFromNodeChild) {}

                // If we got this far then we did not find a candidate match for
                // our "to node" and we exhausted all of the children "from"
                // nodes. Therefore, we will just append the current "to" node
                // to the end
                if (curToNodeKey && (matchingFromEl = fromNodesLookup[curToNodeKey]) && compareNodeNames(matchingFromEl, curToNodeChild)) {
                    fromEl.appendChild(matchingFromEl);
                    // MORPH
                    morphEl(matchingFromEl, curToNodeChild);
                } else {
                    var onBeforeNodeAddedResult = onBeforeNodeAdded(curToNodeChild);
                    if (onBeforeNodeAddedResult !== false) {
                        if (onBeforeNodeAddedResult) {
                            curToNodeChild = onBeforeNodeAddedResult;
                        }

                        if (curToNodeChild.actualize) {
                            curToNodeChild = curToNodeChild.actualize(fromEl.ownerDocument || doc);
                        }
                        fromEl.appendChild(curToNodeChild);
                        handleNodeAdded(curToNodeChild);
                    }
                }

                curToNodeChild = toNextSibling;
                curFromNodeChild = fromNextSibling;
            }

            cleanupFromEl(fromEl, curFromNodeChild, curFromNodeKey);

            var specialElHandler = specialElHandlers[fromEl.nodeName];
            if (specialElHandler) {
                specialElHandler(fromEl, toEl);
            }
        } // END: morphChildren(...)

        var morphedNode = fromNode;
        var morphedNodeType = morphedNode.nodeType;
        var toNodeType = toNode.nodeType;

        if (!childrenOnly) {
            // Handle the case where we are given two DOM nodes that are not
            // compatible (e.g. <div> --> <span> or <div> --> TEXT)
            if (morphedNodeType === ELEMENT_NODE) {
                if (toNodeType === ELEMENT_NODE) {
                    if (!compareNodeNames(fromNode, toNode)) {
                        onNodeDiscarded(fromNode);
                        morphedNode = moveChildren(fromNode, createElementNS(toNode.nodeName, toNode.namespaceURI));
                    }
                } else {
                    // Going from an element node to a text node
                    morphedNode = toNode;
                }
            } else if (morphedNodeType === TEXT_NODE || morphedNodeType === COMMENT_NODE) { // Text or comment node
                if (toNodeType === morphedNodeType) {
                    if (morphedNode.nodeValue !== toNode.nodeValue) {
                        morphedNode.nodeValue = toNode.nodeValue;
                    }

                    return morphedNode;
                } else {
                    // Text node to something else
                    morphedNode = toNode;
                }
            }
        }

        if (morphedNode === toNode) {
            // The "to node" was not compatible with the "from node" so we had to
            // toss out the "from node" and use the "to node"
            onNodeDiscarded(fromNode);
        } else {
            if (toNode.isSameNode && toNode.isSameNode(morphedNode)) {
                return;
            }

            morphEl(morphedNode, toNode, childrenOnly);

            // We now need to loop over any keyed nodes that might need to be
            // removed. We only do the removal if we know that the keyed node
            // never found a match. When a keyed node is matched up we remove
            // it out of fromNodesLookup and we use fromNodesLookup to determine
            // if a keyed node has been matched up or not
            if (keyedRemovalList) {
                for (var i=0, len=keyedRemovalList.length; i<len; i++) {
                    var elToRemove = fromNodesLookup[keyedRemovalList[i]];
                    if (elToRemove) {
                        removeNode(elToRemove, elToRemove.parentNode, false);
                    }
                }
            }
        }

        if (!childrenOnly && morphedNode !== fromNode && fromNode.parentNode) {
            if (morphedNode.actualize) {
                morphedNode = morphedNode.actualize(fromNode.ownerDocument || doc);
            }
            // If we had to swap out the from node with a new node because the old
            // node was not compatible with the target node then we need to
            // replace the old DOM node in the original DOM tree. This is only
            // possible if the original DOM node was part of a DOM tree which
            // we know is the case if it has a parent node.
            fromNode.parentNode.replaceChild(morphedNode, fromNode);
        }

        return morphedNode;
    };
}

var morphdom = morphdomFactory(morphAttrs);

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (morphdom);


/***/ }),

/***/ "./node_modules/stimulus/index.js":
/*!****************************************!*\
  !*** ./node_modules/stimulus/index.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Application": () => (/* reexport safe */ _stimulus_core__WEBPACK_IMPORTED_MODULE_0__.Application),
/* harmony export */   "Context": () => (/* reexport safe */ _stimulus_core__WEBPACK_IMPORTED_MODULE_0__.Context),
/* harmony export */   "Controller": () => (/* reexport safe */ _stimulus_core__WEBPACK_IMPORTED_MODULE_0__.Controller),
/* harmony export */   "defaultSchema": () => (/* reexport safe */ _stimulus_core__WEBPACK_IMPORTED_MODULE_0__.defaultSchema)
/* harmony export */ });
/* harmony import */ var _stimulus_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @stimulus/core */ "./node_modules/@stimulus/core/dist/index.js");



/***/ }),

/***/ "./node_modules/stimulus_reflex/javascript/attributes.js":
/*!***************************************************************!*\
  !*** ./node_modules/stimulus_reflex/javascript/attributes.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "attributeValue": () => (/* binding */ attributeValue),
/* harmony export */   "attributeValues": () => (/* binding */ attributeValues),
/* harmony export */   "extractElementAttributes": () => (/* binding */ extractElementAttributes),
/* harmony export */   "extractElementDataset": () => (/* binding */ extractElementDataset),
/* harmony export */   "extractDataAttributes": () => (/* binding */ extractDataAttributes)
/* harmony export */ });
/* harmony import */ var _reflexes__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./reflexes */ "./node_modules/stimulus_reflex/javascript/reflexes.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils */ "./node_modules/stimulus_reflex/javascript/utils.js");
/* harmony import */ var _debug__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./debug */ "./node_modules/stimulus_reflex/javascript/debug.js");
/* harmony import */ var _deprecate__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./deprecate */ "./node_modules/stimulus_reflex/javascript/deprecate.js");





const multipleInstances = element => {
  if (['checkbox', 'radio'].includes(element.type)) {
    return (
      document.querySelectorAll(
        `input[type="${element.type}"][name="${element.name}"]`
      ).length > 1
    )
  }
  return false
}
const collectCheckedOptions = element => {
  return Array.from(element.querySelectorAll('option:checked'))
    .concat(
      Array.from(
        document.querySelectorAll(
          `input[type="${element.type}"][name="${element.name}"]`
        )
      ).filter(elem => elem.checked)
    )
    .map(o => o.value)
}

// Returns a string value for the passed array.
//
//   attributeValue(['', 'one', null, 'two', 'three ']) // 'one two three'
//
const attributeValue = (values = []) => {
  const value = values
    .filter(v => v && String(v).length)
    .map(v => v.trim())
    .join(' ')
    .trim()
  return value.length ? value : null
}

// Returns an array for the passed string value by splitting on whitespace.
//
//   attributeValues('one two three ') // ['one', 'two', 'three']
//
const attributeValues = value => {
  if (!value) return []
  if (!value.length) return []
  return value.split(' ').filter(v => v.trim().length)
}

// Extracts attributes from a DOM element.
//
const extractElementAttributes = element => {
  let attrs = Array.from(element.attributes).reduce((memo, attr) => {
    memo[attr.name] = attr.value
    return memo
  }, {})

  attrs.checked = !!element.checked
  attrs.selected = !!element.selected
  attrs.tag_name = element.tagName

  if (element.tagName.match(/select/i) || multipleInstances(element)) {
    const collectedOptions = collectCheckedOptions(element)
    attrs.values = collectedOptions
    attrs.value = collectedOptions.join(',')
  } else {
    attrs.value = element.value
  }
  return attrs
}

// Returns an array of elements for the provided tokens.
// Tokens is an array of space separated string coming from the `data-reflex-dataset`
// or `data-reflex-dataset-all` attribute.
//
const getElementsFromTokens = (element, tokens) => {
  if (!tokens || tokens.length === 0) return []

  let elements = [element]

  const xPath = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.elementToXPath)(element)

  tokens.forEach(token => {
    try {
      switch (token) {
        case 'combined':
          if (_deprecate__WEBPACK_IMPORTED_MODULE_3__.default.enabled)
            console.warn(
              "In the next version of StimulusReflex, the 'combined' option to data-reflex-dataset will become 'ancestors'."
            )
          elements = [
            ...elements,
            ...(0,_utils__WEBPACK_IMPORTED_MODULE_1__.XPathToArray)(`${xPath}/ancestor::*`, true)
          ]
          break
        case 'ancestors':
          elements = [
            ...elements,
            ...(0,_utils__WEBPACK_IMPORTED_MODULE_1__.XPathToArray)(`${xPath}/ancestor::*`, true)
          ]
          break
        case 'parent':
          elements = [...elements, ...(0,_utils__WEBPACK_IMPORTED_MODULE_1__.XPathToArray)(`${xPath}/parent::*`)]
          break
        case 'siblings':
          elements = [
            ...elements,
            ...(0,_utils__WEBPACK_IMPORTED_MODULE_1__.XPathToArray)(
              `${xPath}/preceding-sibling::*|${xPath}/following-sibling::*`
            )
          ]
          break
        case 'children':
          elements = [...elements, ...(0,_utils__WEBPACK_IMPORTED_MODULE_1__.XPathToArray)(`${xPath}/child::*`)]
          break
        case 'descendants':
          elements = [...elements, ...(0,_utils__WEBPACK_IMPORTED_MODULE_1__.XPathToArray)(`${xPath}/descendant::*`)]
          break
        default:
          elements = [...elements, ...document.querySelectorAll(token)]
      }
    } catch (error) {
      if (_debug__WEBPACK_IMPORTED_MODULE_2__.default.enabled) console.error(error)
    }
  })

  return elements
}

// Extracts the dataset of an element and combines it with the data attributes from all specified tokens
//
const extractElementDataset = element => {
  const dataset = element.attributes[_reflexes__WEBPACK_IMPORTED_MODULE_0__.default.app.schema.reflexDatasetAttribute]
  const allDataset =
    element.attributes[_reflexes__WEBPACK_IMPORTED_MODULE_0__.default.app.schema.reflexDatasetAllAttribute]

  const tokens = (dataset && dataset.value.split(' ')) || []
  const allTokens = (allDataset && allDataset.value.split(' ')) || []

  const datasetElements = getElementsFromTokens(element, tokens)
  const datasetAllElements = getElementsFromTokens(element, allTokens)

  const datasetAttribtues = datasetElements.reduce((acc, ele) => {
    return { ...extractDataAttributes(ele), ...acc }
  }, {})

  const reflexElementAttribtues = extractDataAttributes(element)

  const elementDataset = {
    dataset: { ...reflexElementAttribtues, ...datasetAttribtues },
    datasetAll: {}
  }

  datasetAllElements.forEach(element => {
    const elementAttributes = extractDataAttributes(element)

    Object.keys(elementAttributes).forEach(key => {
      const value = elementAttributes[key]

      if (
        elementDataset.datasetAll[key] &&
        Array.isArray(elementDataset.datasetAll[key])
      ) {
        elementDataset.datasetAll[key].push(value)
      } else {
        elementDataset.datasetAll[key] = [value]
      }
    })
  })

  return elementDataset
}

// Extracts all data attributes from a DOM element.
//
const extractDataAttributes = element => {
  let attrs = {}

  if (element && element.attributes) {
    Array.from(element.attributes).forEach(attr => {
      if (attr.name.startsWith('data-')) {
        attrs[attr.name] = attr.value
      }
    })
  }

  return attrs
}


/***/ }),

/***/ "./node_modules/stimulus_reflex/javascript/callbacks.js":
/*!**************************************************************!*\
  !*** ./node_modules/stimulus_reflex/javascript/callbacks.js ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "beforeDOMUpdate": () => (/* binding */ beforeDOMUpdate),
/* harmony export */   "afterDOMUpdate": () => (/* binding */ afterDOMUpdate),
/* harmony export */   "serverMessage": () => (/* binding */ serverMessage)
/* harmony export */ });
/* harmony import */ var cable_ready__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! cable_ready */ "./node_modules/cable_ready/javascript/index.js");
/* harmony import */ var _reflexes__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./reflexes */ "./node_modules/stimulus_reflex/javascript/reflexes.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils */ "./node_modules/stimulus_reflex/javascript/utils.js");
/* harmony import */ var _lifecycle__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./lifecycle */ "./node_modules/stimulus_reflex/javascript/lifecycle.js");
/* harmony import */ var _log__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./log */ "./node_modules/stimulus_reflex/javascript/log.js");
/* harmony import */ var _debug__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./debug */ "./node_modules/stimulus_reflex/javascript/debug.js");







const beforeDOMUpdate = event => {
  const { stimulusReflex } = event.detail || {}
  if (!stimulusReflex) return
  const { reflexId, xpathElement, xpathController } = stimulusReflex
  const controllerElement = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.XPathToElement)(xpathController)
  const reflexElement = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.XPathToElement)(xpathElement)
  const reflex = _reflexes__WEBPACK_IMPORTED_MODULE_1__.default[reflexId]
  const promise = reflex.promise
  const payload = event.detail.payload

  reflex.pendingOperations--

  if (reflex.pendingOperations > 0) return

  if (!stimulusReflex.resolveLate)
    setTimeout(() =>
      promise.resolve({
        element: reflexElement,
        event,
        data: promise.data,
        payload
      })
    )

  setTimeout(() =>
    (0,_lifecycle__WEBPACK_IMPORTED_MODULE_3__.dispatchLifecycleEvent)(
      'success',
      reflexElement,
      controllerElement,
      reflexId,
      payload
    )
  )
}

const afterDOMUpdate = event => {
  const { stimulusReflex } = event.detail || {}
  if (!stimulusReflex) return
  const { reflexId, xpathElement, xpathController } = stimulusReflex
  const controllerElement = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.XPathToElement)(xpathController)
  const reflexElement = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.XPathToElement)(xpathElement)
  const reflex = _reflexes__WEBPACK_IMPORTED_MODULE_1__.default[reflexId]
  const promise = reflex.promise
  const payload = event.detail.payload

  reflex.completedOperations++

  if (_debug__WEBPACK_IMPORTED_MODULE_5__.default.enabled) _log__WEBPACK_IMPORTED_MODULE_4__.default.success(event)

  if (reflex.completedOperations < reflex.totalOperations) return

  if (stimulusReflex.resolveLate)
    setTimeout(() =>
      promise.resolve({
        element: reflexElement,
        event,
        data: promise.data,
        payload
      })
    )

  setTimeout(() =>
    (0,_lifecycle__WEBPACK_IMPORTED_MODULE_3__.dispatchLifecycleEvent)(
      'finalize',
      reflexElement,
      controllerElement,
      reflexId,
      payload
    )
  )

  cable_ready__WEBPACK_IMPORTED_MODULE_0__.default.perform(reflex.piggybackOperations)
}

const serverMessage = event => {
  const { reflexId, serverMessage, xpathController, xpathElement } =
    event.detail.stimulusReflex || {}
  const { subject, body } = serverMessage
  const controllerElement = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.XPathToElement)(xpathController)
  const reflexElement = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.XPathToElement)(xpathElement)
  const reflex = _reflexes__WEBPACK_IMPORTED_MODULE_1__.default[reflexId]
  const promise = reflex.promise
  const subjects = { error: true, halted: true, nothing: true, success: true }
  const payload = event.detail.payload

  if (controllerElement) {
    controllerElement.reflexError = controllerElement.reflexError || {}
    if (subject === 'error') controllerElement.reflexError[reflexId] = body
  }

  promise[subject === 'error' ? 'reject' : 'resolve']({
    data: promise.data,
    element: reflexElement,
    event,
    toString: () => body,
    payload
  })

  reflex.finalStage = subject === 'halted' ? 'halted' : 'after'

  if (_debug__WEBPACK_IMPORTED_MODULE_5__.default.enabled) _log__WEBPACK_IMPORTED_MODULE_4__.default[subject === 'error' ? 'error' : 'success'](event)

  if (subjects[subject])
    (0,_lifecycle__WEBPACK_IMPORTED_MODULE_3__.dispatchLifecycleEvent)(
      subject,
      reflexElement,
      controllerElement,
      reflexId,
      payload
    )

  cable_ready__WEBPACK_IMPORTED_MODULE_0__.default.perform(reflex.piggybackOperations)
}


/***/ }),

/***/ "./node_modules/stimulus_reflex/javascript/controllers.js":
/*!****************************************************************!*\
  !*** ./node_modules/stimulus_reflex/javascript/controllers.js ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "allReflexControllers": () => (/* binding */ allReflexControllers),
/* harmony export */   "findControllerByReflexName": () => (/* binding */ findControllerByReflexName)
/* harmony export */ });
/* harmony import */ var _attributes__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./attributes */ "./node_modules/stimulus_reflex/javascript/attributes.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils */ "./node_modules/stimulus_reflex/javascript/utils.js");



// Returns StimulusReflex controllers local to the passed element based on the data-controller attribute.
//
const localReflexControllers = (app, element) => {
  return (0,_attributes__WEBPACK_IMPORTED_MODULE_0__.attributeValues)(
    element.getAttribute(app.schema.controllerAttribute)
  ).reduce((memo, name) => {
    const controller = app.getControllerForElementAndIdentifier(element, name)
    if (controller && controller.StimulusReflex) memo.push(controller)
    return memo
  }, [])
}

// Returns all StimulusReflex controllers for the passed element.
// Traverses DOM ancestors starting with element.
//
const allReflexControllers = (app, element) => {
  let controllers = []
  while (element) {
    controllers = controllers.concat(localReflexControllers(app, element))
    element = element.parentElement
  }
  return controllers
}

// Given a reflex string such as 'click->TestReflex#create' and a list of
// controllers. It will find the matching controller based on the controller's
// identifier. e.g. Given these controller identifiers ['foo', 'bar', 'test'],
// it would select the 'test' controller.
const findControllerByReflexName = (reflexName, controllers) => {
  const controller = controllers.find(controller => {
    if (!controller.identifier) return

    return (
      (0,_utils__WEBPACK_IMPORTED_MODULE_1__.extractReflexName)(reflexName).toLowerCase() ===
      controller.identifier.toLowerCase()
    )
  })

  return controller || controllers[0]
}


/***/ }),

/***/ "./node_modules/stimulus_reflex/javascript/debug.js":
/*!**********************************************************!*\
  !*** ./node_modules/stimulus_reflex/javascript/debug.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
let debugging = false

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  get enabled () {
    return debugging
  },
  get disabled () {
    return !debugging
  },
  get value () {
    return debugging
  },
  set (value) {
    debugging = !!value
  },
  set debug (value) {
    debugging = !!value
  }
});


/***/ }),

/***/ "./node_modules/stimulus_reflex/javascript/deprecate.js":
/*!**************************************************************!*\
  !*** ./node_modules/stimulus_reflex/javascript/deprecate.js ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
let deprecationWarnings = true

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  get enabled () {
    return deprecationWarnings
  },
  get disabled () {
    return !deprecationWarnings
  },
  get value () {
    return deprecationWarnings
  },
  set (value) {
    deprecationWarnings = !!value
  },
  set deprecate (value) {
    deprecationWarnings = !!value
  }
});


/***/ }),

/***/ "./node_modules/stimulus_reflex/javascript/isolation_mode.js":
/*!*******************************************************************!*\
  !*** ./node_modules/stimulus_reflex/javascript/isolation_mode.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
let isolationMode = false

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  get disabled () {
    return !isolationMode
  },
  set (value) {
    isolationMode = value
  }
});


/***/ }),

/***/ "./node_modules/stimulus_reflex/javascript/lifecycle.js":
/*!**************************************************************!*\
  !*** ./node_modules/stimulus_reflex/javascript/lifecycle.js ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "dispatchLifecycleEvent": () => (/* binding */ dispatchLifecycleEvent)
/* harmony export */ });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ "./node_modules/stimulus_reflex/javascript/utils.js");
/* harmony import */ var _debug__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./debug */ "./node_modules/stimulus_reflex/javascript/debug.js");
/* harmony import */ var _reflexes__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./reflexes */ "./node_modules/stimulus_reflex/javascript/reflexes.js");




// Invokes a lifecycle method on a StimulusReflex controller.
//
// - stage - the lifecycle stage
//   * before
//   * success
//   * error
//   * halted
//   * after
//   * finalize
//
// - reflexElement - the element that triggered the Reflex (not necessarily the StimulusReflex Controller Element)
//
// - controllerElement - the element holding the StimulusReflex Controller
//
// - reflexId - the UUIDv4 which uniquely identifies the Reflex
//
const invokeLifecycleMethod = (
  stage,
  reflexElement,
  controllerElement,
  reflexId,
  payload
) => {
  if (!controllerElement || !controllerElement.reflexData[reflexId]) return

  const controller = controllerElement.reflexController[reflexId]
  const reflex = controllerElement.reflexData[reflexId].target
  const reflexMethodName = reflex.split('#')[1]

  const specificLifecycleMethodName = ['before', 'after', 'finalize'].includes(
    stage
  )
    ? `${stage}${(0,_utils__WEBPACK_IMPORTED_MODULE_0__.camelize)(reflexMethodName)}`
    : `${(0,_utils__WEBPACK_IMPORTED_MODULE_0__.camelize)(reflexMethodName, false)}${(0,_utils__WEBPACK_IMPORTED_MODULE_0__.camelize)(stage)}`
  const specificLifecycleMethod = controller[specificLifecycleMethodName]

  const genericLifecycleMethodName = ['before', 'after', 'finalize'].includes(
    stage
  )
    ? `${stage}Reflex`
    : `reflex${(0,_utils__WEBPACK_IMPORTED_MODULE_0__.camelize)(stage)}`
  const genericLifecycleMethod = controller[genericLifecycleMethodName]

  if (typeof specificLifecycleMethod === 'function') {
    specificLifecycleMethod.call(
      controller,
      reflexElement,
      reflex,
      controllerElement.reflexError[reflexId],
      reflexId,
      payload
    )
  }

  if (typeof genericLifecycleMethod === 'function') {
    genericLifecycleMethod.call(
      controller,
      reflexElement,
      reflex,
      controllerElement.reflexError[reflexId],
      reflexId,
      payload
    )
  }

  if (_reflexes__WEBPACK_IMPORTED_MODULE_2__.default[reflexId] && stage === _reflexes__WEBPACK_IMPORTED_MODULE_2__.default[reflexId].finalStage) {
    Reflect.deleteProperty(controllerElement.reflexController, reflexId)
    Reflect.deleteProperty(controllerElement.reflexData, reflexId)
    Reflect.deleteProperty(controllerElement.reflexError, reflexId)
    // Removing this on a trial basis
    // 1. Prevents race condition with CR broadcasts
    // 2. Planning to remove it for v4 as part of queueing refactor
    // 3. Removing reflexes shouldn't be the responsibility of the lifecycle subsystem
    // Reflect.deleteProperty(reflexes, reflexId)
  }
}

document.addEventListener(
  'stimulus-reflex:before',
  event =>
    invokeLifecycleMethod(
      'before',
      event.detail.element,
      event.detail.controller.element,
      event.detail.reflexId,
      event.detail.payload
    ),
  true
)

document.addEventListener(
  'stimulus-reflex:success',
  event => {
    invokeLifecycleMethod(
      'success',
      event.detail.element,
      event.detail.controller.element,
      event.detail.reflexId,
      event.detail.payload
    )
    dispatchLifecycleEvent(
      'after',
      event.detail.element,
      event.detail.controller.element,
      event.detail.reflexId,
      event.detail.payload
    )
  },
  true
)

document.addEventListener(
  'stimulus-reflex:nothing',
  event => {
    invokeLifecycleMethod(
      'success',
      event.detail.element,
      event.detail.controller.element,
      event.detail.reflexId,
      event.detail.payload
    )
    dispatchLifecycleEvent(
      'after',
      event.detail.element,
      event.detail.controller.element,
      event.detail.reflexId,
      event.detail.payload
    )
  },
  true
)

document.addEventListener(
  'stimulus-reflex:error',
  event => {
    invokeLifecycleMethod(
      'error',
      event.detail.element,
      event.detail.controller.element,
      event.detail.reflexId,
      event.detail.payload
    )
    dispatchLifecycleEvent(
      'after',
      event.detail.element,
      event.detail.controller.element,
      event.detail.reflexId,
      event.detail.payload
    )
  },
  true
)

document.addEventListener(
  'stimulus-reflex:halted',
  event =>
    invokeLifecycleMethod(
      'halted',
      event.detail.element,
      event.detail.controller.element,
      event.detail.reflexId,
      event.detail.payload
    ),
  true
)

document.addEventListener(
  'stimulus-reflex:after',
  event =>
    invokeLifecycleMethod(
      'after',
      event.detail.element,
      event.detail.controller.element,
      event.detail.reflexId,
      event.detail.payload
    ),
  true
)

document.addEventListener(
  'stimulus-reflex:finalize',
  event =>
    invokeLifecycleMethod(
      'finalize',
      event.detail.element,
      event.detail.controller.element,
      event.detail.reflexId,
      event.detail.payload
    ),
  true
)

// Dispatches a lifecycle event on document
//
// - stage - the lifecycle stage
//   * before
//   * success
//   * error
//   * halted
//   * after
//   * finalize
//
// - reflexElement - the element that triggered the Reflex (not necessarily the StimulusReflex Controller Element)
//
// - controllerElement - the element holding the StimulusReflex Controller
//
// - reflexId - the UUIDv4 which uniquely identifies the Reflex
//
const dispatchLifecycleEvent = (
  stage,
  reflexElement,
  controllerElement,
  reflexId,
  payload
) => {
  if (!controllerElement) {
    if (_debug__WEBPACK_IMPORTED_MODULE_1__.default.enabled && !_reflexes__WEBPACK_IMPORTED_MODULE_2__.default[reflexId].warned) {
      console.warn(
        `StimulusReflex was not able execute callbacks or emit events for "${stage}" or later life-cycle stages for this Reflex. The StimulusReflex Controller Element is no longer present in the DOM. Could you move the StimulusReflex Controller to an element higher in your DOM?`
      )
      _reflexes__WEBPACK_IMPORTED_MODULE_2__.default[reflexId].warned = true
    }
    return
  }

  if (
    !controllerElement.reflexController ||
    (controllerElement.reflexController &&
      !controllerElement.reflexController[reflexId])
  ) {
    if (_debug__WEBPACK_IMPORTED_MODULE_1__.default.enabled && !_reflexes__WEBPACK_IMPORTED_MODULE_2__.default[reflexId].warned) {
      console.warn(
        `StimulusReflex detected that the StimulusReflex Controller responsible for this Reflex has been replaced with a new instance. Callbacks and events for "${stage}" or later life-cycle stages cannot be executed.`
      )
      _reflexes__WEBPACK_IMPORTED_MODULE_2__.default[reflexId].warned = true
    }
    return
  }

  const { target } = controllerElement.reflexData[reflexId] || {}
  const controller = controllerElement.reflexController[reflexId] || {}
  const event = `stimulus-reflex:${stage}`
  const detail = {
    reflex: target,
    controller,
    reflexId,
    element: reflexElement,
    payload
  }

  controllerElement.dispatchEvent(
    new CustomEvent(event, { bubbles: true, cancelable: false, detail })
  )
  if (window.jQuery) window.jQuery(controllerElement).trigger(event, detail)
}


/***/ }),

/***/ "./node_modules/stimulus_reflex/javascript/log.js":
/*!********************************************************!*\
  !*** ./node_modules/stimulus_reflex/javascript/log.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _reflexes__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./reflexes */ "./node_modules/stimulus_reflex/javascript/reflexes.js");


function request (
  reflexId,
  target,
  args,
  controller,
  element,
  controllerElement
) {
  _reflexes__WEBPACK_IMPORTED_MODULE_0__.default[reflexId].timestamp = new Date()
  console.log(`\u2191 stimulus \u2191 ${target}`, {
    reflexId,
    args,
    controller,
    element,
    controllerElement
  })
}

function success (event) {
  const { detail } = event || {}
  const { selector, payload } = detail || {}
  const { reflexId, target, morph, serverMessage } = detail.stimulusReflex || {}
  const reflex = _reflexes__WEBPACK_IMPORTED_MODULE_0__.default[reflexId]
  const progress =
    reflex.totalOperations > 1
      ? ` ${reflex.completedOperations}/${reflex.totalOperations}`
      : ''
  const duration = reflex.timestamp
    ? `in ${new Date() - reflex.timestamp}ms`
    : 'CLONED'
  const operation = event.type
    .split(':')[1]
    .split('-')
    .slice(1)
    .join('_')
  const halted = (serverMessage && serverMessage.subject === 'halted') || false
  console.log(
    `\u2193 reflex \u2193 ${target} \u2192 ${selector ||
      '\u221E'}${progress} ${duration}`,
    { reflexId, morph, operation, halted, payload }
  )
}

function error (event) {
  const { detail } = event || {}
  const { reflexId, target, serverMessage } = detail.stimulusReflex || {}
  const reflex = _reflexes__WEBPACK_IMPORTED_MODULE_0__.default[reflexId]
  const duration = reflex.timestamp
    ? `in ${new Date() - reflex.timestamp}ms`
    : 'CLONED'
  const payload = detail.stimulusReflex
  console.log(
    `\u2193 reflex \u2193 ${target} ${duration} %cERROR: ${serverMessage.body}`,
    'color: #f00;',
    { reflexId, payload }
  )
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({ request, success, error });


/***/ }),

/***/ "./node_modules/stimulus_reflex/javascript/reflexes.js":
/*!*************************************************************!*\
  !*** ./node_modules/stimulus_reflex/javascript/reflexes.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   "received": () => (/* binding */ received),
/* harmony export */   "registerReflex": () => (/* binding */ registerReflex),
/* harmony export */   "getReflexRoots": () => (/* binding */ getReflexRoots),
/* harmony export */   "setupDeclarativeReflexes": () => (/* binding */ setupDeclarativeReflexes)
/* harmony export */ });
/* harmony import */ var cable_ready__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! cable_ready */ "./node_modules/cable_ready/javascript/index.js");
/* harmony import */ var _debug__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./debug */ "./node_modules/stimulus_reflex/javascript/debug.js");
/* harmony import */ var _lifecycle__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./lifecycle */ "./node_modules/stimulus_reflex/javascript/lifecycle.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./utils */ "./node_modules/stimulus_reflex/javascript/utils.js");
/* harmony import */ var _controllers__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./controllers */ "./node_modules/stimulus_reflex/javascript/controllers.js");
/* harmony import */ var _attributes__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./attributes */ "./node_modules/stimulus_reflex/javascript/attributes.js");
/* harmony import */ var _isolation_mode__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./isolation_mode */ "./node_modules/stimulus_reflex/javascript/isolation_mode.js");








const reflexes = {}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (reflexes);

const received = data => {
  if (!data.cableReady) return

  let reflexOperations = {}

  for (let name in data.operations) {
    if (data.operations.hasOwnProperty(name)) {
      for (let i = data.operations[name].length - 1; i >= 0; i--) {
        if (
          data.operations[name][i].stimulusReflex ||
          (data.operations[name][i].detail &&
            data.operations[name][i].detail.stimulusReflex)
        ) {
          reflexOperations[name] = reflexOperations[name] || []
          reflexOperations[name].push(data.operations[name][i])
          data.operations[name].splice(i, 1)
        }
      }
      if (!data.operations[name].length)
        Reflect.deleteProperty(data.operations, name)
    }
  }

  let totalOperations = 0
  let reflexData

  const dispatchEvent = reflexOperations['dispatchEvent']
  const morph = reflexOperations['morph']
  const innerHtml = reflexOperations['innerHtml']

  ;[dispatchEvent, morph, innerHtml].forEach(operation => {
    if (operation && operation.length) {
      const urls = Array.from(
        new Set(
          operation.map(m =>
            m.detail ? m.detail.stimulusReflex.url : m.stimulusReflex.url
          )
        )
      )

      if (urls.length !== 1 || urls[0] !== location.href) return
      totalOperations += operation.length

      if (!reflexData) {
        if (operation[0].detail) {
          reflexData = operation[0].detail.stimulusReflex
          reflexData.payload = operation[0].detail.payload
          reflexData.reflexId = operation[0].detail.reflexId
        } else {
          reflexData = operation[0].stimulusReflex
          reflexData.payload = operation[0].payload
        }
      }
    }
  })

  if (reflexData) {
    const { reflexId, payload } = reflexData

    if (!reflexes[reflexId] && _isolation_mode__WEBPACK_IMPORTED_MODULE_6__.default.disabled) {
      const controllerElement = (0,_utils__WEBPACK_IMPORTED_MODULE_3__.XPathToElement)(reflexData.xpathController)
      const reflexElement = (0,_utils__WEBPACK_IMPORTED_MODULE_3__.XPathToElement)(reflexData.xpathElement)
      controllerElement.reflexController =
        controllerElement.reflexController || {}
      controllerElement.reflexData = controllerElement.reflexData || {}
      controllerElement.reflexError = controllerElement.reflexError || {}

      controllerElement.reflexController[
        reflexId
      ] = reflexes.app.getControllerForElementAndIdentifier(
        controllerElement,
        reflexData.reflexController
      )

      controllerElement.reflexData[reflexId] = reflexData
      ;(0,_lifecycle__WEBPACK_IMPORTED_MODULE_2__.dispatchLifecycleEvent)(
        'before',
        reflexElement,
        controllerElement,
        reflexId,
        payload
      )
      registerReflex(reflexData)
    }

    if (reflexes[reflexId]) {
      reflexes[reflexId].totalOperations = totalOperations
      reflexes[reflexId].pendingOperations = totalOperations
      reflexes[reflexId].completedOperations = 0
      reflexes[reflexId].piggybackOperations = data.operations
      cable_ready__WEBPACK_IMPORTED_MODULE_0__.default.perform(reflexOperations)
    }
  } else {
    const operations = Object.entries(data.operations)
    if (operations.length && reflexes[operations[0][1][0].reflexId])
      cable_ready__WEBPACK_IMPORTED_MODULE_0__.default.perform(data.operations)
  }
}

const registerReflex = data => {
  const { reflexId } = data
  reflexes[reflexId] = { finalStage: 'finalize' }

  const promise = new Promise((resolve, reject) => {
    reflexes[reflexId].promise = {
      resolve,
      reject,
      data
    }
  })

  promise.reflexId = reflexId

  if (_debug__WEBPACK_IMPORTED_MODULE_1__.default.enabled) promise.catch(() => {})

  return promise
}

// compute the DOM element(s) which will be the morph root
// use the data-reflex-root attribute on the reflex or the controller
// optional value is a CSS selector(s); comma-separated list
// order of preference is data-reflex, data-controller, document body (default)
const getReflexRoots = element => {
  let list = []
  while (list.length === 0 && element) {
    let reflexRoot = element.getAttribute(
      reflexes.app.schema.reflexRootAttribute
    )
    if (reflexRoot) {
      if (reflexRoot.length === 0 && element.id) reflexRoot = `#${element.id}`
      const selectors = reflexRoot.split(',').filter(s => s.trim().length)
      if (_debug__WEBPACK_IMPORTED_MODULE_1__.default.enabled && selectors.length === 0) {
        console.error(
          `No value found for ${reflexes.app.schema.reflexRootAttribute}. Add an #id to the element or provide a value for ${application.schema.reflexRootAttribute}.`,
          element
        )
      }
      list = list.concat(selectors.filter(s => document.querySelector(s)))
    }
    element = element.parentElement
      ? element.parentElement.closest(
          `[${reflexes.app.schema.reflexRootAttribute}]`
        )
      : null
  }
  return list
}

// Sets up declarative reflex behavior.
// Any elements that define data-reflex will automatically be wired up with the default StimulusReflexController.
//
const setupDeclarativeReflexes = (0,_utils__WEBPACK_IMPORTED_MODULE_3__.debounce)(() => {
  document
    .querySelectorAll(`[${reflexes.app.schema.reflexAttribute}]`)
    .forEach(element => {
      const controllers = (0,_attributes__WEBPACK_IMPORTED_MODULE_5__.attributeValues)(
        element.getAttribute(reflexes.app.schema.controllerAttribute)
      )
      const reflexAttributeNames = (0,_attributes__WEBPACK_IMPORTED_MODULE_5__.attributeValues)(
        element.getAttribute(reflexes.app.schema.reflexAttribute)
      )
      const actions = (0,_attributes__WEBPACK_IMPORTED_MODULE_5__.attributeValues)(
        element.getAttribute(reflexes.app.schema.actionAttribute)
      )
      reflexAttributeNames.forEach(reflexName => {
        const controller = (0,_controllers__WEBPACK_IMPORTED_MODULE_4__.findControllerByReflexName)(
          reflexName,
          (0,_controllers__WEBPACK_IMPORTED_MODULE_4__.allReflexControllers)(reflexes.app, element)
        )
        let action
        if (controller) {
          action = `${reflexName.split('->')[0]}->${
            controller.identifier
          }#__perform`
          if (!actions.includes(action)) actions.push(action)
        } else {
          action = `${reflexName.split('->')[0]}->stimulus-reflex#__perform`
          if (!controllers.includes('stimulus-reflex')) {
            controllers.push('stimulus-reflex')
          }
          if (!actions.includes(action)) actions.push(action)
        }
      })
      const controllerValue = (0,_attributes__WEBPACK_IMPORTED_MODULE_5__.attributeValue)(controllers)
      const actionValue = (0,_attributes__WEBPACK_IMPORTED_MODULE_5__.attributeValue)(actions)
      if (
        controllerValue &&
        element.getAttribute(reflexes.app.schema.controllerAttribute) !=
          controllerValue
      ) {
        element.setAttribute(
          reflexes.app.schema.controllerAttribute,
          controllerValue
        )
      }
      if (
        actionValue &&
        element.getAttribute(reflexes.app.schema.actionAttribute) != actionValue
      )
        element.setAttribute(reflexes.app.schema.actionAttribute, actionValue)
    })
  ;(0,_utils__WEBPACK_IMPORTED_MODULE_3__.emitEvent)('stimulus-reflex:ready')
}, 20)


/***/ }),

/***/ "./node_modules/stimulus_reflex/javascript/schema.js":
/*!***********************************************************!*\
  !*** ./node_modules/stimulus_reflex/javascript/schema.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "defaultSchema": () => (/* binding */ defaultSchema)
/* harmony export */ });
const defaultSchema = {
  reflexAttribute: 'data-reflex',
  reflexPermanentAttribute: 'data-reflex-permanent',
  reflexRootAttribute: 'data-reflex-root',
  reflexDatasetAttribute: 'data-reflex-dataset',
  reflexDatasetAllAttribute: 'data-reflex-dataset-all',
  reflexSerializeFormAttribute: 'data-reflex-serialize-form'
}


/***/ }),

/***/ "./node_modules/stimulus_reflex/javascript/stimulus_reflex.js":
/*!********************************************************************!*\
  !*** ./node_modules/stimulus_reflex/javascript/stimulus_reflex.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var stimulus__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! stimulus */ "./node_modules/stimulus/index.js");
/* harmony import */ var _schema__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./schema */ "./node_modules/stimulus_reflex/javascript/schema.js");
/* harmony import */ var _lifecycle__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./lifecycle */ "./node_modules/stimulus_reflex/javascript/lifecycle.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./utils */ "./node_modules/stimulus_reflex/javascript/utils.js");
/* harmony import */ var _callbacks__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./callbacks */ "./node_modules/stimulus_reflex/javascript/callbacks.js");
/* harmony import */ var _reflexes__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./reflexes */ "./node_modules/stimulus_reflex/javascript/reflexes.js");
/* harmony import */ var _attributes__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./attributes */ "./node_modules/stimulus_reflex/javascript/attributes.js");
/* harmony import */ var _log__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./log */ "./node_modules/stimulus_reflex/javascript/log.js");
/* harmony import */ var _debug__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./debug */ "./node_modules/stimulus_reflex/javascript/debug.js");
/* harmony import */ var _deprecate__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./deprecate */ "./node_modules/stimulus_reflex/javascript/deprecate.js");
/* harmony import */ var _isolation_mode__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./isolation_mode */ "./node_modules/stimulus_reflex/javascript/isolation_mode.js");
/* harmony import */ var _transports_action_cable__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./transports/action_cable */ "./node_modules/stimulus_reflex/javascript/transports/action_cable.js");















// Default StimulusReflexController that is implicitly wired up as data-controller for any DOM elements
// that have configured data-reflex. Note that this default can be overridden when initializing the application.
// i.e. StimulusReflex.initialize(myStimulusApplication, MyCustomDefaultController);
//
class StimulusReflexController extends stimulus__WEBPACK_IMPORTED_MODULE_0__.Controller {
  constructor (...args) {
    super(...args)
    register(this)
  }
}

// Initializes StimulusReflex by registering the default Stimulus controller with the passed Stimulus application.
//
// - application  - the Stimulus application
// - options
//   * controller - [optional] the default StimulusReflexController
//   * consumer   - [optional] the ActionCable consumer
//   * debug      - [false] log all Reflexes to the console
//   * params     - [{}] key/value parameters to send during channel subscription
//   * isolate    - [false] restrict Reflex playback to the tab which initiated it
//   * deprecate  - [true] show warnings regarding upcoming changes to the library
//
const initialize = (application, initializeOptions = {}) => {
  const {
    controller,
    consumer,
    debug,
    params,
    isolate,
    deprecate
  } = initializeOptions
  _transports_action_cable__WEBPACK_IMPORTED_MODULE_11__.default.set(consumer, params)
  setTimeout(() => {
    if (_deprecate__WEBPACK_IMPORTED_MODULE_9__.default.enabled && consumer)
      console.warn(
        "Deprecation warning: the next version of StimulusReflex will obtain a reference to consumer via the Stimulus application object.\nPlease add 'application.consumer = consumer' to your index.js after your Stimulus application has been established, and remove the consumer key from your StimulusReflex initialize() options object."
      )
  })
  _isolation_mode__WEBPACK_IMPORTED_MODULE_10__.default.set(!!isolate)
  setTimeout(() => {
    if (_deprecate__WEBPACK_IMPORTED_MODULE_9__.default.enabled && _isolation_mode__WEBPACK_IMPORTED_MODULE_10__.default.disabled)
      console.warn(
        'Deprecation warning: the next version of StimulusReflex will standardize isolation mode, and the isolate option will be removed.\nPlease update your applications to assume that every tab will be isolated.'
      )
  })
  _reflexes__WEBPACK_IMPORTED_MODULE_5__.default.app = application
  _reflexes__WEBPACK_IMPORTED_MODULE_5__.default.app.schema = { ..._schema__WEBPACK_IMPORTED_MODULE_1__.defaultSchema, ...application.schema }
  _reflexes__WEBPACK_IMPORTED_MODULE_5__.default.app.register(
    'stimulus-reflex',
    controller || StimulusReflexController
  )
  _debug__WEBPACK_IMPORTED_MODULE_8__.default.set(!!debug)
  if (typeof deprecate !== 'undefined') _deprecate__WEBPACK_IMPORTED_MODULE_9__.default.set(deprecate)
  const observer = new MutationObserver(_reflexes__WEBPACK_IMPORTED_MODULE_5__.setupDeclarativeReflexes)
  observer.observe(document.documentElement, {
    attributeFilter: [
      _reflexes__WEBPACK_IMPORTED_MODULE_5__.default.app.schema.reflexAttribute,
      _reflexes__WEBPACK_IMPORTED_MODULE_5__.default.app.schema.actionAttribute
    ],
    childList: true,
    subtree: true
  })
}

// Registers a Stimulus controller and extends it with StimulusReflex behavior
//
// controller - the Stimulus controller
// options - [optional] configuration
//
const register = (controller, options = {}) => {
  const channel = 'StimulusReflex::Channel'
  controller.StimulusReflex = { ...options, channel }
  _transports_action_cable__WEBPACK_IMPORTED_MODULE_11__.default.createSubscription(controller)
  Object.assign(controller, {
    // Indicates if the ActionCable web socket connection is open.
    // The connection must be open before calling stimulate.
    //
    isActionCableConnectionOpen () {
      return this.StimulusReflex.subscription.consumer.connection.isOpen()
    },

    // Invokes a server side reflex method.
    //
    // - target - the reflex target (full name of the server side reflex) i.e. 'ReflexClassName#method'
    // - controllerElement - [optional] the element that triggered the reflex, defaults to this.element
    // - options - [optional] an object that contains at least one of attrs, reflexId, selectors, resolveLate, serializeForm
    // - *args - remaining arguments are forwarded to the server side reflex method
    //
    stimulate () {
      const url = location.href
      const args = Array.from(arguments)
      const target = args.shift() || 'StimulusReflex::Reflex#default_reflex'
      const controllerElement = this.element
      const reflexElement =
        args[0] && args[0].nodeType === Node.ELEMENT_NODE
          ? args.shift()
          : controllerElement
      if (
        reflexElement.type === 'number' &&
        reflexElement.validity &&
        reflexElement.validity.badInput
      ) {
        if (_debug__WEBPACK_IMPORTED_MODULE_8__.default.enabled) console.warn('Reflex aborted: invalid numeric input')
        return
      }
      const options = {}
      if (
        args[0] &&
        typeof args[0] === 'object' &&
        Object.keys(args[0]).filter(key =>
          [
            'attrs',
            'selectors',
            'reflexId',
            'resolveLate',
            'serializeForm'
          ].includes(key)
        ).length
      ) {
        const opts = args.shift()
        Object.keys(opts).forEach(o => (options[o] = opts[o]))
      }
      const attrs = options['attrs'] || (0,_attributes__WEBPACK_IMPORTED_MODULE_6__.extractElementAttributes)(reflexElement)
      const reflexId = options['reflexId'] || (0,_utils__WEBPACK_IMPORTED_MODULE_3__.uuidv4)()
      let selectors = options['selectors'] || (0,_reflexes__WEBPACK_IMPORTED_MODULE_5__.getReflexRoots)(reflexElement)
      if (typeof selectors === 'string') selectors = [selectors]
      const resolveLate = options['resolveLate'] || false
      const dataset = (0,_attributes__WEBPACK_IMPORTED_MODULE_6__.extractElementDataset)(reflexElement)
      const xpathController = (0,_utils__WEBPACK_IMPORTED_MODULE_3__.elementToXPath)(controllerElement)
      const xpathElement = (0,_utils__WEBPACK_IMPORTED_MODULE_3__.elementToXPath)(reflexElement)
      const data = {
        target,
        args,
        url,
        tabId,
        attrs,
        dataset,
        selectors,
        reflexId,
        resolveLate,
        xpathController,
        xpathElement,
        reflexController: this.identifier,
        permanentAttributeName: _reflexes__WEBPACK_IMPORTED_MODULE_5__.default.app.schema.reflexPermanentAttribute
      }
      const { subscription } = this.StimulusReflex

      if (!this.isActionCableConnectionOpen())
        throw 'The ActionCable connection is not open! `this.isActionCableConnectionOpen()` must return true before calling `this.stimulate()`'

      if (!_transports_action_cable__WEBPACK_IMPORTED_MODULE_11__.default.subscriptionActive)
        throw 'The ActionCable channel subscription for StimulusReflex was rejected.'

      // lifecycle setup
      controllerElement.reflexController =
        controllerElement.reflexController || {}
      controllerElement.reflexData = controllerElement.reflexData || {}
      controllerElement.reflexError = controllerElement.reflexError || {}

      controllerElement.reflexController[reflexId] = this
      controllerElement.reflexData[reflexId] = data

      ;(0,_lifecycle__WEBPACK_IMPORTED_MODULE_2__.dispatchLifecycleEvent)(
        'before',
        reflexElement,
        controllerElement,
        reflexId
      )

      setTimeout(() => {
        const { params } = controllerElement.reflexData[reflexId] || {}
        const serializeAttribute =
          reflexElement.attributes[
            _reflexes__WEBPACK_IMPORTED_MODULE_5__.default.app.schema.reflexSerializeFormAttribute
          ]
        if (serializeAttribute) {
          // not needed after v4 because this is only here for the deprecation warning
          options['serializeForm'] = false
          if (serializeAttribute.value === 'true')
            options['serializeForm'] = true
        }

        const form = reflexElement.closest('form')

        if (_deprecate__WEBPACK_IMPORTED_MODULE_9__.default.enabled && options['serializeForm'] === undefined && form)
          console.warn(
            `Deprecation warning: the next version of StimulusReflex will not serialize forms by default.\nPlease set ${_reflexes__WEBPACK_IMPORTED_MODULE_5__.default.app.schema.reflexSerializeFormAttribute}=\"true\" on your Reflex Controller Element or pass { serializeForm: true } as an option to stimulate.`
          )
        const formData =
          options['serializeForm'] === false
            ? ''
            : (0,_utils__WEBPACK_IMPORTED_MODULE_3__.serializeForm)(form, {
                element: reflexElement
              })

        controllerElement.reflexData[reflexId] = {
          ...data,
          params,
          formData
        }

        subscription.send(controllerElement.reflexData[reflexId])
      })

      const promise = (0,_reflexes__WEBPACK_IMPORTED_MODULE_5__.registerReflex)(data)

      if (_debug__WEBPACK_IMPORTED_MODULE_8__.default.enabled) {
        _log__WEBPACK_IMPORTED_MODULE_7__.default.request(
          reflexId,
          target,
          args,
          this.context.scope.identifier,
          reflexElement,
          controllerElement
        )
      }

      return promise
    },

    // Wraps the call to stimulate for any data-reflex elements.
    // This is internal and should not be invoked directly.
    __perform (event) {
      let element = event.target
      let reflex

      while (element && !reflex) {
        reflex = element.getAttribute(_reflexes__WEBPACK_IMPORTED_MODULE_5__.default.app.schema.reflexAttribute)
        if (!reflex || !reflex.trim().length) element = element.parentElement
      }

      const match = (0,_attributes__WEBPACK_IMPORTED_MODULE_6__.attributeValues)(reflex).find(
        reflex => reflex.split('->')[0] === event.type
      )

      if (match) {
        event.preventDefault()
        event.stopPropagation()
        this.stimulate(match.split('->')[1], element)
      }
    }
  })
}

// Uniquely identify this browser tab in each Reflex
const tabId = (0,_utils__WEBPACK_IMPORTED_MODULE_3__.uuidv4)()

const useReflex = (controller, options = {}) => {
  register(controller, options)
}

document.addEventListener('stimulus-reflex:server-message', _callbacks__WEBPACK_IMPORTED_MODULE_4__.serverMessage)
document.addEventListener('cable-ready:before-inner-html', _callbacks__WEBPACK_IMPORTED_MODULE_4__.beforeDOMUpdate)
document.addEventListener('cable-ready:before-morph', _callbacks__WEBPACK_IMPORTED_MODULE_4__.beforeDOMUpdate)
document.addEventListener('cable-ready:after-inner-html', _callbacks__WEBPACK_IMPORTED_MODULE_4__.afterDOMUpdate)
document.addEventListener('cable-ready:after-morph', _callbacks__WEBPACK_IMPORTED_MODULE_4__.afterDOMUpdate)
window.addEventListener('load', _reflexes__WEBPACK_IMPORTED_MODULE_5__.setupDeclarativeReflexes)

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  initialize,
  register,
  useReflex,
  get debug () {
    return _debug__WEBPACK_IMPORTED_MODULE_8__.default.value
  },
  set debug (value) {
    _debug__WEBPACK_IMPORTED_MODULE_8__.default.set(!!value)
  },
  get deprecate () {
    return _deprecate__WEBPACK_IMPORTED_MODULE_9__.default.value
  },
  set deprecate (value) {
    _deprecate__WEBPACK_IMPORTED_MODULE_9__.default.set(!!value)
  }
});


/***/ }),

/***/ "./node_modules/stimulus_reflex/javascript/transports/action_cable.js":
/*!****************************************************************************!*\
  !*** ./node_modules/stimulus_reflex/javascript/transports/action_cable.js ***!
  \****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _rails_actioncable__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @rails/actioncable */ "./node_modules/@rails/actioncable/app/assets/javascripts/action_cable.js");
/* harmony import */ var _rails_actioncable__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_rails_actioncable__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _reflexes__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../reflexes */ "./node_modules/stimulus_reflex/javascript/reflexes.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils */ "./node_modules/stimulus_reflex/javascript/utils.js");




let consumer
let params
let subscriptionActive

const createSubscription = controller => {
  consumer = consumer || controller.application.consumer || (0,_rails_actioncable__WEBPACK_IMPORTED_MODULE_0__.createConsumer)()
  const { channel } = controller.StimulusReflex
  const subscription = { channel, ...params }
  const identifier = JSON.stringify(subscription)

  controller.StimulusReflex.subscription =
    consumer.subscriptions.findAll(identifier)[0] ||
    consumer.subscriptions.create(subscription, {
      received: _reflexes__WEBPACK_IMPORTED_MODULE_1__.received,
      connected,
      rejected,
      disconnected
    })
}

const connected = () => {
  subscriptionActive = true
  ;(0,_utils__WEBPACK_IMPORTED_MODULE_2__.emitEvent)('stimulus-reflex:connected')
}

const rejected = () => {
  subscriptionActive = false
  ;(0,_utils__WEBPACK_IMPORTED_MODULE_2__.emitEvent)('stimulus-reflex:rejected')
  if (Debug.enabled) console.warn('Channel subscription was rejected.')
}

const disconnected = willAttemptReconnect => {
  subscriptionActive = false
  ;(0,_utils__WEBPACK_IMPORTED_MODULE_2__.emitEvent)('stimulus-reflex:disconnected', willAttemptReconnect)
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  consumer,
  params,
  get subscriptionActive () {
    return subscriptionActive
  },
  createSubscription,
  connected,
  rejected,
  disconnected,
  set (consumerValue, paramsValue) {
    consumer = consumerValue
    params = paramsValue
  }
});


/***/ }),

/***/ "./node_modules/stimulus_reflex/javascript/utils.js":
/*!**********************************************************!*\
  !*** ./node_modules/stimulus_reflex/javascript/utils.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "uuidv4": () => (/* binding */ uuidv4),
/* harmony export */   "serializeForm": () => (/* binding */ serializeForm),
/* harmony export */   "camelize": () => (/* binding */ camelize),
/* harmony export */   "debounce": () => (/* binding */ debounce),
/* harmony export */   "extractReflexName": () => (/* binding */ extractReflexName),
/* harmony export */   "emitEvent": () => (/* binding */ emitEvent),
/* harmony export */   "elementToXPath": () => (/* binding */ elementToXPath),
/* harmony export */   "XPathToElement": () => (/* binding */ XPathToElement),
/* harmony export */   "XPathToArray": () => (/* binding */ XPathToArray)
/* harmony export */ });
// uuid4 function taken from stackoverflow
// https://stackoverflow.com/a/2117523/554903

const uuidv4 = () => {
  const crypto = window.crypto || window.msCrypto
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  )
}

const serializeForm = (form, options = {}) => {
  if (!form) return ''

  const w = options.w || window
  const { element } = options
  const formData = new w.FormData(form)
  const data = Array.from(formData, e => e.map(encodeURIComponent).join('='))
  const submitButton = form.querySelector('input[type=submit]')
  if (
    element &&
    element.name &&
    element.nodeName === 'INPUT' &&
    element.type === 'submit'
  ) {
    data.push(
      `${encodeURIComponent(element.name)}=${encodeURIComponent(element.value)}`
    )
  } else if (submitButton && submitButton.name) {
    data.push(
      `${encodeURIComponent(submitButton.name)}=${encodeURIComponent(
        submitButton.value
      )}`
    )
  }

  return Array.from(new Set(data)).join('&')
}

const camelize = (value, uppercaseFirstLetter = true) => {
  if (typeof value !== 'string') return ''
  value = value
    .replace(/[\s_](.)/g, $1 => $1.toUpperCase())
    .replace(/[\s_]/g, '')
    .replace(/^(.)/, $1 => $1.toLowerCase())

  if (uppercaseFirstLetter)
    value = value.substr(0, 1).toUpperCase() + value.substr(1)

  return value
}

const debounce = (callback, delay = 250) => {
  let timeoutId
  return (...args) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      timeoutId = null
      callback(...args)
    }, delay)
  }
}

const extractReflexName = reflexString => {
  const match = reflexString.match(/(?:.*->)?(.*?)(?:Reflex)?#/)

  return match ? match[1] : ''
}

const emitEvent = (event, detail) => {
  document.dispatchEvent(
    new CustomEvent(event, {
      bubbles: true,
      cancelable: false,
      detail
    })
  )
  if (window.jQuery) window.jQuery(document).trigger(event, detail)
}

// construct a valid xPath for an element in the DOM
const elementToXPath = element => {
  if (element.id !== '') return "//*[@id='" + element.id + "']"
  if (element === document.body) return '/html/body'

  let ix = 0
  const siblings = element.parentNode.childNodes

  for (var i = 0; i < siblings.length; i++) {
    const sibling = siblings[i]
    if (sibling === element) {
      const computedPath = elementToXPath(element.parentNode)
      const tagName = element.tagName.toLowerCase()
      const ixInc = ix + 1
      return `${computedPath}/${tagName}[${ixInc}]`
    }

    if (sibling.nodeType === 1 && sibling.tagName === element.tagName) {
      ix++
    }
  }
}

const XPathToElement = xpath => {
  return document.evaluate(
    xpath,
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  ).singleNodeValue
}

const XPathToArray = (xpath, reverse = false) => {
  const snapshotList = document.evaluate(
    xpath,
    document,
    null,
    XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
    null
  )

  const snapshots = []

  for (let i = 0; i < snapshotList.snapshotLength; i++) {
    snapshots.push(snapshotList.snapshotItem(i))
  }

  return reverse ? snapshots.reverse() : snapshots
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!*********************************************!*\
  !*** ./sscs/sscs/javascript/controllers.js ***!
  \*********************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var stimulus__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! stimulus */ "./node_modules/stimulus/index.js");
/* harmony import */ var stimulus_reflex__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! stimulus_reflex */ "./node_modules/stimulus_reflex/javascript/stimulus_reflex.js");



class NewClientFormController extends stimulus__WEBPACK_IMPORTED_MODULE_0__.Controller {
  connect() {
    stimulus_reflex__WEBPACK_IMPORTED_MODULE_1__.default.register(this)
  }

  search(event) {
    //document.getElementById("field_errors").classList.add("d-none")
    event.preventDefault()
    this.stimulate('NewClientFormReflex#search')
  }
  update(event) {
    //document.getElementById("field_errors").classList.add("d-none")
    event.preventDefault()
    console.log(event.target)
    let name = event.target.name.split("-")
    let form = name[0]
    let field = name[1]
    let value = event.target.value
    this.stimulate(
      'NewClientFormReflex#update', 
      {
        form: form, field: field, value: value
      }
    )
  }
  toggle_edit(event) {
    event.preventDefault()
    this.stimulate('NewClientFormReflex#toggle', 'edit')
  }
  toggle_search(event) {
    event.preventDefault()
    this.stimulate('NewClientFormReflex#toggle', 'search')
    document.getElementById("client_table").reset()
  }
  new_client(event) {
    event.preventDefault()
    document.getElementById("field_errors").classList.remove("d-none")
    this.stimulate('NewClientFormReflex#new_client')
  }
  select(event) {
    event.preventDefault()
    let pk = event.target.parentNode.dataset.id
    this.stimulate('NewClientFormReflex#select', pk)
  }
  paginate(event) {
    event.preventDefault()
    let page = event.target.dataset.page
    if (!event.target.classList.contains("disabled")) {
      this.stimulate('NewClientFormReflex#paginate', page)
    }
  }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (NewClientFormController);

})();

/******/ })()
;
//# sourceMappingURL=controllers.js.map