/* Mobilità A&V — figure stilizzate (stesso motore della Palestra)
   Pose in angoli: 0 = su, 90 = avanti/destra, 180 = giù, -90 = indietro/sinistra. A = inizio, B = fine. */
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
/* Corpo morbido: arti come linee continue con giunture arrotondate, busto pieno */
const fpoly = (pts, cls) => `<polyline class="${cls}" points="${P(pts)}"/>`;
function fbody(J){
  let s = "";
  s += fpoly([J.hip,J.knee2,J.ank2,J.toe2], "fg-far") + fpoly([J.sho,J.elb2,J.wr2], "fg-far");
  if(J.arch){ // schiena curva (cat-cow): curva quadratica, arch > 0 = schiena che scende
    const [hx,hy]=J.hip, [nx,ny]=J.neck, dx=nx-hx, dy=ny-hy, L=Math.hypot(dx,dy)||1;
    const cx=(hx+nx)/2 - dy/L*J.arch, cy=(hy+ny)/2 + dx/L*J.arch;
    s += `<path class="fg-body" d="M${hx.toFixed(1)} ${hy.toFixed(1)} Q${cx.toFixed(1)} ${cy.toFixed(1)} ${nx.toFixed(1)} ${ny.toFixed(1)}"/>`;
  } else s += fline(J.hip,J.neck,"fg-body");
  s += fpoly([J.hip,J.knee,J.ank,J.toe], "fg-limb") + fpoly([J.sho,J.elb,J.wr], "fg-limb");
  s += `<circle class="fg-head" cx="${J.head[0].toFixed(1)}" cy="${J.head[1].toFixed(1)}" r="5.8"/>`;
  return s;
}
function fbodyFront(F){
  let s = "";
  s += fline([F.c,18],[F.c,46],"fg-body");
  s += fpoly([[F.c-7,GROUND],[F.c-5,47],[F.c+5,47],[F.c+7,GROUND]], "fg-limb");
  s += fpoly([F.wL,F.eL,F.sL,F.sR,F.eR,F.wR], "fg-limb");
  s += `<circle class="fg-head" cx="${F.c}" cy="9.5" r="5.8"/>`;
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
  const ground = fig.noGround ? "" : groundSVG(fig);
  return `${ground}${back}${body}${front}`;
}
function groundSVG(fig){
  if(!fig._g){
    let x0 = 1e9, x1 = -1e9;
    for(const t of [0,1]){ const {F, J} = figJoints(fig, t); const pts = F ? [[F.c-12,0],[F.c+12,0]] : Object.values(J).filter(Array.isArray);
      for(const q of pts){ x0 = Math.min(x0, q[0]); x1 = Math.max(x1, q[0]); } }
    fig._g = [x0-7, x1+7];
  }
  const [a, b] = fig._g;
  return `<ellipse class="fg-ground" cx="${((a+b)/2).toFixed(1)}" cy="${GROUND+2.6}" rx="${((b-a)/2).toFixed(1)}" ry="2.6"/>`;
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
const STAND = {t:0, th:180, sh:180, ua:180, fa:180, foot:[60,GROUND]};
const S = o => ({...STAND, ...o});
const SUP = {hip:[66,80], t:-90};                       // supino: testa a sinistra
const QUAD = {knee:[40,GROUND-1], th:180, sh:270, ft:270, t:82, ua:180, fa:180}; // quattro zampe
const WALL_R = {k:"wall", x:93, y:24, w:5, h:61};
const CHAIR = [{k:"rect", x:78, y:58, w:22, h:4},{k:"rect", x:80, y:62, w:3, h:22},{k:"rect", x:95, y:62, w:3, h:22}];

const FIG = {
  cat_cow:{A:{...QUAD, arch:-9, hd:45}, B:{...QUAD, arch:7, hd:-55}, eq:[]},
  bridge:{A:{hip:[52,79], t:-90, th:45, sh:180, ft:90, ua:90, fa:90}, B:{hip:[50,64], t:-118, th:95, sh:180, ft:90, ua:100, fa:90}, eq:[]},
  bw_squat:{A:S({ua:90, fa:90}), B:S({t:38, th:98, sh:205, ua:80, fa:80}), eq:[]},
  knee_wall:{A:{foot:[80,GROUND], t:6, th:178, sh:180, th2:202, sh2:192, ft2:150, ua:72, fa:84}, B:{foot:[80,GROUND], t:10, th:160, sh:208, th2:202, sh2:192, ft2:150, ua:66, fa:80}, eq:[WALL_R]},
  wgs:{A:{foot:[84,GROUND], t:62, th:96, sh:186, th2:244, sh2:256, ft2:180, ua:182, fa:182}, B:{foot:[84,GROUND], t:58, th:96, sh:186, th2:244, sh2:256, ft2:180, ua:-4, fa:-4, ua2:182, fa2:182}, eq:[]},
  hinge:{A:S({ua:180, fa:180}), B:{foot:[60,GROUND], t:76, th:160, sh:184, ua:182, fa:182}, eq:[]},
  deep_squat:{A:S({t:36, th:82, sh:212, ua:96, fa:70}), B:S({t:30, th:72, sh:216, ua:98, fa:64}), eq:[]},
  hip_flexor:{A:{hip:[56,63], t:0, th:90, sh:180, ft:90, th2:180, sh2:270, ft2:270, ua:180, fa:180}, B:{hip:[61,64], t:-8, th:98, sh:182, ft:90, th2:194, sh2:270, ft2:270, ua:2, fa:0, ua2:180, fa2:180}, eq:[]},
  ham_band:{A:{...SUP, th:22, sh:22, ft:-40, th2:90, sh2:90, ft2:0, ua:36, fa:30}, B:{...SUP, th:4, sh:4, ft:-60, th2:90, sh2:90, ft2:0, ua:22, fa:16}, eq:[{k:"band", fromJ:"ank", at:"wr"}]},
  fig4:{A:{...SUP, th:38, sh:150, ft:90, th2:20, sh2:96, ft2:20, ua:40, fa:80}, B:{...SUP, th:20, sh:140, ft:90, th2:6, sh2:92, ft2:20, ua:28, fa:70}, eq:[]},
  butterfly:{A:{hip:[50,80], t:24, th:60, sh:220, ft:120, ua:150, fa:176}, B:{hip:[50,80], t:46, th:62, sh:222, ft:120, ua:140, fa:170}, eq:[]},
  calf_wall:{A:{foot:[70,GROUND], t:30, th:160, sh:190, ft:90, th2:204, sh2:206, ft2:110, ua:62, fa:68}, B:{foot:[70,GROUND], t:36, th:150, sh:196, ft:90, th2:206, sh2:208, ft2:110, ua:66, fa:70}, eq:[WALL_R]},
  quad_stand:{A:S({th2:186, sh2:340, ft2:300, ua:150, fa:150, ua2:200, fa2:200}), B:S({th2:194, sh2:350, ft2:300, ua:140, fa:140, ua2:206, fa2:196}), eq:[]},
  child:{A:{hip:[40,66], t:104, th:140, sh:270, ft:270, ua:98, fa:94, hd:8}, B:{hip:[38,68], t:110, th:146, sh:270, ft:270, ua:100, fa:96, hd:8}, eq:[]},
  disloc:{A:S({ua:160, fa:160}), B:S({ua:-28, fa:-28}), eq:[]},
  pull_apart:{front:true, A:{a:-90, b:0, k:.22}, B:{a:90, b:0, k:1}, eq:[{k:"band", fromJ:"wL", at:"wR"}]},
  open_book:{noGround:true, A:{hip:[74,48], t:-90, th:180, sh:90, ft:0, ua:180, fa:180}, B:{hip:[74,48], t:-90, th:180, sh:90, ft:0, ua:0, fa:0, ua2:180, fa2:180}, eq:[{k:"mat", x:12, y:16, w:96, h:66}]},
  tspine:{A:{...QUAD}, B:{...QUAD, ua:-2, fa:-2, ua2:180, fa2:180, hd:-40}, eq:[]},
  wall_angel:{front:true, A:{a:84, b:92}, B:{a:150, b:10}, eq:[]},
  pec_wall:{A:S({t:6, ua:-88, fa:-4}), B:S({t:14, ua:-96, fa:-8}), eq:[{k:"wall", x:40, y:6, w:5, h:79}]},
  lat_chair:{A:{knee:[36,GROUND-1], th:180, sh:270, ft:270, t:90, ua:88, fa:88, hd:20}, B:{knee:[36,GROUND-1], th:172, sh:270, ft:270, t:102, ua:80, fa:80, hd:20}, eq:CHAIR},
  sphinx:{A:{hip:[42,80], t:72, th:-90, sh:-90, ft:-100, ua:180, fa:90}, B:{hip:[42,80], t:60, th:-90, sh:-90, ft:-100, ua:178, fa:90}, eq:[]},
  knees_chest:{A:{...SUP, th:40, sh:120, ft:90, ua:40, fa:90}, B:{...SUP, th:12, sh:110, ft:90, ua:26, fa:84}, eq:[]},
  breath:{A:{...SUP, th:45, sh:150, ft:90, ua:76, fa:120}, B:{...SUP, th:45, sh:150, ft:90, ua:72, fa:116, arch:-2}, eq:[]}
};

/* Una figura animata (A ↔ B) con il fantasma della posizione finale */
function figSVG(key, label){
  const f = FIG[key]; if(!f) return "";
  const ghost = f.B ? `<g class="fg-ghost">${figureFrame(f, 1, {bodyOnly:true})}</g>` : "";
  return `<svg class="fig" viewBox="${fitBox(key)}" data-fig="${key}" role="img" aria-label="Esecuzione: ${label}">${ghost}<g class="fg-live">${figureFrame(f,0)}</g></svg>`;
}
const REDUCED = (()=>{ try{ return matchMedia("(prefers-reduced-motion: reduce)").matches; }catch(e){ return false; } })();
/* Animazione a respiro: avanti e indietro senza scatti, 7 s per ciclo (3,5 s per andare, 3,5 per tornare) */
(function animateFigures(){
  if(REDUCED || typeof requestAnimationFrame==="undefined") return;
  let last = 0;
  function frame(now){
    requestAnimationFrame(frame);
    if(now - last < 40) return; last = now;
    const t = (1 - Math.cos(2*Math.PI*(now % 7000)/7000)) / 2;
    document.querySelectorAll("svg.fig[data-fig]").forEach(svg=>{
      const f = FIG[svg.dataset.fig], g = svg.querySelector(".fg-live"); if(!f || !f.B || !g) return;
      const r = svg.getBoundingClientRect(); if(r.bottom < 0 || r.top > innerHeight) return;
      g.innerHTML = figureFrame(f, t);
    });
  }
  requestAnimationFrame(frame);
})();
/* fase del respiro (0-1) per l'anello del player */
const breathPhase = () => (1 - Math.cos(2*Math.PI*(performance.now() % 7000)/7000)) / 2;
