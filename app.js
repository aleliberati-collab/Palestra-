
/* ================= PROGRAMMA ================= */
const START_DEFAULT = "2026-10-12";
const STEP = { bb:{a:2.5,v:2.5}, bbu:{a:2.5,v:1}, bbh:{a:5,v:2.5}, db:{a:2,v:1}, cable:{a:2.5,v:2.5}, kb:{a:4,v:4}, bw:{a:2.5,v:2.5} };
/* Schemi per ruolo: [blocco Volume, blocco Carico] → [serie, min, max] */
const SCHEME = {
  main:  [[3,8,10],[4,6,8]],
  hinge: [[3,6,8],[3,4,6]],
  main2: [[3,8,10],[3,6,8]],
  sec:   [[3,10,12],[3,8,10]],
  acc:   [[3,10,15],[3,8,12]],
  iso:   [[3,12,15],[3,10,12]],
  core:  [[3,10,15],[3,10,15]]
};
const ROLE_LABEL = {main:"Fondamentale", hinge:"Fondamentale", main2:"Fondamentale", sec:"Complementare", acc:"Accessorio", iso:"Isolamento", core:"Core"};
const PLUS_SET = new Set(["acc","iso"]); // +1 serie nelle settimane 3-4

const DAYS = {
  lun:{label:"Lunedì", name:"Full body A", slots:[
    {role:"main", opts:[{id:"squat", name:"Squat con bilanciere", eq:"bb"}]},
    {role:"main", opts:[{id:"panca", name:"Panca piana bilanciere", eq:"bbu"}]},
    {role:"sec", opts:[
      {id:"pulley", name:"Pulley", eq:"cable"},
      {id:"rematore_man", name:"Rematore con manubrio", eq:"db", est:{from:"pulley",k:.45}},
      {id:"rematore_bil", name:"Rematore con bilanciere", eq:"bbu", est:{from:"panca",k:.75}}]},
    {role:"acc", opts:[
      {id:"hip", name:"Hip thrust", eq:"bbh"},
      {id:"hip_mono", name:"Hip thrust monolaterale", eq:"db"},
      {id:"pull_through", name:"Pull-through ai cavi", eq:"cable"}]},
    {role:"iso", strip:true, opts:[
      {id:"alzate", name:"Alzate laterali", eq:"db"},
      {id:"alzate_cavi", name:"Alzate laterali ai cavi", eq:"cable"},
      {id:"alzate_panca", name:"Alzate laterali a busto inclinato", eq:"db", est:{from:"alzate",k:.9}}]},
    {role:"iso", strip:true, opts:[
      {id:"pushdown", name:"Push down ai cavi", eq:"cable"},
      {id:"french", name:"French press con EZ", eq:"bbu", est:{from:"pushdown",k:.75}},
      {id:"tri_over", name:"Estensioni sopra la testa ai cavi", eq:"cable", est:{from:"pushdown",k:.7}}]}
  ]},
  mer:{label:"Mercoledì", name:"Full body B", slots:[
    {role:"hinge", opts:[{id:"stacco", name:"Stacco da terra", eq:"bbh"}]},
    {role:"main2", opts:[{id:"military", name:"Military press", eq:"bbu"}]},
    {role:"sec", opts:[
      {id:"lat", name:"Lat machine", eq:"cable"},
      {id:"trazioni", name:"Trazioni alla sbarra", eq:"bw"},
      {id:"lat_stretta", name:"Lat machine presa stretta", eq:"cable", est:{from:"lat",k:1}}]},
    {role:"acc", opts:[
      {id:"bulgaro", name:"Bulgarian split squat", eq:"db"},
      {id:"affondi", name:"Affondi camminati con manubri", eq:"db", est:{from:"bulgaro",k:1.1}},
      {id:"stepup", name:"Step-up con manubri", eq:"db", est:{from:"bulgaro",k:1}}]},
    {role:"iso", opts:[
      {id:"facepull", name:"Face pull", eq:"cable"},
      {id:"rear_cavi", name:"Alzate posteriori ai cavi", eq:"cable"},
      {id:"reverse_fly", name:"Reverse fly con manubri", eq:"db"}]},
    {role:"iso", strip:true, opts:[
      {id:"curl", name:"Curl bilanciere EZ", eq:"bbu"},
      {id:"curl_incl", name:"Curl su panca inclinata", eq:"db", est:{from:"curl",k:.4}},
      {id:"curl_cavi", name:"Curl ai cavi", eq:"cable", est:{from:"curl",k:1}}]}
  ]},
  ven:{label:"Venerdì", name:"Full body C", slots:[
    {role:"sec", opts:[
      {id:"inclinata", name:"Panca inclinata con manubri", eq:"db"},
      {id:"inclinata_bil", name:"Panca inclinata bilanciere", eq:"bbu", est:{from:"panca",k:.8}},
      {id:"panca_stretta", name:"Panca presa stretta", eq:"bbu", est:{from:"panca",k:.85}}]},
    {role:"sec", opts:[
      {id:"rdl", name:"Romanian deadlift", eq:"bb"},
      {id:"good_morning", name:"Good morning", eq:"bb", est:{from:"rdl",k:.6}},
      {id:"rdl_man", name:"Stacco rumeno con manubri", eq:"db", est:{from:"rdl",k:.4}}]},
    {role:"sec", opts:[
      {id:"row_petto", name:"Rematore su panca inclinata", eq:"db", est:{from:"pulley",k:.4}},
      {id:"pulley_mono", name:"Pulley monolaterale", eq:"cable", est:{from:"pulley",k:.5}},
      {id:"tbar", name:"Rematore landmine (T-bar)", eq:"bb"}]},
    {role:"acc", opts:[
      {id:"goblet", name:"Goblet squat", eq:"kb"},
      {id:"front_squat", name:"Front squat", eq:"bb", est:{from:"squat",k:.75}},
      {id:"split_bil", name:"Split squat con bilanciere", eq:"bb", est:{from:"squat",k:.5}}]},
    {role:"iso", opts:[
      {id:"polpacci", name:"Polpacci in piedi", eq:"db"},
      {id:"polpacci_mono", name:"Polpacci monopodalici", eq:"db", est:{from:"polpacci",k:.6}}]}
  ]}
};

/* Circuito core opzionale: 3 esercizi, giri crescenti con i blocchi */
const CORE = {
  lun:{name:"Anti-estensione e anti-rotazione", ex:[
    {n:"Dead bug", fig:"dead_bug", d:"8 per lato", c:"Zona lombare schiacciata a terra, espira mentre allunghi braccio e gamba opposti."},
    {n:"Plank laterale", fig:"side_plank", d:"25-30 s per lato", c:"Anche alte, corpo in linea dalla testa ai piedi."},
    {n:"Pallof press con elastico", fig:"pallof", d:"10 per lato", c:"Elastico di lato all'altezza del petto, spingi in avanti e resisti alla rotazione per 2 secondi."}]},
  mer:{name:"Stabilità e presa", ex:[
    {n:"Plank con contrazione totale", fig:"plank_rkc", d:"20-30 s", c:"Gomiti verso i piedi, glutei e addome stretti al massimo: meglio corto e duro che lungo e molle."},
    {n:"Suitcase carry", fig:"suitcase", d:"30 m per lato", c:"Manubrio pesante in una mano, cammina dritto senza piegarti di lato."},
    {n:"Bird dog con elastico", fig:"bird_dog", d:"6 per lato", c:"Elastico al piede, allunga lento e tieni 2 secondi."}]},
  ven:{name:"Flessione e controllo", ex:[
    {n:"Hollow hold", fig:"hollow", d:"20-25 s", c:"Zona lombare a terra, braccia e gambe distese: piega le ginocchia se la schiena si stacca."},
    {n:"Rollout in ginocchio", fig:"rollout", d:"8 rip", c:"Con ruota o bilanciere con dischi: vai avanti solo finché la schiena resta neutra."},
    {n:"Ginocchia al petto alla sbarra", fig:"knee_raise", d:"10 rip", c:"Appeso, porta le ginocchia al petto arrotondando il bacino, scendi lento senza oscillare."}]}
};
function coreRounds(ph){ return ph.deload ? 1 : ph.block===0 && ph.wib<2 ? 2 : 3; }
/* Nomi e pesi di partenza non stanno nel codice (che è pubblico): arrivano dal profilo,
   salvato tra i dati del telefono e nel backup. Senza profilo l'app usa nomi neutri e trova i pesi da zero. */
const ATH = {a:"Atleta A", v:"Atleta V"};
const SHORT = {a:"A", v:"V"};
const BASE = {};
function applyProfile(p){
  if(!p || typeof p!=="object") return;
  for(const k of ["a","v"]){ const n = p.names?.[k]; if(n?.full) ATH[k] = String(n.full).slice(0,40); if(n?.short) SHORT[k] = String(n.short).slice(0,12); }
  for(const k in BASE) delete BASE[k];
  for(const [id,b] of Object.entries(p.base||{})) if(b && typeof b==="object") BASE[id] = {a:+b.a, v:+b.v, r:+b.r||8};
}
/* Recupero tra le serie (secondi) per ruolo: modificabile al volo con −15/+15 */
const REST = {main:150, hinge:180, main2:120, sec:120, acc:90, iso:60, core:60};
/* Gruppo muscolare principale di ogni esercizio, per il volume settimanale */
const MUSCLE = {
  squat:"Quadricipiti", front_squat:"Quadricipiti", goblet:"Quadricipiti", split_bil:"Quadricipiti", bulgaro:"Quadricipiti", affondi:"Quadricipiti", stepup:"Quadricipiti",
  stacco:"Glutei e femorali", rdl:"Glutei e femorali", good_morning:"Glutei e femorali", rdl_man:"Glutei e femorali", hip:"Glutei e femorali", hip_mono:"Glutei e femorali", pull_through:"Glutei e femorali",
  panca:"Petto", inclinata:"Petto", inclinata_bil:"Petto", panca_stretta:"Petto",
  pulley:"Schiena", rematore_man:"Schiena", rematore_bil:"Schiena", lat:"Schiena", trazioni:"Schiena", lat_stretta:"Schiena", row_petto:"Schiena", pulley_mono:"Schiena", tbar:"Schiena",
  military:"Spalle", alzate:"Spalle", alzate_cavi:"Spalle", alzate_panca:"Spalle", facepull:"Spalle", rear_cavi:"Spalle", reverse_fly:"Spalle", pushpress:"Spalle",
  pushdown:"Braccia", french:"Braccia", tri_over:"Braccia", curl:"Braccia", curl_incl:"Braccia", curl_cavi:"Braccia",
  polpacci:"Polpacci", polpacci_mono:"Polpacci", kb:"Glutei e femorali"
};
const MUSCLE_ORDER = ["Quadricipiti","Glutei e femorali","Petto","Schiena","Spalle","Braccia","Polpacci"];
const PLATES = [25,20,15,10,5,2.5,1.25,0.5];
const BAR_EQ = new Set(["bb","bbh","bbu"]);
const isEZ = ex => /\bEZ\b/.test(ex.name);
const GEAR_DEFAULT = {bar:20, ez:10};
const DAY_OF_WEEKDAY = {1:"lun", 3:"mer", 5:"ven"};
const ALL_EX = []; const EX_BY_ID = {};
for(const [d,day] of Object.entries(DAYS)) day.slots.forEach((sl,si)=>sl.opts.forEach(o=>{ const e={...o, day:d, role:sl.role, slot:si, strip:!!sl.strip}; ALL_EX.push(e); EX_BY_ID[o.id]=e; }));
// esercizi della vecchia scheda non più in programma: restano nello storico
for(const [id,name] of [["pushpress","Push press"],["kb","Kettlebell swing"]]) if(!EX_BY_ID[id]){ EX_BY_ID[id]={id,name,eq:"bb",role:"old",retired:true}; }

