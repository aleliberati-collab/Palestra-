/* Archivio locale della Palestra.
   Stessa interfaccia usata dall'app (collection → doc → set, onSnapshot),
   ma i dati restano nel telefono (localStorage). Il backup è un file JSON da salvare su Drive. */
const LocalDB = (() => {
  const KEY = "pav-db";
  const COLLS = ["logs", "plans", "settings"];
  let data = {};
  try { data = JSON.parse(localStorage.getItem(KEY) || "{}") || {}; } catch (e) { data = {}; }
  for (const c of COLLS) if (!data[c] || typeof data[c] !== "object") data[c] = {};
  const subs = {};
  const clone = (v) => JSON.parse(JSON.stringify(v));
  function persist() { localStorage.setItem(KEY, JSON.stringify(data)); } // un errore (spazio esaurito) arriva a chi salva
  function snap(c) {
    const docs = Object.entries(data[c] || {}).map(([id, d]) => ({ id, exists: true, data: () => clone(d) }));
    return { docs, size: docs.length, empty: !docs.length };
  }
  function notify(c) { (subs[c] || []).forEach((fn) => { try { fn(snap(c)); } catch (e) { console.error(e); } }); }
  function collection(c) {
    if (!data[c]) data[c] = {};
    return {
      doc(id) {
        return {
          id,
          async get() { const d = data[c][id]; return { id, exists: !!d, data: () => (d ? clone(d) : undefined) }; },
          async set(v) { data[c][id] = clone(v); persist(); setTimeout(() => notify(c)); },
          async delete() { delete data[c][id]; persist(); setTimeout(() => notify(c)); },
        };
      },
      onSnapshot(fn) {
        (subs[c] = subs[c] || []).push(fn);
        setTimeout(() => fn(snap(c)));
        return () => { subs[c] = (subs[c] || []).filter((x) => x !== fn); };
      },
    };
  }
  function exportAll() {
    return { app: "palestra-av", version: 1, exportedAt: new Date().toISOString(), logs: clone(data.logs), plans: clone(data.plans), settings: clone(data.settings) };
  }
  function importAll(obj) {
    if (!obj || obj.app !== "palestra-av" || typeof obj.logs !== "object") throw new Error("not_a_backup");
    data = { logs: obj.logs || {}, plans: obj.plans || {}, settings: obj.settings || {} };
    persist();
    COLLS.forEach((c) => setTimeout(() => notify(c)));
    return Object.keys(data.logs).length;
  }
  // profilo (nomi e pesi di partenza): si unisce ai dati senza toccare le sedute
  function importProfile(obj) {
    if (!obj || obj.app !== "palestra-av" || obj.kind !== "profile" || typeof obj.profile !== "object") throw new Error("not_a_profile");
    data.settings.profile = clone(obj.profile);
    persist();
    setTimeout(() => notify("settings"));
  }
  function count() { return Object.keys(data.logs).length; }
  return { collection, exportAll, importAll, importProfile, count };
})();

/* Salva un file: su Android apre la condivisione (scegli Drive), altrove lo scarica.
   Chrome per Android non condivide file .json: in quel caso usa .txt con lo stesso contenuto. */
async function shareOrDownload(base, text, kinds) {
  const files = kinds.map(([ext, type]) => new File([text], `${base}.${ext}`, { type }));
  if (navigator.share && navigator.canShare) {
    const file = files.find((f) => { try { return navigator.canShare({ files: [f] }); } catch (e) { return false; } });
    if (file) {
      try { await navigator.share({ files: [file], title: file.name }); return "shared"; }
      catch (err) { if (err && err.name === "AbortError") return "cancelled"; }
    }
  }
  const url = URL.createObjectURL(files[0]);
  const a = document.createElement("a");
  a.href = url; a.download = files[0].name; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  return "downloaded";
}
