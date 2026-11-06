# Palestra A&V

Scheda full body in 3 giorni per due persone, come app installabile e offline (PWA): carichi suggeriti dal coach, periodizzazione a blocchi, core, progressi. Stretching e mobilità sono nell'app a parte [Mobilità A&V](mobilita/) (cartella `mobilita/`).

- **Offline:** dopo la prima apertura funziona senza rete.
- **Dati sul telefono:** le sedute restano nel browser del telefono. Backup: *Progressi → Backup su Drive* (cartella Claude/Palestra), ripristino con *Importa backup*.
- **Profilo:** nomi e pesi di partenza non sono nel codice. Si importano una volta da *Progressi → Importa backup* con il file profilo (`kind: "profile"`), e da lì finiscono nei backup.
- **Pausa:** *Segna una pausa* sotto la fase del programma. Si chiude da sola alla prima seduta salvata; al rientro l'app sceglie come ripartire (settimane 1-2: stessa settimana; 3-4 o scarico: blocco nuovo; 2+ settimane: stesso blocco dalla settimana 1).
- **Piano dei blocchi:** *Vedi i blocchi futuri* mostra i prossimi 6 blocchi settimana per settimana: esercizi, serie × ripetizioni, RIR, esercizi che cambiano e peso stimato dal massimale di oggi.
- **Aggiornamenti:** dopo ogni modifica lanciare `node build.mjs`, che rigenera `sw.js`; l'app mostra "Nuova versione pronta".

| File | Ruolo |
|---|---|
| `index.html`, `style.css` | pagina e stile |
| `app.js` | programma, coach, figure animate, progressi |
| `mobilita/` | app separata per stretching e mobilità del weekend |
| `store.js` | archivio locale, backup, condivisione file |
| `sw.js.template` → `sw.js` | service worker per l'uso offline |
