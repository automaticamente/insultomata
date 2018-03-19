const fs = require('fs');
const path = require('path');
const TG = require('treegrammar');
const color = require('tinycolor2');
const stitchit = require('./lib/stitchit');

const { sample } = require('lodash');

const insultos = require('./insultos.json');

const rules = {
  '<start>': ['<template>'],
  '<template>': [
    'Es un <insulto> e un <insulto>, vai <accion> <a_lugar>.',
    'Mira que es <insulto> <modificador>, vai <accion>!',
    'Me cago <familiar> que te <orixe>, <insulto> <modificador>.',
    'Vai <accion> <a_lugar>, <insulto> da <sexual_feminino>.',
    'Vai <accion> <a_lugar>, <insulto> do <sexual_masculino>.'
  ],
  '<insulto>': insultos.map(i => i.toLowerCase()),
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

const generator = new TG(rules);

module.exports.bot = function bot() {
  const i = generator.generate().toUpperCase();
  const background = color.random().toHexString();

  stitchit({
    text: i,
    font: path.join(__dirname, `fonts/stitch${sample([1, 2, 3])}.ttf`),
    fontSize: '60',
    size: '600x600',
    background
  }).then(buffer => fs.writeFileSync('./out.png', buffer));
};

if (require.main === module) {
  module.exports.bot();
}
