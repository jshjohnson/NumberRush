// React
import React from 'react';
import ReactDOM from 'react-dom';
import ReactTestUtils from 'react-addons-test-utils';

// Components
import App from '../../assets/scripts/src/components/App';
// import GameControls from '../../assets/scripts/src/components/GameControls';
// import GameScreen from '../../assets/scripts/src/components/GameScreen';
// import ModeSwitcher from '../../assets/scripts/src/components/ModeSwitcher';
// import Scoreboard from '../../assets/scripts/src/components/Scoreboard';
// import StartScreen from '../../assets/scripts/src/components/StartScreen';

describe('App', () => {

    let root, component;

    beforeEach(function(){
        root = document.createElement('div');
        component = ReactDOM.render(<App />, root);
    });

    it('should render within <app />', () => {
        let renderer = ReactTestUtils.createRenderer();
        renderer.render(<App />);

        let actualElement = renderer.getRenderOutput();

        expect(actualElement.type).toBe('app');
    });

    it('should initialise with a score of 0', () => {
        ReactDOM.render(<App />, root);
        expect(component.state.score).toBe(0);
    });

    it('should have a timer of 60 seconds', () => {
        const REMAINING_TIME = 60000;

        ReactDOM.render(<App />, root);

        expect(component.state.remainingTime).toBe(REMAINING_TIME);
    });

    // it('should start the game but clicking start', () => {
    //     ReactDOM.render(<App />, root);
    //     let startButton = ReactDOM.findDOMNode(component.refs.startButton);

    //     console.log(startButton);

    //     ReactTestUtils.Simulate.click(startButton);

    //     expect(component.state.gameStarted).toBe(true);
    // });

});