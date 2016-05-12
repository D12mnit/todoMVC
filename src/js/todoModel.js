/*
 * @Author: d12mnit
 * @Date:   2016-05-11 16:10:48
 * @Last Modified by:   d12mnit
 * @Last Modified time: 2016-05-12 14:28:04
 */
(function() {
    'use strict';
    var Utils = require('./utils.js');

    var TodoModel = function (key) {
        this.key = key;
        this.todos = Utils.store(key);
        this.onChange = [];
    }
    TodoModel.prototype.subscribe = function(f) {
        this.onChange.push(f);
    };
    TodoModel.prototype.save = function() {
        Utils.store(this.key, this.todos);
        this.onChange.forEach( function(f) {
            f();
        });
    };
    TodoModel.prototype.addTodo  = function(title) {
        this.todos = this.todos.concat({
            id: Utils.randomId(),
            title: title,
            isComplete: false
        });
        this.save();
    };
    TodoModel.prototype.toggleAll = function(checked) {
        this.todos = this.todos.map(function(todo){
            return Utils.extends({},todo,{isComplete: checked});
        });
        this.save();
    };
    TodoModel.prototype.toggle = function(item) {
        this.todos = this.todos.map(function(todo){
            return (todo !== item) ? todo : Utils.extends({},todo, {isComplete: !todo.isComplete});
        });
        this.save();
    };
    TodoModel.prototype.destroy = function(item) {
        this.todos = this.todos.filter(function(todo) {
            return todo !== item;
        });
        this.save();
    };
    module.exports = TodoModel;
}())