/* ===== Figure stilizzate: pose in angoli (0 = su, 90 = avanti/destra, 180 = giù, -90 = indietro/sinistra) ===== */
const FL = {T:28, TH:20, SH:20, UA:14, FA:13};
const GROUND = 84;
function fdir(a){ const r=a*Math.PI/180; return [Math.sin(r), -Math.cos(r)]; }
function fadd(p,a,l){ const d=fdir(a); return [p[0]+d[0]*l, p[1]+d[1]*l]; }
function fsolve(p){
  const th2 = p.th2 ?? p.th, sh2 = p.sh2 ?? p.sh;
  let hip;
  if(p.hip) hip = p.hip;
  else if(p.knee) hip = fadd(p.knee, p.th+180, FL.TH);
  else { const k = fadd(p.foot, p.sh+180, FL.SH); hip = fadd(k, p.th+180, FL.TH); }
  const neck = fadd(hip, p.t, FL.T), head = fadd(neck, p.t + (p.hd||0), 8.5), sho = fadd(hip, p.t, FL.T-3);
  const knee = fadd(hip, p.th, FL.TH), ank = fadd(knee, p.sh, FL.SH), toe = fadd(ank, p.ft ?? 90, 6);
  const knee2 = fadd(hip, th2, FL.TH), ank2 = fadd(knee2, sh2, FL.SH), toe2 = fadd(ank2, p.ft2 ?? p.ft ?? 90, 6);
  const elb = fadd(sho, p.ua, FL.UA), wr = fadd(elb, p.fa, FL.FA);
  const elb2 = fadd(sho, p.ua2 ?? p.ua, FL.UA), wr2 = fadd(elb2, p.fa2 ?? p.fa, FL.FA);
  return {hip, neck, head, sho, knee, ank, toe, knee2, ank2, toe2, elb, wr, elb2, wr2, arch:p.arch||0};
}
/* vista frontale: a = abduzione braccio (0 giù, 90 orizzontale), b = piega avambraccio */
function fsolveFront(p){
  const c=60, sL=[51,21], sR=[69,21], k=p.k ?? 1;   // k < 1 = braccia in avanti, accorciate dalla prospettiva
  const UA=FL.UA*k, FA=FL.FA*k;
  const eL=[sL[0]-UA*Math.sin(p.a*Math.PI/180), sL[1]+UA*Math.cos(p.a*Math.PI/180)];
  const eR=[sR[0]+UA*Math.sin(p.a*Math.PI/180), sR[1]+UA*Math.cos(p.a*Math.PI/180)];
  const fb=(p.a+(p.b||0))*Math.PI/180;
  const wL=[eL[0]-FA*Math.sin(fb), eL[1]+FA*Math.cos(fb)], wR=[eR[0]+FA*Math.sin(fb), eR[1]+FA*Math.cos(fb)];
  return {c, sL, sR, eL, eR, wL, wR};
}
const P = (pts)=>pts.map(q=>q.map(v=>v.toFixed(1)).join(",")).join(" ");
function fline(a,b,cls){ return `<line class="${cls}" x1="${a[0].toFixed(1)}" y1="${a[1].toFixed(1)}" x2="${b[0].toFixed(1)}" y2="${b[1].toFixed(1)}"/>`; }
function fequip(e, J){
  const at = e.at ? (J[e.at]) : null;
  switch(e.k){
    case "bar": { const r = e.r||6.5, cy = Math.min(at[1]+(e.dy||0), GROUND+0.5-r); // i dischi non scendono sotto il pavimento
      return `<circle class="fg-plate" cx="${at[0].toFixed(1)}" cy="${cy.toFixed(1)}" r="${r}"/><circle class="fg-hub" cx="${at[0].toFixed(1)}" cy="${cy.toFixed(1)}" r="1.4"/>`; }
    case "db": return `<rect class="fg-db" x="${(at[0]-3.2).toFixed(1)}" y="${(at[1]-3.2).toFixed(1)}" width="6.4" height="6.4" rx="1.6"/>`;
    case "kb": return `<circle class="fg-db" cx="${at[0].toFixed(1)}" cy="${(at[1]+(e.dy??4.5)).toFixed(1)}" r="4.2"/>`;
    case "wheel": return `<circle class="fg-plate" cx="${at[0].toFixed(1)}" cy="${(at[1]+1).toFixed(1)}" r="4.5"/>`;
    case "cable": { const a = e.from; return `<line class="fg-cable" x1="${a[0]}" y1="${a[1]}" x2="${at[0].toFixed(1)}" y2="${at[1].toFixed(1)}"/><circle class="fg-pulley" cx="${a[0]}" cy="${a[1]}" r="2.6"/>`; }
    case "band": { const a = e.fromJ ? J[e.fromJ] : e.from; return `<line class="fg-band" x1="${a[0].toFixed(1)}" y1="${a[1].toFixed(1)}" x2="${at[0].toFixed(1)}" y2="${at[1].toFixed(1)}"/>`; }
    case "mat": return `<rect class="fg-mat" x="${e.x}" y="${e.y}" width="${e.w}" height="${e.h}" rx="4"/>`;
    case "wall": return `<rect class="fg-wall" x="${e.x}" y="${e.y}" width="${e.w}" height="${e.h}"/>`;
    case "rect": return `<rect class="fg-furn" x="${e.x}" y="${e.y}" width="${e.w}" height="${e.h}" rx="1.5"/>`;
    case "poly": return `<polyline class="fg-furn-l" points="${P(e.pts)}"/>`;
    case "barH": return `<line class="fg-furn-l" x1="${e.x1}" y1="${e.y}" x2="${e.x2}" y2="${e.y}"/>`;
    default: return "";
  }
}
function fbody(J, far){
  let s = "";
  s += fline(J.hip,J.knee2,"fg-far")+fline(J.knee2,J.ank2,"fg-far")+fline(J.ank2,J.toe2,"fg-far");
  s += fline(J.sho,J.elb2,"fg-far")+fline(J.elb2,J.wr2,"fg-far");
  s += `<circle class="fg-hand-far" cx="${J.wr2[0].toFixed(1)}" cy="${J.wr2[1].toFixed(1)}" r="1.8"/>`;
  if(J.arch){ // schiena curva (cat-cow): curva quadratica, arch > 0 = schiena che scende
    const [hx,hy]=J.hip, [nx,ny]=J.neck, dx=nx-hx, dy=ny-hy, L=Math.hypot(dx,dy)||1;
    const cx=(hx+nx)/2 - dy/L*J.arch, cy=(hy+ny)/2 + dx/L*J.arch;
    s += `<path class="fg-body" d="M${hx.toFixed(1)} ${hy.toFixed(1)} Q${cx.toFixed(1)} ${cy.toFixed(1)} ${nx.toFixed(1)} ${ny.toFixed(1)}"/>`;
  } else s += fline(J.hip,J.neck,"fg-body");
  s += fline(J.hip,J.knee,"fg-limb")+fline(J.knee,J.ank,"fg-limb")+fline(J.ank,J.toe,"fg-limb");
  s += fline(J.sho,J.elb,"fg-limb")+fline(J.elb,J.wr,"fg-limb");
  s += `<circle class="fg-hand" cx="${J.wr[0].toFixed(1)}" cy="${J.wr[1].toFixed(1)}" r="2"/>`;
  s += `<circle class="fg-head" cx="${J.head[0].toFixed(1)}" cy="${J.head[1].toFixed(1)}" r="5.3"/>`;
  return s;
}
function fbodyFront(F, legs){
  let s = "";
  s += fline([F.c,17],[F.c,47],"fg-body");
  s += fline([F.c-9,21],[F.c+9,21],"fg-limb");
  s += fline([F.c-5,47],[F.c-7,GROUND],"fg-limb")+fline([F.c+5,47],[F.c+7,GROUND],"fg-limb")+fline([F.c-5,47],[F.c+5,47],"fg-limb");
  s += fline(F.sL,F.eL,"fg-limb")+fline(F.eL,F.wL,"fg-limb")+fline(F.sR,F.eR,"fg-limb")+fline(F.eR,F.wR,"fg-limb");
  s += `<circle class="fg-hand" cx="${F.wL[0].toFixed(1)}" cy="${F.wL[1].toFixed(1)}" r="2"/><circle class="fg-hand" cx="${F.wR[0].toFixed(1)}" cy="${F.wR[1].toFixed(1)}" r="2"/>`;
  s += `<circle class="fg-head" cx="${F.c}" cy="9.5" r="5.3"/>`;
  return s;
}
const lerp = (a,b,t)=>a+(b-a)*t;
function fmix(A,B,t){
  const o = {};
  for(const k of Object.keys(A)){
    const a=A[k], b=B[k] ?? a;
    if(typeof a==="number") o[k]=lerp(a,b,t);
    else if(Array.isArray(a)) o[k]=[lerp(a[0],b[0],t), lerp(a[1],b[1],t)];
    else o[k]=a;
  }
  return o;
}
/* Disegna la figura al tempo t (0 = posizione A, 1 = posizione B). bodyOnly: solo corpo e carico, per il fantasma */
const BACK_KINDS = new Set(["rect","poly","barH","cable","band","wall","mat"]);
function figJoints(fig, t){
  const pose = fmix(fig.A, fig.B || fig.A, t);
  if(fig.front){ const F = fsolveFront(pose); return {F, J:{wL:F.wL, wR:F.wR, sL:F.sL, sR:F.sR, eL:F.eL, eR:F.eR}}; }
  return {J: fsolve(pose)};
}
function figureFrame(fig, t, opt={}){
  const {F, J} = figJoints(fig, t);
  let back = "", front = "";
  for(const e of fig.eq||[]){
    if(e.at==="both"){ front += fequip({...e, at:"wL"}, J) + fequip({...e, at:"wR"}, J); continue; }
    if(BACK_KINDS.has(e.k)){ if(!opt.bodyOnly) back += fequip(e,J); }
    else front += fequip(e,J);
  }
  const body = F ? fbodyFront(F) : fbody(J);
  if(opt.bodyOnly) return body + front;
  const ground = fig.noGround ? "" : `<line class="fg-ground" x1="-80" y1="${GROUND+1.5}" x2="200" y2="${GROUND+1.5}"/>`;
  return `${ground}${back}${body}${front}`;
}
/* Inquadratura: ogni figura riempie il riquadro (4:3) con tutto il movimento dentro */
const FIT = {};
function fitBox(key){
  if(FIT[key]) return FIT[key];
  const f = FIG[key]; let x0=1e9, y0=1e9, x1=-1e9, y1=-1e9;
  const add = (x,y,r=0)=>{ x0=Math.min(x0,x-r); y0=Math.min(y0,y-r); x1=Math.max(x1,x+r); y1=Math.max(y1,y+r); };
  for(const t of [0,.25,.5,.75,1]){
    const {F, J} = figJoints(f, t);
    if(F){ [F.sL,F.sR,F.eL,F.eR,F.wL,F.wR].forEach(q=>add(q[0],q[1],3)); add(F.c,4); add(F.c-8,GROUND); add(F.c+8,GROUND); }
    else { for(const k of ["hip","neck","sho","knee","ank","toe","knee2","ank2","toe2","elb","wr","elb2","wr2"]) add(J[k][0], J[k][1], 2.5); add(J.head[0], J.head[1], 5.8); }
    for(const e of f.eq||[]){
      const at = e.at==="both" ? null : e.at && J[e.at];
      if(at && (e.k==="bar"||e.k==="wheel")) add(at[0], Math.min(at[1]+(e.dy||0), GROUND-(e.r||6.5)), (e.r||6.5)+1.5);
      if(at && (e.k==="db"||e.k==="kb")) add(at[0], at[1]+(e.k==="kb"?(e.dy??4.5):0), 5);
    }
  }
  for(const e of f.eq||[]){
    if(e.k==="rect"||e.k==="wall"||e.k==="mat"){ add(e.x,e.y); add(e.x+e.w,e.y+e.h); }
    if(e.k==="poly") e.pts.forEach(q=>add(q[0],q[1],2));
    if(e.k==="barH"){ add(e.x1,e.y,2); add(e.x2,e.y,2); }
    if(e.from) add(e.from[0], e.from[1], 3);
  }
  const pad = 5; x0-=pad; x1+=pad; y0-=pad;
  y1 = f.noGround ? y1+pad : Math.max(y1, GROUND+5);
  let w = Math.max(x1-x0, 60), h = Math.max(y1-y0, 45);
  if(w/h < 4/3) w = h*4/3; else h = w*3/4;
  const cx = (x0+x1)/2, vx = cx - w/2, vy = f.noGround ? (y0+y1)/2 - h/2 : y1 - h;
  return FIT[key] = `${vx.toFixed(1)} ${vy.toFixed(1)} ${w.toFixed(1)} ${h.toFixed(1)}`;
}
/* Traiettoria del carico (bilanciere, manubrio, maniglia): linea puntinata da A a B */
function pathSVG(f){
  const e = (f.eq||[]).find(q=>q.at && !BACK_KINDS.has(q.k)) || (f.eq||[]).find(q=>q.k==="cable");
  if(!e || !f.B) return "";
  const at = e.at==="both" ? "wR" : e.at, pts = [];
  for(let i=0;i<=12;i++){ const {J} = figJoints(f, i/12), q = J[at]; if(!q) return ""; pts.push([q[0], Math.min(q[1]+(e.k==="bar"?(e.dy||0):0), e.k==="bar"?GROUND+0.5-(e.r||6.5):1e9)]); }
  let len = 0; for(let i=1;i<pts.length;i++) len += Math.hypot(pts[i][0]-pts[i-1][0], pts[i][1]-pts[i-1][1]);
  return len > 6 ? `<polyline class="fg-path" points="${P(pts)}"/>` : "";
}

/* ===== Libreria pose ===== */
const BENCH_FLAT = [{k:"rect", x:18, y:58, w:62, h:4},{k:"rect", x:24, y:62, w:3, h:22},{k:"rect", x:72, y:62, w:3, h:22}];
const BENCH_INCL = [{k:"poly", pts:[[22,40],[52,62],[70,62]]},{k:"rect", x:50, y:62, w:3, h:22},{k:"rect", x:30, y:52, w:3, h:32}];
const STAND = {t:0, th:180, sh:180, ua:180, fa:180, foot:[60,GROUND]};
const S = o => ({...STAND, ...o});
const supine = (o)=>({t:-90, th:115, sh:172, hip:[62,54], ua:0, fa:0, ...o});
const inclineSeat = (o)=>({t:-52, th:92, sh:178, hip:[56,58], ua:0, fa:0, ...o});
const hipThrust = { A:{hip:[58,70], t:-54, th:75, sh:180, ua:126, fa:126}, B:{hip:[64,54], t:-90, th:118, sh:180, ua:90, fa:90} };
const hangA = {hip:[65,70], t:0, th:178, sh:186, ua:0, fa:0, th2:185, sh2:195};
const hangB = {hip:[63,42], t:4, th:172, sh:190, ua:172, fa:2, th2:178, sh2:198};
const PULL_BAR = {k:"barH", x1:40, x2:92, y:16};
const lunge = {A:{foot:[76,GROUND], t:4, th:162, sh:180, th2:210, sh2:215, ft2:160}, B:{foot:[76,GROUND], t:4, th:100, sh:192, th2:185, sh2:262, ft2:150}};
const bentRow = {A:{foot:[56,GROUND], t:68, th:158, sh:188, ua:180, fa:180}, B:{foot:[56,GROUND], t:68, th:158, sh:188, ua:232, fa:178}};
const seatedRow = {A:{hip:[40,64], t:18, th:82, sh:108, ft:20, ua:88, fa:90}, B:{hip:[40,64], t:-6, th:82, sh:108, ft:20, ua:205, fa:88}};
const ROW_SEAT = [{k:"rect", x:24, y:66, w:30, h:4},{k:"rect", x:36, y:70, w:3, h:14},{k:"rect", x:80, y:56, w:3, h:18}];
const latPull = {A:{hip:[46,58], t:-8, th:90, sh:178, ua:12, fa:12}, B:{hip:[46,58], t:-14, th:90, sh:178, ua:196, fa:16}};
const LAT_SEAT = [{k:"rect", x:34, y:62, w:24, h:4},{k:"rect", x:44, y:66, w:3, h:18},{k:"rect", x:62, y:52, w:10, h:4}];

