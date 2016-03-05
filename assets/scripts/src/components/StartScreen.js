import React, { Component } from 'react';

class StartScreen extends Component {
    render() {
        let { personalBest, previousScore, startGame } =  this.props;
        let hasPersonalBest = (personalBest && personalBest > 0) ? true : false;
        let hasPreviousScore = previousScore ? true : false;
        return (
            <screen className="fade-in">
                <div className="window__outer">
                    <div className="window__inner">
                        <h1 className="window__focus window__focus--sm">Number Rush</h1>
                        <h2>Aim of the game</h2>
                        <p>Translate as many numbers as possible into German before the timer runs out!</p>
                        <ul className="list-inline">
                            {(hasPersonalBest) && (
                                <li><h3><strong>Personal best:</strong> { personalBest }</h3></li>
                            )}
                            {(hasPreviousScore) && (
                                <li><h3><strong>Previous score:</strong> { previousScore }</h3></li>
                            )}
                        </ul>
                        <button className="bubble bubble--input window__form-control window__form-control--push" onClick={ startGame }>Start</button>
                        <p><small>A thing by <a href="https://github.com/jshjohnson/NumberRush">Josh Johnson</a></small></p>
                    </div>
                </div>
            </screen>
        )
    };
};

export default StartScreen;