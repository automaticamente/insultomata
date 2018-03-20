const redis = require('redis');
const client = redis.createClient({
  host: 'redis'
});

client.on('error', function(err) {
  process.stdout.write('Error ' + err);
});

client.select(1);

const T = require('twit');

const { twitterAPI } = require('./config.js');

const tweeter = new T(twitterAPI);

const stream = tweeter.stream('user');

stream.on('follow', event => {
  const user = event.source.screen_name;

  client.exists('@' + user, function(error, exists) {
    if (error) {
      process.stdout.write('Error ' + error);
    }

    if (!exists) {
      process.stdout.write(`Pushing to queue: ${user}\n`);

      client.rpush('queue', user);

      client.set('@' + user, '1');
      client.expire('@' + user, 3600 * 24);
    } else {
      process.stdout.write(`User: ${user} is blocked \n`);
    }
  });
});
