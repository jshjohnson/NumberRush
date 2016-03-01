import React, { Component } from 'react';
import ReactDOM from 'react-dom';

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
        let { number, answerAttempts } = this.props;
        let areaClass = classNames({
            'window__area': true,
            'window__area--active': !this.props.areaDisabled,
            'window__area--disabled': this.props.areaDisabled 
        });
        return (
            <div className={ areaClass }>
                <div className="window__outer">
                    <div className="window__inner">
                        <h2 className="window__focus zero-bottom">{ number.digits }</h2>
                        <p>{ number.questionLanguage }</p>
                        { answerAttempts >= 5 &&
                            <p><strong>Clue:</strong> { number.answerLanguage }</p>
                        }
                        <input ref="input" type="text" className="window__form-control" onKeyUp={ this.handleKeyUp } autofocus></input>
                    </div>
                </div>
            </div>
        ) 
    };
};

export default NumberArea;