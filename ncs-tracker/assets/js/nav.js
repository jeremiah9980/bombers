const NAV_HTML = `
<nav>
  <div class="nav-inner">
    <a class="nav-brand" href="index.html">
      <span style="display:inline-grid;place-items:center;width:28px;height:28px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#fff 0%,#dbe8ff 35%,#075DFF 72%,#02040A 100%);color:#fff;border:2px solid #075DFF;font-family:Georgia,'Times New Roman',serif;font-size:17px;font-weight:900;line-height:1;text-shadow:0 0 10px rgba(7,93,255,.85);box-shadow:0 0 18px rgba(7,93,255,.45);">B</span>
      Bombers <span>FASTPITCH</span>
    </a>
    <div class="nav-links">
      <a href="index.html">Home</a>
      <a href="about.html">About</a>
      <a href="board.html">Board</a>
      <a href="coaching.html">Coaching</a>
      <a href="roster.html">Roster</a>
      <a href="bylaws.html">Bylaws</a>
      <a href="finances.html">Finances</a>
      <a href="policies.html">Policies</a>
      <a href="docs.html">Documents</a>
      <a href="fundraising.html">Support Us</a>
      <a href="contact.html">Contact</a>
    </div>
  </div>
</nav>`;

document.addEventListener('DOMContentLoaded', () => {
  document.body.insertAdjacentHTML('afterbegin', NAV_HTML);
  const path = window.location.pathname;
  document.querySelectorAll('.nav-links a').forEach(a => {
    if (path.endsWith(a.getAttribute('href').split('/').pop())) a.classList.add('active');
  });
});