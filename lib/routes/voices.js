const express = require('express');
const AWS = require('aws-sdk');

const { awsRegion } = require('../config');

const router = express.Router();
const polly = new AWS.Polly({
  region: awsRegion
});

router.get('/', (req, res) => {
  polly.describeVoices({}, (err, data) => {
    if (err) console.error(err);
    else {
      const { Voices: voices } = data;
      res.json({ voices });
    }
  });
});

module.exports = router;
