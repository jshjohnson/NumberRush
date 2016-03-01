import React, { Component } from 'react';

class StartScreen extends Component {
    render() {
        return (
            <screen>
                <div className="window__area">
                    <div className="window__outer">
                        <div className="window__inner">
                            <h2 className="window__focus window__focus--sm">Numberwang</h2>
                            {(this.props.personalBest && this.props.personalBest > 0) && (
                                <h3><strong>Personal best:</strong> { this.props.personalBest }</h3>
                            )}
                            <button className="push-top window__form-control" onClick={ this.props.startGame }>Start</button>
                        </div>
                    </div>
                </div>
            </screen>
        )
    };
};

export default StartScreen;