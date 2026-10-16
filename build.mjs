// Rigenera sw.js con una versione legata al contenuto: a ogni modifica l'app propone "Aggiorna".
// Uso: node build.mjs
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { createHash } from "node:crypto";
const files = ["index.html", "style.css", "store.js", "app.js", "manifest.webmanifest", ...readdirSync("fonts").filter((f) => f.endsWith(".woff2")).map((f) => "fonts/" + f)];
const hash = createHash("sha256");
for (const f of files) hash.update(readFileSync(f));
const version = hash.digest("hex").slice(0, 12);
writeFileSync("sw.js", readFileSync("sw.js.template", "utf8").replace("__VERSION__", version));
console.log("sw.js versione", version);
