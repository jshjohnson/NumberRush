// React
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

// Utilities
import { whichAnimationEvent, addAnimation } from '../libs/utils';
import classNames from 'classnames';

class ScoreBoard extends Component {
    
    componentWillReceiveProps(nextProps) {
        if(this.props.score != nextProps.score) {
            let score = ReactDOM.findDOMNode(this.refs.score);
            addAnimation(score, 'pulse');
        }

        if(this.props.personalBest != nextProps.personalBest) {
            let personalBest = ReactDOM.findDOMNode(this.refs.personalBest);
            addAnimation(personalBest, 'pulse');
        }
    };
    
    render() {
        const { score, personalBest, timer } = this.props;
        const timerClass = classNames({
            'flash-text': (timer / 1000) <= 10,
        });
        
        return (
            <scoreboard>
                <div ref="personalBest" className="bubble bubble--sm bubble--personalbest">
                    <div className="bubble__inner">
                        <h3 className="bubble__desc">Best</h3>
                        { personalBest }
                    </div>
                </div>
                <div ref="score" className="bubble bubble--sm bubble--score">
                    <div className="bubble__inner">
                        <h3 className="bubble__desc">Score</h3>
                        { score }
                    </div>
                </div>
                <div ref="timer" className="bubble bubble--sm bubble--timer">
                    <div className="bubble__inner">
                        <h3 className="bubble__desc">Timer</h3>
                        <span className={ timerClass }>{ timer / 1000 }s</span>
                    </div>
                </div>
            </scoreboard>
        )
    };
};

export default ScoreBoard;