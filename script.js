const SUPABASE_URL = 'https://bcnnbaajbgihfgwiuzjs.supabase.co';
const SUPABASE_KEY = 'sb_publishable_gvWWnIz28P4JixSg2Z7-Fw_Xc6NYbu3';
const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
const form = document.getElementById('idea-form');
const cardsContainer = document.getElementById('cards-container');

form.addEventListener('submit', function (event) {
  event.preventDefault();

  const title = document.getElementById('title-input').value;
  const pitch = document.getElementById('pitch-input').value;
  const stage = document.getElementById('stage-input').value;

  const card = document.createElement('div');
  card.className = 'idea-card';
  card.innerHTML = `
    <h3>${title}</h3>
    <p>${pitch}</p>
    <span class="stage-tag">${stage}</span>
  `;

  cardsContainer.appendChild(card);

  form.reset();
});