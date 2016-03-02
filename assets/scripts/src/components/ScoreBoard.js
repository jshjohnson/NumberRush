import React, { Component } from 'react';
import { whichAnimationEvent } from '../libs/utils';
import ReactDOM from 'react-dom';

import classNames from 'classnames';

class ScoreBoard extends Component {
    // componentWillReceiveProps(nextProps) {
        
    //     if(this.props.score != nextProps.score) {
    //         let el = ReactDOM.findDOMNode(this.refs.score);
    //         el.classList.add('pulse');

    //         var showEvent = whichAnimationEvent();
    //         var showFunction = function(){
    //             el.classList.remove('pulse');
    //             el.removeEventListener(showEvent, showFunction, false);
    //         };
    //         el.addEventListener(showEvent, showFunction, false);
    //     }
    // };
    
    render() {
        let { score, personalBest, timer } = this.props;
        let timerClass = classNames({
            'flash-text': (timer / 1000) <= 10,
        });
        return (
            <scoreboard>
                <div className="bubble bubble--sm bubble--personalbest">
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
                <div className="bubble bubble--sm bubble--timer">
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