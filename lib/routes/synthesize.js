const express = require('express');
const AWS = require('aws-sdk');

const router = express.Router();
const polly = new AWS.Polly({
  region: 'eu-west-1'
});

router.get('/', (req, res) => {
  const { text } = req.query;
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
      res.send(data);
    }
  });
});

module.exports = router;
