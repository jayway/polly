const express = require('express');
const AWS = require('aws-sdk');

const router = express.Router();
const polly = new AWS.Polly({
  region: 'eu-west-1'
});

router.post('/', (req, res) => {
  const text = 'Hello world';
  const params = {
    Text: text,
    OutputFormat: 'json',
    VoiceId: 'Joanna',
    SpeechMarkTypes: ['word']
  };

  polly.synthesizeSpeech(params, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      const { AudioStream } = data;
      const speechMarkTypes = JSON.parse(`[${AudioStream.toString().replace('\n', ',')}]`);

      res.send({
        text,
        speechMarkTypes,
      });
    }
  });
});

module.exports = router;
