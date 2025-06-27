import '../css/style.css';

const apiKey = import.meta.env.VITE_OPEN_API_KEY;
const apiUrl = import.meta.env.VITE_OPEN_API_URL;

async function getStory(category) {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${apiKey}`,
  };
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: `Genera una historia de ${category}` }],
    }),
  });
  const data = await response.json();
  return data.choices[0].message.content;
}

document.querySelector('#app').innerHTML = `
  <div class="container is-flex is-flex-direction-column is-align-items-center is-justify-content-center">
    <div class="box box-container">
      <div class="field has-text-centered">
        <h2 class="title is-2 label">Elige una categoría de historia</h2>
        <div class="control">
          <div class="select is-fullwidth">
            <select id="category-select">
              <option value="ficcion">Ficción</option>
              <option value="comedia">Comedia</option>
              <option value="romance">Romance</option>
            </select>
          </div>
        </div>
      </div>
      <div class="buttons is-centered">
        <button class="button is-primary" id="btn-idea">Quiero una idea para una historia</button>
        <button class="button is-link" id="btn-inicio">Quiero el inicio de una historia</button>
        <button class="button is-info" id="btn-completa">Quiero una historia completa</button>
      </div>
      <div class="box mt-5" id="story-box">
        <p class="has-text-centered has-text-grey"></p>
      </div>
    </div>
  </div>
`;

const btnIdea = document.querySelector('#btn-idea');
const btnInicio = document.querySelector('#btn-inicio');
const btnCompleta = document.querySelector('#btn-completa');
const categorySelect = document.querySelector('#category-select');
const storyBox = document.querySelector('#story-box');

btnIdea.addEventListener('click', async () => {
  const story = await getStory(categorySelect.value);
  console.log(story);
  storyBox.textContent = story;
});

btnInicio.addEventListener('click', async () => {
  const story = await getStory(categorySelect.value);
  storyBox.textContent = story;
});

btnCompleta.addEventListener('click', async () => {
  const story = await getStory(categorySelect.value);
  storyBox.textContent = story;
});