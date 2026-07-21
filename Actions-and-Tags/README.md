---
description: Mine regler i Actions and Tags for Zotero
date: 2026-07-21
---
# Actions and Tags

[Actions and Tags for Zotero](https://github.com/windingwind/zotero-actions-tags) lar deg lage egne regler som enten legger til/fjerner tags, eller kjører JavaScript, manuelt (høyreklikk/snarvei) eller automatisk (nytt element / ved oppstart).

Denne oversikten er generert fra en Tara-sikkerhetskopi ([21.7.2026](../README.md)) og viser alle 30 reglene som lå i profilen på det tidspunktet. Regler som kun setter en tag er ikke lagret som egne filer (de består av én linje, f.eks. `#Status/Leser`) – kun reglene som kjører JavaScript er lagt ved som `.js`-filer i denne mappen.

## Tag-regler (snarvei/høyreklikk → legger til tag)

| Navn | Meny/tag | Snarvei | Aktiv |
| --- | --- | --- | --- |
| Status/Ulest (standard) | 🟪 Ulest | Ctrl+Alt+U | Ja |
| Status/Ulest AUTO | *(kjøres automatisk på nye elementer)* | – | Ja |
| Status/Leser | 🟧 Leser | Ctrl+Alt+L | Ja |
| Status/Lest | 🟩 Lest | Ctrl+Alt+K | Ja |
| Status/Skal leses | 🟥 Skal leses | – | Ja |
| Innhold/Forkortelse | 🔵 Innhold/Forkortelse | Ctrl+Alt+F | Ja |
| Innhold/Ord | Innhold/Ord | Ctrl+Alt+O | Ja |
| Innhold/Henvisning | 🌐 Innhold/Henvisning | Ctrl+Alt+H | Ja |
| Innhold/Bokmerke | 🔖 Innhold/Bokmerke | Ctrl+Alt+F1 | Ja |
| Innhold/Person | Innhold/Person | Ctrl+Alt+P | Ja |
| Høring/Enig | – | Shift+Alt+% | Ja |
| Høring/Uenig | – | Shift+Alt+& | Ja |
| Høring/Tvil | – | Shift+Alt+/ | Ja |
| Type/Høringsbrev | Type/Høringsbrev | – | Ja |
| Type/Høringsnotat | Type/Høringsnotat | – | Ja |

## Skript-regler (kjører JavaScript)

| Navn | Fil | Snarvei | Aktiv | Hva den gjør |
| --- | --- | --- | --- | --- |
| Søk Scholar / Søk SNL | [Soek-Google-Scholar.js](Soek-Google-Scholar.js), [Soek-SNL.js](Soek-SNL.js) | – | Ja | Høyreklikk på markert tekst i PDF-leseren → søk på Google Scholar/SNL |
| Synk grønn markering | [Auto-Synk-Grønn-Utheving.js](Auto-Synk-Grønn-Utheving.js) | – | Ja | Samler alle grønne uthevinger (`#5fb236`, "Ord og forkortelser") fra vedlegg i en tabellnotat, og rydder opp gamle notater først |
| Masseredigering | [Masseredigering.js](Masseredigering.js) | – | Ja | Bulk-endring av metadatafelt, elementtype eller forfatternavn på flere valgte elementer samtidig |
| Åpne i Power PDF | [Åpne-i-Power-PDF.js](Åpne-i-Power-PDF.js) | – | Ja | Åpner PDF-vedlegget til valgt element i Kofax Power PDF i stedet for standard leser |
| Relasjon (+) | [Relasjon-Pluss.js](Relasjon-Pluss.js) | Shift+Ctrl+Alt+R | Ja | Relaterer alle valgte elementer til hverandre |
| Relasjon (-) | [Relasjon-Minus.js](Relasjon-Minus.js) | Shift+Ctrl+Alt+E | Ja | Fjerner relasjon mellom alle valgte elementer |
| Kopier åpne faner | [Kopier-Åpne-Faner.js](Kopier-Åpne-Faner.js) | – | Ja | Kopierer lenker til alle åpne lesefaner som en HTML/Markdown-liste (for Zotero-notater/Obsidian) |
| Zutilo Copy | [Zutilo-Copy.js](Zutilo-Copy.js) | Ctrl+Alt+C | Ja | Kopierer alle metadatafelt, forfattere og tags for valgt element til utklippstavlen som JSON |
| Zutilo Paste | [Zutilo-Paste.js](Zutilo-Paste.js) | Ctrl+Alt+V | Ja | Limer inn metadata/tags/forfattere/type fra utklippstavlen (kopiert med Zutilo Copy) inn i valgte elementer |
| Zotero select | [Zotero-Select.js](Zotero-Select.js) | Shift+Alt+C | Ja | Kopierer en `zotero://select` / `zotero://open-pdf`-lenke til valgt element/notat/samling |
| Extract Abstract Keywords | [Extract-Abstract-Keywords.js](Extract-Abstract-Keywords.js) | – | **Nei** (deaktivert) | Leser ut Abstract/Keywords fra PDF-fulltekst og fyller inn abstract-felt + tags automatisk |
| Lenk PDF / Lenk PDF åpne | [Lenk-PDF.js](Lenk-PDF.js), [Lenk-PDF-Åpne.js](Lenk-PDF-Åpne.js) | – | **Nei** (deaktivert) | Lag en hyperlenke til en annotasjon og hopp til target-annotasjonen igjen |
| Customize color labels of reader | [Customize-Color-Labels-of-Reader.js](Customize-Color-Labels-of-Reader.js) | – | **Nei** (deaktivert) | Bytter ut navnene på fargekodene i PDF-leserens høyreklikkmeny (kjøres ved Zotero-oppstart) |
| zotseek-exclude | – *(kun tag, ingen skript)* | Shift+Ctrl+Alt+Z | Ja | Setter tag som ekskluderer elementet fra [ZotSeek](../README.md)'s semantiske indeksering |

> Merk: "Lenk PDF", "Lenk PDF åpne", "Extract Abstract Keywords" og "Customize color labels of reader" er lagret her for referanse, men er **deaktivert** i den sikkerhetskopierte profilen.

## Kilder
De fleste skriptene er hentet/tilpasset fra diskusjonstråder i [windingwind/zotero-actions-tags](https://github.com/windingwind/zotero-actions-tags/discussions) – se `@link` i toppen av hver fil for opprinnelig kilde.
