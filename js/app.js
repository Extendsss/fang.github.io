// Markdown 驱动文章列表
const posts = [
    { id: 1, title: '凌晨唱给月亮的歌', date: '2025-10-01', tags: ['诗','爱情'], file: 'posts/2025-10-01-凌晨唱给月亮的歌.md' },
    { id: 2, title: '把注释写成情书', date: '2025-09-20', tags: ['代码','生活'], file: 'posts/2025-11-01-把注释写成情书.md' },
    { id: 3, title: '静态站点的小确幸', date: '2025-08-03', tags: ['指南','工具'], file: 'posts/2025-08-03-静态站点的小确幸.md' },
    { id: 4, title: '音乐与算法的相遇', date: '2025-05-11', tags: ['音乐','算法'], file: 'posts/2025-05-11-音乐与算法的相遇.md' }
];

const postsEl = document.getElementById('posts');
const latestEl = document.getElementById('latest');
const filtersEl = document.getElementById('filters');
const qEl = document.getElementById('q');
document.getElementById('year').textContent = new Date().getFullYear();

// 渲染文章卡片
function renderPosts(list) {
    postsEl.innerHTML = '';
    if (list.length === 0) {
        postsEl.innerHTML = '<div class="panel" style="grid-column:1/-1;text-align:center;color:var(--muted);padding:24px;border-radius:12px">没有匹配的文章</div>';
        return;
    }
    list.forEach(p => {
        const card = document.createElement('article');
        card.className = 'card';
        card.innerHTML = `
      <div>
        <h3>${p.title}</h3>
        <div class="meta">${p.date} · ${p.tags.join(', ')}</div>
      </div>
      <div style="margin-top:10px;display:flex;justify-content:space-between;align-items:center">
        <button class="btn" onclick="openPost('${p.file}', '${p.title}', '${p.date}', '${p.tags.join(', ')}')">阅读全文</button>
      </div>`;
        postsEl.appendChild(card);
    });
}

// 打开 Markdown 文章
function openPost(file, title, date, tags) {
    fetch(file)
        .then(res => res.text())
        .then(md => {
            const html = marked.parse(md); // marked.js 渲染 Markdown
            const modal = document.createElement('div');
            modal.id = 'modal-root';
            modal.innerHTML = `
        <div style="position:fixed;inset:0;background:rgba(2,6,23,0.7);display:flex;align-items:center;justify-content:center;padding:20px;z-index:9999">
          <div style="max-width:820px;width:100%;background:#071425;padding:20px;border-radius:12px;border:1px solid rgba(255,255,255,0.03);color:inherit">
            <h2>${title}</h2>
            <div class="meta">${date} · ${tags}</div>
            <hr style="border:none;border-top:1px solid rgba(255,255,255,0.03);margin:12px 0">
            <div>${html}</div>
            <div style="text-align:right;margin-top:12px">
              <button class="btn" onclick="document.getElementById('modal-root').remove();">关 闭</button>
            </div>
          </div>
        </div>`;
            document.body.appendChild(modal);
        })
        .catch(err => console.error('加载文章失败：', err));
}

// 标签、最新文章、搜索功能保持不变
function uniqueTags(data) {
    const s = new Set();
    data.forEach(p => p.tags.forEach(t => s.add(t)));
    return [...s];
}

function renderFilters() {
    const tags = uniqueTags(posts);
    filtersEl.innerHTML = '';
    tags.forEach(t => {
        const b = document.createElement('button');
        b.className = 'tag';
        b.textContent = t;
        b.onclick = () => { qEl.value = t; filter(); }
        filtersEl.appendChild(b);
    });
}

function renderLatest() {
    latestEl.innerHTML = posts.slice(0, 3).map(p => `<div style="margin:8px 0"><strong>${p.title}</strong><div class="meta">${p.date}</div></div>`).join('');
}

function filter() {
    const q = qEl.value.trim().toLowerCase();
    renderPosts(posts.filter(p => p.title.toLowerCase().includes(q) || p.tags.join(' ').toLowerCase().includes(q)));
}

document.getElementById('clear').onclick = () => { qEl.value=''; filter(); }
document.getElementById('writeBtn').onclick = () => { alert('大小姐提示：写下你的第一篇小日记吧，鸽鸽~'); }
qEl.addEventListener('keydown', e => { if(e.key==='Enter') filter(); });

// 初始渲染
renderFilters();
renderLatest();
renderPosts(posts);
