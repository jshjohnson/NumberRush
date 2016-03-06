// React
import React, { Component } from 'react';

class GameControls extends Component {
    render() {
        let { controls } = this.props;
        return (
            <controls>
                <ul className="header__controls list-unstyled">
                    {
                        controls.map(function(control) {
                            if(control.active) {
                                return (
                                    <button className="header__input header__input--btn" key={ control.name } onClick={ control.action } value={ control.name }>{ control.name }</button>
                                )
                            } 
                        }, this)
                    }
                </ul>
            </controls>
        )
    };
};

export default GameControls;