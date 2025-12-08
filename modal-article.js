// modalArticle.js: Modal dialog expands out from trigger element & initializes carousels

function showModalArticle(filename, triggerEl = null) {
  // Overlay
  const overlay = document.createElement('div');
  overlay.className = 'modal-article-overlay';

  // Dialog
  const dialog = document.createElement('div');
  dialog.className = 'modal-article-dialog';

  // Close X button
  const closeX = document.createElement('button');
  closeX.className = 'modal-article-close-x';
  closeX.innerHTML = '&times;';
  closeX.setAttribute('aria-label', 'Close dialog');

  // Content area
  const contentDiv = document.createElement('div');
  contentDiv.className = 'modal-article-content';
  contentDiv.innerHTML = '<div style="text-align:center">Loading...</div>';

  dialog.appendChild(closeX);
  dialog.appendChild(contentDiv);
  overlay.appendChild(dialog);
  document.body.appendChild(overlay);

  // Calculate scale/position animation origin
  let origin = '50% 50%';
  if (triggerEl) {
    const rect = triggerEl.getBoundingClientRect();
    origin = `${rect.left + rect.width / 2}px ${rect.top + rect.height / 2}px`;
  }
  dialog.style.transformOrigin = origin;

  // Animate in after next frame
  requestAnimationFrame(() => {
    dialog.classList.add('visible');
  });

  // Fetch content
  fetch(filename)
    .then(resp => resp.text())
    .then(html => {
      contentDiv.innerHTML = html + `<button class="modal-article-close-btm">Sluit</button>`;
      // Init carousels if carousel.js is loaded
      if (typeof initCarousels === 'function') {
        initCarousels(contentDiv);
      }
      // Wire Close button
      const btmClose = contentDiv.querySelector('.modal-article-close-btm');
      if (btmClose) btmClose.onclick = close;
    })
    .catch(err => {
      contentDiv.innerHTML = '<div style="color:red;text-align:center">Content could not be loaded.</div>';
    });

  // Close logic
  function close() {
    dialog.classList.remove('visible');
    setTimeout(() => overlay.remove(), 320);
  }
  closeX.onclick = close;
  overlay.onclick = e => {
    if (e.target === overlay) close();
  };
  window.addEventListener('keydown', function handler(e) {
    if (e.key === "Escape") {
      close();
      window.removeEventListener('keydown', handler);
    }
  }, { once: true });
}

// Utility to wire up triggers
function wireModalArticleTriggers(selector = '[data-article]') {
  document.querySelectorAll(selector).forEach(el => {
    el.addEventListener('click', e => {
      e.preventDefault();
      const filename = el.getAttribute('data-article');
      if (filename) showModalArticle(filename, el);
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  wireModalArticleTriggers();
});
