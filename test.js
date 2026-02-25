            let RAW = [];

            const ORG_COLORS = {
                anthropic: '#C0531A',
                openai: '#0D7A5F',
                google: '#1A6BBF',
                qwen: '#0077A8',
                deepseek: '#3A4FB5',
                moonshotai: '#0A8A72',
                'x-ai': '#555555',
                mistralai: '#B83020',
                baidu: '#1A2AB5',
                xiaomi: '#CC4400',
                minimax: '#6B3AAA',
                'z-ai': '#007A9A',
                'bytedance-seed': '#A01535',
                'prime-intellect': '#5A3A99',
            };

            const ORG_DOMAINS = {
                anthropic: 'anthropic.com',
                openai: 'openai.com',
                google: 'google.com',
                qwen: 'qwen.ai',
                deepseek: 'deepseek.com',
                moonshotai: 'moonshot.cn',
                'x-ai': 'x.ai',
                mistralai: 'mistral.ai',
                baidu: 'baidu.com',
                xiaomi: 'xiaomi.com',
                minimax: 'minimaxi.com',
                'z-ai': 'zhipuai.cn',
                'bytedance-seed': 'bytedance.com',
                'prime-intellect': 'primeintellect.ai',
            };

            let currentView = 'all';
            let currentSort = 'green';

            function formatModelName(id) {
                const overrides = {
                    'qwen3.5-397b-a17b': 'Qwen3.5 397b A17b',
                    'kimi-k2.5': 'Kimi K2.5',
                    'gpt-5.2': 'GPT-5.2',
                    'minimax-m2.5': 'Minimax M2.5',
                    'deepseek-v3.2': 'Deepseek V3.2',
                    'ernie-4.5-300b-a47b': 'Ernie 4.5 300b A47b',
                    'intellect-3': 'Intellect 3',
                    'o4-mini': 'o4 Mini',
                    'gpt-oss-120b': 'GPT OSS 120b',
                    'mimo-v2-flash': 'Mimo v2 Flash',
                    'glm-5': 'Glm 5',
                    'grok-4.1-fast': 'Grok 4.1 Fast',
                    'seed-1.6': 'Seed 1.6',
                    'gemma-3-27b-it': 'Gemma 3 27b IT',
                    'mistral-large-2512': 'Mistral Large 2512'
                };
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

            function setView(v) {
                currentView = v;
                document.querySelectorAll('.btn-group:first-of-type .btn').forEach((b, i) => {
                    b.classList.toggle('active', ['all', 'org', 'reasoning'][i] === v);
                });
                render();
            }

            function setSort(s) {
                currentSort = s;
                render();
            }

            function sortData(data) {
                return [...data].sort((a, b) => {
                    if (currentSort === 'green') return b.g - a.g;
                    if (currentSort === 'red') return b.r - a.r;
                    return a.name.localeCompare(b.name);
                });
            }

            function logoImg(org, size = 16) {
                const domain = ORG_DOMAINS[org];
                if (!domain) return '';
                return `<img src="https://logo.clearbit.com/${domain}" width="${size}" height="${size}" style="border-radius:3px;object-fit:contain;flex-shrink:0;opacity:0.85" onerror="this.style.display='none'">`;
            }

            function barHtml(d, rank) {
                const orgColor = ORG_COLORS[d.org] || '#888';
                const orgBg = orgColor + '12';
                const orgLabel = d.org === 'prime-intellect' ? 'prime-i' : d.org === 'bytedance-seed' ? 'bytedance' : d.org;
                const displayName = d.name.replace(/\s*\((High|Low)\)\s*$/i, '');
                return `
    <div class="chart-row" style="border-left-color:${orgColor};background:${orgColor}08">
      <div class="rank-num">${rank}</div>
      <div class="tag-cols">
        <div style="width:98px;display:flex;align-items:center">
          <span class="org-tag" style="color:${orgColor};border-color:${orgColor}33;background:${orgBg}">
            ${logoImg(d.org, 10)}${orgLabel}
          </span>
        </div>
        <div style="width:44px;display:flex;align-items:center">
          <span class="reasoning-tag reasoning-tag-${d.reasoning}">${d.reasoning}</span>
        </div>
      </div>
      <div class="row-label">
        <div class="row-name" title="${d.name}">${displayName}</div>
      </div>
      <div class="bar-container">
        <div class="bar-segment bar-green" style="width:${d.g}%"></div>
        <div class="bar-segment bar-amber" style="width:${d.a}%"></div>
        <div class="bar-segment bar-poo" style="width:${d.r}%"></div>
      </div>
      <div class="bar-values">
        <span class="val-green">${d.g.toFixed(0)}%</span>
        <span class="val-amber">${d.a.toFixed(0)}%</span>
        <span class="val-poo">${d.r.toFixed(0)}%</span>
      </div>
    </div>`;
            }

            function groupBy(key) {
                const groups = {};
                RAW.forEach(d => {
                    const k = d[key];
                    if (!groups[k]) groups[k] = [];
                    groups[k].push(d);
                });
                return groups;
            }

            function avg(arr, key) {
                return arr.reduce((s, d) => s + d[key], 0) / arr.length;
            }

            function render() {
                const viz = document.getElementById('viz');

                if (currentView === 'all') {
                    const sorted = sortData(RAW);
                    viz.innerHTML = `
      ${sectionTitle(`All ${sorted.length} models — sorted by ${currentSort} %`)}
      ${sorted.map((d, i) => barHtml(d, i + 1)).join('')}
    `;
                }

                else if (currentView === 'org') {
                    const groups = groupBy('org');
                    const orgStats = Object.entries(groups).map(([org, models]) => ({
                        org, models,
                        g: avg(models, 'g'), a: avg(models, 'a'), r: avg(models, 'r'),
                        n: models.length
                    })).sort((a, b) => b.g - a.g);

                    const cards = orgStats.map(o => `
      <div class="org-card" style="border-top-color:${ORG_COLORS[o.org] || '#888'}">
        <div class="org-card-name" style="color:${ORG_COLORS[o.org] || '#888'}">
          ${logoImg(o.org, 12)}${o.org}
        </div>
        <div class="org-card-score">${o.g.toFixed(0)}%</div>
        <div class="org-card-label">avg green · ${o.n} model${o.n > 1 ? 's' : ''}</div>
        <div class="org-card-bar">
          <div style="width:${o.g}%;background:var(--green);height:100%"></div>
          <div style="width:${o.a}%;background:var(--amber);height:100%"></div>
          <div style="width:${o.r}%;background:var(--poo);height:100%"></div>
        </div>
      </div>`).join('');

                    const details = orgStats.map(o => {
                        const sorted = sortData(o.models);
                        return `
        <div class="group-header">
          <div class="group-header-name" style="color:${ORG_COLORS[o.org] || '#888'};display:flex;align-items:center;gap:6px">
            ${logoImg(o.org, 14)}${o.org}
          </div>
          <div class="group-header-line"></div>
          <div class="group-header-stat">${o.g.toFixed(0)}% avg green</div>
        </div>
        ${sorted.map((d, i) => barHtml(d, i + 1)).join('')}`;
                    }).join('');

                    viz.innerHTML = `
      ${sectionTitle('Average green % by organisation')}
      <div class="org-cards">${cards}</div>
      <div class="divider"></div>
      <div class="chart-section-title">Models grouped by org</div>
      ${details}
    `;
                }

                else if (currentView === 'reasoning') {
                    const order = ['None', 'Low', 'High'];
                    const groups = groupBy('reasoning');

                    const details = order.filter(k => groups[k]).map(tier => {
                        const models = groups[tier];
                        const g = avg(models, 'g'), a = avg(models, 'a'), r = avg(models, 'r');
                        const sorted = sortData(models);
                        return `
        <div class="group-header">
          <div class="group-header-name">
            <span class="reasoning-badge reasoning-${tier}" style="font-size:12px;padding:2px 8px">${tier} reasoning</span>
          </div>
          <div class="group-header-line"></div>
          <div class="group-header-stat">${g.toFixed(0)}% avg green · ${models.length} models</div>
        </div>
        ${sorted.map((d, i) => barHtml(d, i + 1)).join('')}`;
                    }).join('');

                    // Summary comparison
                    const summaryBars = order.filter(k => groups[k]).map(tier => {
                        const g = avg(groups[tier], 'g');
                        const a = avg(groups[tier], 'a');
                        const r = avg(groups[tier], 'r');
                        return `
        <div class="chart-row">
          <div class="rank-num"></div>
          <div class="row-label">
            <div class="row-name"><span class="reasoning-badge reasoning-${tier}">${tier}</span></div>
            <div class="row-meta">${groups[tier].length} models</div>
          </div>
          <div class="bar-container">
            <div class="bar-segment bar-green" style="width:${g}%"></div>
            <div class="bar-segment bar-amber" style="width:${a}%"></div>
            <div class="bar-segment bar-poo" style="width:${r}%"></div>
          </div>
          <div class="bar-values">
            <span class="val-green">${g.toFixed(0)}%</span>
            <span class="val-amber">${a.toFixed(0)}%</span>
            <span class="val-poo">${r.toFixed(0)}%</span>
          </div>
        </div>`;
                    }).join('');

                    viz.innerHTML = `
      ${sectionTitle('Does reasoning help with BS detection? (avg)')}
      ${summaryBars}
      <div class="divider"></div>
      <div class="chart-section-title">Models by reasoning tier</div>
      ${details}
    `;
                }
            }

            async function init() {
                try {
                    const res = await fetch('../../data/latest/aggregate_summary.json');
                    if (!res.ok) throw new Error(`Failed to fetch data: ${res.status}`);
                    const data = await res.json();

                    RAW = data.leaderboard.map(item => {
                        // Parse "org/model@reasoning=level"
                        let reasoning = "None";
                        let orgModel = item.model;

                        if (orgModel.includes('@reasoning=')) {
                            const parts = orgModel.split('@reasoning=');
                            orgModel = parts[0];
                            const val = parts[1];
                            if (val) reasoning = val.charAt(0).toUpperCase() + val.slice(1);
                        }

                        const parts = orgModel.split('/');
                        const org = parts[0];
                        const rawModel = parts[1] || '';

                        let formattedName = formatModelName(rawModel);
                        if (reasoning !== "None") {
                            formattedName += ` (${reasoning})`;
                        }

                        const total = item.scored_count || 1;
                        const g = (item.score_2 / total) * 100;
                        const a = (item.score_1 / total) * 100;
                        const r = (item.score_0 / total) * 100;

                        return {
                            name: formattedName,
                            org,
                            reasoning,
                            g,
                            a,
                            r
                        };
                    });

                    render();
                } catch (err) {
                    document.getElementById('viz').innerHTML = `<div style="color:red;padding:20px;">Error loading data: ${err.message}</div>`;
                }
            }

            init();
