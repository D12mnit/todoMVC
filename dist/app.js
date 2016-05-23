webpackJsonp([0],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(React, ReactDOM) {/*
	 * @Author: d12mnit
	 * @Date:   2016-05-11 14:00:32
	* @Last modified by:   d12mnit
	* @Last modified time: 2016-05-13T13:27:22+08:00
	 */
	'use strict';

	var _director = __webpack_require__(168);

	var ALL_TODOS = 'all',
	    ACTIVE_TODOS = 'active',
	    COMPLETED_TODOS = 'completed';

	var TodoModel = __webpack_require__(169);
	var TodoItem = __webpack_require__(171);
	var Footer = __webpack_require__(172);
	var ENTER_KEY = 13;

	var todos = new TodoModel('todo-react');
	var TodoApp = React.createClass({
	    displayName: 'TodoApp',

	    getInitialState: function getInitialState() {
	        return { newTodo: '', nowShowing: 'ALL_TODOS', editing: null };
	    },
	    handleChange: function handleChange(event) {
	        this.setState({ newTodo: event.target.value });
	    },
	    handleSubmit: function handleSubmit(event) {
	        if (event.keyCode !== ENTER_KEY) return;
	        event.preventDefault();
	        var todoName = this.state.newTodo.trim();
	        if (todoName) {
	            this.props.model.addTodo(todoName);
	            this.setState({ newTodo: '' });
	        }
	    },
	    toggleAll: function toggleAll(event) {
	        var checked = event.target.checked;
	        this.props.model.toggleAll(checked);
	    },
	    toggle: function toggle(todo) {
	        this.props.model.toggle(todo);
	    },
	    destroy: function destroy(todo) {
	        this.props.model.destroy(todo);
	    },
	    edit: function edit(todo) {
	        this.setState({ editing: todo.id });
	    },
	    save: function save(todo, val) {
	        this.props.model.update(todo, val);
	        this.setState({ editing: null });
	    },
	    cancel: function cancel() {
	        this.setState({ editing: null });
	    },
	    clear: function clear() {
	        this.props.model.clear();
	    },
	    componentDidMount: function componentDidMount() {
	        var setState = this.setState;
	        var router = (0, _director.Router)({
	            '/': setState.bind(this, { nowShowing: ALL_TODOS }),
	            '/active': setState.bind(this, { nowShowing: ACTIVE_TODOS }),
	            '/completed': setState.bind(this, { nowShowing: COMPLETED_TODOS })
	        });
	        router.init('/');
	    },
	    render: function render() {
	        var main;
	        var footer;
	        var todos = this.props.model.todos;

	        var showingTodos = todos.filter(function (todo) {
	            switch (this.state.nowShowing) {
	                case "active":
	                    return !todo.isComplete;
	                case "completed":
	                    return todo.isComplete;
	                default:
	                    return todo;
	            }
	        }, this);

	        var todoItems = showingTodos.map(function (todo) {
	            return React.createElement(TodoItem, { todo: todo, key: todo.id, onToggle: this.toggle.bind(this, todo), onDestroy: this.destroy.bind(this, todo), onSave: this.save.bind(this, todo), onEdit: this.edit.bind(this, todo), editing: this.state.editing === todo.id, onCancel: this.cancel });
	        }, this);

	        var activeItemNum = todos.reduce(function (i, todo) {
	            return todo.isComplete ? i : i + 1;
	        }, 0);
	        var completeItemNum = todos.length - activeItemNum;
	        if (todos.length) {
	            main = React.createElement(
	                'section',
	                { className: 'main' },
	                React.createElement('input', { className: 'toggle-all', type: 'checkbox', onChange: this.toggleAll, checked: activeItemNum === 0 }),
	                React.createElement(
	                    'ul',
	                    { className: 'todo-list' },
	                    todoItems
	                )
	            );
	        }
	        if (completeItemNum || activeItemNum) {
	            footer = React.createElement(Footer, { count: activeItemNum, completeNum: completeItemNum, showing: this.state.nowShowing, onClear: this.clear });
	        }
	        return React.createElement(
	            'div',
	            null,
	            React.createElement(
	                'header',
	                { className: 'header' },
	                React.createElement(
	                    'h1',
	                    null,
	                    'Todos'
	                ),
	                React.createElement('input', { className: 'new-todo', placeholder: 'What needs to be done?', value: this.state.newTodo, onChange: this.handleChange, onKeyDown: this.handleSubmit, autoFocus: true })
	            ),
	            main,
	            footer
	        );
	    }
	});
	function render() {
	    ReactDOM.render(React.createElement(TodoApp, { model: todos }), document.querySelector('#app-wrap'));
	}
	todos.subscribe(render);
	render();
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1), __webpack_require__(33)))