const FIG = {
  squat:{A:S({t:6, ua:205, fa:25}), B:S({t:38, th:98, sh:205, ua:215, fa:32}), eq:[{k:"bar", at:"neck", dy:1}]},
  front_squat:{A:S({t:3, ua:100, fa:340}), B:S({t:20, th:96, sh:208, ua:110, fa:345}), eq:[{k:"bar", at:"wr"}]},
  goblet:{A:S({t:4, ua:165, fa:20}), B:S({t:22, th:96, sh:206, ua:170, fa:20}), eq:[{k:"kb", at:"wr", dy:0}]},
  split_bil:{A:{...lunge.A, ua:205, fa:25}, B:{...lunge.B, ua:205, fa:25}, eq:[{k:"bar", at:"neck", dy:1}]},
  affondi:{A:{...lunge.A, ua:180, fa:180}, B:{...lunge.B, ua:180, fa:180}, eq:[{k:"db", at:"wr"}]},
  bulgaro:{A:{foot:[78,GROUND], t:6, th:166, sh:180, th2:236, sh2:243, ft2:270, ua:180, fa:180},
           B:{foot:[78,GROUND], t:12, th:102, sh:195, th2:200, sh2:302, ft2:270, ua:180, fa:180},
           eq:[{k:"rect", x:20, y:64, w:24, h:4},{k:"rect", x:30, y:68, w:3, h:16},{k:"db", at:"wr"}]},
  stepup:{A:{foot:[76,66], t:10, th:112, sh:190, th2:182, sh2:183, ft2:140, ua:180, fa:180},
          B:{foot:[76,66], t:2, th:180, sh:180, th2:168, sh2:205, ft2:120, ua:180, fa:180},
          eq:[{k:"rect", x:64, y:66, w:26, h:18},{k:"db", at:"wr"}], scale:.85},
  panca:{A:supine({}), B:supine({ua:125, fa:8}), eq:[...BENCH_FLAT,{k:"bar", at:"wr"}]},
  panca_stretta:{A:supine({}), B:supine({ua:140, fa:5}), eq:[...BENCH_FLAT,{k:"bar", at:"wr"}]},
  french:{A:supine({ua:350, fa:350}), B:supine({ua:345, fa:248}), eq:[...BENCH_FLAT,{k:"bar", at:"wr", r:4.5}]},
  inclinata:{A:inclineSeat({}), B:inclineSeat({ua:138, fa:2}), eq:[...BENCH_INCL,{k:"db", at:"wr"}]},
  inclinata_bil:{A:inclineSeat({}), B:inclineSeat({ua:132, fa:4}), eq:[...BENCH_INCL,{k:"bar", at:"wr"}]},
  curl_incl:{A:inclineSeat({t:-35, ua:188, fa:188}), B:inclineSeat({t:-35, ua:188, fa:40}), eq:[...BENCH_INCL,{k:"db", at:"wr"}]},
  stacco:{A:{foot:[60,GROUND], t:74, th:100, sh:200, ua:182, fa:182}, B:S({}), eq:[{k:"bar", at:"wr", dy:3}]},
  rdl:{A:S({}), B:{foot:[60,GROUND], t:76, th:158, sh:184, ua:182, fa:182}, eq:[{k:"bar", at:"wr", dy:2}]},
  rdl_man:{A:S({}), B:{foot:[60,GROUND], t:76, th:158, sh:184, ua:182, fa:182}, eq:[{k:"db", at:"wr"}]},
  good_morning:{A:S({ua:205, fa:25}), B:{foot:[60,GROUND], t:72, th:162, sh:184, ua:250, fa:60}, eq:[{k:"bar", at:"neck", dy:1}]},
  military:{A:S({ua:150, fa:12}), B:S({ua:4, fa:2}), eq:[{k:"bar", at:"wr"}], scale:.8},
  hip:{...hipThrust, eq:[{k:"rect", x:14, y:56, w:24, h:4},{k:"rect", x:24, y:60, w:3, h:24},{k:"bar", at:"hip", dy:-4}]},
  hip_mono:{A:{...hipThrust.A, th2:60, sh2:72}, B:{...hipThrust.B, th2:88, sh2:92}, eq:[{k:"rect", x:14, y:56, w:24, h:4},{k:"rect", x:24, y:60, w:3, h:24},{k:"db", at:"hip"}]},
  pull_through:{A:{foot:[60,GROUND], t:72, th:158, sh:184, ua:196, fa:206}, B:S({ua:178, fa:170}), eq:[{k:"cable", from:[8,80], at:"wr"}]},
  pulley:{...seatedRow, eq:[...ROW_SEAT,{k:"cable", from:[100,66], at:"wr"}]},
  pulley_mono:{...seatedRow, eq:[...ROW_SEAT,{k:"cable", from:[100,66], at:"wr"}]},
  rematore_man:{...bentRow, eq:[{k:"db", at:"wr"}]},
  rematore_bil:{...bentRow, eq:[{k:"bar", at:"wr", dy:2}]},
  tbar:{...bentRow, eq:[{k:"band", from:[16,83], at:"wr"},{k:"bar", at:"wr", dy:2}]},
  row_petto:{A:{hip:[34,47], t:52, th:196, sh:180, ua:180, fa:180}, B:{hip:[34,47], t:52, th:196, sh:180, ua:222, fa:180},
             eq:[{k:"poly", pts:[[30,58],[62,32]]},{k:"rect", x:36, y:55, w:3, h:29},{k:"db", at:"wr"}]},
  lat:{...latPull, eq:[...LAT_SEAT,{k:"cable", from:[64,2], at:"wr"}]},
  lat_stretta:{...latPull, eq:[...LAT_SEAT,{k:"cable", from:[64,2], at:"wr"}]},
  trazioni:{A:hangA, B:hangB, eq:[PULL_BAR], noGround:true, scale:.82, anchorTop:true},
  knee_raise:{A:hangA, B:{...hangA, th:82, sh:182, th2:86, sh2:186}, eq:[PULL_BAR], noGround:true, scale:.82, anchorTop:true},
  curl:{A:S({ua:180, fa:180}), B:S({ua:174, fa:24}), eq:[{k:"bar", at:"wr", r:4.5}]},
  curl_cavi:{A:S({ua:180, fa:178}), B:S({ua:174, fa:24}), eq:[{k:"cable", from:[100,80], at:"wr"}]},
  pushdown:{A:S({t:10, ua:186, fa:40}), B:S({t:10, ua:186, fa:176}), eq:[{k:"cable", from:[86,4], at:"wr"}]},
  tri_over:{A:{...lunge.A, t:22, ua:20, fa:300}, B:{...lunge.A, t:22, ua:28, fa:30}, eq:[{k:"cable", from:[10,12], at:"wr"}]},
  facepull:{A:S({t:-6, ua:82, fa:86}), B:S({t:-6, ua:262, fa:8}), eq:[{k:"cable", from:[104,22], at:"wr"}]},
  alzate:{front:true, A:{a:8, b:0}, B:{a:86, b:4}, eq:[{k:"db", at:"both"}]},
  alzate_panca:{front:true, A:{a:8, b:0}, B:{a:84, b:4}, eq:[{k:"db", at:"both"}]},
  alzate_cavi:{front:true, A:{a:10, b:0}, B:{a:84, b:4}, eq:[{k:"cable", from:[104,82], at:"wL"},{k:"cable", from:[16,82], at:"wR"}]},
  rear_cavi:{front:true, A:{a:-28, b:0}, B:{a:88, b:0}, eq:[{k:"cable", from:[108,20], at:"wL"},{k:"cable", from:[12,20], at:"wR"}]},
  reverse_fly:{front:true, A:{a:4, b:0}, B:{a:82, b:0}, eq:[{k:"db", at:"both"}]},
  polpacci:{A:S({foot:[60,79], ft:60}), B:S({foot:[60,73], ft:120}), eq:[{k:"rect", x:62, y:76, w:28, h:8},{k:"db", at:"wr"}], scale:.86},
  polpacci_mono:{A:S({foot:[60,79], ft:60, th2:186, sh2:262}), B:S({foot:[60,73], ft:120, th2:186, sh2:262}), eq:[{k:"rect", x:62, y:76, w:28, h:8},{k:"db", at:"wr"}], scale:.86},
  /* core */
  dead_bug:{A:{hip:[66,80], t:-90, th:2, sh:90, ua:2, fa:2, ft:0}, B:{hip:[66,80], t:-90, th:78, sh:80, ua:-82, fa:-84, ft:0, th2:2, sh2:90, ua2:2, fa2:2}, eq:[]},
  side_plank:{A:{hip:[52,73], t:-76, th:106, sh:106, ft:180, ua:180, fa:90, ua2:6, fa2:4}, B:{hip:[52,68], t:-72, th:100, sh:100, ft:180, ua:180, fa:90, ua2:2, fa2:2}, eq:[]},
  pallof:{A:S({ua:160, fa:62}), B:S({ua:90, fa:90}), eq:[{k:"band", from:[10,40], at:"wr"}]},
  plank:{A:{hip:[53,75], t:-80, th:100, sh:100, ft:165, ua:180, fa:90}, B:{hip:[53,74], t:-80, th:100, sh:100, ft:165, ua:180, fa:90}, eq:[]},
  suitcase:{A:S({th:162, sh:176, th2:198, sh2:200, ft2:120}), B:S({th:198, sh:200, ft:120, th2:162, sh2:176, ft2:90}), eq:[{k:"db", at:"wr"}]},
  bird_dog:{A:{knee:[40,GROUND-1], th:180, sh:270, ft:270, t:82, ua:180, fa:180}, B:{knee:[40,GROUND-1], th:180, sh:270, ft:270, t:82, ua:84, fa:84, ua2:180, fa2:180, th2:268, sh2:268, ft2:268}, eq:[]},
  hollow:{A:{hip:[62,78], t:-102, th:98, sh:98, ft:100, ua:-98, fa:-98}, B:{hip:[62,77], t:-104, th:100, sh:100, ft:100, ua:-100, fa:-100}, eq:[]},
  rollout:{A:{knee:[36,GROUND-1], th:178, sh:270, ft:270, t:42, ua:158, fa:158}, B:{knee:[36,GROUND-1], th:118, sh:270, ft:270, t:78, ua:96, fa:96}, eq:[{k:"wheel", at:"wr"}]},
  plank_rkc:null
};
FIG.plank_rkc = FIG.plank;
// esercizi in cui da A a B il peso scende: quella fase va lenta
for(const k of ["squat","front_squat","goblet","split_bil","affondi","bulgaro","panca","panca_stretta","french","inclinata","inclinata_bil","rdl","rdl_man","good_morning"]) FIG[k].eccAB = true;

const VISIBLE = new Set();
const figIO = (()=>{ try{ return new IntersectionObserver(es=>es.forEach(e=>e.isIntersecting?VISIBLE.add(e.target):VISIBLE.delete(e.target))); }catch(e){ return null; } })();
function observeFigs(){ VISIBLE.clear(); if(!figIO) return; figIO.disconnect(); document.querySelectorAll("svg.fig[data-fig]").forEach(svg=>figIO.observe(svg)); }
const REDUCED = (()=>{ try{ return matchMedia("(prefers-reduced-motion: reduce)").matches; }catch(e){ return false; } })();
function figSVG(key, label){
  const f = FIG[key]; if(!f) return "";
  const ghost = f.B ? `<g class="fg-ghost">${figureFrame(f, 1, {bodyOnly:true})}</g>` : "";
  return `<svg class="fig" viewBox="${fitBox(key)}" data-fig="${key}" role="img" aria-label="Esempio di esecuzione: ${esc(label)}">${ghost}${pathSVG(f)}<g class="fg-live">${figureFrame(f,0)}</g></svg>`;
}
const videoURL = name => "https://www.youtube.com/results?search_query=" + encodeURIComponent(name + " esecuzione corretta");
/* Animazione: pausa in A → movimento → pausa in B → ritorno, 3,4 s per ciclo.
   La fase eccentrica (quella in cui il peso scende) dura 1,7 s, quella concentrica 1 s. */
(function animateFigures(){
  if(REDUCED) return;
  const ease = x => x<.5 ? 2*x*x : 1-Math.pow(-2*x+2,2)/2;
  let lastT = 0;
  function frame(now){
    requestAnimationFrame(frame);
    if(now - lastT < 33) return; lastT = now;
    const c = now % 3400, P_ = 350;
    const tFor = f => { const dAB = f.eccAB ? 1700 : 1000, dBA = 2700 - dAB;
      return c < P_ ? 0 : c < P_+dAB ? ease((c-P_)/dAB) : c < 2*P_+dAB ? 1 : 1-ease(Math.min(1,(c-2*P_-dAB)/dBA)); };
    const list = figIO ? VISIBLE : document.querySelectorAll("svg.fig[data-fig]");
    list.forEach(svg=>{ if(!svg.isConnected) return; const f = FIG[svg.dataset.fig], g = svg.querySelector(".fg-live"); if(f && f.B && g) g.innerHTML = figureFrame(f, tFor(f)); });
  }
  requestAnimationFrame(frame);
})();

