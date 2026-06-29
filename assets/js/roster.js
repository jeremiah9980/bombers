const ROSTER_DATA_PATH = '../assets/data/primetime-players.json';
const PLAYER_ASSET_ROOT = '../assets/players/';

function rosterEl(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function imagePathFor(player) {
  return `${PLAYER_ASSET_ROOT}${player.image}`;
}

function displayNumber(player) {
  const number = String(player.number || '').trim();
  return number || 'TBD';
}

function profilePathFor(player) {
  if (player.profilePath) return player.profilePath;
  if (!player.hasProfile) return '';
  return player.slug === 'romina-alexandra-trevino'
    ? '../players/romina-trevino.html'
    : `../players/${player.slug}.html`;
}

function buildPlayerCard(player) {
  const card = rosterEl('article', `player-card${player.guest ? ' player-card-guest' : ''}`);
  const number = displayNumber(player);
  const jerseyBadge = number === 'TBD' ? 'TBD' : `#${number}`;
  const profilePath = profilePathFor(player);
  const noteHTML = player.note
    ? `<p class="player-note"><i class="ti ti-star-filled"></i> ${player.note}</p>`
    : '';
  const profileHTML = profilePath
    ? `<a href="${profilePath}" class="player-profile-link"><i class="ti ti-id"></i> View Player Profile</a>`
    : `<span class="player-profile-link player-profile-link-disabled"><i class="ti ti-id"></i> Profile Coming Soon</span>`;

  card.innerHTML = `
    <div class="player-photo">
      <span class="player-watermark">${number}</span>
      <img src="${imagePathFor(player)}" alt="${player.name}" class="player-photo-img" loading="lazy">
      <i class="ti ti-user-circle"></i>
      <span class="player-photo-coming">Player Image Coming Soon</span>
      <div class="jersey-badge">${jerseyBadge}</div>
    </div>
    <div class="player-body">
      <h3 class="player-name">${player.name}</h3>
      ${player.guest ? '<div class="player-status"><span class="status-dot"></span> Guest Player</div>' : ''}
      <div class="player-divider"></div>
      ${noteHTML}
      ${profileHTML}
    </div>`;

  const img = card.querySelector('img.player-photo-img');
  img.addEventListener('load', () => img.closest('.player-photo').classList.add('has-player-image'));
  img.addEventListener('error', () => img.remove());
  return card;
}

async function loadRoster() {
  const root = document.querySelector('[data-roster-grid]');
  if (!root) return;
  const response = await fetch(`${ROSTER_DATA_PATH}?v=${Date.now()}`, { cache: 'no-store' });
  const players = await response.json();
  root.replaceChildren(...players.map(buildPlayerCard));
  window.dispatchEvent(new CustomEvent('bombers-roster-rendered', { detail: { count: players.length } }));
}

document.addEventListener('DOMContentLoaded', loadRoster);
