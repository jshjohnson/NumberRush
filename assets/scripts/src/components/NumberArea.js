import React, { Component } from 'react';

import classNames from 'classnames';

class NumberArea extends Component {
    componentDidMount() {
        // Focus input on mount
        ReactDOM.findDOMNode(this.refs.input).focus();
    };

    componentWillReceiveProps(nextProps) {
        // If new number is given, clear input
        if(this.props.number != nextProps.number) {
            ReactDOM.findDOMNode(this.refs.input).value = '';
        }
    };

    handleKeyUp = (event) => {
        if(event.which == 13) {
            this.props.answer(event.currentTarget.value, this.props.number);
        }
    };

    render() { 
        var areaClass = classNames({
            'window__area': true,
            'window__area--active': !this.props.areaDisabled,
            'window__area--disabled': this.props.areaDisabled 
        });
        return (
            <div className={ areaClass }>
                <div className="window__outer">
                    <div className="window__inner">
                        <h2 className="window__focus zero-bottom">{ this.props.number.digits }</h2>
                        <p>{ this.props.number.questionLanguage }</p>
                        { this.props.answerAttempts >= 5 &&
                            <p><strong>Clue:</strong> { this.props.number.answerLanguage }</p>
                        }
                        { this.props.cheatMode &&
                            <p>{ this.props.number.answerLanguage }</p>
                        } 
                        <input ref="input" type="text" className="window__form-control" onKeyUp={ this.handleKeyUp } autofocus></input>
                    </div>
                </div>
            </div>
        ) 
    };
};

export default NumberArea;