const $form = document.querySelector('form');
const $text = document.querySelector('[type="text"]')
const $textarea = document.querySelector('textarea');
const $player = document.querySelector('audio');

$form.addEventListener('submit', (event) => {
  event.preventDefault();

  const payload = {
    text: $text.value
  };

  const requestOptions = {
    method: 'POST',
  };

  fetch('/synthesize/text?text=' + encodeURIComponent($text.value), requestOptions)
    .then(res => res.json())
    .then(({ text, speechMarkTypes }) => {
      $textarea.textContent = text;
      $textarea.focus();

      $player.src = '/synthesize/audio?text=' + encodeURIComponent(text) 
      $player.play()
      console.log("player", $player)
      speechMarkTypes.forEach(({ start, end, time }) => {
        setTimeout(() => {
          $textarea.setSelectionRange(start, end)
        }, time)
      });
      
    })
    .catch(err => console.error(err));
});
