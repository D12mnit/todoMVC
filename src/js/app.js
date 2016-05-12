/*
 * @Author: d12mnit
 * @Date:   2016-05-11 14:00:32
* @Last modified by:   d12mnit
* @Last modified time: 2016-05-12T16:17:59+08:00
 */
'use strict';
var React = require('react');
var ReactDOM = require('react-dom');
var TodoModel = require('./todoModel.js');
var TodoItem = require('./todoItem.js');

var ENTER_KEY = 13;

var todos = new TodoModel('todo-react');
var TodoApp = React.createClass({
    getInitialState: function() {
        return {newTodo: ''}
    },
    handleChange: function(event) {
        this.setState({newTodo: event.target.value});
    },
    handleSubmit: function(event) {
        if (event.keyCode !== ENTER_KEY)
            return;
        event.preventDefault();
        var todoName = this.state.newTodo.trim();
        if (todoName) {
            this.props.model.addTodo(todoName);
            this.setState({newTodo: ''})
        }
    },
    toggleAll: function(event) {
        var checked = event.target.checked;
        this.props.model.toggleAll(checked);
    },
    toggle: function(todo) {
        this.props.model.toggle(todo);
    },
    destroy: function(todo) {
        this.props.model.destroy(todo);
    },
    render: function() {
        var main;
        var footer;
        var todos = this.props.model.todos;

        var todoItems = todos.map(function(todo) {
            return (<TodoItem todo={todo} key={todo.id} onToggle={this.toggle.bind(this, todo)} onDestroy={this.destroy.bind(this, todo)}/>)
        }, this);
        var completeItemNum = todos.reduce(function(i, todo) {
            return todo.isComplete
                ? i
                : i + 1;
        }, 0);
        if (todos.length) {
            main = (
                <section className="main">
                    <input className="toggle-all" type="checkbox" onChange={this.toggleAll} checked={completeItemNum === 0}/>
                    <ul className="todo-list">
                        {todoItems}
                    </ul>
                </section>
            )
        };
        return (
            <div>
                <header className="header">
                    <h1>Todos</h1>
                    <input className="new-todo" placeholder="What needs to be done?" value={this.state.newTodo} onChange={this.handleChange} onKeyDown={this.handleSubmit} autoFocus={true}/>
                </header>
                {main}
                {footer}
            </div>
        );
    }
});
function render() {
    ReactDOM.render(
        <TodoApp model={todos}/>, document.querySelector('#app-wrap'));
}
todos.subscribe(render);
render();
