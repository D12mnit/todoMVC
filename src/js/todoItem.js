/*
* @Author: d12mnit
* @Date:   2016-05-12 20:57:11
* @Last modified by:   d12mnit
* @Last modified time: 2016-05-13T11:53:29+08:00
*/
(function() {
    'use strict';

    var ESCAPE_KEY = 27;
    var ENTER_KEY = 13;

    var TodoItem = React.createClass({
        getInitialState: function(){
            return {editText: this.props.todo.title}
        },
        handleEdit: function(event){
            this.props.onEdit();
            this.setState({editText: this.props.todo.title})
        },
        handleChange: function(event){
            if(this.props.editing){
                this.setState({editText: event.target.value})
            }
        },
        handleKeyDown: function(event) {
            if(event.keyCode === ESCAPE_KEY){
                this.setState({editText: this.props.todo.title});
                this.props.onCancel(event);
            } else if(event.keyCode === ENTER_KEY){
                this.handleSubmit(event);
            }
        },
        handleSubmit: function(){
            var val = this.state.editText.trim();
            if(val){
                this.props.onSave(val);
            } else{
                this.props.onDestroy();
            }
        },
        componentDidUpdate: function(prevProps, prevState) {
            if(!prevProps.editing && this.props.editing){
                var node = ReactDOM.findDOMNode(this.refs.editbar);
                node.focus();
                node.setSelectionRange(node.value.length,node.value.length);
            }
        },
        render: function() {
            return (
                <li className={this.props.editing ? "editing":""}>
                    <div className="view">
                        <input className="toggle" type="checkbox" checked={this.props.todo.isComplete} onChange={this.props.onToggle}/>
                        <label onDoubleClick={this.handleEdit}>
                            {this.props.todo.title}
                        </label>
                        <button className="destroy" onClick={this.props.onDestroy}/>
                    </div>
                    <input ref="editbar" className="edit" type="text" value={this.state.editText} onChange={this.handleChange} onBlur={this.handleSubmit} onKeyDown={this.handleKeyDown}/>
                </li>
            );
        }
    });

    module.exports = TodoItem;
}())
