// React
import React, { Component } from 'react';

// Utilities
import { capitalise, stripHTML } from '../libs/utils';
import merge from 'lodash/merge';

// Configs
import { EN, DE } from '../config/languages';
import { modes, defaultMode } from '../config/modes';
import { diacriticMap } from '../config/diacritics';

// Components
import StartScreen from './StartScreen';
import GameScreen from './GameScreen';
import ScoreBoard from './ScoreBoard';

const REMAINING_TIME = 600000;

class Numberwang extends Component {

    constructor(props) {
        super(props);

        const DEFAULT_STATE = {
            currentMode: defaultMode,
            answerAttempts: 0,
            score: 0,
            previousScore: 0,
            personalBest: 0,
            currentNumber: [],
            mute: false,
            remainingTime: REMAINING_TIME,
            gameStarted: false,
            controls: []
        }

        let SAVED_STATE = null;

        // If there is already a saved state in local stroage, use that
        if(localStorage.getItem('NumberRushState') !== null) {
            SAVED_STATE = JSON.parse(localStorage.NumberRushState);
        }

        this.state = SAVED_STATE || DEFAULT_STATE;
    }

    componentDidMount() {
        this.endGame();
    };

    componentDidUpdate(prevProps, prevState) {
        localStorage.NumberRushState = JSON.stringify(this.state);
    };

    playSound = (sound, loop = false) => {
        if(!sound) return; 

        let play = () => {
            sound.currentTime = 0;
            sound.play();
        }

        play();

        if(loop) {
            sound.addEventListener('ended', play, false);    
        }
    };

    stopSound = (sound) => {
        if(!sound) return; 
        sound.pause();
        sound.currentTime = 0;
    };

    startTimer = () => {
        let beep = new Audio('assets/audio/beep.mp3');

        this.remainingTimer = setInterval(() => {
            let remainingTime = this.state.remainingTime - 1000;
            if(remainingTime === 10000 && !this.state.mute) {
                this.playSound(beep, true);
            }
            if(remainingTime < 0) {
                this.stopSound(beep);
                this.endGame();
            } else {
                this.setState({
                    remainingTime
                })
            }
        }, 1000);
    };

    startGame = () => {
        let controls = [
            { name: 'End', action: this.endGame, active: true },
            { name: 'Restart', action: this.restartGame, active: true },
            { name: 'Mute', action: this.toggleGameAudio, active: true },
            { name: 'Unmute', action: this.toggleGameAudio, active: false }
        ];

        // Don't override controls if user has a saved state already
        if(localStorage.getItem('NumberRushState') !== null) {
            let savedState = JSON.parse(localStorage.NumberRushState);
            controls = merge(controls, savedState.controls);
        }

        let numbers = this.getNewNumber();

        let newState = {
            answerAttempts: 0,
            score: 0,
            currentNumber: numbers[0],
            controls,
            gameStarted: true
        }

        return this.setState(newState, () => {
           this.startTimer(); 
        });
    };

    endGame = () => {
        let newState = {
            gameStarted: false,
            previousScore: this.state.score,
            currentNumber: [],
            remainingTime: REMAINING_TIME
        };

        clearInterval(this.remainingTimer);
        this.setState(newState);
    };

    restartGame = () => {
        let numbers = this.getNewNumber();

        let newState = {
            answerAttempts: 0,
            previousScore: this.state.score,
            score: 0,
            currentNumber: numbers[0],
            remainingTime: REMAINING_TIME
        };

        localStorage.removeItem('NumberRushState');
        clearInterval(this.remainingTimer);
        this.setState(newState, () => {
            this.startTimer();
        });
    };

