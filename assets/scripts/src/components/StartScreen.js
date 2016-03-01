import React, { Component } from 'react';

class StartScreen extends Component {
    render() {
        let { personalBest, previousScore, startGame } =  this.props;
        let hasPersonalBest = (personalBest && personalBest > 0) ? true : false;
        let hasPreviousScore = previousScore ? true : false;
        return (
            <screen>
                <div className="window__area">
                    <div className="window__outer">
                        <div className="window__inner">
                            <h2 className="window__focus window__focus--sm">Numberwang</h2>
                            <ul className="list-inline">
                                {(hasPersonalBest) && (
                                    <li><h3><strong>Personal best:</strong> { personalBest }</h3></li>
                                )}
                                {(hasPreviousScore) && (
                                    <li><h3><strong>Previous score:</strong> { previousScore }</h3></li>
                                )}
                            </ul>
                            <button className="push-top window__form-control" onClick={ startGame }>Start</button>
                        </div>
                    </div>
                </div>
            </screen>
        )
    };
};

export default StartScreen;