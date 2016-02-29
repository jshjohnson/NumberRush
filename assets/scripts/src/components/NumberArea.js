import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import classNames from 'classnames';

class NumberArea extends Component {
    componentDidMount() {
        ReactDOM.findDOMNode(this.refs.input).focus();
    };

    componentDidUpdate() {
        console.log(this.props);
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
                        <h2 className="window__focus">{ this.props.number.digits }</h2>
                        <p>{ this.props.number.questionLanguage }</p>
                        { this.props.answerAttempts >= 5 &&
                            <p><strong>Clue:</strong> { this.props.number.answerLanguage }</p>
                        }
                        { this.props.cheatMode &&
                            <p>{ this.props.number.answerLanguage }</p>
                        } 
                        <input ref="input" type="text" className="window__answer" onKeyUp={ this.handleKeyUp } autofocus></input>
                    </div>
                </div>
            </div>
        ) 
    };
};

export default NumberArea;