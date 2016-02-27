// React
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

// Utilities
import RandomString from 'randomstring';
import utils from '../libs/utils';
import { merge } from 'lodash/object';

// Components
import NumberArea from './NumberArea';
import ScoreBoard from './ScoreBoard';
import ModeSwitcher from './ModeSwitcher';
import GameControls from './GameControls';

// Configs
import { EN, DE } from '../config/languages';
import { modes } from '../config/modes';
import { diacriticMap } from '../config/diacritics';

let remainingTimer = null;

const REMAINING_TIME = 60000;
const DEFAULT_STATE = {
    modes: modes,
    currentMode: modes[0],
    score: 0,
    personalBest: 0,
    numbers: [],
    mute: false,
    remainingTime: REMAINING_TIME,
    controls: []
}

class Numberwang extends Component {

    constructor(props) {
        super(props);

        let SAVED_STATE = null;

        if(localStorage.getItem('NumberwangState') !== null) {
            SAVED_STATE = JSON.parse(localStorage.NumberwangState);
        }

        this.state = SAVED_STATE || DEFAULT_STATE;
    }

    componentDidMount() {
        let controls = [
            { name: 'Restart', action: this.restartGame, active: true },
            { name: 'Mute', action: this.toggleGameAudio, active: true },
            { name: 'Unmute', action: this.toggleGameAudio, active: false }
        ];

        // Don't override controls if user has a saved state already
        if(localStorage.getItem('NumberwangState') !== null) {
            let savedState = JSON.parse(localStorage.NumberwangState);
            controls = merge(controls, savedState.controls);
        }

        let newState = {
            numbers: this.getNewNumbers(1),
            controls
        }

        return this.setState(newState, () => {
           return this.startTimer(); 
        });
    };

    componentDidUpdate(prevProps, prevState) {
        localStorage.NumberwangState = JSON.stringify(this.state);
    };

    startTimer = () => {
        remainingTimer = setInterval(() => {
            let remainingTime = this.state.remainingTime - 1000;
            if(remainingTime < 0) {
                this.restartGame();
            } else {
                this.setState({
                    remainingTime
                })
            }
        }, 1000);
    };

    restartGame = () => {
        let newState = {
            score: 0,
            numbers: this.getNewNumbers(1),
            remainingTime: REMAINING_TIME
        }

        localStorage.removeItem('NumberwangState');
        clearInterval(remainingTimer);
        this.setState(newState, () => {
            this.startTimer();
        });
    };

    toggleGameAudio = () => {
        console.log(controls);
        let controls = [
            { name: 'Restart', action: this.restartGame, active: true },
            { name: 'Mute', action: this.toggleGameAudio, active: this.state.mute ? true : false },
            { name: 'Unmute', action: this.toggleGameAudio, active: this.state.mute ? false : true }
        ];

        let newState = {
            mute: this.state.mute ? false : true,
            controls
        }

        this.setState(newState);
    };

    setGameMode = (newMode) => {
        let newState = {
            currentMode: newMode[0],
        }

        this.setState(newState, function(){
            return this.setState({
                numbers: this.getNewNumbers(1),
            })
        });
    };

    handleGameModeChange = (event) => {
        let selectedMode = this.state.modes.filter(function(mode) {
            return mode.name == event.currentTarget.value;
        });

        this.setGameMode(selectedMode);
    };

    getNewNumbers = (limit) => {
        let numbers = []
        let numberLimit = limit || 1;
        let numberCount = 0;
        let numberRange = this.state.currentMode.numberRange;

        let getRandomNumber = function(min, max) {
            return Math.floor(Math.random() * (max - min) + min);
        };

        let fillNumbersArray = function(){
            while(numberCount < numberLimit) {
                let number = getRandomNumber(1, numberRange);

                if(numbers.indexOf(number) === -1) {
                    numbers.push({
                        id: RandomString.generate(6),
                        digits: number,
                        questionLanguage: utils.capitalise(this.translateNum(number, EN, 'forwards', true)),
                        answerLanguage: utils.capitalise(this.translateNum(number, DE, 'backwards', false)),
                        answerAttempts: 0,
                    });

                    numberCount++;
                } else {
                    fillNumbersArray();
                }
            }  
        }.bind(this);

        fillNumbersArray();

        return numbers;
    };

