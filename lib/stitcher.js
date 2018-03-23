const Im = require('./im');

module.exports = function(config) {
  return new Im(config.background)
    .size(config.size)
    .background('transparent')
    .fill(config.fill)
    .font(config.font)
    .fontSize(config.fontSize)
    .gravity('center')
    .text(config.text)
    .composite()
    .buffer('jpg');
};
