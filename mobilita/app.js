/* Mobilità A&V — stretching, flessibilità e mobilità del weekend.
   Tre routine guidate (sabato, domenica, breve), livelli che allungano le tenute,
   test mensili di flessibilità per ciascuno, storico e backup. Tutto resta sul telefono. */

/* ================= PROGRAMMA ================= */
/* kind: "din" = movimento controllato (tempo fisso), "stat" = tenuta (durata dal livello).
   side: si fa su un lato e poi sull'altro. s: secondi per i "din" (per lato se side). */
const ROUTINES = {
  sab:{day:"Sabato", name:"Anche e gambe", focus:"Caviglie, anche, femorali e quadricipiti: la mobilità che serve a squat, stacco e affondi.",
    gear:"Tappetino, un elastico, un muro.", blocks:[
    {t:"Attivazione", items:[
      {fig:"cat_cow", n:"Cat-cow", kind:"din", d:"8 ripetizioni lente", s:45, z:"Colonna", c:"A quattro zampe: inspira e inarca la schiena guardando avanti, espira e arrotondala una vertebra alla volta."},
      {fig:"bridge", n:"Ponte glutei", kind:"din", d:"12 ripetizioni", s:45, z:"Glutei, anche", c:"Piedi alla larghezza del bacino. Sali stringendo i glutei, tieni 2 secondi in alto, scendi piano."},
      {fig:"bw_squat", n:"Squat lento a corpo libero", kind:"din", d:"8 ripetizioni, 3 s in discesa", s:50, z:"Anche, caviglie", c:"Petto alto, ginocchia in linea con le punte. Scendi in 3 secondi, fermati un attimo in basso, risali."}]},
    {t:"Mobilità", items:[
      {fig:"knee_wall", n:"Ginocchio al muro", kind:"din", side:true, d:"10 per lato", s:40, z:"Caviglia", c:"Piede a una spanna dal muro, porta il ginocchio a toccarlo senza staccare il tallone. Quando è facile, arretra il piede di un dito."},
      {fig:"wgs", n:"World's greatest stretch", kind:"din", side:true, d:"4 per lato", s:45, z:"Anche, torace", c:"Affondo lungo, mano a terra, gomito verso la caviglia. Poi ruota e apri il braccio verso il soffitto seguendolo con lo sguardo."},
      {fig:"hinge", n:"Piegamento d'anca a corpo libero", kind:"din", d:"10 ripetizioni", s:45, z:"Femorali", c:"Ginocchia morbide, spingi il bacino indietro con la schiena dritta finché senti tirare dietro le cosce, poi torna su."},
      {fig:"deep_squat", n:"Accosciata profonda", kind:"stat", d:"tenuta", z:"Anche, caviglie", c:"Scendi più in basso che puoi con i talloni a terra, gomiti che spingono le ginocchia in fuori. Se i talloni si alzano, appoggiati a un mobile davanti a te."}]},
    {t:"Allungamento", items:[
      {fig:"hip_flexor", n:"Flessori dell'anca in affondo", kind:"stat", side:true, z:"Flessori dell'anca", c:"Ginocchio dietro sul tappetino. Stringi il gluteo di quella gamba e porta il bacino avanti, il busto resta dritto. Il braccio dello stesso lato va in alto."},
      {fig:"ham_band", n:"Femorali da sdraiati con elastico", kind:"stat", side:true, z:"Femorali", c:"Elastico sotto la pianta, gamba tesa verso l'alto. Tira piano finché senti tensione dietro la coscia, l'altra gamba resta piegata o distesa a terra."},
      {fig:"fig4", n:"Piriforme (figura 4)", kind:"stat", side:true, z:"Glutei", c:"Da sdraiato, caviglia destra sul ginocchio sinistro. Abbraccia la coscia sinistra e portala verso il petto finché senti il gluteo destro."},
      {fig:"butterfly", n:"Farfalla da seduti", kind:"stat", z:"Adduttori", c:"Piante dei piedi unite, talloni vicini al bacino. Schiena dritta, piegati in avanti dall'anca e lascia scendere le ginocchia."},
      {fig:"calf_wall", n:"Polpacci al muro", kind:"stat", side:true, z:"Polpacci", c:"Mani al muro, gamba dietro tesa con il tallone ben a terra e la punta dritta. Avvicina il bacino al muro."},
      {fig:"quad_stand", n:"Quadricipiti in piedi", kind:"stat", side:true, z:"Quadricipiti", c:"Afferra la caviglia e porta il tallone verso il gluteo, ginocchia vicine, bacino leggermente in avanti. Tieniti al muro se serve."}]},
    {t:"Chiusura", items:[
      {fig:"child", n:"Posizione del bambino", kind:"din", d:"respira lento", s:60, z:"Schiena, rilassamento", c:"Siediti sui talloni e allunga le braccia avanti. Inspira dal naso in 4 secondi, espira dalla bocca in 6."}]}
  ]},
  dom:{day:"Domenica", name:"Schiena e spalle", focus:"Colonna toracica, spalle e petto: per panca, military, trazioni e per chi lavora chino.",
    gear:"Tappetino, un elastico, un muro, una sedia.", blocks:[
    {t:"Attivazione", items:[
      {fig:"cat_cow", n:"Cat-cow", kind:"din", d:"8 ripetizioni lente", s:45, z:"Colonna", c:"Muovi una vertebra alla volta, dal bacino alla testa."},
      {fig:"disloc", n:"Dislocazioni con elastico", kind:"din", d:"10 ripetizioni", s:40, z:"Spalle", c:"Presa larga, porta l'elastico da davanti a dietro la testa senza piegare i gomiti. Se non passa, allarga la presa."},
      {fig:"pull_apart", n:"Band pull-apart", kind:"din", d:"15 ripetizioni", s:40, z:"Dorso alto", c:"Elastico all'altezza del petto, braccia tese: apri fino allo sterno portando le scapole indietro e in basso."}]},
    {t:"Mobilità", items:[
      {fig:"open_book", n:"Open book a terra", kind:"din", side:true, d:"6 per lato", s:45, z:"Colonna toracica", c:"Sul fianco, ginocchia a 90° appoggiate a terra. Ruota il torace e apri il braccio dall'altra parte, segui la mano con lo sguardo."},
      {fig:"tspine", n:"Rotazioni a quattro zampe", kind:"din", side:true, d:"8 per lato", s:40, z:"Colonna toracica", c:"Mano dietro la testa o braccio teso: ruota aprendo il gomito verso il soffitto, il bacino resta fermo."},
      {fig:"wall_angel", n:"Angeli al muro", kind:"din", d:"10 ripetizioni", s:45, z:"Spalle", c:"Schiena, testa e bacino contro il muro, braccia a W. Scivola su fino a Y senza staccare polsi e gomiti, costole giù."}]},
    {t:"Allungamento", items:[
      {fig:"pec_wall", n:"Pettorali al muro", kind:"stat", side:true, z:"Petto", c:"Avambraccio sul muro, gomito all'altezza della spalla. Ruota lentamente il busto dalla parte opposta finché senti il petto."},
      {fig:"lat_chair", n:"Dorsali con la sedia", kind:"stat", z:"Dorsali, spalle", c:"In ginocchio, gomiti sulla sedia e mani unite. Lascia scendere il petto verso terra e porta il bacino indietro."},
      {fig:"sphinx", n:"Sfinge", kind:"stat", z:"Zona lombare, addome", c:"A pancia in giù, avambracci a terra sotto le spalle. Rilassa glutei e schiena e lascia che il bacino resti a terra."},
      {fig:"knees_chest", n:"Ginocchia al petto", kind:"stat", z:"Zona lombare", c:"Da sdraiato, abbraccia le ginocchia e portale verso il petto. Puoi dondolare piano a destra e a sinistra."},
      {fig:"child", n:"Posizione del bambino", kind:"stat", z:"Schiena, spalle", c:"Seduto sui talloni, braccia avanti. Cammina con le mani verso destra e poi verso sinistra per allungare i fianchi."}]},
    {t:"Chiusura", items:[
      {fig:"breath", n:"Respirazione con la pancia", kind:"din", d:"respira lento", s:60, z:"Rilassamento", c:"Sdraiato, ginocchia piegate, una mano sulla pancia. Inspira gonfiando la pancia in 4 secondi, espira in 6."}]}
  ]},
  breve:{day:"Quando c'è poco tempo", name:"Corpo intero breve", focus:"Il minimo che vale la pena fare: un giro veloce su anche, colonna, femorali e petto.",
    gear:"Tappetino e un elastico.", blocks:[
    {t:"Mobilità", items:[
      {fig:"cat_cow", n:"Cat-cow", kind:"din", d:"6 ripetizioni lente", s:35, z:"Colonna", c:"Inspira inarcando, espira arrotondando."},
      {fig:"wgs", n:"World's greatest stretch", kind:"din", side:true, d:"3 per lato", s:40, z:"Anche, torace", c:"Affondo lungo, gomito verso la caviglia, poi ruota e apri il braccio."},
      {fig:"open_book", n:"Open book a terra", kind:"din", side:true, d:"5 per lato", s:35, z:"Colonna toracica", c:"Ginocchia ferme a terra, apri il torace respirando a fondo."},
      {fig:"deep_squat", n:"Accosciata profonda", kind:"stat", z:"Anche, caviglie", c:"Talloni a terra, gomiti che spingono le ginocchia in fuori."}]},
    {t:"Allungamento", items:[
      {fig:"hip_flexor", n:"Flessori dell'anca in affondo", kind:"stat", side:true, z:"Flessori dell'anca", c:"Gluteo stretto, bacino avanti, busto dritto."},
      {fig:"ham_band", n:"Femorali da sdraiati con elastico", kind:"stat", side:true, z:"Femorali", c:"Gamba tesa verso l'alto, tira piano con l'elastico."},
      {fig:"pec_wall", n:"Pettorali al muro", kind:"stat", side:true, z:"Petto", c:"Avambraccio sul muro, ruota il busto dall'altra parte."},
      {fig:"child", n:"Posizione del bambino", kind:"din", d:"respira lento", s:45, z:"Rilassamento", c:"Seduto sui talloni, braccia avanti, espira lungo."}]}
  ]}
};
const ROUTINE_ORDER = ["sab","dom","breve"];
/* Livelli: allungano le tenute. Il livello consigliato sale con le sedute fatte. */
const LEVELS = [
  {name:"Base", hold:30, need:0},
  {name:"Medio", hold:45, need:8},
  {name:"Avanzato", hold:60, need:20}
];
const PREP_FIRST = 10, PREP = 8, SWITCH = 5;   // secondi di preparazione e cambio lato

