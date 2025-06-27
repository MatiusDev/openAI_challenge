const apiKey = import.meta.env.VITE_OPEN_API_KEY;
const apiUrl = import.meta.env.VITE_OPEN_API_URL;

const btnFirstIdea = document.querySelector('#btn-first-idea');
const btnSecondIdea = document.querySelector('#btn-second-idea');
const btnThirdIdea = document.querySelector('#btn-third-idea');
const buttonsContainer = document.querySelector('#buttons-container');

const categorySelect = document.querySelector('#category-select');
const storyBox = document.querySelector('#story-box');

async function getStory(category, idea) {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${apiKey}`,
  };
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: `Genera una historia de ${category} de 50 palabras, la historia debe ser sobre ${idea}` }],
    }),
  });
  const data = await response.json();
  return data.choices[0].message.content;
}

async function getContinueStory(category, idea, story) {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${apiKey}`,
  };
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: `Genera una idea para continuar una historia de ${category} usando esta idea: ${idea}, devuelveme un texto corto, sin comas, ni comillas y no mas de 15 palabras. La historia actual es: ${story}` }],
      n: 3,
    }),
  });
  const data = await response.json();
  return data.choices.map(choice => choice.message.content);
}

async function getStoryByIdea(category, idea) {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${apiKey}`,
  };
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: `Genera una idea de titulo para una historia sobre ${category}, devuelveme solo el titulo en una respuesta corta, sin comas, ni comillas y no mas de 20 palabras.` }],
      n: 3,
    }),
  });
  const data = await response.json();
  return data.choices.map(choice => choice.message.content);
}

function generateTitles() {
  const promise = getStoryByIdea(categorySelect.value);
  promise.then(ideas => {
    btnFirstIdea.textContent = ideas[0];
    btnSecondIdea.textContent = ideas[1];
    btnThirdIdea.textContent = ideas[2];
    buttonsContainer.classList.remove('is-hidden');
  }).catch(error => {
    console.log(error);
  });
}

function continueStory(selectedIdea) {
  buttonsContainer.classList.add('is-hidden');
  const promise = getContinueStory(categorySelect.value, selectedIdea, storyBox.textContent);
  promise.then(stories => {
    btnFirstIdea.textContent = ` ${stories[0]}`;
    btnSecondIdea.textContent = ` ${stories[1]}`;
    btnThirdIdea.textContent = ` ${stories[2]}`;
    buttonsContainer.classList.remove('is-hidden');
  }).catch(error => {
    console.log(error);
  });
}

categorySelect.addEventListener('change', () => {
  if (categorySelect.value === '') {
    buttonsContainer.classList.add('is-hidden');
    btnFirstIdea.textContent = '';
    btnSecondIdea.textContent = '';
    btnThirdIdea.textContent = '';
    storyBox.textContent = '';
    return; 
  }
  generateTitles();
});

btnFirstIdea.addEventListener('click', async () => {
  const story = await getStory(categorySelect.value, btnFirstIdea.textContent);
  storyBox.textContent += story;
  continueStory(btnFirstIdea.textContent);
});

btnSecondIdea.addEventListener('click', async () => {
  const story = await getStory(categorySelect.value, btnSecondIdea.textContent);
  storyBox.textContent += story;
  continueStory(btnSecondIdea.textContent);
});

btnThirdIdea.addEventListener('click', async () => {
  const story = await getStory(categorySelect.value, btnThirdIdea.textContent);
  storyBox.textContent += story;
  continueStory(btnThirdIdea.textContent);
});