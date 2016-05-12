/*
* @Author: d12mnit
* @Date:   2016-05-12 09:08:54
* @Last Modified by:   d12mnit
* @Last Modified time: 2016-05-12 15:48:38
*/
(function () {
    'use strict';
    var React = require('react');
    var ReactDOM = require('react-dom');

    var Utils = require('./utils.js');

    var TodoItem = React.createClass({
        render: function() {
            return (
                <li>
                    <div className="view">
                        <input
                            className="toggle"
                            type="checkbox"
                            checked = {this.props.todo.isComplete}
                            onChange = {this.props.onToggle}
                        />
                        <label>
                            {this.props.todo.title}
                        </label>
                        <button className="destroy" onClick={this.props.onDestroy}/>
                    </div>
                    <input
                        className="edit"
                    />
                </li>
            );
        }
    });

    module.exports = TodoItem;
}())
