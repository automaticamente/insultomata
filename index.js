const redis = require('redis');
const { CronJob } = require('cron');
const { sample } = require('lodash');

const { generator } = require('./generator');
const { Tweeter } = require('./lib/tweeter');
const genderizer = require('./lib/genderizer');

const { twitterAPI, myself } = require('./config');
const t = new Tweeter(twitterAPI);

const client = redis.createClient({
  host: 'redis'
});

client.on('error', function(err) {
  process.stderr.write('Error ' + err);
});

function tweet(buffer, text) {
  buffer
    .then(b => {
      return t.tweetImageBuffer(b, text);
    })
    .then(id =>
      process.stdout.write(`
      done!
      Text: ${text}
      Link: https://twitter.com/${myself}/status/${id}\n
      `)
    )
    .catch(error => process.stderr.write(error));
}

function generateSingle() {
  process.stdout.write('Generating single tweet');

  const output = generator(sample(['f', 'm', 'n']));

  process.stdout.write(`
      Date: ${new Date()}
      posting tweet...\n
      `);

  tweet(output.buffer, output.text);
}

function followBack(user) {
  //I do not really care about callbacks here
  t.twitter.get('friends/ids', function(err, data) {
    const friends = data.ids.map(id => Number(id));

    if (!friends.includes(Number(user.id))) {
      process.stdout.write('Following user...');
      t.twitter.post('friendships/create', {
        user_id: user.id,
        follow: false
      });
    }
  });
}

function generateReply() {
  client.lpop('queue', function(error, reply) {
    if (error) {
      process.stderr.write(`Error: ${error}\n`);
    }

    if (reply) {
      process.stdout.write('Generating reply');

      const user = JSON.parse(reply);

      process.stdout.write(`
      User: ${user.handle} 
      Date: ${new Date()}
      check followback & posting tweet...\n
      `);

      followBack(user);

      genderizer(user.name).then(g => {
        const output = generator(g);
        tweet(output.buffer, `@${user.handle} ${output.text}`);
      });
    }
  });
}

new CronJob('0 0 */4 * * *', generateSingle, null, true, 'Europe/Madrid');
new CronJob('0 */2 * * * *', generateReply, null, true, 'Europe/Madrid');

generateSingle();
