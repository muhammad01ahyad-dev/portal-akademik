/*
  public-list.js
  Mengambil data/<category>.json langsung dari repo (raw.githubusercontent.com,
  tanpa perlu token — repo publik) dan merender daftar entri + tombol
  lihat/unduh yang mengarah ke file di /uploads/.
*/

async function loadCategory(category, containerId, opts = {}){
  const container = document.getElementById(containerId);
  container.innerHTML = `<div class="loading">Memuat data…</div>`;

  const rawBase = `https://raw.githubusercontent.com/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/${GITHUB_CONFIG.branch}`;

  try{
    const res = await fetch(`${rawBase}/data/${category}.json?t=${Date.now()}`);
    if(!res.ok) throw new Error("not found");
    let items = await res.json();

    if(!Array.isArray(items) || items.length === 0){
      container.innerHTML = `<div class="empty-state">Belum ada konten di bagian ini.</div>`;
      return;
    }

    items = items.slice().sort((a,b) => new Date(b.date||0) - new Date(a.date||0));

    container.innerHTML = items.map(item => {
      const fileUrl = item.file ? `${rawBase}/${item.file}` : null;
      const tags = (item.tags||[]).map(t => `<span>${escapeHTML(t)}</span>`).join("");
      return `
        <article class="entry">
          <div class="entry-top">
            <h3>${escapeHTML(item.title||"Tanpa judul")}</h3>
            <span class="date">${fmtDate(item.date)}</span>
          </div>
          ${item.description ? `<p class="desc">${escapeHTML(item.description)}</p>` : ""}
          ${tags ? `<div class="entry-tags">${tags}</div>` : ""}
          ${fileUrl ? `
            <div class="entry-actions">
              <a class="btn" href="${fileUrl}" target="_blank" rel="noopener">Lihat</a>
              <a class="btn btn-primary" href="${fileUrl}" download>Unduh</a>
            </div>` : ""}
        </article>`;
    }).join("");
  }catch(err){
    container.innerHTML = `<div class="empty-state">Belum ada konten, atau data/${category}.json belum dibuat.<br>${GITHUB_CONFIG.owner==='USERNAME_GITHUB_ANDA' ? 'Ingat: isi assets/js/config.js dengan username & repo Anda.' : ''}</div>`;
  }
}
