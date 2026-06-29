const PROFILE_DATA_PATH = '../assets/data/primetime-players.json';
const GAMECHANGER_STATS_PATH = '../assets/data/gamechanger-stats.json';

const CURRENT_FIELDS = ['AVG', 'OBP', 'SLG', 'OPS', 'H', 'RBI', 'SB', 'SB%'];
const ALL_TIME_FIELDS = ['GP', 'PA', 'AB', 'AVG', 'OBP', 'SLG', 'OPS', 'H', '1B', '2B', '3B', 'HR', 'RBI', 'R', 'BB', 'SO', 'HBP', 'SB', 'SB%', 'CS'];
const CLIP_TAGS = ['GAME CLIP', 'HITS', 'DEFENSE', 'TOP PLAY', 'GAME CLIP', 'HOME RUN', 'TOP PLAY', 'GAME CLIP'];

function profileEl(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function normalizeName(value = '') {
  return String(value).toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

function placeholderStats(fields) {
  return Object.fromEntries(fields.map(field => [field, '—']));
}

function statsForPlayer(player, statsData) {
  const statsRows = Array.isArray(statsData?.playerStats) ? statsData.playerStats : [];
  const match = statsRows.find(row => normalizeName(row.player) === normalizeName(player.name));
  if (!match) return null;
  const allStats = match.allStats || {};
  return {
    currentStats: Object.fromEntries(CURRENT_FIELDS.map(field => [field, allStats[field] || '—'])),
    allTimeStats: Object.fromEntries(ALL_TIME_FIELDS.map(field => [field, allStats[field] || '—'])),
    categories: match.categories || {},
    syncedAt: statsData.updatedAt || null
  };
}

function buildHero(player) {
  const hero = profileEl('section', 'profile-hero');
  const number = String(player.number || '').trim() || 'TBD';
  hero.innerHTML = `
    <div class="profile-kicker">Bombers Fastpitch · CTX Meza · 2026</div>
    <h1><span>#${number}</span> ${player.name}</h1>
    <div class="profile-role">Rostered Athlete</div>
    <div class="profile-hero-rule"></div>
    <p>${player.name}'s player profile, current GameChanger snapshot, character profile, all-time stats, and highlight clip wall are shown below.</p>`;
  return hero;
}

function buildPhotoCard(player) {
  const card = profileEl('article', 'profile-photo-card');
  const number = String(player.number || '').trim() || 'TBD';
  card.innerHTML = `
    <span class="profile-photo-watermark">${number}</span>
    <i class="ti ti-user-circle"></i>
    <div class="profile-photo-label">
      <strong>Player Image Coming Soon</strong>
      <span class="profile-number-badge">#${number}</span>
    </div>`;
  return card;
}

function buildSnapshotPanel(player, gcStats) {
  const stats = gcStats?.currentStats || player.currentStats || placeholderStats(CURRENT_FIELDS);
  const panel = profileEl('article', 'profile-panel');
  const label = profileEl('div', 'profile-section-label', `${player.name.split(' ')[0]} · Player Profile`);
  const h2 = profileEl('h2', '', 'GameChanger Snapshot');
  const p = profileEl('p', '', gcStats
    ? `Synced from GameChanger${gcStats.syncedAt ? ` · ${new Date(gcStats.syncedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}` : ''}.`
    : 'Current in-season GameChanger snapshot fields are ready for verified stats once available.');
  const grid = profileEl('div', 'stat-grid');

  CURRENT_FIELDS.forEach(field => {
    const tile = profileEl('div', 'stat-tile');
    tile.innerHTML = `<strong>${stats[field] || '—'}</strong><span>${field}</span>`;
    grid.appendChild(tile);
  });

  panel.append(label, h2, p, grid);
  return panel;
}

function buildCharacter(player) {
  const block = profileEl('section', 'profile-block character-block');
  const inner = profileEl('div', 'profile-block-inner');
  inner.innerHTML = `
    <div class="profile-section-label">Coach Notes</div>
    <h2>Character Profile</h2>
    <div class="character-grid">
      <div class="coach-quote">
        “Coach notes and character profile details for ${player.name} will be added here.”
        <span>Bombers coach profile</span>
      </div>
      <ul class="character-list">
        <li>Coachability notes and player strengths can be added here.</li>
        <li>Team-first habits, effort, and practice notes can be tracked here.</li>
        <li>Development focus and leadership moments can be captured here.</li>
      </ul>
    </div>`;
  block.appendChild(inner);
  return block;
}

function buildAllTimeStats(player, gcStats) {
  const stats = gcStats?.allTimeStats || player.allTimeStats || placeholderStats(ALL_TIME_FIELDS);
  const block = profileEl('section', 'profile-block');
  const inner = profileEl('div', 'profile-block-inner');
  const table = profileEl('table', 'stats-table');
  const thead = document.createElement('thead');
  const tbody = document.createElement('tbody');

  thead.innerHTML = `<tr>${ALL_TIME_FIELDS.map(field => `<th>${field}</th>`).join('')}</tr>`;
  tbody.innerHTML = `<tr>${ALL_TIME_FIELDS.map(field => `<td>${stats[field] || '—'}</td>`).join('')}</tr>`;
  table.append(thead, tbody);

  const wrap = profileEl('div', 'stats-table-wrap');
  wrap.appendChild(table);
  inner.innerHTML = `<div class="profile-section-label">Performance</div><h2>All-Time Stats</h2>`;
  inner.appendChild(wrap);
  block.appendChild(inner);
  return block;
}

function buildFilmRoom(player) {
  const block = profileEl('section', 'profile-block film-block');
  const inner = profileEl('div', 'profile-block-inner');
  inner.innerHTML = `
    <div class="film-head">
      <div>
        <div class="profile-section-label">Film Room</div>
        <h2>At The Plate</h2>
        <p>Highlight reel wall for game clips, swings, defensive plays, and player development moments.</p>
      </div>
      <a class="full-folder-link" href="#"><i class="ti ti-folder"></i> Full Folder</a>
    </div>
    <div class="film-filters">
      <button type="button">All</button>
      <button type="button">Home Runs</button>
      <button type="button">Hits</button>
      <button type="button">Doubles</button>
      <button type="button">Defense</button>
    </div>`;

  const clips = profileEl('div', 'clip-grid');
  CLIP_TAGS.forEach((tag, index) => {
    const clip = profileEl('article', 'clip-card');
    clip.innerHTML = `
      <div class="play-dot"><i class="ti ti-player-play-filled"></i></div>
      <div>
        <span class="clip-tag">${tag}</span>
        <h3>Game Clip ${String(index + 1).padStart(2, '0')}</h3>
        <p>${player.name} · Bombers Fastpitch</p>
      </div>`;
    clips.appendChild(clip);
  });

  inner.appendChild(clips);
  block.appendChild(inner);
  return block;
}

function buildFooter() {
  const footer = profileEl('footer', 'profile-footer');
  footer.innerHTML = `
    <h2>Bombers Fastpitch</h2>
    <div class="profile-hero-rule"></div>
    <p>Central Texas · Select Fastpitch Softball · 2026</p>`;
  return footer;
}

async function loadStatsData() {
  try {
    const response = await fetch(`${GAMECHANGER_STATS_PATH}?v=${Date.now()}`, { cache: 'no-store' });
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

async function renderPlayerProfile() {
  const root = document.getElementById('player-profile-root');
  if (!root) return;

  const slug = document.body.dataset.playerSlug;
  const [playersResponse, statsData] = await Promise.all([
    fetch(`${PROFILE_DATA_PATH}?v=${Date.now()}`, { cache: 'no-store' }),
    loadStatsData()
  ]);
  const players = await playersResponse.json();
  const player = players.find(item => item.slug === slug) || players[0];
  const gcStats = statsForPlayer(player, statsData);
  const number = String(player.number || '').trim() || 'TBD';

  document.title = `#${number} ${player.name} · Bombers Fastpitch`;

  const shell = profileEl('div', 'player-profile-shell');
  shell.appendChild(buildHero(player));

  const main = profileEl('main', 'profile-main');
  const top = profileEl('div', 'profile-top-grid');
  top.append(buildPhotoCard(player), buildSnapshotPanel(player, gcStats));
  main.append(top, buildCharacter(player), buildAllTimeStats(player, gcStats), buildFilmRoom(player));

  const back = profileEl('a', 'back-roster', '← Back to Roster');
  back.href = '../roster/';
  main.appendChild(back);

  shell.append(main, buildFooter());
  root.appendChild(shell);
  window.dispatchEvent(new CustomEvent('bombers-player-profile-rendered', { detail: { slug: player.slug } }));
}

document.addEventListener('DOMContentLoaded', renderPlayerProfile);
