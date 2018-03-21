const fs = require('fs');
const { generator } = require('./generator');
const { sample } = require('lodash');

// const { twitterAPI } = require('./config');
// const { Tweeter } = require('./lib/tweeter');
//const tweeter = new Tweeter(twitterAPI);

const s = generator(sample(['f', 'm', 'n']));

s.then(b => fs.writeFileSync('./out.png', b));