    translateNum = (num, lang, direction = 'forwards', space = true) => {
        let whitespace = space ? ' ' : '';

        let convertMillions = function(num) {
            if (num >= 1000000) {
                return convertMillions(Math.floor(num / 1000000)) + whitespace + lang.million + whitespace + convertThousands(num % 1000000);
            } else {
                return convertThousands(num);
            }
        }

        let convertThousands = function(num) {
            if (num >= 1000) {
                return convertHundreds(Math.floor(num / 1000)) + whitespace + lang.thousand + whitespace + convertHundreds(num % 1000);
            } else {
                return convertHundreds(num);
            }
        }

        let convertHundreds = function(num) {
            if (num > 99) {
                if(direction === 'forwards') {  
                    return lang.ones[Math.floor(num / 100)] + whitespace + lang.hundred + whitespace + lang.join + whitespace + convertTens(num % 100);
                } else {
                    return lang.ones[Math.floor(num / 100)] + whitespace + lang.hundred + whitespace + convertTens(num % 100);
                }
            } else {
                return convertTens(num);
            }
        }

        let convertTens = function(num) {
            if (num < 10) return lang.ones[num];
            else if (num >= 10 && num < 20) {
                return lang.teens[num - 10];
            } else {
                if(direction === 'forwards') {  
                    return lang.tens[Math.floor(num / 10)] + whitespace + lang.ones[num % 10];
                } else {
                    return lang.ones[num % 10] + whitespace + lang.join + whitespace + lang.tens[Math.floor(num / 10)];
                }
            }
        }

        let convert = function(num) {
            if (num == 0) return "zero";
            else return convertMillions(num);
        }

        return convert(num);
    };

    removeDiacritics = (string) => {
        diacriticMap.forEach(function(element, index) {
            string = string.replace(diacriticMap[index].letters, diacriticMap[index].base);
        });
        
        return string;
    };

    answer = (response, answer) => {
        if ( 
            response === answer.answerLanguage || 
            response === this.removeDiacritics(answer.answerLanguage) || 
            response === answer.answerLanguage.toLowerCase() ||
            response === this.removeDiacritics(answer.answerLanguage).toLowerCase()
        ) {
            let numberArray = this.state.numbers;
            let answerIndex = numberArray.indexOf(answer);
            let newNumber = this.getNewNumbers(1);

            // Remove correct answer 
            numberArray.splice(answerIndex, 1);
            // Add new question
            numberArray.push(newNumber[0]);
            // Increment score 
            let score = this.state.score + this.state.currentMode.multiplier;

            // If game hasn't been muted
            if(!this.state.mute) {
                // Play sound
                let audio = new Audio('../../assets/audio/correct.mp3');
                audio.play();
            }

            let newState = {
                numbers: numberArray,
                score: score,
                personalBest: score > this.state.personalBest ? score : this.state.personalBest
            }

            // Update state
            return this.setState(newState);

        } else if(response) {
            if(!this.state.mute) {
                let audio = new Audio('../../assets/audio/incorrect.mp3');
                audio.play();
            }
            let currentNumber = this.state.numbers[0];
        }
    };

    render() {
        return (
            <numberwang className="window">
                <header className="header">
                    <ScoreBoard score={ this.state.score } personalBest={ this.state.personalBest } timer={ this.state.remainingTime } />
                    <GameControls controls={ this.state.controls } />
                    <ModeSwitcher modes={ this.state.modes } changeMode={ this.handleGameModeChange } currentMode={ this.state.currentMode.name }/>
                </header>
                {
                    this.state.numbers.map(function(number) {
                        let areaDisabled = true;
                        if(this.state.numbers.indexOf(number) === 0) {
                            areaDisabled = false;
                        }
                        return (
                            <NumberArea areaDisabled={ areaDisabled } answer={ this.answer } key={ number.id } number={ number } cheatMode={ this.props.cheatMode }/>
                        ) 
                    }, this)
                }
            </numberwang>
        );
    };
};

export default Numberwang;