/* Test di flessibilità: uno al mese, per ciascuno */
const TESTS = [
  {id:"reach", n:"Allungamento in avanti da seduti", unit:"cm", up:true, sides:false,
    how:"Seduto a gambe tese, piedi contro uno scatolone o un gradino. Allunga le mani in avanti lentamente e tieni 2 secondi. Misura dalle punte dei piedi alla punta delle dita: positivo se le superi, negativo se non ci arrivi."},
  {id:"knee", n:"Ginocchio al muro", unit:"cm", up:true, sides:true,
    how:"Distanza massima tra alluce e muro con cui il ginocchio tocca il muro senza alzare il tallone. Misura per ogni lato."},
  {id:"scratch", n:"Mani dietro la schiena", unit:"cm", up:false, sides:true,
    how:"Una mano scende da sopra la spalla, l'altra sale da sotto. Misura la distanza tra i medi: 0 se si toccano, negativo se si sovrappongono. Lato = mano che sta sopra."},
  {id:"squat", n:"Accosciata profonda", unit:"s", up:true, sides:false,
    how:"Quanti secondi resti in accosciata completa con i talloni a terra, senza appoggiarti. Fermati a 120."}
];
const TEST_EVERY = 28; // giorni

/* ================= ARCHIVIO ================= */
const KEY = "mob-db";
const DB = (() => {
  let d = {};
  try{ d = JSON.parse(localStorage.getItem(KEY)||"{}")||{}; }catch(e){ d = {}; }
  if(!Array.isArray(d.sessions)) d.sessions = [];
  if(!Array.isArray(d.tests)) d.tests = [];
  if(!d.settings || typeof d.settings!=="object") d.settings = {};
  return {
    get data(){ return d; },
    save(){ try{ localStorage.setItem(KEY, JSON.stringify(d)); return true; }catch(e){ alert("Spazio del telefono esaurito: fai un backup."); return false; } },
    export(){ return {app:"mobilita-av", version:1, exportedAt:new Date().toISOString(), sessions:d.sessions, tests:d.tests, settings:d.settings}; },
    import(o){
      if(!o || o.app!=="mobilita-av" || !Array.isArray(o.sessions)) throw new Error("not_a_backup");
      d = {sessions:o.sessions, tests:Array.isArray(o.tests)?o.tests:[], settings:o.settings||{}}; this.save();
    }
  };
})();
/* Nomi: li prende dal profilo della Palestra (stesso sito, stesso telefono), se c'è */
const NAME = {a:"A", v:"V"};
try{
  const p = JSON.parse(localStorage.getItem("pav-db")||"{}")?.settings?.profile?.names;
  for(const k of ["a","v"]){ const n = p?.[k]; if(n?.short) NAME[k] = String(n.short).slice(0,12); else if(n?.full) NAME[k] = String(n.full).split(" ")[0].slice(0,12); }
}catch(e){}
const whoLabel = w => w==="both" ? `${NAME.a} e ${NAME.v}` : NAME[w] || w;

