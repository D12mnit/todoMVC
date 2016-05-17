/*
 * @Author: d12mnit
 * @Date:   2016-05-11 14:00:32
* @Last modified by:   d12mnit
* @Last modified time: 2016-05-13T13:27:22+08:00
 */
'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'director';

const ALL_TODOS = 'all',
    ACTIVE_TODOS = 'active',
    COMPLETED_TODOS = 'completed';

var TodoModel = require('./todoModel.js');
var TodoItem = require('./todoItem.js');
var Footer = require('./footer.js');
var ENTER_KEY = 13;

var todos = new TodoModel('todo-react');
var TodoApp = React.createClass({
    getInitialState: function() {
        return {newTodo: '', nowShowing: 'ALL_TODOS', editing: null}
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
    edit: function(todo) {
        this.setState({editing: todo.id});
    },
    save: function(todo, val) {
        this.props.model.update(todo, val);
        this.setState({editing: null});
    },
    cancel: function() {
        this.setState({editing: null})
    },
    clear: function() {
        this.props.model.clear();
    },
    componentDidMount: function() {
        var setState = this.setState;
        var router = Router({
            '/': setState.bind(this,{nowShowing: ALL_TODOS}),
            '/active': setState.bind(this,{nowShowing: ACTIVE_TODOS}),
            '/completed': setState.bind(this,{nowShowing: COMPLETED_TODOS})
        });
        router.init('/');
    },
    render: function() {
        var main;
        var footer;
        var todos = this.props.model.todos;

        var showingTodos = todos.filter(function(todo){
            switch (this.state.nowShowing) {
                case "active":
                    return !todo.isComplete;
                case "completed":
                    return todo.isComplete;
                default:
                    return todo;
            }
        },this);

        var todoItems = showingTodos.map(function(todo) {
            return (<TodoItem todo={todo} key={todo.id} onToggle={this.toggle.bind(this, todo)} onDestroy={this.destroy.bind(this, todo)} onSave={this.save.bind(this, todo)} onEdit={this.edit.bind(this, todo)} editing={this.state.editing === todo.id} onCancel={this.cancel}/>)
        }, this);

        var activeItemNum = todos.reduce(function(i, todo) {
            return todo.isComplete
                ? i
                : i + 1;
        }, 0);
        var completeItemNum = todos.length - activeItemNum;
        if (todos.length) {
            main = (
                <section className="main">
                    <input className="toggle-all" type="checkbox" onChange={this.toggleAll} checked={activeItemNum === 0}/>
                    <ul className="todo-list">
                        {todoItems}
                    </ul>
                </section>
            )
        }
        if (completeItemNum || activeItemNum) {
            footer = (<Footer count={activeItemNum} completeNum={completeItemNum} showing={this.state.nowShowing} onClear={this.clear}/>)
        }
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