    toggleGameAudio = () => {
        let controls = [
            { name: 'End', action: this.endGame, active: true },
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
            let numbers = this.getNewNumber();
            return this.setState({
                currentNumber: numbers[0],
                answerAttempts: 0
            })
        });
    };

    handleGameModeChange = (event) => {
        let selectedMode = modes.filter(function(mode) {
            return mode.name == event.currentTarget.value;
        });

        this.setGameMode(selectedMode);
    };

    translateNumber = (num, lang, direction = 'forwards', space = true) => {
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
                    if(num % 10 === 0) { 
                        // If number is divisible by ten
                        return lang.tens[Math.floor(num / 10)];
                    } else { 
                        return lang.ones[num % 10] + whitespace + lang.join + whitespace + lang.tens[Math.floor(num / 10)]; 
                    }
                }
            }
        }

        let convert = function(num) {
            if (num == 0) return "zero";
            else return convertMillions(num);
        }

        return convert(num);
    };

    getNewNumber = () => {
        let numbers = []
        let numberCount = 0;
        let numberRange = this.state.currentMode.numberRange;

        let getRandomNumber = function(min, max) {
            return Math.floor(Math.random() * (max - min) + min);
        };

        let getNumber = function(){
            let number = getRandomNumber(1, numberRange);

            // If number is not the same as the current number
            if(number !== this.state.currentNumber.digits) {
                numbers.push({
                    digits: number,
                    questionLanguage: capitalise(this.translateNumber(number, EN, 'forwards', true)),
                    answerLanguage: capitalise(this.translateNumber(number, DE, 'backwards', false)),
                });

                numberCount++;
            } else {
                getNumber();
            } 

        }.bind(this);

        getNumber();

        return numbers;
    };

    removeDiacritics = (string) => {
        diacriticMap.forEach(function(element, index) {
            string = string.replace(diacriticMap[index].letters, diacriticMap[index].base);
        });
        
        return string;
    };

    handleSuccess = (answer) => {
        // Get new numbers
        let numbers = this.getNewNumber();
        // Increment score 
        let score = this.state.score + this.state.currentMode.multiplier;
        // Increment timer
        let remainingTime = this.state.remainingTime + (this.state.currentMode.multiplier * 1000);

        // If game hasn't been muted
        if(!this.state.mute) {
            // Play sound
            let success = new Audio('assets/audio/success.mp3');
            success.play();
        }

        let newState = {
            personalBest: score > this.state.personalBest ? score : this.state.personalBest,
            answerAttempts: 0,
            currentNumber: numbers[0],
            score,
            remainingTime
        }

        return this.setState(newState);
    };

    handleFailure = () => {
        this.setState({
            answerAttempts: this.state.answerAttempts + 1
        });

        if(!this.state.mute) {
            let fail = new Audio('assets/audio/incorrect.mp3');
            fail.play();
        }
    };

    isCorrect = (response, answer) => {
        let responseSanitised = response.toLowerCase();
        let answerSanitised = answer.answerLanguage.toLowerCase();

        return (responseSanitised === answerSanitised || responseSanitised === this.removeDiacritics(answerSanitised)) ? true : false;
    };

    answer = (response, answer) => {
        let responseSanitised = stripHTML(response);
        if (this.isCorrect(responseSanitised, answer)) {
            this.handleSuccess(answer);
        } else if(response) {
            this.handleFailure();
        }
    };

    render() {
        let modeProps = {
            modes: modes,
            changeMode: this.handleGameModeChange,
            currentMode: this.state.currentMode.name
        };

        let numberProps = {
            currentNumber: this.state.currentNumber,
            answer: this.answer,
            answerAttempts: this.state.answerAttempts
        };

        let scoreboardProps = {
            score: this.state.score,
            personalBest: this.state.personalBest,
            remainingTime: this.state.remainingTime
        };

        return (
            <numberwang className="window">
                {(!this.state.gameStarted) && (
                    <StartScreen previousScore={ this.state.previousScore } personalBest={ this.state.personalBest } startGame={ this.startGame } />
                )}
                {(this.state.gameStarted) && (
                    <GameScreen modeProps={ modeProps } numberProps={ numberProps } scoreboardProps={ scoreboardProps } controls={ this.state.controls } />
                )}
            </numberwang>
        );
    };
};

export default Numberwang;