/* Salva un file: su Android apre la condivisione (scegli Drive), altrove lo scarica */
async function shareOrDownload(base, text){
  const kinds = [["json","application/json"],["txt","text/plain"]];
  const files = kinds.map(([ext,type]) => new File([text], `${base}.${ext}`, {type}));
  if(navigator.share && navigator.canShare){
    const file = files.find(f => { try{ return navigator.canShare({files:[f]}); }catch(e){ return false; } });
    if(file){ try{ await navigator.share({files:[file], title:file.name}); return "shared"; }catch(err){ if(err && err.name==="AbortError") return "cancelled"; } }
  }
  const url = URL.createObjectURL(files[0]), a = document.createElement("a");
  a.href = url; a.download = files[0].name; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(()=>URL.revokeObjectURL(url), 1000);
  return "downloaded";
}

/* ================= UTILITÀ ================= */
const $ = id => document.getElementById(id);
const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
function todayISO(){ const d = new Date(); d.setMinutes(d.getMinutes()-d.getTimezoneOffset()); return d.toISOString().slice(0,10); }
const fmtDate = iso => new Date(iso+"T12:00:00").toLocaleDateString("it-IT",{day:"numeric", month:"short"});
const fmtLong = iso => new Date(iso+"T12:00:00").toLocaleDateString("it-IT",{weekday:"long", day:"numeric", month:"long"});
const mins = sec => Math.max(1, Math.round(sec/60));
const daysBetween = (a,b) => Math.round((new Date(b+"T12:00:00") - new Date(a+"T12:00:00"))/864e5);
const fmtNum = n => (Math.round(n*10)/10).toLocaleString("it-IT", {maximumFractionDigits:1});
/* lunedì della settimana di una data */
function weekStart(iso){ const d = new Date(iso+"T12:00:00"); const wd = (d.getDay()+6)%7; d.setDate(d.getDate()-wd); return d.toISOString().slice(0,10); }
function addDays(iso, n){ const d = new Date(iso+"T12:00:00"); d.setDate(d.getDate()+n); return d.toISOString().slice(0,10); }