/* ================= STATO ================= */
const state = {ath:"a", view:"lun", date:todayISO(), hist:[], plans:{}, db:null, forms:{}, pendingRender:false, exSel:"squat", swaps:{}, gear:{}, open:{}, dl:null};
try{
  const s=JSON.parse(localStorage.getItem("pav-ui")||"{}");
  if(s.ath) state.ath=s.ath; state.couple = !!s.couple; if(s.view) state.view=s.view; if(s.exSel) state.exSel=s.exSel;
  // il primo accesso di un giorno di allenamento apre la seduta di oggi
  const wd = new Date().getDay(); if(s.seen!==todayISO() && DAY_OF_WEEKDAY[wd]) state.view = DAY_OF_WEEKDAY[wd];
}catch(e){}
function persistUi(){ try{ localStorage.setItem("pav-ui", JSON.stringify({ath:state.ath, couple:!!state.couple, view:state.view, exSel:state.exSel, seen:todayISO()})); }catch(e){} }
persistUi();
try{ const g=JSON.parse(localStorage.getItem("pav-gear")||"{}"); if(g && typeof g==="object") state.gear=g; }catch(e){}
function gearOf(ath){ const g = state.gear[ath]||{}; return {bar:+g.bar>0?+g.bar:GEAR_DEFAULT.bar, ez:+g.ez>0?+g.ez:GEAR_DEFAULT.ez}; }

/* Bozza della seduta non ancora salvata: resta sul telefono se la pagina si ricarica */
const DRAFT_KEY = "pav-draft";
let drafts = {};
try{ drafts = JSON.parse(localStorage.getItem(DRAFT_KEY)||"{}")||{}; const old = Date.now()-4*864e5; for(const k in drafts) if(!(drafts[k]?.at>old)) delete drafts[k]; }catch(e){ drafts = {}; }
function saveDraft(key, f){
  if(f && f.touched) drafts[key] = {sets:f.sets, fb:f.fb, rpe:f.rpe, core:f.core, note:f.note, swaps:state.swaps[key]||{}, at:Date.now()};
  else delete drafts[key];
  try{ localStorage.setItem(DRAFT_KEY, JSON.stringify(drafts)); }catch(e){}
}

function todayISO(){ const d=new Date(); d.setMinutes(d.getMinutes()-d.getTimezoneOffset()); return d.toISOString().slice(0,10); }
const fmt = n => (Math.round(n*10)/10).toLocaleString("it-IT",{maximumFractionDigits:1});
const fmtDate = iso => new Date(iso+"T12:00:00").toLocaleDateString("it-IT",{day:"2-digit",month:"short"});
const fmtLong = iso => new Date(iso+"T12:00:00").toLocaleDateString("it-IT",{weekday:"long",day:"numeric",month:"long"});
const r1 = n => Math.round(n*10)/10;
const e1rm = (kg,reps) => kg*(1+reps/30);
const esc = s => String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const stepOf = (ex,ath) => (STEP[ex.eq]||STEP.bb)[ath];
const floorTo = (x,st) => Math.max(0, Math.floor(x/st+1e-9)*st);
const dayMs = 864e5;
// lunedì della settimana in giorni UTC: nessuno sfasamento al cambio dell'ora legale
function mondayOf(iso){ const t = Date.parse(iso.slice(0,10)+"T00:00:00Z"); return t - ((new Date(t).getUTCDay()+6)%7)*dayMs; }

/* ================= PERIODIZZAZIONE =================
   Blocchi da 5 settimane: 4 di carico progressivo (RIR 3 → 2 → 2 → 1) + 1 di scarico.
   Blocchi pari = Volume (rip alte), dispari = Carico (rip più basse). Gli accessori ruotano a ogni blocco. */
function planOf(ath){ const p=state.plans[ath]||{}; return {start:p.start||START_DEFAULT, early:new Set(p.early||[])}; }
function phaseAt(ath, iso){
  const {start, early} = planOf(ath);
  const before = Date.parse(iso+"T00:00:00Z") < mondayOf(start);
  const w = before ? 0 : Math.floor((mondayOf(iso)-mondayOf(start))/(7*dayMs)+1e-9);
  let b=0, wib=0;
  for(let i=0;i<w;i++){ if(wib===4 || early.has(i)){ b++; wib=0; } else wib++; }
  const deload = wib===4 || early.has(w);
  return {block:b, wib, weekAbs:w, deload, early:early.has(w), type:b%2===0?0:1, rir: deload?4:[3,2,2,1][wib], before, start};
}
const TYPE_NAME = ["Volume","Carico"];
function schemeFor(ex, ph){
  let [sets,min,max] = SCHEME[ex.role][ph.type];
  if(ph.deload) return {sets:2, min, max, rir:4};
  if(PLUS_SET.has(ex.role) && ph.wib>=2) sets++;
  return {sets, min, max, rir:ph.rir};
}
function exForSlot(slot, ph){ return slot.opts[ph.block % slot.opts.length]; }

/* ================= STORICO E CARICHI ================= */
function sessionsFor(exId, ath, beforeDate, includeDeload){
  return state.hist.filter(s=>s.athlete===ath && Array.isArray(s.entries?.[exId]) && s.entries[exId].length && (!beforeDate || s.date<beforeDate) && (includeDeload || !s.deload))
    .sort((x,y)=>y.date.localeCompare(x.date));
}
const topKg = sets => Math.max(...sets.map(s=>s.kg));
const bestE1 = sets => Math.max(...sets.map(s=>e1rm(s.kg,s.reps)));
const kgFromE1 = (e1, reps, rir) => e1/(1+(reps+rir)/30);

function refE1(exId, ath, beforeDate, depth=0){
  const ss = sessionsFor(exId, ath, beforeDate);
  if(ss.length) return bestE1(ss[0].entries[exId]);
  const ex = EX_BY_ID[exId]; if(!ex) return null;
  const bs = BASE[exId]; if(bs && bs[ath]>0) return bs[ath]*(1+(bs.r+2)/30);
  if(ex.est && depth<2){ const e = refE1(ex.est.from, ath, beforeDate, depth+1); return e ? e*ex.est.k : null; }
  return null;
}

/* Doppia progressione + feedback:
   tutte le serie al massimo → +1 step (+2 se "facile"); dentro il range → +1 rip;
   sotto il minimo → stesso peso (−1 step se "al limite"); due sedute di fila sotto il minimo → −10%.
   Cambio di schema (nuovo blocco) → carico ricalcolato dal massimale stimato e dal RIR della settimana. */
function suggest(ex, ath, date, sc){
  const st = stepOf(ex, ath), ss = sessionsFor(ex.id, ath, date);
  const fromE1 = (e1, why, kind) => ({kg:floorTo(kgFromE1(e1, sc.min, sc.rir), st), reps:sc.min, kind, why});
  if(sc.rir===4){
    const e = refE1(ex.id, ath, date);
    if(!e) return {kg:null, reps:sc.min, kind:"find", why:"Settimana di scarico: peso comodo, tecnica pulita"};
    const lastKg = ss.length ? topKg(ss[0].entries[ex.id]) : floorTo(kgFromE1(e, sc.min, 2), st);
    return {kg:floorTo(lastKg*0.9, st), reps:sc.min, kind:"deload", why:"Scarico: −10% e solo 2 serie"};
  }
  if(!ss.length){
    const e = refE1(ex.id, ath, date);
    if(!e && ex.eq==="bw") return {kg:0, reps:sc.min, kind:"start", why:"Corpo libero: aggiungi zavorra quando chiudi tutte le serie al massimo"};
    if(!e) return {kg:null, reps:sc.min, kind:"find", why:`Nuovo: trova un peso che ti lasci ${sc.rir} rip in riserva`};
    return fromE1(e, BASE[ex.id] ? "Dal peso attuale della scheda" : "Stimato da un esercizio simile", "start");
  }
  const last = ss[0], sets = last.entries[ex.id], W = topKg(sets), fb = last.fb?.[ex.id];
  const prevSc = last.scheme?.[ex.id];
  if(!prevSc || prevSc.min!==sc.min || prevSc.max!==sc.max) return fromE1(bestE1(sets), "Nuovo range di rip: ricalcolato dal massimale stimato", "start");
  const allTop = sets.length>=prevSc.sets && sets.every(s=>s.reps>=sc.max);
  const anyLow = sets.some(s=>s.reps<sc.min);
  if(allTop){ const inc = fb==="facile" ? 2*st : st; return {kg:r1(W+inc), reps:sc.min, kind:"up", why:`Tutte le serie a ${sc.max} rip${fb==="facile"?" e facile":""}: +${fmt(inc)} kg`}; }
  if(anyLow){
    const prev = ss[1]; const pSets = prev?.entries[ex.id];
    if(pSets && topKg(pSets)===W && pSets.some(s=>s.reps<sc.min)) return {kg:floorTo(W*0.9, st), reps:sc.min, kind:"down", why:"Due sedute sotto il minimo: −10%"};
    if(fb==="limite") return {kg:r1(Math.max(0,W-st)), reps:sc.min, kind:"down", why:`Sotto ${sc.min} rip e al limite: −${fmt(st)} kg`};
    return {kg:W, reps:sc.min, kind:"hold", why:`Sotto ${sc.min} rip: ripeti lo stesso peso`};
  }
  const minR = Math.min(...sets.map(s=>s.reps));
  const target = fb==="limite" ? minR : Math.min(sc.max, minR+1);
  return {kg:W, reps:target, kind:"hold", why: fb==="limite" ? `Era al limite: consolida ${target} rip` : `Stesso peso, punta a ${target} rip su ogni serie`};
}
function stripPlan(ex, ath, kg){ const st=stepOf(ex,ath); return [kg, r1(Math.max(st,floorTo(kg*0.75,st))), r1(Math.max(st,floorTo(kg*0.5,st)))]; }

/* Il coach propone lo scarico anticipato se la fatica resta alta */
function fatigueAlert(ath, ph){
  if(ph.deload || ph.wib<1 || ph.before) return null;
  const rs = state.hist.filter(s=>s.athlete===ath && !s.deload && typeof s.rpe==="number").sort((x,y)=>y.date.localeCompare(x.date)).slice(0,3);
  if(rs.length<2) return null;
  const lastTwoHigh = rs[0].rpe>=9 && rs[1].rpe>=9;
  const avg3 = rs.length===3 ? rs.reduce((a,s)=>a+s.rpe,0)/3 : 0;
  if(lastTwoHigh) return "Ultime due sedute a RPE 9 o più.";
  if(avg3>=8.5) return `Fatica media delle ultime tre sedute: RPE ${fmt(avg3)}.`;
  return null;
}

/* ================= FORM ================= */
const docId = (ath,day,date) => `${ath}_${date}_${day}`;
function formKey(){ return `${state.ath}|${state.view}|${state.date}`; }
const savedDoc = () => state.hist.find(s=>s.id===docId(state.ath,state.view,state.date));
/* Cambio esercizio per la sola seduta (macchina occupata): sceglie tra le alternative dello stesso slot */
function swapsFor(key){ return state.swaps[key] || (key===formKey() ? savedDoc()?.swaps : null) || {}; }
function currentPlanDay(){
  const ph = phaseAt(state.ath, state.date), day = DAYS[state.view], sw = swapsFor(formKey());
  const items = day.slots.map((sl,si)=>{
    const def = exForSlot(sl, ph), pick = sw[si] && sl.opts.find(o=>o.id===sw[si]);
    const ex = EX_BY_ID[(pick||def).id];
    return {ex, sc:schemeFor(ex, ph), slot:sl, si, def:EX_BY_ID[def.id]};
  });
  return {ph, day, items};
}
function freshSets(ex, sc){ const sg = suggest(ex, state.ath, state.date, sc); return Array.from({length:sc.sets},()=>({kg:sg.kg==null?"":String(sg.kg), reps:""})); }
function ensureSets(f){ for(const {ex, sc} of currentPlanDay().items) if(!f.sets[ex.id]) f.sets[ex.id] = freshSets(ex, sc); }
function getForm(){
  const key = formKey(); let f = state.forms[key];
  if(f && f.touched) return f;
  const saved = savedDoc(), dr = drafts[key];
  if(!f && dr && (!saved || dr.at > Date.parse(saved.savedAt||0))){
    state.swaps[key] = dr.swaps||{};
    f = {touched:true, restored:true, saved:!!saved, sets:dr.sets||{}, fb:dr.fb||{}, rpe:dr.rpe ?? null, core:dr.core ?? null, note:dr.note||""};
    state.forms[key] = f; ensureSets(f); return f;
  }
  const {items} = currentPlanDay();
  const sets = {}, fb = {...(saved?.fb||{})};
  for(const {ex, sc} of items){
    if(saved && saved.entries?.[ex.id]){
      const arr = saved.entries[ex.id].map(s=>({kg:String(s.kg), reps:String(s.reps)}));
      while(arr.length<sc.sets) arr.push({kg:arr.at(-1)?.kg||"", reps:""});
      sets[ex.id]=arr;
    } else sets[ex.id] = freshSets(ex, sc);
  }
  f = {touched:false, saved:!!saved, sets, fb, rpe:saved?.rpe ?? null, core:saved?.coreRounds ?? null, note:saved?.note||""}; state.forms[key]=f; return f;
}

