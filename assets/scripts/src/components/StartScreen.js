// React
import React, { Component } from 'react';

class StartScreen extends Component {
    render() {
        
        const { personalBest, previousScore, startGame } =  this.props;
        const hasPersonalBest = (personalBest && personalBest > 0) ? true : false;
        const hasPreviousScore = previousScore ? true : false;

        return (
            <screen>
                <div className="window__outer fade-in">
                    <div className="window__inner">
                        <h1 className="window__focus window__focus--sm">Number Rush</h1>
                        <h2>Aim of the game</h2>
                        <p>Translate as many numbers as possible into German before the timer runs out!</p>
                        <ul className="list-inline">
                            {(hasPersonalBest) && (
                                <li><h3 className="zero-bottom"><strong>Personal best:</strong> { personalBest }</h3></li>
                            )}
                            {(hasPreviousScore) && (
                                <li><h3 className="zero-bottom"><strong>Previous score:</strong> { previousScore }</h3></li>
                            )}
                        </ul>
                        <button className="bubble bubble--input window__form-control window__form-control--push" onClick={ startGame }>Start</button>
                        <p className="zero-bottom"><small>A thing by <a href="https://github.com/jshjohnson/NumberRush">Josh Johnson</a></small></p>
                    </div>
                </div>
            </screen>
        )
    };
};

export default StartScreen;