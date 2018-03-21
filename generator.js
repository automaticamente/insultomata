const TG = require('treegrammar');
const merge = require('deepmerge');
const { sample, random } = require('lodash');

const stitchit = require('./lib/stitcher');

const insults = require('./data/insultos.json');
const genericRules = require('./data/generic-rules.json');

const ife = insults.map(i => i.f.toLowerCase());
const ima = insults.map(i => i.m.toLowerCase());
const ine = insults.filter(i => i.f === i.m).map(i => i.f.toLowerCase());

module.exports.generator = function generator(gender) {
  const genderRules = {
    f: {
      '<template>': [
        'Es unha <insulto> e unha <insulto>, vai <accion> <accion_lugar>',
        'Es unha <insulto>',
        'Es unha <insulto> <modificador>'
      ],
      '<insulto>': ife
    },
    m: {
      '<template>': [
        'Es un <insulto> e un <insulto>, vai <accion> <accion_lugar>',
        'Es un <insulto>',
        'Es un <insulto> <modificador>'
      ],
      '<insulto>': ima
    },
    n: {
      '<insulto>': ine
    }
  };

  const generator = new TG(merge(genericRules, genderRules[gender]));

  const output = generator.generate();

  const text = output.charAt(0).toUpperCase() + output.slice(1);

  return stitchit({
    text: `${text.toUpperCase()}`,
    font: 'media/fonts/stitch.ttf',
    fontSize: '50',
    fill: 'rgba(35,80,35,0.7)',
    size: '600x400',
    background: `media/images/bg${random(1, 9)}.png`
  });
};

if (require.main === module) {
  module.exports.generator(sample(['f', 'm', 'n']));
}