/* ===== Dischi, avvicinamento, record ===== */
function barOf(ex, ath){ const g = gearOf(ath); return isEZ(ex) ? g.ez : g.bar; }
function platesFor(ex, ath, kg){
  if(!BAR_EQ.has(ex.eq) || ex.id==="tbar" || !(kg>0)) return null;
  const bar = barOf(ex, ath);
  if(kg < bar) return {bar, under:true, list:[]};
  let rem = Math.round((kg-bar)*50); const list = [];   // centesimi di kg per lato
  for(const pl of PLATES){ const c = Math.round(pl*100); while(rem >= c - 1){ list.push(pl); rem -= c; } }
  return {bar, list, approx: rem > 1};
}
function platesHTML(ex, ath, kg){
  const p = platesFor(ex, ath, kg); if(!p) return "";
  if(p.under) return `<div class="plates">Sotto il peso del bilanciere (${fmt(p.bar)} kg)</div>`;
  const ez = isEZ(ex) ? "EZ " : "";
  return `<div class="plates">Per lato:${p.list.length ? p.list.map(x=>`<span class="pl">${x.toLocaleString("it-IT",{maximumFractionDigits:2})}</span>`).join("") : " solo bilanciere"}<span>· ${ez}bilanciere ${fmt(p.bar)} kg${p.approx?" · arrotondato":""}</span></div>`;
}
function warmupSets(ex, ath, kg){
  if(!(kg>0)) return [];
  const st = stepOf(ex, ath), bar = BAR_EQ.has(ex.eq) ? barOf(ex, ath) : 0, out = [];
  for(const [pct, reps] of [[0,10],[.5,5],[.7,3],[.85,1]]){
    let w = pct===0 ? bar : Math.max(bar, floorTo(kg*pct, st));
    if(!w || w >= kg || (out.length && w <= out.at(-1).kg)) continue;
    out.push({kg:w, reps});
  }
  return out;
}
function bestBefore(exId, ath, excludeId){
  const ss = state.hist.filter(s=>s.athlete===ath && s.id!==excludeId && Array.isArray(s.entries?.[exId]) && s.entries[exId].length);
  return ss.length ? Math.max(...ss.map(s=>bestE1(s.entries[exId]))) : null;
}
function formSets(f, exId){ return (f.sets[exId]||[]).map(s=>({kg:parseFloat(s.kg), reps:parseInt(s.reps,10)})).filter(s=>!isNaN(s.kg) && !isNaN(s.reps) && s.reps>0); }
function prCheck(exId, ath=state.ath){
  const el = document.getElementById(`pr-${ath}-${exId}`); if(!el) return;
  const f = withAth(ath, ()=>getForm()), cur = formSets(f, exId), prev = bestBefore(exId, ath, docId(ath,state.view,state.date));
  const e = cur.length ? bestE1(cur) : 0;
  if(prev && e > prev + 0.05){ el.hidden = false; el.textContent = `★ Record stimato: ${fmt(e)} kg (prima ${fmt(prev)} kg)`; }
  else el.hidden = true;
}
const mmss = sec => `${Math.floor(sec/60)}:${String(Math.max(0,sec)%60).padStart(2,"0")}`;

/* ================= RENDER ================= */
const main = document.getElementById("main");
const $ = id => document.getElementById(id);
function render(){
  document.querySelectorAll(".seg button[data-ath='a'], .seg button[data-ath='v']").forEach(b=>{ b.textContent = SHORT[b.dataset.ath]; });
  document.querySelectorAll(".seg button").forEach(b=>b.setAttribute("aria-pressed", String(b.dataset.ath==="both" ? !!state.couple : !state.couple && b.dataset.ath===state.ath)));
  const wk = mondayOf(state.view==="prog" ? todayISO() : state.date);
  document.querySelectorAll(".tabs button").forEach(b=>{
    b.setAttribute("aria-selected", String(b.dataset.view===state.view));
    if(!b.dataset.label) b.dataset.label = b.textContent;
    const done = b.dataset.view!=="prog" && state.hist.some(s=>s.athlete===state.ath && s.day===b.dataset.view && mondayOf(s.date)===wk);
    b.innerHTML = esc(b.dataset.label) + (done ? `<span class="dot" title="Fatta questa settimana"></span>` : "");
  });
  document.getElementById("savebar").hidden = state.view==="prog";
  if(state.view==="prog") renderProg(); else renderDay();
  observeFigs();
}

function phaseHTML(ph){
  const segs = [0,1,2,3,4].map(i=>{
    const isDl = i===4; let cls = "wk"+(isDl?" dl":"");
    if(ph.deload){ if(isDl) cls+=" now"; else if(i < (ph.early ? ph.wib : 4)) cls+=" done"; }
    else { if(i<ph.wib) cls+=" done"; if(i===ph.wib) cls+=" now"; }
    return `<span class="${cls}">${isDl?"Scarico":"Sett. "+(i+1)}</span>`;
  }).join("");
  const title = ph.deload ? `Blocco ${ph.block+1} · <em>Scarico</em>${ph.early?" anticipato":""}` : `Blocco ${ph.block+1} · <em>${TYPE_NAME[ph.type]}</em>`;
  const sub = ph.deload ? "RIR 4 · recupero attivo" : `Settimana ${ph.wib+1} di 4 · RIR ${ph.rir}`;
  const hint = ph.before ? `Il programma parte ${fmtLong(ph.start)}. Le sedute di prima contano come settimana 1.` :
    ph.deload ? "Meno serie e peso ridotto: muscoli e articolazioni recuperano, la settimana dopo riparte un blocco nuovo." :
    `RIR ${ph.rir} = chiudi ogni serie con circa ${ph.rir} ripetizion${ph.rir===1?"e":"i"} ancora in serbatoio.` + (ph.wib>=2?" Questa settimana +1 serie sugli accessori.":"");
  return `<section class="phase" aria-label="Fase del programma"><div class="phase-top"><span class="t">${title}</span><span class="s">${sub}</span></div><div class="weeks">${segs}</div><div class="hint">${hint}</div></section>`;
}

/* ===== Modalità coppia =====
   Con "Insieme" ogni esercizio mostra una corsia per ciascuna delle due persone: carico, dischi e serie di entrambi,
   senza cambiare schermata. Il salvataggio registra due sedute, una per persona. */
const OTHER = {a:"v", v:"a"};
function withAth(a, fn){ const p = state.ath; state.ath = a; try{ return fn(); } finally{ state.ath = p; } }
function athletesNow(){ return state.couple && state.view!=="prog" ? [state.ath, OTHER[state.ath]] : [state.ath]; }

function renderDay(){
  const aths = athletesNow(), couple = aths.length > 1, ath = state.ath;
  const plans = Object.fromEntries(aths.map(a => [a, withAth(a, () => currentPlanDay())]));
  const forms = Object.fromEntries(aths.map(a => [a, withAth(a, () => getForm())]));
  const {ph, day, items} = plans[ath];
  let h = "";
  for(const a of aths){
    const alert = fatigueAlert(a, plans[a].ph);
    if(alert) h += `<div class="coach" role="status"><b>Il coach consiglia uno scarico${couple?" a "+SHORT[a]:""}</b><span>${esc(alert)} Anticipare lo scarico a questa settimana fa recuperare prima di riprendere a salire. Il blocco successivo parte la settimana dopo.</span><button class="earlyBtn" data-early="${a}">Anticipa lo scarico</button></div>`;
  }
  h += phaseHTML(ph);
  const who = couple ? `${SHORT[aths[0]]} e ${SHORT[aths[1]]}` : ATH[ath];
  const f0 = forms[ath];
  const badge = aths.some(a => forms[a].restored) ? `<span class="badge" style="color:var(--warn);background:var(--warn-soft)">Bozza ripresa</span>` :
    aths.every(a => forms[a].saved && !forms[a].touched) ? `<span class="badge">✓ Salvata</span>` : "";
  h += `<div class="dayhead"><h2><small>${esc(day.name)} · ${who}</small>${day.label}</h2>
    <div class="row-actions">${badge}<label class="field">Data seduta<input type="date" id="sessDate" value="${state.date}"></label></div></div>
    <div class="live" id="live-stats" aria-live="polite"></div><div class="list">`;
  items.forEach((it, idx) => {
    const {ex, sc, slot, si, def} = it;
    const isMain = ex.role.startsWith("main")||ex.role==="hinge";
    const unit = ex.eq==="db"?"kg per manubrio · ":ex.eq==="bw"?"kg di zavorra, 0 = corpo libero · ":ex.eq==="kb"?"kettlebell · ":"";
    const isNew = aths.every(a => !sessionsFor(ex.id, a, null, true).length) && !BASE[ex.id];
    h += `<section class="ex${isMain?" ex-main":""}" aria-label="${esc(ex.name)}">
      <div class="ex-head">
        <div class="fig-tile">${figSVG(ex.id, ex.name)}<a class="vid" href="${videoURL(ex.name)}" target="_blank" rel="noopener">Video ↗</a></div>
        <div class="ex-info">
          <div class="ex-name"><span class="role${isMain?" main":""}">${ROLE_LABEL[ex.role]}</span>${isNew?`<span class="new">Nuovo</span>`:""}<span class="nm">${esc(ex.name)}</span><span class="sub">${unit}${couple?"":"step "+fmt(stepOf(ex,ath))+" kg"}</span></div>
          <div class="scheme">${sc.sets} × ${sc.min}${sc.max!==sc.min?"-"+sc.max:""}<small>RIR ${sc.rir}</small></div>
          ${couple ? "" : (sg => `<div class="sugg"><span class="load num">${sg.kg==null?"—":fmt(sg.kg)} <small>kg × ${sg.reps}</small></span></div>`)(suggest(ex, ath, state.date, sc))}
          <div class="meta"><span class="pill">Recupero ${mmss(REST[ex.role]||90)}</span></div>
        </div>
      </div>
      ${slot.opts.length>1 ? `<label class="swap">Macchina occupata?<select id="swap-${si}" data-swap="${si}">${slot.opts.map(o=>`<option value="${o.id}"${o.id===ex.id?" selected":""}>${esc(o.name)}${o.id===def.id?" · in programma":""}</option>`).join("")}</select></label>` : ""}`;
    for(const a of aths){
      const pIt = plans[a].items[idx];
      h += laneHTML(a, pIt.ex, pIt.sc, plans[a].ph, forms[a], couple, pIt.ex.id !== ex.id);
    }
    h += `</section>`;
  });

  const co = CORE[state.view], cr = coreRounds(ph);
  const coreVal = aths.every(a => forms[a].core === forms[ath].core) ? forms[ath].core : null;
  h += `<section class="block" aria-label="Circuito core"><div class="block-top"><span class="ttl">Circuito core · ${cr} ${cr===1?"giro":"giri"}<small>${esc(co.name)}. Esercizi in fila senza pausa, 60 s di recupero tra un giro e l'altro.</small></span><span class="optional">Opzionale</span></div>
    <ol class="drills core-list">${co.ex.map(d=>`<li><span class="core-fig">${figSVG(d.fig, d.n)}</span><span class="core-txt"><span class="dn">${esc(d.n)}</span><span class="dd">${esc(d.d)}</span><span class="dc">${esc(d.c)}</span></span></li>`).join("")}</ol>
    <div class="donerow"><span class="q">Giri fatti</span>${[0,1,2,3].map(v=>`<button data-core="${v}" aria-pressed="${coreVal===v}">${v}</button>`).join("")}</div></section>`;
  h += `<section class="ex" aria-label="Fatica della seduta"><div class="ex-name">Fatica della seduta<span class="sub">RPE da 5 a 10: quanto è stata dura nel complesso</span></div>`;
  for(const a of aths){
    h += `<div class="rpe" role="group" aria-label="RPE ${ATH[a]}">${couple?`<span class="lane-who">${SHORT[a]}</span>`:""}`;
    for(let v=5; v<=10; v++) h += `<button data-rpe="${v}" data-ath="${a}" aria-pressed="${forms[a].rpe===v}">${v}</button>`;
    h += `</div>`;
  }
  h += `<div class="rpe-legend">5-6 facile · 7-8 impegnativa ma gestibile · 9 molto dura · 10 al massimo</div></section>`;
  h += `<section class="ex" aria-label="Note"><div class="ex-name">Note della seduta<span class="sub">Dolori, macchine occupate, sensazioni: le ritrovi la prossima volta</span></div>`;
  for(const a of aths){
    const lastNote = state.hist.filter(s=>s.athlete===a && s.day===state.view && s.date<state.date && s.note).sort((x,y)=>y.date.localeCompare(x.date))[0];
    h += `${couple?`<span class="lane-who">${SHORT[a]}</span>`:""}${lastNote?`<div class="last">Nota del ${fmtDate(lastNote.date)}: ${esc(lastNote.note)}</div>`:""}
      <textarea id="note-${a}" class="note" data-note="1" data-ath="${a}" aria-label="Note di ${ATH[a]}" placeholder="Es. spalla destra un po' rigida sulla panca">${esc(forms[a].note||"")}</textarea>`;
  }
  h += `</section></div>`;
  h += `<div class="panel rule" style="margin-top:14px">
    <b>Come ragiona il coach</b><ul>
    <li>Blocchi da 5 settimane: 4 di progressione, con il RIR che scende da 3 a 1, poi una di scarico.</li>
    <li>Si alternano blocchi <b>Volume</b> (più ripetizioni) e <b>Carico</b> (meno ripetizioni, più peso).</li>
    <li>Squat, panca, stacco e military restano fissi. I complementari e gli accessori cambiano a ogni blocco.</li></ul>
    <b>Carichi</b><ul>
    <li>Tutte le serie al massimo delle ripetizioni: sale di uno step, due se l'hai segnato facile.</li>
    <li>Dentro il range: stesso peso, una ripetizione in più.</li>
    <li>Sotto il minimo: ripeti il peso. Se eri al limite scende di uno step; due sedute di fila sotto il minimo, −10%.</li>
    <li>Quando cambia il range di ripetizioni, il peso si ricalcola dal massimale stimato.</li></ul>
    <b>Riscaldamento e core</b><ul>
    <li>Prima dei fondamentali: 5 minuti di cardio leggero (bici o vogatore), poi le serie di avvicinamento. Stretching e mobilità si fanno nel weekend, con l'app Mobilità A&amp;V.</li>
    <li>Il circuito core è opzionale: 2 giri a inizio programma, 3 da metà del primo blocco, 1 in scarico.</li></ul>
    <b>Scarico anticipato</b><ul><li>Se la fatica della seduta resta a 9-10, il coach propone di anticipare lo scarico.</li></ul>
    <b>In sala</b><ul>
    <li>Tocca ✓ a fine serie: se il campo è vuoto scrive le ripetizioni previste e il peso della serie prima.</li>
    <li>Sui fondamentali trovi le serie di avvicinamento e, per il bilanciere, i dischi da mettere per lato.</li>
    <li>Con <b>Insieme</b> vedi le serie di entrambi in ogni esercizio: un solo salvataggio registra due sedute.</li>
    <li>Quello che scrivi resta salvato sul telefono come bozza finché non salvi la seduta.</li></ul>
    ${aths.map(a => `<details class="more" id="gearDetails-${a}"${state.open["gearDetails-"+a]?" open":""}><summary>Attrezzatura di ${ATH[a]}</summary>
      <div class="gear"><label class="field">Bilanciere (kg)<input type="number" inputmode="decimal" step="0.5" min="1" id="gearBar-${a}" data-gear="bar" data-ath="${a}" value="${gearOf(a).bar}"></label>
      <label class="field">Bilanciere EZ (kg)<input type="number" inputmode="decimal" step="0.5" min="1" id="gearEz-${a}" data-gear="ez" data-ath="${a}" value="${gearOf(a).ez}"></label></div>
      <div class="small" style="margin-top:6px">Serve per il calcolo dei dischi e delle serie di avvicinamento.</div></details>`).join("")}</div>`;
  main.innerHTML = h;
  const d = document.getElementById("sessDate");
  d.addEventListener("change", ()=>{ if(d.value){ state.date=d.value; render(); } });
  main.querySelectorAll(".earlyBtn").forEach(b => b.addEventListener("click", () => withAth(b.dataset.early, () => earlyDeload(phaseAt(b.dataset.early, state.date)))));
  for(const a of aths) for(const it of plans[a].items) prCheck(it.ex.id, a);
  updateSaveBar();
}

