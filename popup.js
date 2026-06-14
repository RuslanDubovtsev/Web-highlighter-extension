// Web Highlighter — Popup Script

document.addEventListener('DOMContentLoaded', () => {
  const listEl = document.getElementById('highlight-list');
  const countEl = document.getElementById('count');

  function renderHighlights() {
    chrome.storage.local.get({ highlights: [] }, (result) => {
      const highlights = result.highlights;
      countEl.textContent = highlights.length;

      if (highlights.length === 0) {
        listEl.innerHTML = `
          <div class="empty-state">
            <div class="icon">✏️</div>
            <p>Пока выделений нет.<br>Выделите текст на любой странице и нажмите <strong>Сохранить</strong>.</p>
          </div>
        `;
        return;
      }

      let html = '';
      for (let i = 0; i < highlights.length; i++) {
        const item = highlights[i];
        const date = new Date(item.timestamp);
        const dateStr = date.toLocaleDateString(undefined, {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });

        html += `
          <div class="highlight-item" data-index="${i}">
            <button class="delete-btn" data-index="${i}" title="Удалить">✕</button>
            <div class="highlight-text">${escapeHtml(item.text)}</div>
            <div class="highlight-meta">
              <span class="highlight-source" title="${escapeHtml(item.url)}">${escapeHtml(item.title || item.url)}</span>
              <span class="highlight-date">${dateStr}</span>
            </div>
          </div>
        `;
      }
      listEl.innerHTML = html;

      // Attach event listeners
      listEl.querySelectorAll('.highlight-item').forEach((el) => {
        const index = parseInt(el.dataset.index, 10);

        // Click on item (but not on delete button) → open source page
        el.addEventListener('click', (e) => {
          if (e.target.classList.contains('delete-btn')) return;
          const item = highlights[index];
          if (item && item.url) {
            chrome.tabs.create({ url: item.url });
          }
        });

        // Delete button
        const deleteBtn = el.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          highlights.splice(index, 1);
          chrome.storage.local.set({ highlights }, () => {
            renderHighlights();
          });
        });
      });
    });
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  renderHighlights();
});
