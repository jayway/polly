const express = require('express');
const AWS = require('aws-sdk');

const router = express.Router();
const polly = new AWS.Polly({
  region: 'eu-west-1'
});

router.post('/', (req, res) => {
  const text = 'Why does this work';
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
      const speechMarkTypes = AudioStream
        .toString()
        .replace(/\n/g, ',')
        .slice(0, -1);
      const json = JSON.parse(`[${speechMarkTypes}]`);

      res.send({
        text,
        speechMarkTypes: json,
      });
    }
  });
});

module.exports = router;
