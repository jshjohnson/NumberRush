// React
import React, { Component } from 'react';

class ModeSwitcher extends Component {
    render() {

        const { modes, changeMode, currentMode } = this.props;
        
        return (
            <modeswitcher>
                <select className="header__input header__input--select header__input--push-left header__input--absolute" onChange={ changeMode } value={ currentMode }>
                   {
                        modes.map(function(mode) {
                            return <option key={ mode.name } value={ mode.name }>{ mode.name }</option>
                        })
                   }
                </select>
            </modeswitcher>
        )
    };
}; 

export default ModeSwitcher;