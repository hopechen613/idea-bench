const SUPABASE_URL = 'https://bcnnbaajbgihfgwiuzjs.supabase.co';
const SUPABASE_KEY = 'sb_publishable_gvWWnIz28P4JixSg2Z7-Fw_Xc6NYbu3';
const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
const SUPABASE_KEY = 'sb_publishable_gvWWnIz28P4JixSg2Z7-Fw_Xc6NYbu3';
const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const form = document.getElementById('idea-form');
const cardsContainer = document.getElementById('cards-container');

function renderCard(idea) {
  const card = document.createElement('div');
  card.className = 'idea-card';
  card.innerHTML = `
    <h3>${idea.title}</h3>
    <p>${idea.pitch || ''}</p>
    <span class="stage-tag">${idea.stage}</span>
  `;
  cardsContainer.appendChild(card);
}

async function loadIdeas() {
  const { data, error } = await db
    .from('ideas')
    .select()
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error loading ideas:', error.message, error.details, error.hint, error.code);
    return;
  }

  data.forEach(renderCard);
}

form.addEventListener('submit', async function (event) {
  event.preventDefault();

  const title = document.getElementById('title-input').value;
  const pitch = document.getElementById('pitch-input').value;
  const stage = document.getElementById('stage-input').value;

  const { data, error } = await db
    .from('ideas')
    .insert([{ title: title, pitch: pitch, stage: stage }])
    .select();

  if (error) {
    console.error('Error saving idea:', error.message, error.details, error.hint, error.code);
    return;
  }

  renderCard(data[0]);
  form.reset();
});

loadIdeas();