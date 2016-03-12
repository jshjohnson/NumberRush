// React
import React from 'react';
import ReactDOM from 'react-dom';
import ReactTestUtils from 'react-addons-test-utils';

// Components
import App from '../../assets/scripts/src/components/App';

describe('StartScreen', () => {

    const REMAINING_TIME = 60000;
    let root, component, html;

    beforeEach(function(){
        root = document.createElement('div');
        component = ReactTestUtils.renderIntoDocument(<App />);
    });

    it('should render within <app />', () => {
        let renderedDOM = ReactDOM.findDOMNode(component);
        expect(renderedDOM.tagName.toLowerCase()).toBe('app');
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
        expect(component.state.gameStarted).toBe(true);
    });

});

describe('GameScreen', () => {

    const REMAINING_TIME = 60000;
    let root, component, html;

    beforeEach(function(){
        root = document.createElement('div');
        component = ReactTestUtils.renderIntoDocument(<App />);

        // Start game
        let startButton =  ReactTestUtils.findRenderedDOMComponentWithTag(component, 'button');
        ReactTestUtils.Simulate.click(startButton);
    });


    it('should decrement the timer', () => {
        setTimeout(function() {
            expect(component.state.remainingTime).toBeLessThan(REMAINING_TIME);
            done();
        }, 1000);
    });

    it('should pick a number', () => {
        expect(component.state.currentNumber.digits).toEqual(jasmine.any(Number));
        expect(component.state.currentNumber.questionLanguage).toEqual(jasmine.any(String));
        expect(component.state.currentNumber.answerLanguage).toEqual(jasmine.any(String));
    });

    it('should increment the score with a correct answer', () => {
        let newNumber = {
            digits: 30,
            questionLanguage: 'Thirty',
            answerLanguage: 'Dreißig',
        };

        component.setState({ currentNumber: newNumber });

        let answerInput = ReactTestUtils.findRenderedDOMComponentWithTag(component, 'input');
        expect(answerInput.value).toEqual('');

        answerInput.value = 'Dreissig';
        expect(answerInput.value).toEqual('Dreissig');

        ReactTestUtils.Simulate.change(answerInput);
        ReactTestUtils.Simulate.keyUp(answerInput, {key: "Enter", keyCode: 13, which: 13});
        expect(component.state.score).toBeGreaterThan(0);
    });

    it('should pick a new number upon a correct answer', () => {
        let newNumber = {
            digits: 12,
            questionLanguage: 'Twelve',
            answerLanguage: 'Zwölf',
        };

        component.setState({ currentNumber: newNumber });

        let answerInput = ReactTestUtils.findRenderedDOMComponentWithTag(component, 'input');
        answerInput.value = 'Zwolf';

        ReactTestUtils.Simulate.change(answerInput);
        ReactTestUtils.Simulate.keyUp(answerInput, {key: "Enter", keyCode: 13, which: 13});

        expect(component.state.currentNumber).not.toEqual(newNumber);
    });


    it('should keep the number upon an incorrect answer', () => {
        let newNumber = {
            digits: 10,
            questionLanguage: 'Ten',
            answerLanguage: 'Zehn',
        };

        component.setState({ currentNumber: newNumber });

        let answerInput = ReactTestUtils.findRenderedDOMComponentWithTag(component, 'input');
        answerInput.value = 'Zwolf';

        ReactTestUtils.Simulate.change(answerInput);
        ReactTestUtils.Simulate.keyUp(answerInput, {key: "Enter", keyCode: 13, which: 13});

        expect(component.state.currentNumber).toEqual(newNumber);
    });


    it('should change the number on mode change', () => {
        let newNumber = {
            digits: 10,
            questionLanguage: 'Ten',
            answerLanguage: 'Zehn',
        };

        component.setState({ currentNumber: newNumber });

        let modeSwitcher = ReactTestUtils.findRenderedDOMComponentWithTag(component, 'modeswitcher');
        let modeInput = modeSwitcher.querySelector('select');

        modeInput.value = 'Extreme';
        ReactTestUtils.Simulate.change(modeInput);
        
        expect(component.state.currentNumber).not.toEqual(newNumber);
        expect(component.state.currentMode.name).not.toEqual('Easy');
    });

    it('should end game after the timer runs out', () => {
        component.setState({ remainingTime: 1000 });

        setTimeout(function() {
            expect(component.state.gameStarted).toBe(false);
            done();
        }, 1000);
    });
});