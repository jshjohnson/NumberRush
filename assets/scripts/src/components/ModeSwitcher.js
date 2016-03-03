import React, { Component } from 'react';

class ModeSwitcher extends Component {
    render() {
        let { modes, changeMode, currentMode } = this.props;
        return (
            <modeswitcher>
                <select className="window__input window__input--select window__input--push-left window__input--absolute" onChange={ changeMode } value={ currentMode }>
                   {
                        modes.map(function(mode) {
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