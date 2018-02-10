const express = require('express');
const AWS = require('aws-sdk');
const { awsRegion } = require('../config');

const router = express.Router();
const polly = new AWS.Polly({
  region: awsRegion
});

const synthesizeSpeech = params => new Promise((resolve, reject) => {
  polly.synthesizeSpeech(params, (err, data) => {
    if (err) reject(err);
    else resolve(data);
  });
})

/**
 * Fetch speech mark types in JSON (-ish) format.
 *
 * @param {Object} data
 * @returns {Promise.<Object>}
 */
const getSpeechMarkTypes = ({ text, voiceId }) => synthesizeSpeech({
  Text: text,
  OutputFormat: 'json',
  VoiceId: voiceId,
  SpeechMarkTypes: ['word']
});

/**
 * Fetch audio stream in MP3 format.
 *
 * @param {Object} data
 * @returns {Promise.<Object>}
 */
const getAudioStream = ({ text, voiceId }) => synthesizeSpeech({
  Text: text,
  OutputFormat: 'mp3',
  VoiceId: voiceId,
  TextType: 'text'
});

/**
 * Format awkward speech mark types format into an array of objects.
 *
 * @param {Object} data
 * @returns {Object}
 */
const parseSpeechMarkTypes = data => {
  const { AudioStream: audioStream } = data;
  const speechMarkTypes = audioStream
    .toString()
    .replace(/\n/g, ',')
    .slice(0, -1);
  return JSON.parse(`[${speechMarkTypes}]`);
};

router.post('/', (req, res) => {
  const { text, voiceId } = req.body;

  Promise
    .all([
      getAudioStream({ text, voiceId }),
      getSpeechMarkTypes({ text, voiceId })
    ])
    .then(([ audioStreamRes, speechMarkTypesRes ]) => {
      const speechMarkTypes = parseSpeechMarkTypes(speechMarkTypesRes);
      const { AudioStream: audioStream } = audioStreamRes;

      res.json({
        audioStream,
        speechMarkTypes
      });
    });
});

module.exports = router;