/* ================= LIVELLO E SEQUENZA ================= */
function suggestedLevel(){
  const n = DB.data.sessions.length;
  let l = 0; LEVELS.forEach((L,i) => { if(n >= L.need) l = i; });
  return l;
}
function currentLevel(){ const s = DB.data.settings.level; return Number.isInteger(s) && LEVELS[s] ? s : suggestedLevel(); }
const holdOf = lvl => LEVELS[lvl].hold;
function itemSecs(it, lvl){ return it.kind==="stat" ? holdOf(lvl) : it.s; }
function itemDose(it, lvl){ return it.kind==="stat" ? `${holdOf(lvl)} s${it.side?" per lato":""}` : it.d; }
/* La sessione diventa una fila di passi: preparazione, esecuzione, cambio lato */
function buildSteps(rid, lvl){
  const steps = []; const r = ROUTINES[rid];
  const all = r.blocks.flatMap(b => b.items.map(it => ({...it, block:b.t})));
  all.forEach((it, idx) => {
    const sec = itemSecs(it, lvl), base = {it, idx, total:all.length};
    steps.push({...base, ph:"prep", s: idx===0 ? PREP_FIRST : PREP, side: it.side ? "destro" : ""});
    if(it.side){
      steps.push({...base, ph:"go", s:sec, side:"destro"});
      steps.push({...base, ph:"switch", s:SWITCH, side:"sinistro"});
      steps.push({...base, ph:"go", s:sec, side:"sinistro"});
    } else steps.push({...base, ph:"go", s:sec, side:""});
  });
  return steps;
}
const routineSecs = (rid, lvl) => buildSteps(rid, lvl).reduce((a, s) => a + s.s, 0);

/* ================= STATO E VISTE ================= */
const DOW = new Date().getDay();
const state = {view:"sess", rid: DOW===6 ? "sab" : DOW===0 ? "dom" : "breve", testDate: todayISO()};
try{ const s = JSON.parse(sessionStorage.getItem("mob-ui")||"{}"); if(s.view) state.view = s.view; if(s.rid && ROUTINES[s.rid]) state.rid = s.rid; }catch(e){}
function persistUi(){ try{ sessionStorage.setItem("mob-ui", JSON.stringify({view:state.view, rid:state.rid})); }catch(e){} }
const main = $("main");

function render(){
  document.querySelectorAll(".tabs button").forEach(b => b.setAttribute("aria-selected", String(b.dataset.view===state.view)));
  $("dock").hidden = state.view !== "sess";
  weekTag(); banner();
  if(state.view==="sess") renderSess();
  else if(state.view==="test") renderTest();
  else renderHist();
}
function weekTag(){
  const ws = weekStart(todayISO()), n = DB.data.sessions.filter(s => s.date >= ws).length;
  $("weekTag").textContent = n ? `${n} ${n===1?"sessione":"sessioni"} questa settimana` : "Nessuna sessione questa settimana";
}
function banner(){
  const b = $("banner"), d = DB.data, last = d.settings.lastBackup;
  const count = d.sessions.length + d.tests.length;
  if(count >= 3 && (!last || daysBetween(last.slice(0,10), todayISO()) > 30)){
    b.hidden = false; b.innerHTML = `Ultimo backup: ${last ? fmtDate(last.slice(0,10)) : "mai"}. Le sessioni vivono solo su questo telefono: <a href="#" id="bkLink">salva un backup su Drive</a>.`;
    $("bkLink").onclick = e => { e.preventDefault(); doBackup(); };
  } else b.hidden = true;
}

function renderSess(){
  const lvl = currentLevel(), sug = suggestedLevel(), manual = Number.isInteger(DB.data.settings.level);
  let h = `<div class="picker" role="group" aria-label="Routine">`;
  for(const id of ROUTINE_ORDER){
    const r = ROUTINES[id];
    h += `<button class="rt" data-rid="${id}" aria-pressed="${id===state.rid}"><span class="d">${esc(r.day)}</span><span class="n">${esc(r.name)}</span><span class="m">~${mins(routineSecs(id, lvl))} min</span></button>`;
  }
  h += `</div>`;
  const r = ROUTINES[state.rid];
  h += `<div class="panel"><div class="lvl-row"><span class="t">Livello<small>Tenute da ${holdOf(lvl)} s. ${manual ? (lvl===sug?"È anche quello consigliato.":`Consigliato: ${LEVELS[sug].name}.`) : `Scelto in base alle ${DB.data.sessions.length} sessioni fatte.`}</small></span>
    <div class="seg" role="group" aria-label="Livello">${LEVELS.map((L,i)=>`<button data-lvl="${i}" aria-pressed="${i===lvl}">${L.name}</button>`).join("")}</div></div>
    <div class="focus">${esc(r.focus)} <b>Serve:</b> ${esc(r.gear)}</div></div>`;
  for(const b of r.blocks){
    const secs = b.items.reduce((a, it) => a + itemSecs(it, lvl) * (it.side?2:1), 0);
    h += `<section class="blk"><h3>${esc(b.t)}<span>${mins(secs)} min</span></h3><div class="items">`;
    for(const it of b.items){
      h += `<div class="it">${figSVG(it.fig, it.n)}<div class="tx"><span class="nm">${esc(it.n)}</span>
        <span class="dd ${it.kind}">${it.kind==="stat"?"Tenuta · ":""}${esc(itemDose(it, lvl))}</span><span class="z">${esc(it.z)}</span>
        <details><summary>Come si fa</summary>${esc(it.c)}</details></div></div>`;
    }
    h += `</div></section>`;
  }
  h += `<div class="panel rules">
    <b>Come farlo bene</b><ul>
    <li>Nelle tenute cerca una tensione da 4-6 su 10: deve tirare, non fare male. Niente molleggi.</li>
    <li>Respira lento ed espira lungo: è nell'espirazione che il muscolo cede.</li>
    <li>Fatelo a corpo caldo, dopo una camminata o una doccia calda, mai a freddo appena svegli.</li>
    <li>Due sessioni a settimana bastano per vedere progressi in 6-8 settimane. Contano più della durata.</li>
    <li>Formicolii, dolore acuto o articolare: fermati e salta l'esercizio.</li></ul>
    <b>Livelli</b><ul><li>Base 30 s, Medio 45 s, Avanzato 60 s per tenuta. Il consigliato sale a ${LEVELS[1].need} e a ${LEVELS[2].need} sessioni fatte.</li></ul></div>`;
  main.innerHTML = h;
  $("dockMsg").innerHTML = `<b>${esc(r.name)}</b>${LEVELS[lvl].name} · ~${mins(routineSecs(state.rid, lvl))} min · ${r.blocks.reduce((a,b)=>a+b.items.length,0)} esercizi`;
}

