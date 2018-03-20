const fs = require('fs');
const { generator } = require('./generator');

const s = generator('n');

s.then(b => fs.writeFileSync('./out.png', b));
