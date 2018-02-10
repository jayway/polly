const $form = document.querySelector('form');
const $text = document.querySelector('[type="text"]')
const $textarea = document.querySelector('textarea');
const $player = document.querySelector('audio');

$form.addEventListener('submit', (event) => {
  event.preventDefault();

  const requestOptions = {
    method: 'POST',
    body: JSON.stringify({ text: $text.value }),
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }
  };

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
    })
    .catch(err => console.error(err));
});
