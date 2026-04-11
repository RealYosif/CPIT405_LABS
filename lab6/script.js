// ── Storage helpers (localStorage works without a server) ───────────────────

function saveData(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function loadData(key, fallback) {
  const raw = localStorage.getItem(key);
  if (raw === null) return fallback;
  try { return JSON.parse(raw); } catch (e) { return fallback; }
}

// ── Vote logic ──────────────────────────────────────────────────────────────

function vote(type) {
  if (loadData('lab6_vote', null)) {
    document.getElementById('voteNotice').textContent = 'You have already voted.';
    return;
  }

  let likes    = loadData('lab6_likeCount', 0);
  let dislikes = loadData('lab6_dislikeCount', 0);

  if (type === 'like') likes++;
  else                 dislikes++;

  saveData('lab6_vote',         type);
  saveData('lab6_likeCount',    likes);
  saveData('lab6_dislikeCount', dislikes);

  updateUI();
}

// ── Comment logic ───────────────────────────────────────────────────────────

function submitComment() {
  const input    = document.getElementById('commentInput');
  const text     = input.value.trim();
  const comments = loadData('lab6_comments', []);

  if (!text) {
    document.getElementById('commentNotice').textContent = 'Please write a comment first.';
    return;
  }

  if (comments.length > 0) {
    document.getElementById('commentNotice').textContent = 'You have already commented.';
    return;
  }

  const voteChoice = loadData('lab6_vote', 'none');
  comments.push({ text, vote: voteChoice, time: new Date().toLocaleTimeString() });

  saveData('lab6_comments', comments);

  input.value = '';
  document.getElementById('commentNotice').textContent = '';

  renderComments();
}

function clearInput() {
  document.getElementById('commentInput').value = '';
  document.getElementById('commentNotice').textContent = '';
}

// ── Render ──────────────────────────────────────────────────────────────────

function renderComments() {
  const list     = document.getElementById('commentsList');
  const comments = loadData('lab6_comments', []);

  if (comments.length === 0) {
    list.innerHTML = '';
    return;
  }

  list.innerHTML = comments.map(function(c) {
    const voteLabel =
      c.vote === 'like'    ? '👍 liked' :
      c.vote === 'dislike' ? '👎 disliked' : 'no vote';
    return (
      '<div class="comment-card">' +
        '<div class="comment-meta">' + voteLabel + ' &middot; ' + c.time + '</div>' +
        escapeHtml(c.text) +
      '</div>'
    );
  }).join('');
}

function escapeHtml(str) {
  return str
    .replace(/&/g,  '&amp;')
    .replace(/</g,  '&lt;')
    .replace(/>/g,  '&gt;')
    .replace(/"/g,  '&quot;');
}

function updateUI() {
  const voted    = loadData('lab6_vote', null);
  const likes    = loadData('lab6_likeCount', 0);
  const dislikes = loadData('lab6_dislikeCount', 0);

  document.getElementById('likeCount').textContent    = likes;
  document.getElementById('dislikeCount').textContent = dislikes;

  const likeBtn    = document.getElementById('likeBtn');
  const dislikeBtn = document.getElementById('dislikeBtn');

  likeBtn.classList.remove('active-like', 'active-dislike');
  dislikeBtn.classList.remove('active-like', 'active-dislike');

  if (voted === 'like') {
    likeBtn.classList.add('active-like');
    document.getElementById('voteNotice').textContent = 'You liked this.';
  } else if (voted === 'dislike') {
    dislikeBtn.classList.add('active-dislike');
    document.getElementById('voteNotice').textContent = 'You disliked this.';
  } else {
    document.getElementById('voteNotice').textContent = '';
  }

  renderComments();
}

// ── Init ────────────────────────────────────────────────────────────────────

updateUI();
