import React, { Component } from 'react';

import classNames from 'classnames';

class ScoreBoard extends Component {
    render() {
        let { score, personalBest, timer } = this.props;
        let timerClass = classNames({
            'flash-text': (timer / 1000) <= 10,
        });
        return (
            <scoreboard>
                <ul className="header__list list-unstyled list-inline list-inline--divided zero-bottom">
                    <li><strong>Score:</strong> { score }</li>
                    <li><strong>Best:</strong> { personalBest }</li>
                    <li><strong>Timer:</strong> <span className={ timerClass }>{ timer / 1000 }</span></li>
                </ul>
            </scoreboard>
        )
    };
};

export default ScoreBoard;