/* ---------- Test ---------- */
function testsOf(ath){ return DB.data.tests.filter(t => t.ath===ath).sort((x,y) => x.date.localeCompare(y.date)); }
function renderTest(){
  const lastAny = DB.data.tests.map(t => t.date).sort().pop();
  const due = !lastAny ? "Primo test: fatelo oggi per avere il punto di partenza." :
    daysBetween(lastAny, todayISO()) >= TEST_EVERY ? `Ultimo test il ${fmtDate(lastAny)}: è ora di rifarlo.` :
    `Ultimo test il ${fmtDate(lastAny)}. Il prossimo dal ${fmtDate(addDays(lastAny, TEST_EVERY))}.`;
  let h = `<h2 class="sec-t">Test del mese<small>${esc(due)} Fateli a corpo caldo, dopo una sessione, sempre nello stesso modo.</small></h2>
    <div class="row" style="margin-bottom:10px"><label class="field">Data<input type="date" id="tDate" value="${state.testDate}"></label></div><div class="items">`;
  for(const T of TESTS){
    const keys = T.sides ? [["dx","Destro"],["sx","Sinistro"]] : [["v",""]];
    h += `<div class="tcard"><span class="tn">${esc(T.n)} <small class="prev">(${T.unit}, ${T.up?"più è meglio":"meno è meglio"})</small></span><span class="how">${esc(T.how)}</span>
      <div class="tgrid"><span></span><span class="h">${esc(NAME.a)}</span><span class="h">${esc(NAME.v)}</span>`;
    for(const [k, lab] of keys){
      h += `<span class="lab">${lab}</span>`;
      for(const a of ["a","v"]){
        const prev = testsOf(a).filter(t => t.date < state.testDate && t.vals[T.id+"_"+k] != null).pop();
        const cur = DB.data.tests.find(t => t.ath===a && t.date===state.testDate);
        const val = cur?.vals[T.id+"_"+k];
        h += `<span><input type="number" step="any" data-test="${T.id}_${k}" data-ath="${a}" value="${val ?? ""}" placeholder="${T.unit}" aria-label="${esc(T.n)} ${lab} ${esc(NAME[a])}">
          ${prev ? `<span class="prev">prima ${fmtNum(prev.vals[T.id+"_"+k])}${val!=null?deltaHTML(val - prev.vals[T.id+"_"+k], T.up):""}</span>` : ""}</span>`;
      }
    }
    h += `</div></div>`;
  }
  h += `</div><div class="actions" style="margin-top:12px"><button class="btn" id="tSave">Salva test</button></div>`;
  // storico test
  h += `<h2 class="sec-t">Andamento</h2>`;
  for(const a of ["a","v"]){
    const ts = testsOf(a);
    h += `<div class="panel"><b>${esc(NAME[a])}</b>`;
    if(!ts.length){ h += `<span class="empty">Ancora nessun test.</span></div>`; continue; }
    const first = ts[0], last = ts[ts.length-1];
    h += `<ul class="log">`;
    for(const T of TESTS){
      const keys = T.sides ? ["dx","sx"] : ["v"];
      const parts = keys.map(k => {
        const id = T.id+"_"+k, f = ts.find(t => t.vals[id]!=null), l = [...ts].reverse().find(t => t.vals[id]!=null);
        if(!l) return null;
        const side = T.sides ? (k==="dx"?"dx ":"sx ") : "";
        return `${side}${fmtNum(l.vals[id])} ${T.unit}${f && f!==l ? deltaHTML(l.vals[id]-f.vals[id], T.up) : ""}`;
      }).filter(Boolean);
      if(parts.length) h += `<li><span class="a">${esc(T.n)}</span><span class="b">${parts.join(" · ")}</span></li>`;
    }
    h += `</ul><span class="prev">${ts.length} test, dal ${fmtDate(first.date)} al ${fmtDate(last.date)}. Le frecce confrontano l'ultimo valore con il primo.</span></div>`;
  }
  main.innerHTML = h;
}
function deltaHTML(d, up){
  if(Math.abs(d) < 0.05) return `<span class="delta">=</span>`;
  const good = up ? d > 0 : d < 0;
  return `<span class="delta ${good?"up":"down"}">${d>0?"+":"−"}${fmtNum(Math.abs(d))}</span>`;
}
function saveTests(){
  const date = $("tDate").value || todayISO();
  const byAth = {a:{}, v:{}};
  let bad = false;
  document.querySelectorAll("input[data-test]").forEach(i => {
    const raw = i.value.trim().replace(",", "."); if(raw==="") return;
    const v = Number(raw); if(!Number.isFinite(v)){ bad = true; i.style.borderColor = "var(--bad)"; return; }
    byAth[i.dataset.ath][i.dataset.test] = v;
  });
  if(bad){ alert("Controlla i valori in rosso: servono numeri, es. -4 o 12,5."); return; }
  let n = 0;
  for(const a of ["a","v"]){
    const vals = byAth[a]; const ex = DB.data.tests.findIndex(t => t.ath===a && t.date===date);
    if(!Object.keys(vals).length){ if(ex>=0) DB.data.tests.splice(ex,1); continue; }
    const rec = {id:`${a}-${date}`, ath:a, date, vals};
    if(ex>=0) DB.data.tests[ex] = rec; else DB.data.tests.push(rec);
    n++;
  }
  if(!n){ alert("Inserisci almeno un valore."); return; }
  DB.save(); state.testDate = date; render(); toast("Test salvati");
}

