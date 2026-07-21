---
description: Mine egendefinerte Zotero-oversettere (translators) for norske rettskilder
date: 2026-07-21
---
# Oversettere (translators)

Egenutviklede Zotero-oversettere for norske rettskilder – disse henter riktig metadata når man lagrer en side derfra via nettleserkoblingen, i stedet for å falle tilbake på en generisk "webside"-lagring. Alle tre lå i `translators/`-mappen i Tara-sikkerhetskopien (21.7.2026) med nyere `lastUpdated`-datoer enn Zoteros egne bunnede oversettere, som først avslørte at dette ikke var standardfiler.

| Oversetter | Fil | Nettsted | Elementtyper | Hva den gjør |
| --- | --- | --- | --- | --- |
| Lovdata | [Lovdata.js](Lovdata.js) | lovdata.no | `statute` (lover/forskrifter), `case` (rettsavgjørelser), `webpage` (fallback) | Kjenner igjen lov-/forskrift-URL-er og avgjørelses-URL-er. For lover: bygger fullt tittelformat («Lov 20. mai 2005 nr. 28 om straff»), henter korttittel, departement, SNL-sammendrag og endringshistorikk. For avgjørelser: henter domstol (med oppslag mot en fast liste over domstol-forkortelser), saksnummer, avgjørelsestype, stikkord/emneord, saksgang, parter (som «counsel») og dommere/rettsmedlemmer (parset til enkeltpersoner), samt en note med henvisninger i teksten |
| Regjeringen.no | [Regjeringen.no.js](Regjeringen.no.js) | regjeringen.no | `book` (NOU, proposisjoner, stortingsmeldinger), `statute` (rundskriv, instrukser, forskrifter m.m.), `document` (øvrige dokumenttyper) | Klassifiserer dokumentet ut fra `DC.Type`-metadata (med URL/H1 som fallback), setter serie/serienummer for NOU-er og proposisjoner, henter utvalgsnavn fra sammendraget for NOU-er, departement som forfatter/utgiver, og henter PDF/Word/EPUB-vedlegg fra siden. Inneholder egne testcases for NOU, Prop., Meld. St. og Rundskriv |
| Stortinget | [Stortinget.js](Stortinget.js) | stortinget.no | `bill` (innstillinger, lovanmerkninger), `statute` (lovvedtak) | Trigger kun på bestemte URL-mønstre under Innstillinger/Stortinget, Innstillinger/Odelstinget, Lovvedtak, Beslutninger/Odelstinget og Lovanmerkninger. Bygger kortreferanse med sesjon i parentes (f.eks. «Innst. 462 S (2025–2026)»), henter komité som institusjonell forfatter, og finner tilhørende sak for lovanmerkninger |

## Merknader
- Alle tre er lisensiert under AGPL-3.0, i tråd med Zoteros egen lisenspraksis for oversettere.
- Ingen av de tre er publisert i Zoteros offisielle oversetter-repositorium (`inRepository: false`) bortsett fra **Regjeringen.no**, som har `inRepository: true`.
- Skal installeres manuelt: Verktøy → Utvikler → Oversettere-editor i Zotero, eller ved å legge `.js`-filen direkte i Zotero-datamappens `translators/`-katalog.
