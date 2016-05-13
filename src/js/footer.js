/*
* @Author: d12mnit
* @Date:   2016-05-12 20:56:46
* @Last modified by:   d12mnit
* @Last modified time: 2016-05-13T13:34:06+08:00
*/
(function() {
    'use strict';
    var React = require('react');
    var ReactDOM = require('react-dom');
    var Utils = require('./utils');
    var Footer = React.createClass({

        render: function() {
            var count = this.props.count;
            var completeNum = this.props.completeNum;
            var clearButton;
            count = count + Utils.pluralize(count, ' item');
            if(completeNum){
                clearButton = (
                    <button className="clear-btn" onClick={this.props.onClear}>Clear completed</button>
                )
            }
            return (
                <section className="footer">
                    <span className="todo-count">
                        {count} left
                    </span>
                    <ul className="filters">
                        <li className={this.props.showing === 'all' ? 'selected' : ''}><a href="#/">All</a></li>
                        <li className={this.props.showing === 'active' ? 'selected' : ''}><a href="#/active">Active</a></li>
                        <li className={this.props.showing === 'completed' ? 'selected' : ''}><a href="#/completed">Completed</a></li>
                    </ul>
                    {clearButton}
                </section>
            );
        }

    });

    module.exports = Footer;
}());