/* Una corsia: carico suggerito, dischi, avvicinamento, ultima volta e serie di una persona */
function laneHTML(ath, ex, sc, ph, f, couple, differs){
  const sg = suggest(ex, ath, state.date, sc);
  const prev = sessionsFor(ex.id, ath, state.date, true)[0];
  const isMain = ex.role.startsWith("main")||ex.role==="hinge";
  const arrow = {up:"↑", hold:"=", down:"↓", start:"•", find:"?", deload:"↓"}[sg.kind];
  let h = `<div class="lane${couple?" lane-"+ath:""}">`;
  if(couple) h += `<div class="lane-top"><span class="lane-who">${SHORT[ath]}</span><span class="load num">${sg.kg==null?"—":fmt(sg.kg)} <small>kg × ${sg.reps}</small></span><span class="small">step ${fmt(stepOf(ex,ath))} kg</span></div>${differs?`<div class="small">Fa: <b>${esc(ex.name)}</b> · ${sc.sets} × ${sc.min}${sc.max!==sc.min?"-"+sc.max:""}</div>`:""}`;
  h += `<span class="chip ${sg.kind}">${arrow} ${esc(sg.why)}</span>
    ${sg.kg ? platesHTML(ex, ath, sg.kg) : ""}
    ${isMain && sg.kg ? (ws=>ws.length?`<div class="warmsets"><span>Avvicinamento</span>${ws.map(w=>`<span class="ws">${fmt(w.kg)}×${w.reps}</span>`).join("")}</div>`:"")(warmupSets(ex, ath, sg.kg)) : ""}
    <div class="last">${prev ? `Ultima (${fmtDate(prev.date)}${prev.deload?", scarico":""}): <b class="num">${fmt(topKg(prev.entries[ex.id]))} kg</b> · rip ${prev.entries[ex.id].map(s=>s.reps).join(" / ")}${prev.fb?.[ex.id]?` · ${prev.fb[ex.id]==="limite"?"al limite":prev.fb[ex.id]}`:""}` : (sg.kind==="find" ? "Prima volta: parti leggero, sali serie dopo serie finché resti a RIR " + sc.rir + "." : "Nessuna seduta registrata con questo esercizio.")}</div>
    <div class="sets" role="table" aria-label="Serie di ${esc(ex.name)}${couple?" · "+SHORT[ath]:""}">
      <div class="sethead" role="row"><span>#</span><span>Precedente</span><span>${ex.eq==="db"?"kg/man.":"kg"}</span><span>Rip</span><span aria-hidden="true">✓</span></div>`;
  const prevSets = prev ? prev.entries[ex.id] : [];
  f.sets[ex.id].forEach((s,i)=>{
    const rp = parseInt(s.reps,10); const cls = isNaN(rp)?"":(rp>=sc.max?"hit":(rp<sc.min?"miss":""));
    const who = couple ? SHORT[ath]+" " : "";
    const ps = prevSets[i];
    h += `<div class="setrow${s.reps!==""?" done":""}" role="row"><span class="lbl">${i+1}</span>
      ${ps ? `<button class="prev" type="button" data-ath="${ath}" data-prev="${ex.id}" data-i="${i}" data-kg="${ps.kg}" data-reps="${ps.reps}" aria-label="${who}copia la volta scorsa: ${fmt(ps.kg)} kg per ${ps.reps}">${fmt(ps.kg)}×${ps.reps}</button>` : `<span class="prev none">—</span>`}
      <input id="kg-${ath}-${ex.id}-${i}" data-ath="${ath}" data-ex="${ex.id}" data-i="${i}" data-f="kg" type="number" inputmode="decimal" step="0.1" min="0" value="${esc(s.kg)}" placeholder="kg" aria-label="${who}${esc(ex.name)} serie ${i+1} kg">
      <input id="rp-${ath}-${ex.id}-${i}" class="${cls}" data-ath="${ath}" data-ex="${ex.id}" data-i="${i}" data-f="reps" data-min="${sc.min}" data-max="${sc.max}" type="number" inputmode="numeric" step="1" min="0" value="${esc(s.reps)}" placeholder="${sg.reps}" aria-label="${who}${esc(ex.name)} serie ${i+1} ripetizioni">
      <button class="ok" id="ok-${ath}-${ex.id}-${i}" data-ath="${ath}" data-ok="${ex.id}" data-i="${i}" data-target="${sg.reps}" aria-pressed="${s.reps!==""}" aria-label="${who}serie ${i+1} fatta come previsto">✓</button></div>`;
  });
  h += `</div><div class="pr" id="pr-${ath}-${ex.id}" hidden></div><div class="fb" role="group" aria-label="Com'è andata ${esc(ex.name)}${couple?" a "+SHORT[ath]:""}"><span class="q">Com'è andata?</span>`;
  for(const [v,l] of [["facile","Facile"],["giusto","Giusto"],["limite","Al limite"]]) h += `<button data-ath="${ath}" data-fbex="${ex.id}" data-v="${v}" aria-pressed="${f.fb[ex.id]===v}">${l}</button>`;
  h += `</div>`;
  if(ex.strip && !ph.deload && ph.wib>=2 && sg.kg){
    const [a,b,c] = stripPlan(ex, ath, sg.kg);
    h += `<div class="strip"><b>Stripping</b> · solo ultima serie: ${fmt(a)} kg a cedimento → ${fmt(b)} kg → ${fmt(c)} kg fino a cedimento, senza pausa.</div>`;
  }
  return h + `</div>`;
}

function repsClass(t){ const rp=parseInt(t.value,10); t.className = isNaN(rp)?"":(rp>=+t.dataset.max?"hit":(rp<+t.dataset.min?"miss":"")); }
main.addEventListener("input", e=>{
  const t = e.target, a = t.dataset.ath || state.ath;
  if(t.dataset.note){ withAth(a, ()=>{ const f = getForm(); f.touched = true; f.note = t.value; saveDraft(formKey(), f); }); return; }
  if(!t.dataset.ex) return;
  withAth(a, ()=>{
    const f = getForm(); f.touched = true;
    f.sets[t.dataset.ex][+t.dataset.i][t.dataset.f] = t.value;
    if(t.dataset.f==="reps"){ repsClass(t); const ok = document.getElementById(`ok-${a}-${t.dataset.ex}-${t.dataset.i}`); if(ok) ok.setAttribute("aria-pressed", String(t.value!=="")); t.closest(".setrow")?.classList.toggle("done", t.value!==""); }
    saveDraft(formKey(), f);
  });
  prCheck(t.dataset.ex, a); updateSaveBar();
});
main.addEventListener("change", e=>{
  const t = e.target;
  if(t.dataset.swap!==undefined){
    for(const a of athletesNow()) withAth(a, ()=>{
      const key = formKey(), f = getForm(); f.touched = true;
      state.swaps[key] = {...swapsFor(key), [t.dataset.swap]: t.value};
      ensureSets(f); saveDraft(key, f);
    });
    render();
  }
  if(t.dataset.gear) withAth(t.dataset.ath || state.ath, ()=>saveGear(t.dataset.gear, parseFloat(t.value)));
});
main.addEventListener("toggle", e=>{ if(e.target.id) state.open[e.target.id] = e.target.open; }, true);
main.addEventListener("click", e=>{
  const b = e.target.closest("button"); if(!b) return;
  const a = b.dataset.ath || state.ath;
  if(b.dataset.ok){
    withAth(a, ()=>{
      const f = getForm(), exId = b.dataset.ok, i = +b.dataset.i, set = f.sets[exId][i];
      const kgIn = document.getElementById(`kg-${a}-${exId}-${i}`), rpIn = document.getElementById(`rp-${a}-${exId}-${i}`);
      if(set.kg==="" && i>0 && f.sets[exId][i-1].kg!==""){ set.kg = f.sets[exId][i-1].kg; if(kgIn) kgIn.value = set.kg; }
      if(set.reps===""){ set.reps = b.dataset.target; if(rpIn){ rpIn.value = set.reps; repsClass(rpIn); } }
      f.touched = true; b.setAttribute("aria-pressed","true"); b.closest(".setrow")?.classList.add("done");
      saveDraft(formKey(), f);
    });
    prCheck(b.dataset.ok, a); updateSaveBar();
    return;
  }
  if(b.dataset.prev){
    withAth(a, ()=>{
      const f = getForm(), exId = b.dataset.prev, i = +b.dataset.i, set = f.sets[exId][i];
      set.kg = b.dataset.kg; set.reps = b.dataset.reps; f.touched = true;
      const kgIn = document.getElementById(`kg-${a}-${exId}-${i}`), rpIn = document.getElementById(`rp-${a}-${exId}-${i}`), ok = document.getElementById(`ok-${a}-${exId}-${i}`);
      if(kgIn) kgIn.value = set.kg; if(rpIn){ rpIn.value = set.reps; repsClass(rpIn); } if(ok) ok.setAttribute("aria-pressed","true");
      b.closest(".setrow")?.classList.add("done");
      saveDraft(formKey(), f);
    });
    prCheck(b.dataset.prev, a); updateSaveBar(); return;
  }
  if(b.dataset.fbex){
    withAth(a, ()=>{ const f = getForm(); f.touched=true; f.fb[b.dataset.fbex] = f.fb[b.dataset.fbex]===b.dataset.v ? undefined : b.dataset.v;
      b.parentElement.querySelectorAll("button").forEach(x=>x.setAttribute("aria-pressed", String(f.fb[b.dataset.fbex]===x.dataset.v))); saveDraft(formKey(), f); });
    updateSaveBar(); return;
  }
  if(b.dataset.rpe){
    withAth(a, ()=>{ const f = getForm(); f.touched=true; const v=+b.dataset.rpe; f.rpe = f.rpe===v?null:v;
      b.parentElement.querySelectorAll("button").forEach(x=>x.setAttribute("aria-pressed", String(+x.dataset.rpe===f.rpe))); saveDraft(formKey(), f); });
    updateSaveBar(); return;
  }
  // core: vale per chi si allena (in coppia, per entrambi)
  if(b.dataset.core!==undefined){
    const aths = athletesNow(), v = +b.dataset.core, cur = withAth(state.ath, ()=>getForm().core), next = cur===v ? null : v;
    for(const x of aths) withAth(x, ()=>{ const f = getForm(); f.touched=true; f.core=next; saveDraft(formKey(), f); });
    b.parentElement.querySelectorAll("button").forEach(x=>x.setAttribute("aria-pressed", String(+x.dataset.core===next))); updateSaveBar(); return;
  }
});

