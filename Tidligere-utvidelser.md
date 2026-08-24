---
description: Utvidelser som er avinstallert, men som har etterlatt innstillinger i profilen
date: 2026-07-21
uid: E8TvnKcZeC
---
# Tidligere utvidelser

Disse dukket opp som egne innstillingsgrupper i Tara-sikkerhetskopien (21.7.2026), men tilhører **ingen** av de 33 utvidelsene i [README.md](Verktøy/Zotero/Zotero-Div/README.md) sin oversikt over installerte utvidelser – de er altså prøvd tidligere og siden avinstallert, men Zotero rydder ikke automatisk bort innstillingene til en fjernet utvidelse. Rene API-nøkler/tokens er **ikke** gjengitt her (kun nevnt at de finnes).

| Utvidelse | Hva den gjorde | Etterlatte innstillinger |
| --- | --- | --- |
| [Zutilo](https://github.com/wshanks/Zutilo) | Snarveier for å kopiere/åpne Zotero-lenker, kopiere forfattere, fjerne tags m.m. | Snarvei `Ctrl+R` for å relatere elementer; menyvalg merket «Zutilo»/«Zotero» for kopier collection-URI, kopier item-URI, kopier select-lenke, kopier forfattere, fjern tags. *(Funksjonaliteten er siden gjenskapt som egne skript i [Actions and Tags](Actions-and-Tags) – se Zutilo Copy/Paste og Zotero select.)* |
| [Cita](https://github.com/diegodlh/zotero-cita) | Siter Wikidata-elementer og bygg referanselister fra Wikidata-QID-er | Lagringsmodus for referanser satt til `note`, sortering på `ordinal`, viste ikke siteringsnumre |
| [Notero](https://github.com/dvanoni/notero) | Synker Zotero-elementer til en Notion-database | En Notion-database-ID og et Notion-integrasjonstoken lå lagret *(tokenet er ikke gjengitt her – se sikkerhetsmerknad nederst)* |
| [Zotero Reading List](https://github.com/redleafnew/zotero-reading-list) | Egen lesestatus-kolonne/ikon i elementlisten (overlapper med dine egne Status/*-tags i Actions and Tags) | Hurtigtaster og ikonvisning slått på |
| [Citation Counts](https://github.com/eschnett/zotero-citationcounts) | Hentet antall siteringer automatisk (fra Semantic Scholar) | Kilde satt til `semanticscholar` |
| Better Authors | Formaterte forfatterlisten i biblioteket (f.eks. «Etternavn et al.») | Viste kun første forfatter + siste forfatter (markert med `†` etter navnet), fullt fornavn, `...` for utelatte forfattere |
| [Chartero](https://github.com/volatile-static/Chartero) | Statistikk-dashbord for lesevaner/sitering | Skann-intervall 10 (dager), samt en cache med siteringsdata for tidligere skanninger |
| Format Metadata | Ryddet opp metadata (bl.a. «Extra»-feltet) | `cleanExtra` slått på (versjon 1.19.2) |
| Zotero GPT | Chat/AI-kommandoer rett i Zotero via OpenAI | En OpenAI-nøkkel lå lagret *(ikke gjengitt her – se sikkerhetsmerknad nederst)* |
| Attanger | Alternativ vedleggshåndtering | Vedleggstype satt til «importing» |
| Semantic Zotero | Fant relaterte artikler via Semantic Scholar | `relateItems` slått på |
| Zotero Pin Items | Fest elementer øverst i listen | Sekundærsortering og filsortering satt til «tittel» for én bestemt bruker-instans (`zotero-pin-items-hotmail-com`) |
| [Zotero PDF Translate](https://github.com/windingwind/zotero-pdf-translate) | Oversetter markert tekst/PDF i leseren | Målspråk `nb-NO` (norsk bokmål), ordbokkilde `freedictionaryapi`, oversettelseskilde `googleapi`. En del oversettelsestjenester har liggende felt for API-nøkkel i innstillingene – de fleste er tomme/uutfylte, men et fungerende nøkkelfelt for tjenesten **Caiyun** ser ut til å være fylt ut *(ikke gjengitt her)* |
| «zenotes» *(uidentifisert)* | Ikke sikkert identifisert – muligens et notat-/eksportverktøy | Målspråk `nb` (norsk), standard eksportformat `html`, en vertikal tabellvisning slått på, samt vindus-/kolonnestørrelser |

## Sikkerhetsmerknad
Backup-zipen fra Tara inneholder to reelle hemmeligheter i klartekst, fra utvidelsene over:
- **Notero**: et Notion-integrasjonstoken
- **Zotero GPT**: en OpenAI API-nøkkel

Disse er bevisst utelatt fra all dokumentasjon i dette repoet. Siden ingen av de to utvidelsene lenger er i bruk, bør nøklene vurderes tilbakekalt/rotert dersom de fortsatt er gyldige – uansett ligger de i klartekst i selve zip-filen så lenge den finnes.

## Se også
- [README.md](Verktøy/Zotero/Zotero-Div/README.md) – utvidelser som faktisk er installert i dag
- [Innstillinger.md](Verktøy/Zotero/Zotero-Div/Innstillinger.md) – innstillinger for aktive utvidelser
