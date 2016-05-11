/*
 * @Author: d12mnit
 * @Date:   2016-05-11 16:10:48
 * @Last Modified by:   d12mnit
 * @Last Modified time: 2016-05-11 20:16:08
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

    module.exports = TodoModel;
}())

