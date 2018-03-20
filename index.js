const fs = require('fs');
const { generator } = require('./generator');

// const { twitterAPI } = require('./config');
// const { Tweeter } = require('./lib/tweeter');
//const tweeter = new Tweeter(twitterAPI);

const s = generator('n');

s.then(b => fs.writeFileSync('./out.png', b));
