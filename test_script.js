  const RAW = [];

  const ORG_COLORS = { anthropic: '#C0531A' };
  const ORG_DOMAINS = { anthropic: 'anthropic.com' };

  let currentView = 'all';
  let currentSort = 'green';

  function formatModelName(id) {
    const overrides = { 'gpt-5.2': 'GPT-5.2' };
    if (overrides[id]) return overrides[id];
    return id.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  }

  function LEGEND_HTML() {
    const sorts = [
      { key: 'green', color: 'var(--green)', dot: '●', label: 'Called out nonsense' },
      { key: 'amber', color: 'var(--amber)', dot: '●', label: 'Partial pushback' },
      { key: 'red', color: 'var(--poo)', dot: '💩', label: 'Took the bait' },
    ];
    return `<div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">` +
      sorts.map(s => {
        const active = s.key === currentSort;
        return `<button onclick="setSort('${s.key}')" style="
          display:inline-flex;align-items:center;gap:5px;
          background:${active ? 'rgba(44,26,10,0.06)' : 'none'};
          border:${active ? '1px solid rgba(44,26,10,0.12)' : '1px solid transparent'};
          border-radius:4px;
          cursor:pointer;padding:2px 6px 2px 5px;
          font-family:'JetBrains Mono',monospace;font-size:10px;
          color:${active ? 'var(--text)' : 'var(--text-mid)'};
          font-weight:${active ? '600' : '400'};
          transition:all 0.15s;letter-spacing:0.3px;
        ">
          <span style="color:${s.color};font-size:${s.dot === '💩' ? '10px' : '8px'}">${s.dot}</span>
          ${s.label}
          ${active ? '<span style="color:var(--text-dim);font-size:9px;margin-left:1px">↓</span>' : ''}
        </button>`;
      }).join('') +
      `</div>`;
  }

  function sectionTitle(text) {
    return `<div style="position:relative;margin-bottom:10px;display:flex;align-items:center">
      <div class="chart-section-title">${text}</div>
      <div style="position:absolute;left:373px;display:flex;align-items:center">${LEGEND_HTML()}</div>
    </div>`;
  }

