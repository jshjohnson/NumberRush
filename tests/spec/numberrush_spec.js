// React
import React from 'react';
import ReactDOM from 'react-dom';
import ReactTestUtils from 'react-addons-test-utils';

// Components
import App from '../../assets/scripts/src/components/App';

describe('StartScreen', () => {

    const REMAINING_TIME = 60000;
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
        expect(component.state.score).toBe(0);
    });

    it('should have a timer of 60 seconds', () => {
        expect(component.state.remainingTime).toBe(REMAINING_TIME);
    });

    it('should begin the game by clicking start', () => {
        let startButton =  ReactTestUtils.findRenderedDOMComponentWithTag(component, 'button');
        ReactTestUtils.Simulate.click(startButton);
        expect(component.state.gameStarted).toBe(true)
    });

});

describe('GameScreen', () => {

    const REMAINING_TIME = 60000;
    let root, component;

    beforeEach(function(){
        root = document.createElement('div');
        component = ReactDOM.render(<App />, root);

        // Start game
        let startButton =  ReactTestUtils.findRenderedDOMComponentWithTag(component, 'button');
        ReactTestUtils.Simulate.click(startButton);
    });


    it('should decrement the timer', (done) => {
        setTimeout(function() {
            expect(component.state.remainingTime).toBeLessThan(REMAINING_TIME);
            done();
        }, 1000);
    });

    it('should pick a number', () => {
        expect(component.state.currentNumber.digits).toEqual(jasmine.any(Number));
    });

    it('should translate that number into English', () => {
        expect(component.state.currentNumber.questionLanguage).toEqual(jasmine.any(String));
       
    });

    it('should translate that number into German', () => {
        expect(component.state.currentNumber.answerLanguage).toEqual(jasmine.any(String));
    });

});