/***/ },

/***/ 168:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	//
	// Generated on Tue Dec 16 2014 12:13:47 GMT+0100 (CET) by Charlie Robbins, Paolo Fragomeni & the Contributors (Using Codesurgeon).
	// Version 1.2.6
	//

	(function (exports) {

	  /*
	   * browser.js: Browser specific functionality for director.
	   *
	   * (C) 2011, Charlie Robbins, Paolo Fragomeni, & the Contributors.
	   * MIT LICENSE
	   *
	   */

	  var dloc = document.location;

	  function dlocHashEmpty() {
	    // Non-IE browsers return '' when the address bar shows '#'; Director's logic
	    // assumes both mean empty.
	    return dloc.hash === '' || dloc.hash === '#';
	  }

	  var listener = {
	    mode: 'modern',
	    hash: dloc.hash,
	    history: false,

	    check: function check() {
	      var h = dloc.hash;
	      if (h != this.hash) {
	        this.hash = h;
	        this.onHashChanged();
	      }
	    },

	    fire: function fire() {
	      if (this.mode === 'modern') {
	        this.history === true ? window.onpopstate() : window.onhashchange();
	      } else {
	        this.onHashChanged();
	      }
	    },

	    init: function init(fn, history) {
	      var self = this;
	      this.history = history;

	      if (!Router.listeners) {
	        Router.listeners = [];
	      }

	      function onchange(onChangeEvent) {
	        for (var i = 0, l = Router.listeners.length; i < l; i++) {
	          Router.listeners[i](onChangeEvent);
	        }
	      }

	      //note IE8 is being counted as 'modern' because it has the hashchange event
	      if ('onhashchange' in window && (document.documentMode === undefined || document.documentMode > 7)) {
	        // At least for now HTML5 history is available for 'modern' browsers only
	        if (this.history === true) {
	          // There is an old bug in Chrome that causes onpopstate to fire even
	          // upon initial page load. Since the handler is run manually in init(),
	          // this would cause Chrome to run it twise. Currently the only
	          // workaround seems to be to set the handler after the initial page load
	          // http://code.google.com/p/chromium/issues/detail?id=63040
	          setTimeout(function () {
	            window.onpopstate = onchange;
	          }, 500);
	        } else {
	          window.onhashchange = onchange;
	        }
	        this.mode = 'modern';
	      } else {
	        //
	        // IE support, based on a concept by Erik Arvidson ...
	        //
	        var frame = document.createElement('iframe');
	        frame.id = 'state-frame';
	        frame.style.display = 'none';
	        document.body.appendChild(frame);
	        this.writeFrame('');

	        if ('onpropertychange' in document && 'attachEvent' in document) {
	          document.attachEvent('onpropertychange', function () {
	            if (event.propertyName === 'location') {
	              self.check();
	            }
	          });
	        }

	        window.setInterval(function () {
	          self.check();
	        }, 50);

	        this.onHashChanged = onchange;
	        this.mode = 'legacy';
	      }

	      Router.listeners.push(fn);

	      return this.mode;
	    },

	    destroy: function destroy(fn) {
	      if (!Router || !Router.listeners) {
	        return;
	      }

	      var listeners = Router.listeners;

	      for (var i = listeners.length - 1; i >= 0; i--) {
	        if (listeners[i] === fn) {
	          listeners.splice(i, 1);
	        }
	      }
	    },

	    setHash: function setHash(s) {
	      // Mozilla always adds an entry to the history
	      if (this.mode === 'legacy') {
	        this.writeFrame(s);
	      }

	      if (this.history === true) {
	        window.history.pushState({}, document.title, s);
	        // Fire an onpopstate event manually since pushing does not obviously
	        // trigger the pop event.
	        this.fire();
	      } else {
	        dloc.hash = s[0] === '/' ? s : '/' + s;
	      }
	      return this;
	    },

	    writeFrame: function writeFrame(s) {
	      // IE support...
	      var f = document.getElementById('state-frame');
	      var d = f.contentDocument || f.contentWindow.document;
	      d.open();
	      d.write("<script>_hash = '" + s + "'; onload = parent.listener.syncHash;<script>");
	      d.close();
	    },

	    syncHash: function syncHash() {
	      // IE support...
	      var s = this._hash;
	      if (s != dloc.hash) {
	        dloc.hash = s;
	      }
	      return this;
	    },

	    onHashChanged: function onHashChanged() {}
	  };

	  var Router = exports.Router = function (routes) {
	    if (!(this instanceof Router)) return new Router(routes);

	    this.params = {};
	    this.routes = {};
	    this.methods = ['on', 'once', 'after', 'before'];
	    this.scope = [];
	    this._methods = {};

	    this._insert = this.insert;
	    this.insert = this.insertEx;

	    this.historySupport = (window.history != null ? window.history.pushState : null) != null;

	    this.configure();
	    this.mount(routes || {});
	  };

	  Router.prototype.init = function (r) {
	    var self = this,
	        routeTo;
	    this.handler = function (onChangeEvent) {
	      var newURL = onChangeEvent && onChangeEvent.newURL || window.location.hash;
	      var url = self.history === true ? self.getPath() : newURL.replace(/.*#/, '');
	      self.dispatch('on', url.charAt(0) === '/' ? url : '/' + url);
	    };

	    listener.init(this.handler, this.history);

	    if (this.history === false) {
	      if (dlocHashEmpty() && r) {
	        dloc.hash = r;
	      } else if (!dlocHashEmpty()) {
	        self.dispatch('on', '/' + dloc.hash.replace(/^(#\/|#|\/)/, ''));
	      }
	    } else {
	      if (this.convert_hash_in_init) {
	        // Use hash as route
	        routeTo = dlocHashEmpty() && r ? r : !dlocHashEmpty() ? dloc.hash.replace(/^#/, '') : null;
	        if (routeTo) {
	          window.history.replaceState({}, document.title, routeTo);
	        }
	      } else {
	        // Use canonical url
	        routeTo = this.getPath();
	      }

	      // Router has been initialized, but due to the chrome bug it will not
	      // yet actually route HTML5 history state changes. Thus, decide if should route.
	      if (routeTo || this.run_in_init === true) {
	        this.handler();
	      }
	    }

	    return this;
	  };

	  Router.prototype.explode = function () {
	    var v = this.history === true ? this.getPath() : dloc.hash;
	    if (v.charAt(1) === '/') {
	      v = v.slice(1);
	    }
	    return v.slice(1, v.length).split("/");
	  };

	  Router.prototype.setRoute = function (i, v, val) {
	    var url = this.explode();

	    if (typeof i === 'number' && typeof v === 'string') {
	      url[i] = v;
	    } else if (typeof val === 'string') {
	      url.splice(i, v, s);
	    } else {
	      url = [i];
	    }

	    listener.setHash(url.join('/'));
	    return url;
	  };

	  //
	  // ### function insertEx(method, path, route, parent)
	  // #### @method {string} Method to insert the specific `route`.
	  // #### @path {Array} Parsed path to insert the `route` at.
	  // #### @route {Array|function} Route handlers to insert.
	  // #### @parent {Object} **Optional** Parent "routes" to insert into.
	  // insert a callback that will only occur once per the matched route.
	  //
	  Router.prototype.insertEx = function (method, path, route, parent) {
	    if (method === "once") {
	      method = "on";
	      route = function (route) {
	        var once = false;
	        return function () {
	          if (once) return;
	          once = true;
	          return route.apply(this, arguments);
	        };
	      }(route);
	    }
	    return this._insert(method, path, route, parent);
	  };

	  Router.prototype.getRoute = function (v) {
	    var ret = v;

	    if (typeof v === "number") {
	      ret = this.explode()[v];
	    } else if (typeof v === "string") {
	      var h = this.explode();
	      ret = h.indexOf(v);
	    } else {
	      ret = this.explode();
	    }

	    return ret;
	  };

	  Router.prototype.destroy = function () {
	    listener.destroy(this.handler);
	    return this;
	  };

	  Router.prototype.getPath = function () {
	    var path = window.location.pathname;
	    if (path.substr(0, 1) !== '/') {
	      path = '/' + path;
	    }
	    return path;
	  };
	  function _every(arr, iterator) {
	    for (var i = 0; i < arr.length; i += 1) {
	      if (iterator(arr[i], i, arr) === false) {
	        return;
	      }
	    }
	  }

	  function _flatten(arr) {
	    var flat = [];
	    for (var i = 0, n = arr.length; i < n; i++) {
	      flat = flat.concat(arr[i]);
	    }
	    return flat;
	  }

	  function _asyncEverySeries(arr, iterator, callback) {
	    if (!arr.length) {
	      return callback();
	    }
	    var completed = 0;
	    (function iterate() {
	      iterator(arr[completed], function (err) {
	        if (err || err === false) {
	          callback(err);
	          callback = function callback() {};
	        } else {
	          completed += 1;
	          if (completed === arr.length) {
	            callback();
	          } else {
	            iterate();
	          }
	        }
	      });
	    })();
	  }

	  function paramifyString(str, params, mod) {
	    mod = str;
	    for (var param in params) {
	      if (params.hasOwnProperty(param)) {
	        mod = params[param](str);
	        if (mod !== str) {
	          break;
	        }
	      }
	    }
	    return mod === str ? "([._a-zA-Z0-9-%()]+)" : mod;
	  }

	  function regifyString(str, params) {
	    var matches,
	        last = 0,
	        out = "";
	    while (matches = str.substr(last).match(/[^\w\d\- %@&]*\*[^\w\d\- %@&]*/)) {
	      last = matches.index + matches[0].length;
	      matches[0] = matches[0].replace(/^\*/, "([_.()!\\ %@&a-zA-Z0-9-]+)");
	      out += str.substr(0, matches.index) + matches[0];
	    }
	    str = out += str.substr(last);
	    var captures = str.match(/:([^\/]+)/ig),
	        capture,
	        length;
	    if (captures) {
	      length = captures.length;
	      for (var i = 0; i < length; i++) {
	        capture = captures[i];
	        if (capture.slice(0, 2) === "::") {
	          str = capture.slice(1);
	        } else {
	          str = str.replace(capture, paramifyString(capture, params));
	        }
	      }
	    }
	    return str;
	  }

	  function terminator(routes, delimiter, start, stop) {
	    var last = 0,
	        left = 0,
	        right = 0,
	        start = (start || "(").toString(),
	        stop = (stop || ")").toString(),
	        i;
	    for (i = 0; i < routes.length; i++) {
	      var chunk = routes[i];
	      if (chunk.indexOf(start, last) > chunk.indexOf(stop, last) || ~chunk.indexOf(start, last) && ! ~chunk.indexOf(stop, last) || ! ~chunk.indexOf(start, last) && ~chunk.indexOf(stop, last)) {
	        left = chunk.indexOf(start, last);
	        right = chunk.indexOf(stop, last);
	        if (~left && ! ~right || ! ~left && ~right) {
	          var tmp = routes.slice(0, (i || 1) + 1).join(delimiter);
	          routes = [tmp].concat(routes.slice((i || 1) + 1));
	        }
	        last = (right > left ? right : left) + 1;
	        i = 0;
	      } else {
	        last = 0;
	      }
	    }
	    return routes;
	  }

	  var QUERY_SEPARATOR = /\?.*/;

	  Router.prototype.configure = function (options) {
	    options = options || {};
	    for (var i = 0; i < this.methods.length; i++) {
	      this._methods[this.methods[i]] = true;
	    }
	    this.recurse = options.recurse || this.recurse || false;
	    this.async = options.async || false;
	    this.delimiter = options.delimiter || "/";
	    this.strict = typeof options.strict === "undefined" ? true : options.strict;
	    this.notfound = options.notfound;
	    this.resource = options.resource;
	    this.history = options.html5history && this.historySupport || false;
	    this.run_in_init = this.history === true && options.run_handler_in_init !== false;
	    this.convert_hash_in_init = this.history === true && options.convert_hash_in_init !== false;
	    this.every = {
	      after: options.after || null,
	      before: options.before || null,
	      on: options.on || null
	    };
	    return this;
	  };

	  Router.prototype.param = function (token, matcher) {
	    if (token[0] !== ":") {
	      token = ":" + token;
	    }
	    var compiled = new RegExp(token, "g");
	    this.params[token] = function (str) {
	      return str.replace(compiled, matcher.source || matcher);
	    };
	    return this;
	  };

	  Router.prototype.on = Router.prototype.route = function (method, path, route) {
	    var self = this;
	    if (!route && typeof path == "function") {
	      route = path;
	      path = method;
	      method = "on";
	    }
	    if (Array.isArray(path)) {
	      return path.forEach(function (p) {
	        self.on(method, p, route);
	      });
	    }
	    if (path.source) {
	      path = path.source.replace(/\\\//ig, "/");
	    }
	    if (Array.isArray(method)) {
	      return method.forEach(function (m) {
	        self.on(m.toLowerCase(), path, route);
	      });
	    }
	    path = path.split(new RegExp(this.delimiter));
	    path = terminator(path, this.delimiter);
	    this.insert(method, this.scope.concat(path), route);
	  };

	  Router.prototype.path = function (path, routesFn) {
	    var self = this,
	        length = this.scope.length;
	    if (path.source) {
	      path = path.source.replace(/\\\//ig, "/");
	    }
	    path = path.split(new RegExp(this.delimiter));
	    path = terminator(path, this.delimiter);
	    this.scope = this.scope.concat(path);
	    routesFn.call(this, this);
	    this.scope.splice(length, path.length);
	  };

	  Router.prototype.dispatch = function (method, path, callback) {
	    var self = this,
	        fns = this.traverse(method, path.replace(QUERY_SEPARATOR, ""), this.routes, ""),
	        invoked = this._invoked,
	        after;
	    this._invoked = true;
	    if (!fns || fns.length === 0) {
	      this.last = [];
	      if (typeof this.notfound === "function") {
	        this.invoke([this.notfound], {
	          method: method,
	          path: path
	        }, callback);
	      }
	      return false;
	    }
	    if (this.recurse === "forward") {
	      fns = fns.reverse();
	    }
	    function updateAndInvoke() {
	      self.last = fns.after;
	      self.invoke(self.runlist(fns), self, callback);
	    }
	    after = this.every && this.every.after ? [this.every.after].concat(this.last) : [this.last];
	    if (after && after.length > 0 && invoked) {
	      if (this.async) {
	        this.invoke(after, this, updateAndInvoke);
	      } else {
	        this.invoke(after, this);
	        updateAndInvoke();
	      }
	      return true;
	    }
	    updateAndInvoke();
	    return true;
	  };

	  Router.prototype.invoke = function (fns, thisArg, callback) {
	    var self = this;
	    var _apply2;
	    if (this.async) {
	      _apply2 = function apply(fn, next) {
	        if (Array.isArray(fn)) {
	          return _asyncEverySeries(fn, _apply2, next);
	        } else if (typeof fn == "function") {
	          fn.apply(thisArg, (fns.captures || []).concat(next));
	        }
	      };
	      _asyncEverySeries(fns, _apply2, function () {
	        if (callback) {
	          callback.apply(thisArg, arguments);
	        }
	      });
	    } else {
	      _apply2 = function _apply(fn) {
	        if (Array.isArray(fn)) {
	          return _every(fn, _apply2);
	        } else if (typeof fn === "function") {
	          return fn.apply(thisArg, fns.captures || []);
	        } else if (typeof fn === "string" && self.resource) {
	          self.resource[fn].apply(thisArg, fns.captures || []);
	        }
	      };
	      _every(fns, _apply2);
	    }
	  };

	  Router.prototype.traverse = function (method, path, routes, regexp, filter) {
	    var fns = [],
	        current,
	        exact,
	        match,
	        next,
	        that;
	    function filterRoutes(routes) {
	      if (!filter) {
	        return routes;
	      }
	      function deepCopy(source) {
	        var result = [];
	        for (var i = 0; i < source.length; i++) {
	          result[i] = Array.isArray(source[i]) ? deepCopy(source[i]) : source[i];
	        }
	        return result;
	      }
	      function applyFilter(fns) {
	        for (var i = fns.length - 1; i >= 0; i--) {
	          if (Array.isArray(fns[i])) {
	            applyFilter(fns[i]);
	            if (fns[i].length === 0) {
	              fns.splice(i, 1);
	            }
	          } else {
	            if (!filter(fns[i])) {
	              fns.splice(i, 1);
	            }
	          }
	        }
	      }
	      var newRoutes = deepCopy(routes);
	      newRoutes.matched = routes.matched;
	      newRoutes.captures = routes.captures;
	      newRoutes.after = routes.after.filter(filter);
	      applyFilter(newRoutes);
	      return newRoutes;
	    }
	    if (path === this.delimiter && routes[method]) {
	      next = [[routes.before, routes[method]].filter(Boolean)];
	      next.after = [routes.after].filter(Boolean);
	      next.matched = true;
	      next.captures = [];
	      return filterRoutes(next);
	    }
	    for (var r in routes) {
	      if (routes.hasOwnProperty(r) && (!this._methods[r] || this._methods[r] && _typeof(routes[r]) === "object" && !Array.isArray(routes[r]))) {
	        current = exact = regexp + this.delimiter + r;
	        if (!this.strict) {
	          exact += "[" + this.delimiter + "]?";
	        }
	        match = path.match(new RegExp("^" + exact));
	        if (!match) {
	          continue;
	        }
	        if (match[0] && match[0] == path && routes[r][method]) {
	          next = [[routes[r].before, routes[r][method]].filter(Boolean)];
	          next.after = [routes[r].after].filter(Boolean);
	          next.matched = true;
	          next.captures = match.slice(1);
	          if (this.recurse && routes === this.routes) {
	            next.push([routes.before, routes.on].filter(Boolean));
	            next.after = next.after.concat([routes.after].filter(Boolean));
	          }
	          return filterRoutes(next);
	        }
	        next = this.traverse(method, path, routes[r], current);
	        if (next.matched) {
	          if (next.length > 0) {
	            fns = fns.concat(next);
	          }
	          if (this.recurse) {
	            fns.push([routes[r].before, routes[r].on].filter(Boolean));
	            next.after = next.after.concat([routes[r].after].filter(Boolean));
	            if (routes === this.routes) {
	              fns.push([routes["before"], routes["on"]].filter(Boolean));
	              next.after = next.after.concat([routes["after"]].filter(Boolean));
	            }
	          }
	          fns.matched = true;
	          fns.captures = next.captures;
	          fns.after = next.after;
	          return filterRoutes(fns);
	        }
	      }
	    }
	    return false;
	  };

	  Router.prototype.insert = function (method, path, route, parent) {
	    var methodType, parentType, isArray, nested, part;
	    path = path.filter(function (p) {
	      return p && p.length > 0;
	    });
	    parent = parent || this.routes;
	    part = path.shift();
	    if (/\:|\*/.test(part) && !/\\d|\\w/.test(part)) {
	      part = regifyString(part, this.params);
	    }
	    if (path.length > 0) {
	      parent[part] = parent[part] || {};
	      return this.insert(method, path, route, parent[part]);
	    }
	    if (!part && !path.length && parent === this.routes) {
	      methodType = _typeof(parent[method]);
	      switch (methodType) {
	        case "function":
	          parent[method] = [parent[method], route];
	          return;
	        case "object":
	          parent[method].push(route);
	          return;
	        case "undefined":
	          parent[method] = route;
	          return;
	      }
	      return;
	    }
	    parentType = _typeof(parent[part]);
	    isArray = Array.isArray(parent[part]);
	    if (parent[part] && !isArray && parentType == "object") {
	      methodType = _typeof(parent[part][method]);
	      switch (methodType) {
	        case "function":
	          parent[part][method] = [parent[part][method], route];
	          return;
	        case "object":
	          parent[part][method].push(route);
	          return;
	        case "undefined":
	          parent[part][method] = route;
	          return;
	      }
	    } else if (parentType == "undefined") {
	      nested = {};
	      nested[method] = route;
	      parent[part] = nested;
	      return;
	    }
	    throw new Error("Invalid route context: " + parentType);
	  };

	  Router.prototype.extend = function (methods) {
	    var self = this,
	        len = methods.length,
	        i;
	    function extend(method) {
	      self._methods[method] = true;
	      self[method] = function () {
	        var extra = arguments.length === 1 ? [method, ""] : [method];
	        self.on.apply(self, extra.concat(Array.prototype.slice.call(arguments)));
	      };
	    }
	    for (i = 0; i < len; i++) {
	      extend(methods[i]);
	    }
	  };

	  Router.prototype.runlist = function (fns) {
	    var runlist = this.every && this.every.before ? [this.every.before].concat(_flatten(fns)) : _flatten(fns);
	    if (this.every && this.every.on) {
	      runlist.push(this.every.on);
	    }
	    runlist.captures = fns.captures;
	    runlist.source = fns.source;
	    return runlist;
	  };

	  Router.prototype.mount = function (routes, path) {
	    if (!routes || (typeof routes === 'undefined' ? 'undefined' : _typeof(routes)) !== "object" || Array.isArray(routes)) {
	      return;
	    }
	    var self = this;
	    path = path || [];
	    if (!Array.isArray(path)) {
	      path = path.split(self.delimiter);
	    }
	    function insertOrMount(route, local) {
	      var rename = route,
	          parts = route.split(self.delimiter),
	          routeType = _typeof(routes[route]),
	          isRoute = parts[0] === "" || !self._methods[parts[0]],
	          event = isRoute ? "on" : rename;
	      if (isRoute) {
	        rename = rename.slice((rename.match(new RegExp("^" + self.delimiter)) || [""])[0].length);
	        parts.shift();
	      }
	      if (isRoute && routeType === "object" && !Array.isArray(routes[route])) {
	        local = local.concat(parts);
	        self.mount(routes[route], local);
	        return;
	      }
	      if (isRoute) {
	        local = local.concat(rename.split(self.delimiter));
	        local = terminator(local, self.delimiter);
	      }
	      self.insert(event, local, routes[route]);
	    }
	    for (var route in routes) {
	      if (routes.hasOwnProperty(route)) {
	        insertOrMount(route, path.slice(0));
	      }
	    }
	  };
	})(( false ? 'undefined' : _typeof(exports)) === "object" ? exports : window);

/***/ },

/***/ 169:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/*
	 * @Author: d12mnit
	 * @Date:   2016-05-11 16:10:48
	* @Last modified by:   d12mnit
	* @Last modified time: 2016-05-13T13:29:51+08:00
	 */
	(function () {
	    'use strict';

	    var Utils = __webpack_require__(170);

	    var TodoModel = function TodoModel(key) {
	        this.key = key;
	        this.todos = Utils.store(key);
	        this.onChange = [];
	    };
	    TodoModel.prototype.subscribe = function (f) {
	        this.onChange.push(f);
	    };
	    TodoModel.prototype.save = function () {
	        Utils.store(this.key, this.todos);
	        this.onChange.forEach(function (f) {
	            f();
	        });
	    };
	    TodoModel.prototype.addTodo = function (title) {
	        this.todos = this.todos.concat({
	            id: Utils.randomId(),
	            title: title,
	            isComplete: false
	        });
	        this.save();
	    };
	    TodoModel.prototype.toggleAll = function (checked) {
	        this.todos = this.todos.map(function (todo) {
	            return Utils.extends({}, todo, { isComplete: checked });
	        });
	        this.save();
	    };
	    TodoModel.prototype.toggle = function (item) {
	        this.todos = this.todos.map(function (todo) {
	            return todo !== item ? todo : Utils.extends({}, todo, { isComplete: !todo.isComplete });
	        });
	        this.save();
	    };
	    TodoModel.prototype.destroy = function (item) {
	        this.todos = this.todos.filter(function (todo) {
	            return todo !== item;
	        });
	        this.save();
	    };
	    TodoModel.prototype.update = function (item, text) {
	        this.todos = this.todos.map(function (todo) {
	            return todo !== item ? todo : Utils.extends({}, todo, { title: text });
	        });
	        this.save();
	    };
	    TodoModel.prototype.clear = function () {
	        this.todos = this.todos.filter(function (todo) {
	            return !todo.isComplete;
	        });
	        this.save();
	    };
	    module.exports = TodoModel;
	})();

/***/ },

/***/ 170:
/***/ function(module, exports) {

	'use strict';

	/*
	 * @Author: d12mnit
	 * @Date:   2016-05-11 15:37:27
	* @Last modified by:   d12mnit
	* @Last modified time: 2016-05-17T21:55:50+08:00
	 */
	(function () {
	    'use strict';

	    var Utils = {
	        randomId: function randomId() {
	            var random;
	            var id = '';

	            for (var i = 0; i < 32; i++) {
	                random = Math.random() * 16 | 0;
	                if (i === 8 || i === 12 || i === 16 || i === 20) {
	                    id += '-';
	                }
	                id += (i === 12 ? 4 : i === 16 ? random & 3 | 8 : random).toString(16);
	            }
	            return id;
	        },
	        pluralize: function pluralize(count, word) {
	            return count === 1 ? word : word + 's';
	        },
	        store: function store(key, value) {
	            if (value) {
	                return localStorage.setItem(key, JSON.stringify(value));
	            }
	            var store = localStorage.getItem(key);
	            return store && JSON.parse(store) || [];
	        },
	        extends: function _extends() {
	            var newObj = {};
	            for (var i = 0; i < arguments.length; i++) {
	                var obj = arguments[i];
	                for (var key in obj) {
	                    if (obj.hasOwnProperty(key)) {
	                        newObj[key] = obj[key];
	                    }
	                }
	            }
	            return newObj;
	        }
	    };
	    module.exports = Utils;
	})();

/***/ },

/***/ 171:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(React, ReactDOM) {"use strict";

	/*
	* @Author: d12mnit
	* @Date:   2016-05-12 20:57:11
	* @Last modified by:   d12mnit
	* @Last modified time: 2016-05-13T11:53:29+08:00
	*/
	(function () {
	    'use strict';

	    var ESCAPE_KEY = 27;
	    var ENTER_KEY = 13;

	    var TodoItem = React.createClass({
	        displayName: "TodoItem",

	        getInitialState: function getInitialState() {
	            return { editText: this.props.todo.title };
	        },
	        handleEdit: function handleEdit(event) {
	            this.props.onEdit();
	            this.setState({ editText: this.props.todo.title });
	        },
	        handleChange: function handleChange(event) {
	            if (this.props.editing) {
	                this.setState({ editText: event.target.value });
	            }
	        },
	        handleKeyDown: function handleKeyDown(event) {
	            if (event.keyCode === ESCAPE_KEY) {
	                this.setState({ editText: this.props.todo.title });
	                this.props.onCancel(event);
	            } else if (event.keyCode === ENTER_KEY) {
	                this.handleSubmit(event);
	            }
	        },
	        handleSubmit: function handleSubmit() {
	            var val = this.state.editText.trim();
	            if (val) {
	                this.props.onSave(val);
	            } else {
	                this.props.onDestroy();
	            }
	        },
	        componentDidUpdate: function componentDidUpdate(prevProps, prevState) {
	            if (!prevProps.editing && this.props.editing) {
	                var node = ReactDOM.findDOMNode(this.refs.editbar);
	                node.focus();
	                node.setSelectionRange(node.value.length, node.value.length);
	            }
	        },
	        render: function render() {
	            return React.createElement(
	                "li",
	                { className: this.props.editing ? "editing" : "" },
	                React.createElement(
	                    "div",
	                    { className: "view" },
	                    React.createElement("input", { className: "toggle", type: "checkbox", checked: this.props.todo.isComplete, onChange: this.props.onToggle }),
	                    React.createElement(
	                        "label",
	                        { onDoubleClick: this.handleEdit },
	                        this.props.todo.title
	                    ),
	                    React.createElement("button", { className: "destroy", onClick: this.props.onDestroy })
	                ),
	                React.createElement("input", { ref: "editbar", className: "edit", type: "text", value: this.state.editText, onChange: this.handleChange, onBlur: this.handleSubmit, onKeyDown: this.handleKeyDown })
	            );
	        }
	    });

	    module.exports = TodoItem;
	})();
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1), __webpack_require__(33)))

/***/ },

/***/ 172:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(React) {'use strict';

	/*
	* @Author: d12mnit
	* @Date:   2016-05-12 20:56:46
	* @Last modified by:   d12mnit
	* @Last modified time: 2016-05-13T13:34:06+08:00
	*/
	(function () {
	    'use strict';

	    var Utils = __webpack_require__(170);
	    var Footer = React.createClass({
	        displayName: 'Footer',


	        render: function render() {
	            var count = this.props.count;
	            var completeNum = this.props.completeNum;
	            var clearButton;
	            count = count + Utils.pluralize(count, ' item');
	            if (completeNum) {
	                clearButton = React.createElement(
	                    'button',
	                    { className: 'clear-btn', onClick: this.props.onClear },
	                    'Clear completed'
	                );
	            }
	            return React.createElement(
	                'section',
	                { className: 'footer' },
	                React.createElement(
	                    'span',
	                    { className: 'todo-count' },
	                    count,
	                    ' left'
	                ),
	                React.createElement(
	                    'ul',
	                    { className: 'filters' },
	                    React.createElement(
	                        'li',
	                        { className: this.props.showing === 'all' ? 'selected' : '' },
	                        React.createElement(
	                            'a',
	                            { href: '#/' },
	                            'All'
	                        )
	                    ),
	                    React.createElement(
	                        'li',
	                        { className: this.props.showing === 'active' ? 'selected' : '' },
	                        React.createElement(
	                            'a',
	                            { href: '#/active' },
	                            'Active'
	                        )
	                    ),
	                    React.createElement(
	                        'li',
	                        { className: this.props.showing === 'completed' ? 'selected' : '' },
	                        React.createElement(
	                            'a',
	                            { href: '#/completed' },
	                            'Completed'
	                        )
	                    )
	                ),
	                clearButton
	            );
	        }

	    });

	    module.exports = Footer;
	})();
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }

});