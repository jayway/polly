const $form = document.querySelector('form');
const $text = document.querySelector('[type="text"]')
const $textarea = document.querySelector('textarea');

$form.addEventListener('submit', (event) => {
  event.preventDefault();

  const payload = {
    text: $text.value
  };
  const data = new FormData();

  data.append('json', JSON.stringify(payload));

  const requestOptions = {
    method: 'POST',
    body: JSON.stringify(data),
    headers: new Headers({
      'Content-Type': 'application/json'
    })
  };

  fetch('/synthesize', requestOptions)
    .then(res => res.json())
    .then(({ text, speechMarkTypes }) => {
      $textarea.textContent = text;
      $textarea.focus();

      speechMarkTypes.forEach(({ start, end, time }) => {
        setTimeout(() => {
          $textarea.setSelectionRange(start, end)
        }, time)
      });
    })
    .catch(err => console.error(err));
});
