import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import ScoreBoard from './ScoreBoard';

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

    createClue = (string, percent = 0.4) => {
        let strArr = string.split('');
        let charCount = Math.floor(strArr.length * percent);

        let clueString = strArr.filter(function(val, index){
            return (index < charCount) ? true : false; 
        }).join('');

        return clueString + '...';
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
                <div className="window__container">
                    <div className="window__outer">
                        <div className="window__inner">
                            <ScoreBoard score={ this.props.score } personalBest={ this.props.personalBest } timer={ this.props.remainingTime } />
                            <div className="bubble bubble--lg bubble--focus">
                                <div className="bubble__inner bubble__inner--pad">
                                    { answerAttempts >= 3 &&
                                        <p className="bubble__desc bubble__desc--offset-top bubble__desc--constrained"><strong>Clue:</strong> { this.createClue(number.answerLanguage)  }</p>
                                    }
                                    <h2 className="bubble__title zero-bottom">{ number.digits }</h2>
                                    <p className="bubble__desc bubble__desc--offset-bottom bubble__desc--constrained">{ number.questionLanguage }</p>
                                </div>
                            </div>
                            <input ref="input" type="text" className="window__form-control" onKeyUp={ this.handleKeyUp } autofocus></input>
                        </div>
                    </div>
                </div>
            </div>
        ) 
    };
};

export default NumberArea;