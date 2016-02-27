import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class ScoreBoard extends Component {
    render() {
        return (
            <scoreboard>
                <ul className="header__list list-unstyled list-inline list-inline--divided zero-bottom">
                    <li><strong>Score:</strong> { this.props.score }</li>
                    <li><strong>Best:</strong> { this.props.personalBest }</li>
                    <li><strong>Timer:</strong> { this.props.timer / 1000 }</li>
                </ul>
            </scoreboard>
        )
    };
};

export default ScoreBoard;