import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class ModeSwitcher extends Component {
    render() {
        return (
            <modeswitcher>
                <select className="window__input window__input--push-left window__input--absolute" onChange={ this.props.changeMode } value={ this.props.currentMode }>
                   {
                        this.props.modes.map(function(mode) {
                            return (
                                <option key={ mode.name } value={ mode.name }>{ mode.name }</option>
                            )
                        })
                   }
                </select>
            </modeswitcher>
        )
    };
}; 

export default ModeSwitcher;