async function saveGear(field, v){
  if(!(v>0)) return;
  const g = {...gearOf(state.ath), [field]: v};
  state.gear = {...state.gear, [state.ath]: g};
  try{ localStorage.setItem("pav-gear", JSON.stringify(state.gear)); }catch(e){}
  if(state.db){ try{ await state.db.collection("settings").doc(state.ath).set(g); }catch(e){} }
  render();
}
main.addEventListener("focusout", ()=>{ setTimeout(()=>{ if(state.pendingRender && !main.contains(document.activeElement)){ state.pendingRender=false; render(); } },0); });

async function earlyDeload(ph){
  if(!state.db) return;
  const p = planOf(state.ath); const early = [...p.early, ph.weekAbs];
  try{ await state.db.collection("plans").doc(state.ath).set({start:p.start, early}); state.forms = {}; }
  catch(e){ document.getElementById("saveMsg").textContent = "Non sono riuscito a salvare lo scarico. Riprova."; }
}

function collectEntries(){
  const f = getForm(), {items} = currentPlanDay(), entries = {}, scheme = {}, fb = {}; let n=0;
  for(const {ex, sc} of items){
    const arr = f.sets[ex.id].map(s=>({kg:parseFloat(s.kg), reps:parseInt(s.reps,10)})).filter(s=>!isNaN(s.kg) && !isNaN(s.reps) && s.reps>0);
    if(arr.length){ entries[ex.id]=arr; scheme[ex.id]={sets:sc.sets,min:sc.min,max:sc.max,rir:sc.rir}; if(f.fb[ex.id]) fb[ex.id]=f.fb[ex.id]; n+=arr.length; }
  }
  return {entries, scheme, fb, n, rpe:f.rpe, core:f.core, note:(f.note||"").trim()};
}
function liveStatsHTML(per){
  const planned = a => withAth(a, () => currentPlanDay().items.reduce((n,it)=>n+it.sc.sets, 0));
  return per.map(p => {
    const vol = Object.values(p.entries).flat().reduce((v,s)=>v+s.kg*s.reps, 0);
    return `<div class="live-card${per.length>1?" lane-"+p.a:""}">${per.length>1?`<span class="lane-who">${SHORT[p.a]}</span>`:""}
      <div class="live-k"><span class="v num">${p.n}<small>/${planned(p.a)}</small></span><span class="k">serie</span></div>
      <div class="live-k"><span class="v num">${fmt(Math.round(vol))}<small> kg</small></span><span class="k">volume</span></div>
      <div class="live-k"><span class="v num">${p.rpe ?? "—"}</span><span class="k">RPE</span></div></div>`;
  }).join("");
}
function updateSaveBar(){
  const btn = document.getElementById("saveBtn"), msg = document.getElementById("saveMsg");
  if(state.view==="prog") return;
  const aths = athletesNow();
  const per = aths.map(a => withAth(a, () => ({a, ...collectEntries(), f:getForm()})));
  const live = document.getElementById("live-stats"); if(live) live.innerHTML = liveStatsHTML(per);
  const total = per.reduce((s,p)=>s+p.n, 0);
  btn.disabled = !state.db || total===0;
  if(state.keepMsg && Date.now()-state.keepMsg < 12000 && !per.some(p=>p.f.touched)) return;
  state.keepMsg = 0;
  if(total===0){
    const saved = per.every(p=>p.f.saved);
    msg.textContent = saved ? "Seduta già salvata per questa data. Modifica e salva di nuovo per aggiornarla." : "Inserisci le ripetizioni fatte, poi salva la seduta.";
    return;
  }
  const tag = p => aths.length>1 ? `${SHORT[p.a]} ${p.n} serie${p.n?(p.rpe?` · RPE ${p.rpe}`:" · manca RPE"):""}` : `${p.n} serie · ${ATH[p.a]}${p.rpe?` · RPE ${p.rpe}`:" · manca la fatica della seduta"}`;
  const allSaved = per.every(p=>p.f.saved && !p.f.touched);
  msg.textContent = (allSaved ? "Salvata · " : "") + per.map(tag).join(" · ") + ` · ${fmtDate(state.date)}`;
}
async function saveFor(a){
  return withAth(a, async ()=>{
    const {entries, scheme, fb, n, rpe, core, note} = collectEntries(); if(!n) return null;
    const key = formKey(), id = docId(a,state.view,state.date);
    const {items} = currentPlanDay(), swaps = {};
    for(const it of items) if(it.ex.id!==it.def.id) swaps[it.si] = it.ex.id;
    const records = Object.keys(entries).map(exId=>{ const prev = bestBefore(exId, a, id), e = bestE1(entries[exId]); return prev && e > prev + 0.05 ? `${EX_BY_ID[exId]?.name||exId} ${fmt(e)} kg` : null; }).filter(Boolean);
    const ph = phaseAt(a, state.date);
    const doc = {athlete:a, day:state.view, date:state.date, block:ph.block, week:ph.wib, weekAbs:ph.weekAbs, deload:ph.deload, entries, scheme, fb, savedAt:new Date().toISOString()};
    if(rpe) doc.rpe = rpe;
    if(core!=null) doc.coreRounds = core;
    if(note) doc.note = note.slice(0, 1000);
    if(Object.keys(swaps).length) doc.swaps = swaps;
    const f = getForm();   // prima dell'await: dopo, withAth ha già ripristinato l'atleta
    await state.db.collection("logs").doc(id).set(doc);
    f.saved = true; f.touched = false; f.restored = false;
    saveDraft(key, null);
    return {a, n, records};
  });
}
document.getElementById("saveBtn").addEventListener("click", async ()=>{
  const btn = document.getElementById("saveBtn"), msg = document.getElementById("saveMsg");
  if(!state.db) return;
  btn.disabled = true; msg.textContent = "Salvataggio…";
  try{
    const done = [];
    for(const a of athletesNow()){ const r = await saveFor(a); if(r) done.push(r); }
    if(!done.length){ updateSaveBar(); return; }
    const recs = done.flatMap(r => r.records.map(x => done.length>1 ? `${SHORT[r.a]}: ${x}` : x));
    const what = done.length>1 ? done.map(r=>`${SHORT[r.a]} ${r.n} serie`).join(", ") : `${done[0].n} serie`;
    msg.textContent = recs.length ? `Salvata: ${what}. ★ Record stimati: ${recs.join(", ")}.` : `Salvata: ${what}. Il coach ha aggiornato i carichi della prossima seduta.`;
    state.keepMsg = Date.now();
  }catch(e){
    msg.textContent = e?.name==="QuotaExceededError" ? "Memoria del telefono piena: esporta un backup e libera spazio." : "Salvataggio non riuscito. Riprova tra qualche secondo.";
  }finally{ btn.disabled = false; }
});

