/*
  github-api.js
  Wrapper tipis di atas GitHub REST API (Contents API) untuk operasi
  create / update / delete file di repo, dipakai oleh admin.html.
  Token PAT disimpan di sessionStorage (hilang saat tab ditutup) —
  by design, supaya token tidak tertinggal di perangkat bersama.
*/

const GH = {
  API: "https://api.github.com",

  getToken(){ return sessionStorage.getItem("gh_pat") || ""; },
  setToken(t){ sessionStorage.setItem("gh_pat", t); },
  clearToken(){ sessionStorage.removeItem("gh_pat"); },
  isLoggedIn(){ return !!this.getToken(); },

  async _headers(){
    return {
      "Authorization": `Bearer ${this.getToken()}`,
      "Accept": "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28"
    };
  },

  // Verifikasi token dengan memanggil /user
  async verifyToken(){
    const res = await fetch(`${this.API}/user`, { headers: await this._headers() });
    if(!res.ok) throw new Error("Token tidak valid atau tidak punya akses.");
    return res.json();
  },

  // Ambil isi file (return null jika belum ada / 404)
  async getFile(path){
    const url = `${this.API}/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${path}?ref=${GITHUB_CONFIG.branch}`;
    const res = await fetch(url, { headers: await this._headers() });
    if(res.status === 404) return null;
    if(!res.ok) throw new Error(`Gagal mengambil ${path} (${res.status})`);
    const data = await res.json();
    return { sha: data.sha, content: decodeURIComponent(escape(atob(data.content.replace(/\n/g,'')))) };
  },

  // Buat / update file berisi teks (mis. JSON manifest)
  async putTextFile(path, textContent, message, sha){
    const body = {
      message,
      content: btoa(unescape(encodeURIComponent(textContent))),
      branch: GITHUB_CONFIG.branch
    };
    if(sha) body.sha = sha;
    const res = await fetch(`${this.API}/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${path}`, {
      method: "PUT",
      headers: { ...(await this._headers()), "Content-Type":"application/json" },
      body: JSON.stringify(body)
    });
    if(!res.ok){ const e = await res.json().catch(()=>({})); throw new Error(e.message || `Gagal menulis ${path}`); }
    return res.json();
  },

  // Upload file biner (PDF, dsb) — base64DataUrl adalah hasil FileReader.readAsDataURL
  async putBinaryFile(path, base64DataUrl, message){
    const base64 = base64DataUrl.split(",")[1];
    const body = { message, content: base64, branch: GITHUB_CONFIG.branch };
    const res = await fetch(`${this.API}/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${path}`, {
      method: "PUT",
      headers: { ...(await this._headers()), "Content-Type":"application/json" },
      body: JSON.stringify(body)
    });
    if(!res.ok){ const e = await res.json().catch(()=>({})); throw new Error(e.message || `Gagal upload ${path}`); }
    return res.json();
  },

  async deleteFile(path, sha, message){
    const res = await fetch(`${this.API}/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${path}`, {
      method: "DELETE",
      headers: { ...(await this._headers()), "Content-Type":"application/json" },
      body: JSON.stringify({ message, sha, branch: GITHUB_CONFIG.branch })
    });
    if(!res.ok){ const e = await res.json().catch(()=>({})); throw new Error(e.message || `Gagal hapus ${path}`); }
    return res.json();
  },

  // Ambil manifest JSON kategori (array). Return {items, sha}
  async getManifest(category){
    const f = await this.getFile(`data/${category}.json`);
    if(!f) return { items: [], sha: null };
    try{ return { items: JSON.parse(f.content), sha: f.sha }; }
    catch(e){ return { items: [], sha: f.sha }; }
  },

  async saveManifest(category, items, sha, message){
    return this.putTextFile(`data/${category}.json`, JSON.stringify(items, null, 2), message, sha);
  }
};
