import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class GameControls extends Component {
    render() {
        return (
            <button className="window__input window__input--right window__input--btn" onClick={ this.props.reload } value="Reload">Reload</button>
        )
    };
};

export default GameControls;