---
description: Mine notatmaler i Better Notes (Knowledge4Zotero)
date: 2026-07-21
---
# Notatmaler (Better Notes)

[Better Notes for Zotero](https://github.com/windingwind/zotero-better-notes) (intern-ID `Knowledge4Zotero`) lar deg lage egne maler for notater, hurtiginnsetting og eksport. Malene bruker et lite templatespråk der `${...}` kjører JavaScript og settes inn i HTML-en, og spesielle kommentarer som `// @beforeloop-begin` / `// @default-begin` / `// @afterloop-begin` styrer looping over flere valgte elementer.

Hentet fra samme Tara-sikkerhetskopi (21.7.2026) som [utvidelseslisten](../README.md). Malene ligger under Rediger → Innstillinger → Better Notes → Maler i Zotero.

> Noen av malene inneholder synlige `\n`-tegn midt i HTML-en (f.eks. i lesenotat-malene). Dette er ikke en feil i uttrekket – det ligger slik i selve malen i profilen, sannsynligvis fra tidligere klipp-og-lim mellom malseksjoner i Better Notes-editoren.

## Elementmaler (høyreklikk → Nytt notat fra mal)

| Mal | Fil | Hva den gjør |
| --- | --- | --- |
| `[Item] Lesenotat` | [Item-Lesenotat.html](Item-Lesenotat.html) | Hovedmalen for lesenotater: metadatatabell (tittel, type, forfattere, dato, DOI, URL, citation key) etterfulgt av fire faste seksjoner – **Nyttighet**, **Første lesning**, **Andre lesning**, **Tredje lesning** – som en strukturert leseguide for artikler |
| `[item]Lesenotat Sak TBG` | [Item-Lesenotat-Sak-TBG.html](Item-Lesenotat-Sak-TBG.html) | Samme oppbygning som lesenotat-malen over, men tilpasset saksbehandling/kommunale saker: kommunedirektørens innstilling, bakgrunn, faktagrunnlag, rettslig grunnlag, FN-bærekraftsmål, klima, økonomi osv. |
| `[Item] Boknotat` | [Item-Boknotat.html](Item-Boknotat.html) | Bokspesifikk mal: metadatatabell (tittel, forlag, forfattere, dato, ISBN, lenke til fil) + seksjoner for Notater, Inntrykk/tanker/spørsmål, Konklusjoner, Sitater |
| `[item]Reference Note` | [Item-Reference-Note.html](Item-Reference-Note.html) | Basert på ["Reference Note"-malen](https://github.com/Calorion/zotero-better-notes-reference-note-template) fra Better Notes-miljøet: bibliografi-header, metadata (type, DOI/URL, vedlegg) og seksjonene **Referred from / References / Related to / Source notes** for å bygge et lenket nettverk mellom notater |
| `[Item] Fargekoding` | [Item-Fargekoding.html](Item-Fargekoding.html) | Grupperer alle annotasjoner i vedleggene til et element etter fargekode, med egne overskrifter per farge (🖌️ Generelle uthevinger, ❓ Ord og forkortelser, ❗ Viktige uthevinger, 👍 Henvisninger, 📚 Konklusjoner og ideer, 💡 Evidens og konklusjoner, 🧑‍💼 Personer). Samme fargesystem som brukes i [fargelabel-skriptet](../Actions-and-Tags/Customize-Color-Labels-of-Reader.js) |
| `[Item] all annotations and notes by tag` | [Item-All-Annotations-And-Notes-By-Tag.html](Item-All-Annotations-And-Notes-By-Tag.html) | Samler alle annotasjoner og notater (fra vedlegg + egne notater) gruppert etter tag – bygger én overskrift per tag med lenker og renderte annotasjoner. Ignorerer interne `zotero://`-tags |
| `[item] Annotation Matrix` | [Item-Annotation-Matrix.html](Item-Annotation-Matrix.html) | Bygger en tabell/matrise for **flere valgte elementer samtidig**: rader = artikkel (forfatter, år), kolonner = egendefinerte tags som starter med `*`. Nyttig for å sammenligne annotasjoner på tvers av flere artikler side ved side |

## Hurtiginnsetting og lenker (QuickInsert/QuickNote/QuickImport)

| Mal | Fil | Hva den gjør |
| --- | --- | --- |
| `[QuickInsertV3]` | [QuickInsert-V3.html](QuickInsert-V3.html) | Markdown-lenke (`[tekst](lenke)`) ved hurtiginnsetting av en referanse til et element/notat/samling – nyeste versjon |
| `[QuickInsertV2]` | [QuickInsert-V2.html](QuickInsert-V2.html) | Eldre variant av samme funksjon, men som HTML-lenke i stedet for Markdown |
| `[QuickBackLinkV2]` | [QuickBackLink-V2.html](QuickBackLink-V2.html) | Setter inn en "Referred in [lenke]"-baklenke der et notat er referert fra et annet sted |
| `[QuickNoteV5]` | [QuickNote-V5.html](QuickNote-V5.html) | Ved hurtignotat fra en annotasjon: setter inn eventuell kommentar (konvertert fra Markdown) + selve annotasjonen som HTML |
| `[QuickImportV2]` | [QuickImport-V2.html](QuickImport-V2.html) | Setter inn lenket innhold fra en annen note/annotasjon som et sitatblokk (`<blockquote>`) ved import |

## Eksport (Markdown/LaTeX)

| Mal | Fil | Hva den gjør |
| --- | --- | --- |
| `[ExportMDFileContent]` | [Export-MD-File-Content.html](Export-MD-File-Content.html) | Filinnholdet ved eksport til Markdown – returnerer det konverterte MD-innholdet uendret (ingen ekstra bearbeiding) |
| `[ExportLatexFileContent]` | [Export-Latex-File-Content.html](Export-Latex-File-Content.html) | Tilsvarende for LaTeX-eksport – returnerer `latexContent` uendret |
| `[ExportMDFileHeaderV2]` | [Export-MD-File-Header-V2.html](Export-MD-File-Header-V2.html) | Bygger en JSON-header med metadata (tags, foreldreelementets tittel, samlinger) som skrives øverst i eksporterte Markdown-filer |
| `[ExportMDFileNameV2]` | [Export-MD-File-Name-V2.html](Export-MD-File-Name-V2.html) | Genererer filnavnet ved eksport: notatittel (ugyldige tegn fjernet) + notatets nøkkel + `.md` |

## Kilder
Enkelte maler er bygget videre på community-maler, se kommentarer øverst i filene, bl.a. [Paper Notes](https://github.com/windingwind/zotero-better-notes/discussions/1099) og [Reference Note-malen](https://github.com/Calorion/zotero-better-notes-reference-note-template).