/* ---------- Storico ---------- */
function renderHist(){
  const ss = [...DB.data.sessions].sort((x,y) => (y.date+y.at).localeCompare(x.date+x.at));
  const today = todayISO(), m0 = today.slice(0,7), d = new Date(today+"T12:00:00"); d.setDate(1); d.setMonth(d.getMonth()-1);
  const m1 = d.toISOString().slice(0,7);
  const cM0 = ss.filter(s => s.date.startsWith(m0)).length, cM1 = ss.filter(s => s.date.startsWith(m1)).length;
  const minM0 = ss.filter(s => s.date.startsWith(m0)).reduce((a,s) => a + (s.min||0), 0);
  // settimane di fila con almeno una sessione (la settimana in corso conta solo se c'è già)
  const weeksSet = new Map(); ss.forEach(s => { const w = weekStart(s.date); weeksSet.set(w, (weeksSet.get(w)||0)+1); });
  let streak = 0, w = weekStart(today); if(!weeksSet.has(w)) w = addDays(w, -7);
  while(weeksSet.has(w)){ streak++; w = addDays(w, -7); }
  const diff = cM0 - cM1;
  let h = `<div class="stats">
    <div class="stat"><div class="v num">${cM0}</div><div class="l">sessioni questo mese</div><div class="c" style="color:${diff>=0?"var(--good)":"var(--bad)"}">${cM1||cM0 ? `${diff>=0?"+":"−"}${Math.abs(diff)} sul mese scorso` : "&nbsp;"}</div></div>
    <div class="stat"><div class="v num">${minM0}</div><div class="l">minuti questo mese</div></div>
    <div class="stat"><div class="v num">${streak}</div><div class="l">${streak===1?"settimana":"settimane"} di fila</div></div></div>`;
  // ultime 12 settimane
  const ws0 = weekStart(today);
  h += `<div class="panel"><b>Ultime 12 settimane</b><div class="weeks">`;
  for(let i=11;i>=0;i--){ const wk = addDays(ws0, -7*i), n = weeksSet.get(wk)||0;
    h += `<span class="wk${n>=2?" two":n?" on":""}${i===0?" now":""}" title="Settimana del ${fmtDate(wk)}: ${n} sessioni"></span>`; }
  h += `</div><div class="wlab"><span>${fmtDate(addDays(ws0,-77))}</span><span>Pieno: 1 sessione · bordo chiaro: 2 o più</span><span>oggi</span></div></div>`;
  h += `<h2 class="sec-t">Sessioni</h2><div class="panel">`;
  if(!ss.length) h += `<span class="empty">Ancora nessuna sessione. La prima la trovi nella scheda Sessione.</span>`;
  else {
    h += `<ul class="log">`;
    for(const s of ss.slice(0, 40)){
      const r = ROUTINES[s.routine];
      const feel = ["","ancora rigidi","normale","sciolti"][s.feel] || "";
      h += `<li><span class="a">${esc(r ? r.name : s.routine)} · ${esc(whoLabel(s.who))}</span>
        <span class="b">${fmtLong(s.date)} · ${s.min} min · ${esc(LEVELS[s.level]?.name||"")}${feel?" · "+feel:""}${s.note?" · "+esc(s.note):""}</span>
        <button class="x" data-del="${esc(s.id)}" aria-label="Elimina sessione">×</button></li>`;
    }
    h += `</ul>`;
  }
  h += `</div><h2 class="sec-t">Backup<small>Dati solo su questo telefono. Il backup va nella cartella Claude/Palestra su Drive.</small></h2>
    <div class="actions"><button class="ghost" id="bkSave">Backup su Drive</button><button class="ghost" id="bkLoad">Importa backup</button>
    <input type="file" id="bkFile" accept=".json,.txt,application/json,text/plain" hidden></div>`;
  main.innerHTML = h;
}
async function doBackup(){
  const txt = JSON.stringify(DB.export(), null, 1);
  const r = await shareOrDownload(`mobilita-backup-${todayISO()}`, txt);
  if(r!=="cancelled"){ DB.data.settings.lastBackup = new Date().toISOString(); DB.save(); render(); toast(r==="shared"?"Backup condiviso":"Backup scaricato"); }
}

