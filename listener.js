const redis = require('redis');
const client = redis.createClient({
  host: 'redis'
});

client.on('error', function(err) {
  process.stdout.write('Error ' + err);
});

const T = require('twit');

const { twitterAPI, myself } = require('./config.js');

const i = new T(twitterAPI);

const stream = i.stream('user');

function addToQueue(user) {
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
      client.expire('@' + user.handle, 3600 * 6);
    } else {
      process.stderr.write(`User: @${user.handle} is blocked \n`);
    }
  });
}

function handleFollow(event) {
  if (event.source.screen_name === myself) return;

  addToQueue({
    handle: event.source.screen_name,
    name: event.source.name,
    id: event.source.id_str
  });
}

function handleTweet(event) {
  const mentions = event.entities.user_mentions.filter(
    m => m.screen_name.toLowerCase() === myself
  );

  if (mentions.length && !event.retweeted_status) {
    addToQueue({
      handle: event.user.screen_name,
      name: event.user.name,
      id: event.user.id_str
    });
  }
}

stream.on('follow', handleFollow);
stream.on('tweet', handleTweet);
