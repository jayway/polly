const $form = document.querySelector('form');
const $text = document.querySelector('[type="text"]')
const $button = document.querySelector('button');
const $textarea = document.querySelector('textarea');
const $player = document.querySelector('audio');
const $select = document.querySelector('select');

window.addEventListener('load', () => {
  const requestOptions = {
    method: 'GET'
  };

  // Populate voice select with available Amazon Polly voices
  fetch('/voices', requestOptions)
    .then(res => res.json())
    .then(({ voices }) => {
      voices.forEach(({ Id: voice, LanguageName: language }) => {
        const $option = document.createElement('option');
        $option.setAttribute('value', voice);
        $option.textContent = `${voice} (${language})`;
        $select.appendChild($option);
      });

      $button.disabled = false;
    });
});

$form.addEventListener('submit', (event) => {
  event.preventDefault();

  const requestOptions = {
    method: 'POST',
    body: JSON.stringify({
      text: $text.value,
      voiceId: $select[$select.selectedIndex].value
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  };

  $button.disabled = true;

  fetch('/synthesize', requestOptions)
    .then(res => res.json())
    .then(({ audioStream, speechMarkTypes }) => {
      $textarea.textContent = $text.value;
      $textarea.focus();

      // Play the audio stream
      // Ref: https://stackoverflow.com/a/41173858/517528
      const uInt8Array = new Uint8Array(audioStream.data);
      const arrayBuffer = uInt8Array.buffer;
      const blob = new Blob([arrayBuffer]);
      const url = URL.createObjectURL(blob);

      $player.src = url;

      $player.addEventListener('loadeddata', () => {
        // Highlight text as it is spoken (not really)
        speechMarkTypes.forEach(({ start, end, time }) => {
          setTimeout(() => {
            $textarea.setSelectionRange(start, end)
          }, time)
        });

        $player.play();
      });

      // Re-enable the speak button after finishing playback, or on errors
      $player.addEventListener('ended', () => {
        $button.disabled = false;
      });

      $player.addEventListener('error', () => {
        $button.disabled = false;
      });
    })
    .catch(err => console.error(err));
});
