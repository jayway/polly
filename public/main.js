const $form = document.querySelector('form');
const $text = document.querySelector('[type="text"]')
const $player = document.querySelector('audio');

const context = new AudioContext();

const playSound = (buffer) => {
  const source = context.createBufferSource();
  source.buffer = buffer;
  source.connect(context.destination);
  source.start(0);
};

$form.addEventListener('submit', (event) => {
  // $player.src = '/synthesize?voiceId=Joanna' +
  //   '&text=' + encodeURIComponent($text.value) +
  //   '&outputFormat=ogg_vorbis';
  // $player.play();
});
