/*
* @Author: d12mnit
* @Date:   2016-05-12 09:08:54
* @Last modified by:   d12mnit
* @Last modified time: 2016-05-12T16:36:49+08:00
*/
(function() {
    'use strict';
    var React = require('react');
    var ReactDOM = require('react-dom');

    var Utils = require('./utils.js');

    var TodoItem = React.createClass({
        getInitialState: function(){
            return {editText: this.props.todo.title}
        },
        handleEdit: function(event){
            this.props.onEdit();
            this.setState({editText: event.target.value})
        },
        render: function() {
            return (
                <li>
                    <div className="view">
                        <input className="toggle" type="checkbox" checked={this.props.todo.isComplete} onChange={this.props.onToggle}/>
                        <label onDoubleClick={this.handleEdit}>
                            {this.props.todo.title}
                        </label>
                        <button className="destroy" onClick={this.props.onDestroy}/>
                    </div>
                    <input className="edit" value={this.state.editText} onChange={this.props}/>
                </li>
            );
        }
    });

    module.exports = TodoItem;
}())
