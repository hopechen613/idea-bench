const applicationForm = document.getElementById('application-form');
const applicationsContainer = document.getElementById('applications-container');

const STATUS_LABELS = {
  not_started: 'Not started',
  applied: 'Applied',
  interview: 'Interview',
  offer: 'Offer',
  rejected: 'Rejected'
};

function daysUntil(dateStr) {
  if (!dateStr) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const deadline = new Date(dateStr);
  const diffMs = deadline - today;
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}
function renderApplication(app) {
  const card = document.createElement('div');
  card.className = 'application-card';

  let deadlineText = '';
  if (app.deadline) {
    const days = daysUntil(app.deadline);
    if (days < 0) {
      deadlineText = '<span class="deadline overdue">Deadline passed (' + app.deadline + ')</span>';
    } else if (days <= 7) {
      deadlineText = '<span class="deadline soon">Due in ' + days + ' day(s) - ' + app.deadline + '</span>';
    } else {
      deadlineText = '<span class="deadline">Due ' + app.deadline + '</span>';
    }
  }

  let linkHtml = '';
  if (app.link) {
    linkHtml = '<p><a href="' + app.link + '" target="_blank" rel="noopener">Application link</a></p>';
  }

  let notesHtml = '';
  if (app.notes) {
    notesHtml = '<p class="notes">' + app.notes + '</p>';
  }

  card.innerHTML =
    '<h3>' + app.role + ' @ ' + app.org + '</h3>' +
    '<span class="status-tag status-' + app.status + '">' + (STATUS_LABELS[app.status] || app.status) + '</span>' +
    deadlineText + linkHtml + notesHtml;

  applicationsContainer.appendChild(card);
}
async function loadApplications() {
  const result = await db
    .from('applications')
    .select()
    .order('deadline', { ascending: true, nullsFirst: false });

  const data = result.data;
  const error = result.error;

  if (error) {
    console.error('Error loading applications:', error.message, error.details, error.hint, error.code);
    return;
  }

  applicationsContainer.innerHTML = '';
  data.forEach(renderApplication);
}

applicationForm.addEventListener('submit', async function (event) {
  event.preventDefault();

  const org = document.getElementById('org-input').value;
  const role = document.getElementById('role-input').value;
  const status = document.getElementById('status-input').value;
  const deadline = document.getElementById('deadline-input').value || null;
  const link = document.getElementById('link-input').value || null;
  const notes = document.getElementById('notes-input').value || null;

  const result = await db
    .from('applications')
    .insert([{ org: org, role: role, status: status, deadline: deadline, link: link, notes: notes }])
    .select();

  const error = result.error;

  if (error) {
    console.error('Error saving application:', error.message, error.details, error.hint, error.code);
    return;
  }

  applicationForm.reset();
  loadApplications();
});

loadApplications();