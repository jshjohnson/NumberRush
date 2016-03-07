// React
import React, { Component } from 'react';

// Utilities
import { capitalise, stripHTML, getRandomNumber } from '../libs/utils';
import merge from 'lodash/merge';

// Configs
import { EN, DE } from '../config/languages';
import { modes, defaultMode } from '../config/modes';
import { diacriticMap } from '../config/diacritics';

// Components
import StartScreen from './StartScreen';
import GameScreen from './GameScreen';
import ScoreBoard from './ScoreBoard';

// Constants
let testAudio = document.createElement("audio");

// Upping this cache will clear users' personal best scores! Use with caution
const CACHE_NUMBER   = 10;
const REMAINING_TIME = 60000;
const INCREMENT_TIME = 2000;
const SOUNDS = {
    beep: new Audio('assets/audio/beep.mp3'),
    success: new Audio('assets/audio/success.mp3'),
    fail: new Audio('assets/audio/incorrect.mp3')
};


class NumberRush extends Component {

    constructor(props) {
        super(props);

        const DEFAULT_STATE = {
            cache: CACHE_NUMBER,
            currentMode: defaultMode,
            answerAttempts: 0,
            score: 0,
            previousScore: 0,
            personalBest: 0,
            currentNumber: '',
            mute: false,
            remainingTime: REMAINING_TIME,
            gameStarted: false,
            controls: []
        }

        let SAVED_STATE = null;

        // If there is already a saved state in local storage
        if(localStorage.getItem('NumberRushState') !== null) {
            let parsedState = JSON.parse(localStorage.NumberRushState);

            // And its cache is not out of date, use the saved state
            if(parsedState.cache && parsedState.cache === CACHE_NUMBER) {
                SAVED_STATE = parsedState;
            } else {
                // Otherwise clear the out of date version
                localStorage.removeItem('NumberRushState');
            }
        }
        
        this.state = SAVED_STATE || DEFAULT_STATE;
    }

    componentDidMount() {
        this.endGame();
    };

    componentDidUpdate(prevProps, prevState) {
        localStorage.NumberRushState = JSON.stringify(this.state);
    };

    /**
     * Play given sound with optional loop
     * @param  {NodeElement}  sound Reference to audio element
     * @param  {Boolean} loop  Whether the sound should loop upon completion
     * @return
     */
    playSound = (sound, loop = false) => {
        if(!sound) return; 

        let play = () => {
            if(loop) sound.loop = true;
            sound.currentTime = 0;
            sound.play();
        }

        play();
    };

    /**
     * Stop given sound being played
     * @param  {NodeElement}  sound Reference to audio element
     * @return
     */
    stopSound = (sound) => {
        if(!sound) return; 
        sound.currentTime = 0;
        sound.pause();
    };

    /**
     * Begin timer and handle behaviour based on time remaining
     * @return
     */
    startTimer = () => {
        this.remainingTimer = setInterval(() => {
            let remainingTime = this.state.remainingTime - 1000;
            if(remainingTime < 10000 && !this.state.mute) {
                this.playSound(SOUNDS.beep);
            }
            if(remainingTime < 0) {
                if(!this.state.mute) this.stopSound(SOUNDS.beep);
                this.endGame();
            } else {
                this.setState({
                    remainingTime
                })
            }
        }, 1000);
    };

    /**
     * Start game with a fresh state and a new number to answer
     * @return
     */
    startGame = () => {
        let controls = [
            { name: 'End', action: this.endGame, active: true },
            { name: 'Restart', action: this.restartGame, active: true },
            { name: 'Mute', action: this.toggleGameAudio, active: testAudio.play ? true : false },
            { name: 'Unmute', action: this.toggleGameAudio, active: false }
        ];

        // Don't override controls if user has a saved state already
        if(localStorage.getItem('NumberRushState') !== null) {
            let savedState = JSON.parse(localStorage.NumberRushState);
            controls = merge(controls, savedState.controls);
        }

        let number = this.getNewNumber();

        let newState = {
            answerAttempts: 0,
            score: 0,
            currentNumber: number,
            controls,
            gameStarted: true
        }

        this.setState(newState, () => {
           this.startTimer(); 
        });
    };

    /**
     * End game with fresh state (remembering previous score)
     * @return
     */
    endGame = () => {
        let newState = {
            gameStarted: false,
            previousScore: this.state.score,
            currentNumber: '',
            remainingTime: REMAINING_TIME
        };
        
        clearInterval(this.remainingTimer);
        this.stopSound(SOUNDS.beep);
        this.setState(newState);
    };

    /**
     * Restart game with a score of 0 and a new number to answer
     * @note Could this be turned into just endGame() && startGame()?
     * @return
     */
    restartGame = () => {
        let number = this.getNewNumber();
        let newState = {
            answerAttempts: 0,
            previousScore: this.state.score,
            score: 0,
            currentNumber: number,
            remainingTime: REMAINING_TIME
        };

        clearInterval(this.remainingTimer);
        this.stopSound(SOUNDS.beep);
        this.setState(newState, () => {
            this.startTimer();
        });
    };

