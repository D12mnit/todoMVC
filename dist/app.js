webpackJsonp([0],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	/*
	 * @Author: d12mnit
	 * @Date:   2016-05-11 14:00:32
	 * @Last Modified by:   d12mnit
	 * @Last Modified time: 2016-05-12 14:28:00
	 */
	'use strict';

	var React = __webpack_require__(1);
	var ReactDOM = __webpack_require__(33);
	var TodoModel = __webpack_require__(168);
	var TodoItem = __webpack_require__(170);

	var ENTER_KEY = 13;

	var todos = new TodoModel('todo-react');
	var TodoApp = React.createClass({
	    displayName: 'TodoApp',

	    getInitialState: function () {
	        return {
	            newTodo: ''
	        };
	    },
	    handleChange: function (event) {
	        this.setState({ newTodo: event.target.value });
	    },
	    handleSubmit: function (event) {
	        if (event.keyCode !== ENTER_KEY) return;
	        event.preventDefault();
	        var todoName = this.state.newTodo.trim();
	        if (todoName) {
	            this.props.model.addTodo(todoName);
	            this.setState({ newTodo: '' });
	        }
	    },
	    toggleAll: function (event) {
	        var checked = event.target.checked;
	        this.props.model.toggleAll(checked);
	    },
	    toggle: function (todo) {
	        this.props.model.toggle(todo);
	    },
	    destroy: function (todo) {
	        this.props.model.destroy(todo);
	    },
	    render: function () {
	        var main;
	        var footer;
	        var todos = this.props.model.todos;

	        var todoItems = todos.map(function (todo) {
	            return React.createElement(TodoItem, {
	                todo: todo,
	                key: todo.id,
	                onToggle: this.toggle.bind(this, todo),
	                onDestroy: this.destroy.bind(this, todo)
	            });
	        }, this);
	        var completeItemNum = todos.reduce(function (i, todo) {
	            return todo.isComplete ? i : i + 1;
	        }, 0);
	        if (todos.length) {
	            main = React.createElement(
	                'section',
	                { className: 'main' },
	                React.createElement('input', {
	                    className: 'toggle-all',
	                    type: 'checkbox',
	                    onChange: this.toggleAll,
	                    checked: completeItemNum === 0
	                }),
	                React.createElement(
	                    'ul',
	                    { className: 'todo-list' },
	                    todoItems
	                )
	            );
	        };
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
	                React.createElement('input', {
	                    className: 'new-todo',
	                    placeholder: 'What needs to be done?',
	                    value: this.state.newTodo,
	                    onChange: this.handleChange,
	                    onKeyDown: this.handleSubmit,
	                    autoFocus: true
	                })
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

/***/ },

/***/ 168:
/***/ function(module, exports, __webpack_require__) {

	/*
	 * @Author: d12mnit
	 * @Date:   2016-05-11 16:10:48
	 * @Last Modified by:   d12mnit
	 * @Last Modified time: 2016-05-12 14:28:04
	 */
	(function () {
	    'use strict';

	    var Utils = __webpack_require__(169);

	    var TodoModel = function (key) {
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
	    module.exports = TodoModel;
	})();

/***/ },

/***/ 169:
/***/ function(module, exports) {

	/*
	 * @Author: d12mnit
	 * @Date:   2016-05-11 15:37:27
	 * @Last Modified by:   d12mnit
	 * @Last Modified time: 2016-05-11 19:56:43
	 */
	(function () {
	    'use strict';

	    var Utils = {
	        randomId: function () {
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
	        pluralize: function (count, word) {
	            return count === 1 ? word : word + 's';
	        },
	        store: function (key, value) {
	            if (value) {
	                return localStorage.setItem(key, JSON.stringify(value));
	            }
	            var store = localStorage.getItem(key);
	            return store && JSON.parse(store) || [];
	        },
	        extends: function () {
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

/***/ 170:
/***/ function(module, exports, __webpack_require__) {

	/*
	* @Author: d12mnit
	* @Date:   2016-05-12 09:08:54
	* @Last Modified by:   d12mnit
	* @Last Modified time: 2016-05-12 15:48:38
	*/
	(function () {
	    'use strict';

	    var React = __webpack_require__(1);
	    var ReactDOM = __webpack_require__(33);

	    var Utils = __webpack_require__(169);

	    var TodoItem = React.createClass({
	        displayName: 'TodoItem',

	        render: function () {
	            return React.createElement(
	                'li',
	                null,
	                React.createElement(
	                    'div',
	                    { className: 'view' },
	                    React.createElement('input', {
	                        className: 'toggle',
	                        type: 'checkbox',
	                        checked: this.props.todo.isComplete,
	                        onChange: this.props.onToggle
	                    }),
	                    React.createElement(
	                        'label',
	                        null,
	                        this.props.todo.title
	                    ),
	                    React.createElement('button', { className: 'destroy', onClick: this.props.onDestroy })
	                ),
	                React.createElement('input', {
	                    className: 'edit'
	                })
	            );
	        }
	    });

	    module.exports = TodoItem;
	})();

/***/ }

});