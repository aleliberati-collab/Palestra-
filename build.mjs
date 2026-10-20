// Rigenera sw.js della Palestra e di Mobilità con una versione legata al contenuto:
// a ogni modifica l'app propone "Aggiorna". Uso: node build.mjs
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { createHash } from "node:crypto";
const fonts = readdirSync("fonts").filter((f) => f.endsWith(".woff2")).map((f) => "fonts/" + f);
function build(dir, files) {
  const hash = createHash("sha256");
  for (const f of files) hash.update(readFileSync(dir + f));
  const version = hash.digest("hex").slice(0, 12);
  writeFileSync(dir + "sw.js", readFileSync(dir + "sw.js.template", "utf8").replace("__VERSION__", version));
  console.log((dir || "./") + "sw.js versione", version);
}
build("", ["index.html", "style.css", "store.js", "app.js", "manifest.webmanifest", ...fonts]);
build("mobilita/", ["index.html", "style.css", "fig.js", "app.js", "manifest.webmanifest", ...fonts.map((f) => "../" + f)]);