    /** 
     * Toggle whether the game should play audio
     * @return
     */
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
        };

        this.setState(newState);
    };

    /**
     * Set the difficulty of the numbers being asked
     * @param  {Object} newMode The mode to be switched to
     * @return
     */
    setGameMode = (newMode) => {
        let newState = {
            currentMode: newMode[0],
        };

        this.setState(newState, function(){
            let number = this.getNewNumber();
            return this.setState({
                currentNumber: number,
                answerAttempts: 0
            })
        });
    };
    
    /**
     * When a user selects a new mode, handle what should happen
     * @param  {Object} event Reference to event
     * @return
     */
    handleGameModeChange = (event) => {
        let selectedMode = modes.filter(function(mode) {
            return mode.name == event.currentTarget.value;
        });

        this.setGameMode(selectedMode);
    };

    /**
     * Translate a number into textual form 
     * @param  {Number}  num       Number to translate
     * @param  {[type]}  lang      Language to reference
     * @param  {String}  direction Whether a number should be translated to 'Sixty nine' or 'Nine Sixty'
     * @param  {Boolean} space     Whether spaces should be placed between numbers, i.e. 'Sixty nine' or 'Sixtynine'
     * @return {String}            Translated number
     */
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
            else if (num == 1) return lang.one[0];
            else return convertMillions(num);
        }

        return convert(num);
    };

    /**
     * Get new random number with translated values
     * @return {Object} A new random number object
     */
    getNewNumber = () => {
        let newNumber;
        let numberRange = this.state.currentMode.numberRange;

        let getNumber = function(){
            let number = getRandomNumber(1, numberRange);

            // If number is not the same as the current number
            if(number !== this.state.currentNumber.digits) {
                newNumber = {
                    digits: number,
                    questionLanguage: capitalise(this.translateNumber(number, EN, 'forwards', true)),
                    answerLanguage: capitalise(this.translateNumber(number, DE, 'backwards', false)),
                };
            } else {
                getNumber();
            } 
        }.bind(this);

        getNumber();

        return newNumber;
    };

    /**
     * Replace special characters within a string to standard characters
     * @param  {String} string String to run function against
     * @return {String}        String with standard characters 
     */
    removeDiacritics = (string) => {
        diacriticMap.forEach(function(element, index) {
            string = string.replace(diacriticMap[index].letters, diacriticMap[index].base);
        });
        
        return string;
    };

    /**
     * Handle what happens if a user answers the question correctly
     * @param  {String} answer User inputted answer
     * @return
     */
    handleSuccess = (answer) => {
        // Get new number
        let number = this.getNewNumber();
        // Increment score 
        let score = this.state.score + this.state.currentMode.multiplier;
        // Increment timer
        let remainingTime = this.state.remainingTime + INCREMENT_TIME;

        // If game hasn't been muted
        if(!this.state.mute) {
            // Play sound
            this.playSound(SOUNDS.success);
        }

        let newState = {
            personalBest: score > this.state.personalBest ? score : this.state.personalBest,
            answerAttempts: 0,
            currentNumber: number,
            score,
            remainingTime
        }

        this.setState(newState);
    };

    /**
     * Handle what happens if a user answers the question incorrectly
     * @return
     */
    handleFailure = () => {
        this.setState({
            answerAttempts: this.state.answerAttempts + 1
        });

        if(!this.state.mute) {
            this.playSound(SOUNDS.fail);
        }
    };

    /**
     * Determines whether a given response to a question is correct or incorrect
     * @param  {String} response The users response
     * @param  {Object} answer   The correct answer to compare the users response to
     * @return {Boolean}         Whether the answer is correct or incorrect
     */
    isCorrect = (response, answer) => {
        let responseSanitised = response.toLowerCase();
        let answerSanitised = answer.answerLanguage.toLowerCase();
        return (responseSanitised === answerSanitised || responseSanitised === this.removeDiacritics(answerSanitised)) ? true : false;
    };

    /**
     * Handle what happens when a user submits a response to a question
     * @param  {String} response The users response
     * @param  {Object} answer   The correct answer
     * @return
     */
    handleAnswer = (response, answer) => {
        let responseSanitised = stripHTML(response).replace(/\s+/g, '');

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
            answer: this.handleAnswer,
            answerAttempts: this.state.answerAttempts
        };

        let scoreboardProps = {
            score: this.state.score,
            personalBest: this.state.personalBest,
            remainingTime: this.state.remainingTime
        };

        return (
            <app className="window">
                {(!this.state.gameStarted) && (
                    <StartScreen previousScore={ this.state.previousScore } personalBest={ this.state.personalBest } startGame={ this.startGame } />
                )}
                {(this.state.gameStarted) && (
                    <GameScreen modeProps={ modeProps } numberProps={ numberProps } scoreboardProps={ scoreboardProps } controls={ this.state.controls } />
                )}
            </app>
        );
    };
};

export default NumberRush;