const Twit = require('twit');

class Tweeter {
  constructor(api) {
    this.twitter = new Twit(api);
  }

  tweetImageBuffer(image, status, reply_id) {
    return new Promise((resolve, reject) => {
      this.twitter.post(
        'media/upload',
        {
          media_data: image.toString('base64')
        },
        (error, data) => {
          if (error) {
            reject(error);
          }

          const params = {
            status,
            media_ids: [data.media_id_string]
          };

          if (reply_id) {
            params['in_reply_to_status_id'] = reply_id;
          }

          this.twitter.post('statuses/update', params, function(error, data) {
            if (error) {
              reject(error);
            }

            resolve(data.id_str);
          });
        }
      );
    });
  }
}

module.exports = {
  Tweeter
};