/* ================= SESSIONE GUIDATA ================= */
const pl = {steps:[], i:0, left:0, end:0, running:false, id:null, startedAt:0, rid:null, lvl:0, doneSecs:0};
let audioCtx = null;
function tone(freq=880, len=.16, vol=.3){
  try{
    audioCtx = audioCtx || new (window.AudioContext||window.webkitAudioContext)();
    if(audioCtx.state==="suspended") audioCtx.resume();
    const o = audioCtx.createOscillator(), g = audioCtx.createGain(), t0 = audioCtx.currentTime;
    o.frequency.value = freq; o.connect(g); g.connect(audioCtx.destination);
    g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(vol, t0+.02); g.gain.exponentialRampToValueAtTime(0.0001, t0+len);
    o.start(t0); o.stop(t0+len+.02);
  }catch(e){}
}
const buzz = p => { try{ navigator.vibrate?.(p); }catch(e){} };
let wakeLock = null;
async function keepAwake(){ if(wakeLock) return; try{ wakeLock = await navigator.wakeLock?.request("screen"); wakeLock?.addEventListener?.("release", ()=>{ wakeLock = null; }); }catch(e){ wakeLock = null; } }
document.addEventListener("visibilitychange", ()=>{ if(document.visibilityState==="visible" && !$("player").hidden) keepAwake(); });

function startSession(){
  pl.rid = state.rid; pl.lvl = currentLevel(); pl.steps = buildSteps(pl.rid, pl.lvl);
  pl.startedAt = Date.now(); pl.doneSecs = 0;
  $("player").hidden = false; document.body.style.overflow = "hidden";
  try{ audioCtx = audioCtx || new (window.AudioContext||window.webkitAudioContext)(); audioCtx.resume?.(); }catch(e){}
  keepAwake(); goStep(0, true);
  clearInterval(pl.id); pl.id = setInterval(tick, 200);
}
function goStep(i, run=pl.running){
  pl.i = Math.max(0, Math.min(i, pl.steps.length-1));
  pl.left = pl.steps[pl.i].s; pl.end = Date.now() + pl.left*1000; pl.running = run;
  const st = pl.steps[pl.i];
  if(st.ph==="go"){ tone(1046, .22); buzz(200); } else if(st.ph==="switch"){ tone(660, .2); buzz([120,80,120]); }
  show();
}
function tick(){
  if(!pl.running) return;
  const left = Math.max(0, Math.ceil((pl.end - Date.now())/1000));
  if(left === pl.left) return;
  pl.left = left;
  const st = pl.steps[pl.i];
  if(st.ph==="go" && left>0 && left<=3) tone(740, .08, .18);
  if(left<=0){
    if(st.ph==="go") pl.doneSecs += st.s;
    if(pl.i < pl.steps.length-1) goStep(pl.i+1); else return endSession(true);
  }
  show();
}
function show(){
  const st = pl.steps[pl.i], it = st.it, nextIt = pl.steps.slice(pl.i+1).find(s => s.it !== it)?.it;
  $("pStep").textContent = `Esercizio ${st.idx+1} di ${st.total}`;
  $("pBlock").textContent = it.block;
  $("pProg").style.width = (100*pl.i/(pl.steps.length-1||1))+"%";
  const ph = $("pPhase");
  ph.className = "p-phase " + (st.ph==="go" ? it.kind : "prep");
  ph.textContent = st.ph==="prep" ? "Preparati" : st.ph==="switch" ? "Cambia lato" : it.kind==="stat" ? "Tieni" : "Muoviti";
  $("pName").textContent = it.n;
  $("pSide").textContent = st.side ? `Lato ${st.side}` : "";
  if($("pFig").dataset.k !== it.fig){ $("pFig").dataset.k = it.fig; $("pFig").innerHTML = figSVG(it.fig, it.n); }
  $("pSec").textContent = pl.left;
  const bar = $("pBar"); bar.parentElement.className = "p-bar" + (it.kind==="stat" && st.ph==="go" ? " stat" : "");
  bar.style.width = (100*(1 - pl.left/st.s))+"%";
  $("pCue").textContent = st.ph==="go" ? `${itemDose(it, pl.lvl)}. ${it.c}` : it.c;
  $("pNext").textContent = nextIt ? `Poi: ${nextIt.n}` : "Ultimo esercizio";
  $("pPause").textContent = pl.running ? "Pausa" : "Riprendi";
}
function stepToItem(dir){
  // salta all'inizio (preparazione) dell'esercizio precedente o successivo
  const cur = pl.steps[pl.i].idx, target = cur + dir;
  if(target >= pl.steps[0].total) return endSession(true);
  const j = pl.steps.findIndex(s => s.idx === Math.max(0, target));
  goStep(j, true);
}
function endSession(finished){
  clearInterval(pl.id); pl.running = false;
  $("player").hidden = true; document.body.style.overflow = "";
  try{ wakeLock?.release(); }catch(e){} wakeLock = null;
  const realMin = Math.round((Date.now() - pl.startedAt)/60000);
  if(finished){ tone(880,.15); setTimeout(()=>tone(1046,.25), 180); buzz([200,100,200,100,300]); }
  // vale come sessione se è finita o se si è fatto almeno metà del tempo di lavoro
  const workTot = pl.steps.filter(s => s.ph==="go").reduce((a,s) => a + s.s, 0);
  if(finished || pl.doneSecs >= workTot/2) openFinish(Math.max(1, realMin), finished);
}

