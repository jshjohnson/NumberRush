// React
import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';\

// Components
import App from '../../assets/scripts/src/components/App';
import GameControls from '../../assets/scripts/src/components/GameControls';
import GameScreen from '../../assets/scripts/src/components/GameScreen';
import ModeSwitcher from '../../assets/scripts/src/components/ModeSwitcher';
import Scoreboard from '../../assets/scripts/src/components/Scoreboard';
import StartScreen from '../../assets/scripts/src/components/StartScreen';

describe('App', () => {

    let sum = 1+1;

    it('should be 2', () => {
        expect(2).toBe(2);
    });
});