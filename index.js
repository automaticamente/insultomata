const fs = require('fs');
const merge = require('deepmerge');
const TG = require('treegrammar');
const color = require('tinycolor2');
const stitchit = require('./lib/stitchit');

const { sample } = require('lodash');

const insults = require('./insultos.json');
const ima = insults.map(i => i.m.toLowerCase());
const ife = insults.map(i => i.f.toLowerCase());

const genericRules = {
  '<start>': ['<template>'],
  '<template>': [
    'Vai <accion>, <insulto>',
    'Mira que es <insulto> <modificador>, vai <accion>!',
    'Me cagho <familiar> que te <orixe>, <insulto> <modificador>.',
    'Vai <accion> <a_lugar>, <insulto> da <sexual_feminino>.',
    'Vai <accion> <a_lugar>, <insulto> do <sexual_masculino>.'
  ],
  '<familiar>': ['na nai', 'na <sexual_feminino>'],
  '<sexual_feminino>': ['cona', 'berberecha', 'perrecha'],
  '<sexual_masculino>': ['carallo', 'pirola'],
  '<orixe>': ['botou', 'cagou', 'chimpou'],
  '<modificador>': ['de merda', 'do carallo'],
  '<accion>': [
    'mexar',
    'cagar',
    'tocar a <sexual_feminino>',
    'rañar na <sexual_feminino>',
    'tocar o <sexual_masculino>'
  ],
  '<a_lugar>': ['ao pe dunha cola', 'ao campo', 'á corte', 'lonxe de aquí']
};

module.exports.bot = function bot(gender) {
  const rules_m = {
    '<template>': ['Es un <insulto> e un <insulto>, vai <accion> <a_lugar>.'],
    '<insulto>': ima
  };

  const rules_f = {
    '<template>': [
      'Es unha <insulto> e unha <insulto>, vai <accion> <a_lugar>.'
    ],
    '<insulto>': ife
  };

  const rules = merge(gender === 'm' ? rules_m : rules_f, genericRules);

  const generator = new TG(rules);
  const i = generator.generate().toUpperCase();

  stitchit({
    text: `${i}`,
    font: 'fonts/stitch.ttf',
    fontSize: '50',
    fill: '#235023',
    size: '600x400',
    background: `images/bg${sample([1, 2])}.png`
  }).then(buffer => fs.writeFileSync('./out.png', buffer));
};

if (require.main === module) {
  module.exports.bot('f');
}
