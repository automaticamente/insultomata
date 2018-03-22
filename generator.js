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

  const colors = [
    'rgba(35,80,35,0.7)',
    'rgba(39,84,113,0.7)',
    'rgba(156,34,110,0.7)',
    'rgba(55,110,97,0.7)',
    'rgba(0,0,0,0.5)'
  ];

  return {
    text,
    buffer: stitchit({
      text: `${text.toUpperCase()}`,
      font: `media/fonts/stitch${random(1, 2)}.ttf`,
      fontSize: '55',
      fill: sample(colors),
      size: '600x400',
      background: `media/images/bg${random(1, 9)}.png`
    })
  };
};

if (require.main === module) {
  const { writeFileSync } = require('fs');
  const output = module.exports.generator(sample(['f', 'm', 'n']));

  output.buffer.then(b => {
    process.stdout.write(output.text);
    writeFileSync('./out.png', b);
  });
}
