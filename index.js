const TG = require('treegrammar');

const insultos = require('./insultos.json');

const rules = {
  '<start>': ['<template>'],
  '<template>': [
    'Es un <insulto> e un <insulto>, vai <accion> <a_lugar>.',
    'Ai <insulto> <modificador>, vai <accion>!',
    'Me cago <familiar> que te <orixe>, <insulto> <modificador>.',
    'Vai <accion> <a_lugar>, <insulto> da <sexual_feminino>.'
  ],
  '<insulto>': insultos.map(i => i.toLowerCase()),
  '<familiar>': ['na nai', 'na <sexual_feminino>'],
  '<sexual_feminino>': ['cona', 'caralla', 'berberecha', 'perrecha'],
  '<orixe>': ['botou', 'cagou', 'chimpou'],
  '<modificador>': ['de merda', 'do carallo'],
  '<accion>': ['mexar', 'cagar', 'tocar a <sexual_feminino>'],
  '<a_lugar>': ['ao pe dunha cola', 'ao campo', 'á corte']
};

const generator = new TG(rules);

for (let i = 0; i < 15; i++) {
  console.log(generator.generate());
}
