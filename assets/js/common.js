/* common.js — navigasi & footer dipakai di semua halaman publik */

const NAV_ITEMS = [
  { href:"index.html",          label:"Beranda" },
  { href:"research.html",       label:"Progress Penelitian" },
  { href:"daily.html",          label:"Progress Harian" },
  { href:"papers.html",         label:"Paper" },
  { href:"computation.html",    label:"Komputasi" },
  { href:"lecture-notes.html",  label:"Catatan Kuliah" },
  { href:"teaching-notes.html", label:"Catatan Mengajar" },
  { href:"books.html",          label:"Buku" }
];

function renderNav(activeHref){
  const current = activeHref || location.pathname.split("/").pop() || "index.html";
  const links = NAV_ITEMS.map(i =>
    `<a href="${i.href}" class="${i.href===current?'active':''}">${i.label}</a>`
  ).join("");

  const header = document.createElement("header");
  header.className = "site-nav";
  header.innerHTML = `
    <div class="nav-inner">
      <a href="index.html" class="brand"><span class="ket">|ψ⟩</span> ${SITE_PROFILE.name}</a>
      <button class="nav-toggle" id="navToggle" aria-label="Buka menu">menu</button>
      <nav class="nav-links" id="navLinks">
        ${links}
        <a href="admin.html" style="color:var(--text-faint)">Admin</a>
      </nav>
    </div>`;
  document.body.prepend(header);

  document.getElementById("navToggle").addEventListener("click", () => {
    document.getElementById("navLinks").classList.toggle("open");
  });
}

function renderFooter(){
  const footer = document.createElement("footer");
  footer.innerHTML = `
    <div class="wrap">
      <span>© ${new Date().getFullYear()} ${SITE_PROFILE.name} · ${SITE_PROFILE.affiliation}</span>
      <span>Dibangun di atas GitHub Pages · <a href="admin.html">Masuk sebagai admin</a></span>
    </div>`;
  document.body.append(footer);
}

// Motif latar hero: pola interferensi gelombang (ilustrasi fungsi gelombang)
function heroWaveSVG(){
  let paths = "";
  const colors = ["#8b6cff","#4fe0e8","#8b6cff"];
  for(let i=0;i<3;i++){
    const yOff = 60 + i*40;
    const amp = 26 - i*6;
    let d = `M -20 ${yOff}`;
    for(let x=0; x<=1200; x+=40){
      const y = yOff + Math.sin((x/60)+i*1.3)*amp;
      d += ` L ${x} ${y}`;
    }
    paths += `<path d="${d}" fill="none" stroke="${colors[i]}" stroke-width="1.4" opacity="${0.5-i*0.12}"/>`;
  }
  return `<svg class="hero-wave" viewBox="0 0 1200 260" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">${paths}</svg>`;
}

function fmtDate(iso){
  if(!iso) return "";
  const d = new Date(iso);
  if(isNaN(d)) return iso;
  return d.toLocaleDateString("id-ID", { day:"numeric", month:"long", year:"numeric" });
}

function escapeHTML(s){
  return String(s ?? "").replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
