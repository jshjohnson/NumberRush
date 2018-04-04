# Number Rush

My first experimentation with React.js and ServiceWorker: A simple "against the clock" style, number based game to help learn German numbers 🇩🇪.

[Link](https://joshuajohnson.co.uk/NumberRush)

----
### Interested in writing your own React web apps? Check out [ReactForBeginners.com](https://ReactForBeginners.com/friend/JOHNSON) for great tutorials!
----

## Development
* Installation: `npm install`
* Local server (& hot reloading): `npm start`
* Styling: `npm run css:watch`
* Script building: `npm run js:build`
* Script testing: `npm run js:test`
* Script continuous testing: `npm run js:test_watch`

## For unlucky Windows fellows
* Have Python 2.7 installed and reachable from the path
* If you still have errors, run in a command window started as administrator
```
    $ npm install --global --production windows-build-tools

    $ npm config set msvs_version 2015 --global
```
and then do a `npm install` in a new command window (so the PATH gets updated). This is needed, unfortunately, to build the SASS compiler.

## Code review
I'm new to React so any performance improvements that can be made will be appreciated as pull requests. All React-specific stuff is located in [`assets/scripts/src/`](https://github.com/jshjohnson/NumberRush/tree/master/assets/scripts/src)

### To do:
* ~~Add unit tests~~
* Refactor css
* Experiment with Redux/Flux for state handling 

### Credits:
I felt inspired to build this as a result of [this](http://jnjosh.com/posts/learning-german-with-AVSpeechUtterance/) article. Note to self: Blog more! 