/* ================= PROGRESSI ================= */
function workSets(s){ return Object.values(s.entries||{}).reduce((n,a)=>n+(Array.isArray(a)?a.length:0),0); }
function weekSummaryHTML(ath){
  const mine = state.hist.filter(s=>s.athlete===ath);
  const wk0 = mondayOf(todayISO()), W = 7*dayMs;
  const inWeek = (s,w) => mondayOf(s.date)===w;
  const thisW = mine.filter(s=>inWeek(s,wk0)), lastW = mine.filter(s=>inWeek(s,wk0-W));
  // settimane consecutive con tutte e 3 le sedute (quella in corso conta se già completa)
  let streak = 0; for(let w = thisW.length>=3 ? wk0 : wk0-W; ; w-=W){ const n = new Set(mine.filter(s=>inWeek(s,w)).map(s=>s.day)).size; if(n>=3) streak++; else break; if(streak>52) break; }
  const sets = thisW.reduce((n,s)=>n+workSets(s),0), setsL = lastW.reduce((n,s)=>n+workSets(s),0);
  let h = `<div class="panel stats">
    <div class="stat"><span class="k">Questa settimana</span><span class="v">${new Set(thisW.map(s=>s.day)).size}/3</span><span class="d">sedute</span></div>
    <div class="stat"><span class="k">Serie allenanti</span><span class="v">${sets}</span><span class="d">settimana scorsa ${setsL}</span></div>
    <div class="stat"><span class="k">Settimane piene</span><span class="v">${streak}</span><span class="d">di fila, 3 sedute su 3</span></div></div>`;
  // costanza: ultime 8 settimane
  const days = ["lun","mer","ven"], short = {lun:"L", mer:"M", ven:"V"};
  h += `<div class="panel"><div class="legend"><span><b style="color:var(--ink)">Costanza</b> · ultime 8 settimane</span><span><i style="background:var(--accent);height:8px;width:8px"></i>seduta fatta</span></div><div class="cal" role="img" aria-label="Sedute delle ultime 8 settimane">`;
  for(let k=7;k>=0;k--){
    const w = wk0 - k*W, done = new Set(mine.filter(s=>inWeek(s,w)).map(s=>s.day));
    const lbl = new Date(w).toLocaleDateString("it-IT",{day:"numeric",month:"short"});
    h += `<div class="cw" title="Settimana del ${lbl}: ${done.size} sedute">${days.map(d=>`<span class="cc${done.has(d)?" on":""}" aria-label="${short[d]}"></span>`).join("")}<span class="cl">${k===0?"ora":esc(lbl)}</span></div>`;
  }
  h += `</div></div>`;
  // volume per gruppo muscolare
  const vol = (list)=>{ const m={}; for(const s of list) for(const [id,a] of Object.entries(s.entries||{})){ const g = MUSCLE[id]; if(g && Array.isArray(a)) m[g]=(m[g]||0)+a.length; } return m; };
  const vT = vol(thisW), vL = vol(lastW), max = Math.max(1, ...MUSCLE_ORDER.map(g=>Math.max(vT[g]||0, vL[g]||0)));
  h += `<div class="panel"><div class="legend"><span><b style="color:var(--ink)">Serie per gruppo muscolare</b></span><span><i style="background:var(--accent)"></i>questa settimana</span><span><i style="background:var(--ink2);width:2px;height:12px"></i>settimana scorsa</span></div><div class="vol">`;
  for(const g of MUSCLE_ORDER){
    const t = vT[g]||0, l = vL[g]||0;
    h += `<div class="vrow" title="${g}: ${t} serie questa settimana, ${l} la scorsa"><span class="vn">${g}</span><span class="vt">${t?`<span class="vb" style="width:${(t/max*100).toFixed(1)}%"></span>`:""}${l?`<span class="vp" style="left:calc(${(l/max*100).toFixed(1)}% - 1px)"></span>`:""}</span><span class="vv">${t}<span class="small"> /${l}</span></span></div>`;
  }
  h += `</div><div class="small" style="margin-top:8px">Conta le serie registrate. Il core non è incluso.</div></div>`;
  return h;
}
function renderProg(){
  const ath = state.ath;
  const logged = new Set(state.hist.filter(s=>s.athlete===ath).flatMap(s=>Object.keys(s.entries||{})));
  const ph = phaseAt(ath, todayISO());
  const current = new Set(Object.values(DAYS).flatMap(d=>d.slots.map(sl=>exForSlot(sl,ph).id)));
  if(!EX_BY_ID[state.exSel]) state.exSel = "squat";
  const ex = EX_BY_ID[state.exSel];
  let opts = "";
  for(const [d,p] of Object.entries(DAYS)){
    const list = p.slots.flatMap(sl=>sl.opts).filter(o=>current.has(o.id)||logged.has(o.id)||o.id===ex.id);
    opts += `<optgroup label="${p.label} · ${p.name}">` + list.map(e=>`<option value="${e.id}" ${e.id===ex.id?"selected":""}>${esc(e.name)}${current.has(e.id)?"":" (blocchi passati)"}</option>`).join("") + `</optgroup>`;
  }
  const old = ["pushpress","kb"].filter(id=>logged.has(id));
  if(old.length) opts += `<optgroup label="Vecchia scheda">` + old.map(id=>`<option value="${id}" ${id===ex.id?"selected":""}>${esc(EX_BY_ID[id].name)}</option>`).join("") + `</optgroup>`;
  const ss = sessionsFor(ex.id, ath, null, true).reverse();
  let run = 0;
  const pts = ss.map((s,i)=>{ const sets=s.entries[ex.id], e=bestE1(sets), rec = i>0 && e > run + 0.05; run = Math.max(run, e); return {date:s.date, top:topKg(sets), e, sets, deload:!!s.deload, rec}; });
  let h = `<div class="dayhead"><h2><small>${ATH[ath]}</small>Progressi</h2><span class="small">${phaseAt(ath, todayISO()).before?"Il programma parte "+fmtLong(planOf(ath).start):`Oggi: blocco ${ph.block+1}, ${ph.deload?"scarico":"settimana "+(ph.wib+1)}`}</span></div><div class="prog">`;
  h += weekSummaryHTML(ath);
  h += `<div class="panel" style="display:grid;gap:12px"><label class="field">Andamento per esercizio<select id="exSel">${opts}</select></label>`;
  if(!pts.length){
    h += `<div class="empty">Nessuna seduta registrata per <b>${esc(ex.name)}</b>.<br>Salva un allenamento e qui comparirà l'andamento del carico.</div></div>`;
  } else {
    const work = pts.filter(p=>!p.deload); const first = (work[0]||pts[0]), last = (work.at(-1)||pts.at(-1)), dE = last.e-first.e;
    h += `<div class="stats">
      <div class="stat"><span class="k">Carico attuale</span><span class="v">${fmt(last.top)} kg</span><span class="d">${fmtDate(last.date)}</span></div>
      <div class="stat"><span class="k">Massimale stimato</span><span class="v">${fmt(last.e)} kg</span><span class="d">record ${fmt(Math.max(...pts.map(p=>p.e)))} kg</span></div>
      <div class="stat"><span class="k">Dall'inizio</span><span class="v">${dE>=0?"+":"−"}${fmt(Math.abs(dE))} kg</span><span class="d">${pts.length} sedute</span></div></div>
      <div><div class="legend"><span><i style="background:var(--accent)"></i>Massimale stimato</span><span><i style="background:var(--muted)"></i>Carico più alto della seduta</span></div>
      <div class="chartbox" id="chartbox">${chartSVG(pts)}<div class="tip" id="tip" hidden></div></div></div></div>
      <div class="panel tbl"><table><thead><tr><th>Data</th><th>Serie (kg × rip)</th><th>Massimale st.</th></tr></thead><tbody>
      ${pts.slice().reverse().map(p=>`<tr><td>${fmtDate(p.date)}${p.deload?" · scarico":""}</td><td class="n">${p.sets.map(s=>`${fmt(s.kg)}×${s.reps}`).join("  ")}</td><td class="n">${fmt(p.e)}${p.rec?`<span class="rec">★ REC</span>`:""}</td></tr>`).join("")}
      </tbody></table></div>`;
  }
  const rp = state.hist.filter(s=>s.athlete===ath && typeof s.rpe==="number").sort((x,y)=>y.date.localeCompare(x.date)).slice(0,8);
  if(rp.length) h += `<div class="panel tbl"><table><thead><tr><th>Ultime sedute</th><th>Giorno</th><th>Fase</th><th>RPE</th><th>Note</th></tr></thead><tbody>${rp.map(s=>`<tr><td>${fmtDate(s.date)}</td><td>${DAYS[s.day]?.label||s.day}</td><td>${s.deload?"Scarico":`Blocco ${(s.block??0)+1} · sett. ${(s.week??0)+1}`}</td><td class="n">${s.rpe}</td><td>${s.note?esc(s.note.length>40?s.note.slice(0,40)+"…":s.note):"—"}</td></tr>`).join("")}</tbody></table></div>`;
  h += dataPanelHTML();
  h += `</div>`;
  main.innerHTML = h;
  document.getElementById("exSel").addEventListener("change", e=>{ state.exSel=e.target.value; persistUi(); render(); });
  wireDataPanel();
  if(pts.length) wireChart(pts);
}
async function exportCSV(){
  const msg = document.getElementById("csvMsg");
  const q = v => { const t = String(v??""); return /[;"\n]/.test(t) ? `"${t.replace(/"/g,'""')}"` : t; };
  const rows = [["data","atleta","giorno","blocco","settimana","scarico","esercizio","serie","kg","ripetizioni","feedback","rpe","note"]];
  for(const s of state.hist.slice().sort((x,y)=>x.date.localeCompare(y.date) || x.athlete.localeCompare(y.athlete))){
    for(const [id, sets] of Object.entries(s.entries||{})) (sets||[]).forEach((st,i)=>rows.push([s.date, ATH[s.athlete]||s.athlete, DAYS[s.day]?.label||s.day, (s.block??0)+1, (s.week??0)+1, s.deload?"sì":"no", EX_BY_ID[id]?.name||id, i+1, String(st.kg).replace(".",","), st.reps, s.fb?.[id]||"", s.rpe??"", i===0 && id===Object.keys(s.entries)[0] ? s.note||"" : ""]));
  }
  const csv = "﻿" + rows.map(r=>r.map(q).join(";")).join("\n");
  const r = await shareOrDownload(`${todayISO()}_palestra-storico`, csv, [["csv","text/csv"],["txt","text/plain"]]);
  if(msg) msg.textContent = r==="cancelled" ? "Esportazione annullata." : "File pronto: aprilo con Fogli Google o Excel.";
}

/* ================= BACKUP ================= */
const BK_KEY = "pav-last-backup";
function lastBackup(){ try{ return localStorage.getItem(BK_KEY); }catch(e){ return null; } }
function daysSinceBackup(){ const b = lastBackup(); return b ? Math.floor((Date.parse(todayISO())-Date.parse(b))/dayMs) : null; }
function dataPanelHTML(){
  const d = daysSinceBackup(), n = LocalDB.count();
  const when = d===null ? "Nessun backup ancora." : d===0 ? "Ultimo backup oggi." : `Ultimo backup ${d} ${d===1?"giorno":"giorni"} fa.`;
  return `<div class="panel" style="display:grid;gap:10px"><div class="ex-name">Dati e backup<span class="sub">${n} sedute salvate su questo telefono. ${when} Salva il backup su Drive, cartella Claude/Palestra.</span></div>
    <div class="row-actions"><button class="btn" id="bkBtn" type="button">Backup su Drive</button><label class="ghost" style="cursor:pointer">Importa backup<input type="file" id="bkIn" accept="application/json,.json,text/plain,.txt" hidden></label>${state.hist.length?`<button class="ghost" id="csvBtn" type="button">Storico CSV</button>`:""}</div>
    <span class="small" id="csvMsg">${state.flash && Date.now()-state.flash.at<15000 ? esc(state.flash.t) : "Il CSV ha una riga per serie, da aprire in Fogli Google o Excel."}</span></div>`;
}
function wireDataPanel(){
  const cb = document.getElementById("csvBtn"); if(cb) cb.addEventListener("click", exportCSV);
  document.getElementById("bkBtn").addEventListener("click", exportBackup);
  document.getElementById("bkIn").addEventListener("change", importBackup);
}
async function exportBackup(){
  const msg = document.getElementById("csvMsg");
  const text = JSON.stringify(LocalDB.exportAll(), null, 1);
  const r = await shareOrDownload(`${todayISO()}_palestra`, text, [["json","application/json"],["txt","text/plain"]]);
  if(r==="cancelled"){ if(msg) msg.textContent = "Backup annullato."; return; }
  try{ localStorage.setItem(BK_KEY, todayISO()); }catch(e){}
  backupBanner();
  if(state.view==="prog") render();
}
function importBackup(e){
  const file = e.target.files && e.target.files[0]; if(!file) return;
  const msg = document.getElementById("csvMsg");
  const reader = new FileReader();
  reader.onload = () => {
    try{
      const obj = JSON.parse(reader.result);
      if(obj && obj.kind==="profile"){
        LocalDB.importProfile(obj);
        state.forms = {};
        state.flash = {t:"Profilo importato: nomi e pesi di partenza aggiornati.", at:Date.now()};
        if(msg) msg.textContent = state.flash.t;
        return;
      }
      const cur = LocalDB.count();
      if(cur && !confirm(`Sostituire le ${cur} sedute su questo telefono con quelle del backup?`)) return;
      const n = LocalDB.importAll(obj);
      state.forms = {};
      state.flash = {t:`Backup importato: ${n} sedute.`, at:Date.now()}; if(msg) msg.textContent = state.flash.t;
    }catch(err){ if(msg) msg.textContent = "Questo file non è un backup della Palestra."; }
  };
  reader.readAsText(file);
  e.target.value = "";
}
function backupBanner(){
  const banner = document.getElementById("banner"), d = daysSinceBackup();
  if(!Object.keys(BASE).length){ banner.hidden = false; banner.textContent = "Profilo mancante: senza i pesi di partenza lunedì e mercoledì restano vuoti. Vai in Progressi → Importa backup e scegli palestra-profilo.json (Drive, cartella Claude/Palestra)."; return; }
  const show = LocalDB.count() > 0 && (d===null || d>=14);
  banner.hidden = !show;
  if(show) banner.textContent = d===null ? "Nessun backup ancora: salvalo da Progressi → Backup su Drive." : `Ultimo backup ${d} giorni fa: salvalo da Progressi → Backup su Drive.`;
}

const CH = {w:640, h:260, l:44, r:16, t:14, b:30};
function scales(pts){
  const t0 = Date.parse(pts[0].date), t1 = Date.parse(pts.at(-1).date);
  const vals = pts.flatMap(p=>[p.top,p.e]);
  let lo = Math.min(...vals), hi = Math.max(...vals); const pad = Math.max(2,(hi-lo)*0.15); lo=Math.max(0,lo-pad); hi+=pad;
  const raw = (hi-lo)/4, mag = Math.pow(10,Math.floor(Math.log10(raw)));
  const stepT = [1,2,2.5,5,10].map(m=>m*mag).find(s=>s>=raw);
  lo = Math.floor(lo/stepT)*stepT; hi = Math.ceil(hi/stepT)*stepT;
  const ticks=[]; for(let v=lo; v<=hi+1e-9; v+=stepT) ticks.push(r1(v));
  const X = d => t1===t0 ? (CH.l+CH.w-CH.r)/2 : CH.l + (Date.parse(d)-t0)/(t1-t0)*(CH.w-CH.l-CH.r);
  const Y = v => CH.t + (hi-v)/(hi-lo)*(CH.h-CH.t-CH.b);
  return {X,Y,ticks};
}
function chartSVG(pts){
  const {X,Y,ticks} = scales(pts);
  let s = `<svg viewBox="0 0 ${CH.w} ${CH.h}" role="img" aria-label="Andamento del massimale stimato e del carico più alto">`;
  for(const v of ticks){ const y=Y(v); s += `<line x1="${CH.l}" x2="${CH.w-CH.r}" y1="${y}" y2="${y}" stroke="var(--line)" stroke-width="1"/><text x="${CH.l-8}" y="${y+4}" text-anchor="end" font-size="11" fill="var(--muted)">${fmt(v)}</text>`; }
  const idx = pts.length<=6 ? pts.map((_,i)=>i) : [0, Math.floor((pts.length-1)/2), pts.length-1];
  for(const i of idx){ s += `<text x="${X(pts[i].date)}" y="${CH.h-8}" text-anchor="middle" font-size="11" fill="var(--muted)">${fmtDate(pts[i].date)}</text>`; }
  const line = (key,color) => pts.length>1 ? `<polyline fill="none" stroke="${color}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" points="${pts.map(p=>`${X(p.date)},${Y(p[key])}`).join(" ")}"/>` : "";
  s += line("top","var(--muted)") + line("e","var(--accent)");
  pts.forEach((p,i)=>{ const last=i===pts.length-1;
    s += `<circle cx="${X(p.date)}" cy="${Y(p.top)}" r="3.5" fill="var(--muted)" stroke="var(--surface)" stroke-width="2"/>`;
    s += `<circle cx="${X(p.date)}" cy="${Y(p.e)}" r="${last?6:4.5}" fill="${p.deload?"var(--surface)":"var(--accent)"}" stroke="${p.deload?"var(--accent)":"var(--surface)"}" stroke-width="2"/>`; });
  s += `<line id="cross" x1="0" x2="0" y1="${CH.t}" y2="${CH.h-CH.b}" stroke="var(--ink2)" stroke-width="1" stroke-dasharray="3 3" visibility="hidden"/>`;
  s += `<rect x="${CH.l}" y="0" width="${CH.w-CH.l-CH.r}" height="${CH.h}" fill="transparent"/>`;
  return s + `</svg>`;
}
function wireChart(pts){
  const box = document.getElementById("chartbox"), svg = box.querySelector("svg"), tip = document.getElementById("tip"), cross = svg.querySelector("#cross");
  const {X,Y} = scales(pts);
  const move = ev => {
    const r = svg.getBoundingClientRect(), vx = (ev.clientX-r.left)/r.width*CH.w;
    let best = pts[0]; for(const p of pts) if(Math.abs(X(p.date)-vx) < Math.abs(X(best.date)-vx)) best = p;
    const x = X(best.date); cross.setAttribute("x1",x); cross.setAttribute("x2",x); cross.setAttribute("visibility","visible");
    tip.hidden = false; tip.textContent = `${fmtDate(best.date)}${best.deload?" (scarico)":""} · stimato ${fmt(best.e)} kg · carico ${fmt(best.top)} kg`;
    const px = x/CH.w*r.width; tip.style.left = Math.min(Math.max(px, 120), r.width-120)+"px"; tip.style.top = (Y(best.e)/CH.h*r.height)+"px";
  };
  svg.addEventListener("pointermove", move); svg.addEventListener("pointerdown", move);
  svg.addEventListener("pointerleave", ()=>{ tip.hidden=true; cross.setAttribute("visibility","hidden"); });
}

/* ================= NAVIGAZIONE E DATI ================= */
document.querySelectorAll(".seg button").forEach(b=>b.addEventListener("click",()=>{
  if(b.dataset.ath==="both") state.couple = true; else { state.couple = false; state.ath = b.dataset.ath; }
  persistUi(); render();
}));
document.querySelectorAll(".tabs button").forEach(b=>b.addEventListener("click",()=>{ state.view=b.dataset.view; persistUi(); render(); window.scrollTo({top:0}); }));
render();

function safeRender(){
  const a = document.activeElement;
  if(main.contains(a) && ((a.tagName==="INPUT" && (a.dataset.ex || a.dataset.gear)) || a.tagName==="TEXTAREA")) state.pendingRender = true; else render();
}
(()=>{
  const db = LocalDB;
  state.db = db;
  const fail = ()=>{};
  db.collection("logs").onSnapshot(snap=>{ state.hist = snap.docs.map(d=>({id:d.id, ...d.data()})); safeRender(); }, fail);
  db.collection("plans").onSnapshot(snap=>{ const p={}; snap.docs.forEach(d=>p[d.id]=d.data()); state.plans=p; for(const k in state.forms) if(!state.forms[k].touched) delete state.forms[k]; safeRender(); }, fail);
  db.collection("settings").onSnapshot(snap=>{ const g={...state.gear}; snap.docs.forEach(d=>{ if(d.id==="profile") applyProfile(d.data()); else g[d.id]=d.data(); }); state.gear=g; backupBanner(); try{ localStorage.setItem("pav-gear", JSON.stringify(g)); }catch(e){} safeRender(); }, ()=>{});
  updateSaveBar();
  backupBanner();
})();
