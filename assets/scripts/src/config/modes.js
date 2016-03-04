export const modes = [
    {
        name: 'Cheat',
        numberRange: 20,
        multiplier: 1
    },
    {
        name: 'Easy',
        numberRange: 50,
        multiplier: 2
    }, 
    {
        name: 'Intermediate',
        numberRange: 100,
        multiplier: 4
    }, 
    {
        name: 'Hard',
        numberRange: 1000,
        multiplier: 8
    },
    {
        name: 'Extreme',
        numberRange: 10000,
        multiplier: 12
    }
];

export const defaultMode = modes[1];

export default modes;