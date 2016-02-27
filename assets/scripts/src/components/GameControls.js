import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class GameControls extends Component {
    render() {
        return (
            <controls>
                <ul className="window__controls list-unstyled">
                    {
                        this.props.controls.map(function(control) {
                            if(control.active) {
                                return (
                                    <button className="window__input window__input--btn" key={ control.name } onClick={ control.action } value={ control.name }>{ control.name }</button>
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