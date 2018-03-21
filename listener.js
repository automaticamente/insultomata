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

const i = new T(twitterAPI);

const stream = i.stream('user');

stream.on('follow', event => {
  const user = {
    handle: event.source.screen_name,
    name: event.source.name
  };

  client.exists('@' + user.handle, function(error, exists) {
    if (error) {
      process.stderr.write('Error ' + error);
    }

    if (!exists) {
      process.stdout.write(`Pushing to queue: 
      User: ${user.name}
      Handle: ${user.handle}\n`);

      client.rpush('queue', JSON.stringify(user));

      client.set('@' + user.handle, '1');
      client.expire('@' + user.handle, 3600 * 24);
    } else {
      process.stderr.write(`User: @${user.handle} is blocked \n`);
    }
  });
});
