const request = require('superagent');

function genderizer(name) {
  if (!name) return Promise.resolve('n');

  const firstNameOrWhatever = name.trim().split(' ')[0];

  if (!firstNameOrWhatever) Promise.resolve('n');

  return request
    .get(`https://api.genderize.io/?name=${firstNameOrWhatever}`)
    .then(({ body }) => {
      if (!body.gender) return 'n';
      return body.gender === 'female' ? 'f' : 'm';
    });
}

module.exports = genderizer;
