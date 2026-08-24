---
description: Utvalgte innstillinger og maler fra Zotero-profilen, utover utvidelseslisten i README
date: 2026-07-21
uid: 76KK3YvEUX
---
# Innstillinger og maler

Hentet fra samme Tara-sikkerhetskopi (21.7.2026) som [utvidelseslisten](Verktøy/Zotero/Zotero-Div/README.md). Dette er innstillinger som ligger i `prefs.js`/utvidelsenes egne lagringsplasser, og som derfor ikke vises noe annet sted i repoet. API-nøkler er **ikke** tatt med her.

## Better BibTeX
- Citation key-formel (både ved generering og redigering): `auth.lower + shorttitle(3, 3) + year`

## Better Notes (intern-ID `Knowledge4Zotero`)
Alle 16 egendefinerte notatmalene er hentet ut med fullt innhold og dokumentert i [Notatmaler/README.md](Notatmaler/README.md).

## PDF-leserens utseende (zoterotag/ZoteroStyle)
- Fargetemaer for PDF-visning: ☀️ (ingen filter/standard), ✨ (invertert/"mørk-lys"-blanding), 🌙 (mørkt tema med sepia+invert)
- Egne kolonnevisninger i elementlisten: **Bred** (Progress, dato, forfatter, vedlegg, lesestatus, tittel), **Smal** og **X Smal**
- Egendefinerte farger på tittelkolonnen (bakgrunn, valgt-farge, opasitet 0,54)

## ZotMoov
- Filbehandling satt til `copy` (kopierer filer til målmappen i stedet for å flytte dem)

## Word- og LibreOffice-integrasjon
Zoteros innebygde tillegg for tekstbehandlere. Ingen egne tilpasninger utover standardoppsettet – kun versjonsmarkører som viser at begge har vært installert/forsøkt installert (Word 9.0.0, LibreOffice/OpenOffice 7.0.1, sistnevnte med `skipInstallation` slått på). Se også [Word/Sorting a Bibliography by Document Types.md](Word/Sorting%20a%20Bibliography%20by%20Document%20Types.md) for egen dokumentasjon om Word-oppsettet.

## Oversettere (translators)
Mappen `translators/` inneholder rundt 750 filer. De aller fleste er Zoteros egne innebygde nettstedsoversettere, synkronisert til nyere versjoner via oversetter-serveren – **men** tre av dem er egenskrevne: se [Oversettere/README.md](Oversettere/README.md) for Lovdata, Regjeringen.no og Stortinget. *(Rettet 21.7.2026 – disse ble først feilaktig antatt å være rutineoppdateringer av standardoversettere.)*

## Sitérstiler
Se egen fil: [Sitérstiler.md](Sitérstiler.md) – 25 CSL-stiler, inkludert flere norske og rettsvitenskapelige stiler.

## Tidligere utvidelser
Se egen fil: [Tidligere-utvidelser.md](Tidligere-utvidelser.md) – innstillinger som ligger igjen etter utvidelser som er avinstallert (Zutilo, Cita, Notero, Chartero m.fl.), inkludert en sikkerhetsmerknad om to API-nøkler som ligger i klartekst i selve backup-zipen.

## Annet
- [ZotSeek](https://github.com/introfini/ZotSeek) kjører i `semantic`-modus (hybrid embeddings + nøkkelordsøk)
- Lokaliseringsmotorene (Google Scholar, Anna's Archive m.fl.) er dokumentert i [engines.json](engines.json) og er uendret siden forrige commit
- Egne Actions and Tags-regler og -skript er dokumentert separat i [Actions-and-Tags/README.md](Actions-and-Tags/README.md)
