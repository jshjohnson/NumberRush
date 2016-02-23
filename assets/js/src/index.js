import React from 'react'
import ReactDOM from 'react-dom';

import 'whatwg-fetch';
import RandomString from 'randomstring';
import classNames from 'classnames';
import utils from './libs/utils';

const EN = {
    'ones': ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'],
    'tens': ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'],
    'teens': ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'],
    'million': 'million',
    'thousand': 'thousand',
    'hundred': 'hundred',
    'join': 'and',
}

const DE = {
    'ones': ['', 'eins', 'zwei', 'drei', 'vier', 'fünf', 'sechs', 'sieben', 'acht', 'neun'],
    'tens': ['', '', 'zwanzig', 'dreizig', 'viervig', 'fünfzig', 'sechzig', 'siebzig', 'achtzig', 'neunzig'],
    'teens': ['zehn', 'elf', 'zwölf', 'dreizehn', 'vierzehn', 'fünfzehn', 'sechzehn', 'siebzehn', 'achtzehn', 'neunzehn'],
    'million': 'milliard',
    'thousand': 'tausend',
    'hundred': 'hundert',
    'join': 'und',
}

let modes = [
    {
        name: 'Easy',
        numberRange: 100
    }, 
    {
        name: 'Intermediate',
        numberRange: 1000
    }, 
    {
        name: 'Hard',
        numberRange: 10000
    }
]

let Numberwang = React.createClass({

    getInitialState: function() {

        const DEFAULT_STATE = {
            modes: modes,
            currentMode: modes[0],
            score: 0,
            personalBest: 0,
            numbers: [],
        }

        let SAVED_STATE = null;

        if(localStorage.getItem('NumberwangState') !== null) {
            SAVED_STATE = JSON.parse(localStorage.NumberwangState);
        }

        return SAVED_STATE || DEFAULT_STATE;
    },

    componentDidMount: function() {
        let newState = {
            numbers: this.getNewNumbers(1)
        }

        this.setState(newState);
    },

    componentDidUpdate: function(prevProps, prevState) {
        localStorage.NumberwangState = JSON.stringify(this.state);
    },

    reloadGame: function() {
        let newState = {
            score: 0,
            numbers: this.getNewNumbers(1)
        }

        this.setState(newState);
    },

    setGameMode: function(newMode) {
        let newState = {
            score: 0,
            currentMode: newMode[0],
        }

        this.setState(newState, function(){
            this.setState({
                numbers: this.getNewNumbers(1),
            })
        });
    },

    handleGameModeChange: function(event) {
        let selectedMode = this.state.modes.filter(function(mode) {
            return mode.name == event.currentTarget.value;
        });

        this.setGameMode(selectedMode);
    },

    getNewNumbers: function(limit) {
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
                        english: utils.capitalise(this.translateNum(number, EN, 'forwards', true)),
                        german: utils.capitalise(this.translateNum(number, DE, 'backwards', false))
                    });

                    numberCount++;

                } else {
                    fillNumbersArray();
                }
            }  
        }.bind(this);

        fillNumbersArray();

        return numbers;
    },

    translateNum: function(num, lang, direction = 'forwards', space = true) {
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
    },

    answer: function(response, answer) {
        if(response === answer.german || response === answer.german.toLowerCase()) {
            let numberArray = this.state.numbers;
            let answerIndex = numberArray.indexOf(answer);
            let newNumber = this.getNewNumbers(1);

            // Remove correct answer 
            numberArray.splice(answerIndex, 1);
            // Add new question
            numberArray.push(newNumber[0]);
            // Increment score 
            let score = this.state.score + 5;

            return this.setState({
                numbers: numberArray,
                score: score,
                personalBest: score > this.state.personalBest ? score : this.state.personalBest
            });

        } else {
            console.log('Wrong answer :(');
        }
    },

    render: function() {
        return (
            <div className="cards">
                <header className="cards__header">
                    <h1 className="zero-bottom cards__heading">Score: { this.state.score } | Best: { this.state.personalBest }</h1>
                    <button className="cards__input cards__input--right cards__input--btn" onClick={ this.reloadGame } value="Reload">Reload</button>
                    <select className="cards__input cards__input--left" onChange={ this.handleGameModeChange } value={ this.state.currentMode.name }>
                       {
                            this.state.modes.map(function(mode) {
                                return (
                                    <option key={ mode.name } value={ mode.name }>{ mode.name }</option>
                                )
                            })
                       }
                    </select>
                </header>
                {
                    this.state.numbers.map(function(number) {
                        let areaDisabled = true;
                        if(this.state.numbers.indexOf(number) === 0) {
                            areaDisabled = false;
                        }

                        return (
                            <NumberArea areaDisabled={ areaDisabled } answer={ this.answer } key={ number.id } number={ number } />
                        ) 
                    }, this)
                }
            </div>
        );
    }
});

var NumberArea = React.createClass({
    handleKeyUp: function(event) {
        if(event.which == 13) {
            this.props.answer(event.currentTarget.value, this.props.number);
        }
    },

    render: function(){
        var areaClass = classNames({
            'cards__area': true,
            'cards__area--active': !this.props.areaDisabled,
            'cards__area--disabled': this.props.areaDisabled 
        });
        return (
            <div className={ areaClass }>
                <div className="cards__outer">
                    <div className="cards__inner">
                        <button className="cards__focus">{ this.props.number.digits }</button>
                        <p>{ this.props.number.english }</p>
                        <p>{ this.props.number.german }</p>
                        <input type="text" className="cards__answer" onKeyUp={ this.handleKeyUp }></input>
                    </div>
                </div>
            </div>
        ) 
    }
});


ReactDOM.render(<Numberwang />, document.getElementById('root'));