/* ---------- fine sessione ---------- */
const fin = {who:"both", feel:2, min:0};
function openFinish(min, finished){
  fin.min = min; fin.feel = 2;
  const r = ROUTINES[pl.rid];
  $("fTitle").textContent = finished ? "Sessione finita" : "Sessione interrotta";
  $("fSub").textContent = `${r.name} · ${LEVELS[pl.lvl].name} · ${min} min`;
  $("fWho").innerHTML = [["both","Insieme"],["a",NAME.a],["v",NAME.v]].map(([k,l]) => `<button data-who="${k}" aria-pressed="${k===fin.who}">${esc(l)}</button>`).join("");
  $("fFeel").querySelectorAll("button").forEach(b => b.setAttribute("aria-pressed", String(+b.dataset.feel===fin.feel)));
  $("fNote").value = "";
  $("finish").hidden = false;
}
$("fWho").addEventListener("click", e => { const b = e.target.closest("button[data-who]"); if(!b) return; fin.who = b.dataset.who; $("fWho").querySelectorAll("button").forEach(x => x.setAttribute("aria-pressed", String(x===b))); });
$("fFeel").addEventListener("click", e => { const b = e.target.closest("button[data-feel]"); if(!b) return; fin.feel = +b.dataset.feel; $("fFeel").querySelectorAll("button").forEach(x => x.setAttribute("aria-pressed", String(x===b))); });
$("fCancel").addEventListener("click", () => { $("finish").hidden = true; });
$("fSave").addEventListener("click", () => {
  const before = suggestedLevel();
  const s = {id: Date.now().toString(36), date: todayISO(), at: new Date().toTimeString().slice(0,5), routine: pl.rid, level: pl.lvl, who: fin.who, min: fin.min, feel: fin.feel};
  const note = $("fNote").value.trim(); if(note) s.note = note.slice(0, 500);
  DB.data.sessions.push(s);
  if(!DB.save()) return;
  $("finish").hidden = true;
  const after = suggestedLevel();
  render();
  toast(after > before ? `Salvata. Siete pronti per il livello ${LEVELS[after].name}.` : "Sessione salvata");
});

/* ================= EVENTI ================= */
function toast(msg){
  let t = document.querySelector(".toast");
  if(!t){ t = document.createElement("div"); t.className = "toast"; t.setAttribute("role","status");
    t.style.cssText = "position:fixed;left:50%;bottom:calc(84px + env(safe-area-inset-bottom,0px));transform:translateX(-50%);z-index:40;background:var(--ink);color:var(--bg);padding:10px 14px;border-radius:10px;font:600 14px var(--f-body);box-shadow:0 8px 24px rgba(0,0,0,.25);max-width:90vw;text-align:center";
    document.body.appendChild(t); }
  t.textContent = msg; t.hidden = false; clearTimeout(t._h); t._h = setTimeout(() => { t.hidden = true; }, 2600);
}
document.querySelectorAll(".tabs button").forEach(b => b.addEventListener("click", () => { state.view = b.dataset.view; persistUi(); render(); window.scrollTo({top:0}); }));
main.addEventListener("click", e => {
  const b = e.target.closest("button"); if(!b) return;
  if(b.dataset.rid){ state.rid = b.dataset.rid; persistUi(); render(); return; }
  if(b.dataset.lvl){ const v = +b.dataset.lvl; DB.data.settings.level = v === suggestedLevel() ? null : v; DB.save(); render(); return; }
  if(b.id==="tSave") return saveTests();
  if(b.id==="bkSave") return doBackup();
  if(b.id==="bkLoad") return $("bkFile").click();
  if(b.dataset.del){
    const s = DB.data.sessions.find(x => x.id===b.dataset.del); if(!s) return;
    if(!confirm(`Eliminare la sessione del ${fmtDate(s.date)}?`)) return;
    DB.data.sessions = DB.data.sessions.filter(x => x !== s); DB.save(); render(); return;
  }
});
main.addEventListener("change", async e => {
  if(e.target.id==="tDate"){ state.testDate = e.target.value || todayISO(); render(); return; }
  if(e.target.id==="bkFile"){
    const f = e.target.files?.[0]; if(!f) return;
    try{
      const o = JSON.parse(await f.text());
      if(!confirm(`Il backup del ${o.exportedAt ? fmtDate(o.exportedAt.slice(0,10)) : "?"} sostituisce i dati di questo telefono. Continuare?`)) return;
      DB.import(o); render(); toast(`Ripristinate ${DB.data.sessions.length} sessioni`);
    }catch(err){ alert("Questo file non è un backup di Mobilità A&V."); }
  }
});
$("startBtn").addEventListener("click", startSession);
$("pPause").addEventListener("click", () => { pl.running = !pl.running; if(pl.running) pl.end = Date.now() + pl.left*1000; show(); });
$("pSkip").addEventListener("click", () => stepToItem(1));
$("pBack").addEventListener("click", () => {
  const st = pl.steps[pl.i];
  // se l'esercizio è appena iniziato torna al precedente, altrimenti ricomincia questo
  const first = pl.steps.findIndex(s => s.idx === st.idx);
  if(pl.i === first && pl.left >= st.s - 2) stepToItem(-1); else goStep(first, true);
});
$("pClose").addEventListener("click", () => { if(confirm("Chiudere la sessione?")) endSession(false); });

render();
