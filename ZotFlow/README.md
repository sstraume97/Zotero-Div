---
description: Hvordan få fotnoter/bibliografi i ZotFlow til å følge Chicago 17. utgave, inkl. på norsk
date: 2026-07-28
uid: h4pR9tXqLm
---
# ZotFlow

[ZotFlow](https://github.com/duanxianpi/zotflow) er en Obsidian-utvidelse (ikke en Zotero-utvidelse) som synker Zotero-biblioteket til lokal IndexedDB, genererer én auto-oppdatert "Source Note" (`.md`-fil) per Zotero-element, og lar deg sette inn siteringer mens du skriver – ved å dra fra Tree View, taste en triggerkarakter (`@@`), eller kopiere fra leseren. Full dokumentasjon: [zotflow-doc](https://github.com/duanxianpi/zotflow-doc) (Docusaurus-nettsted, kildene ligger i `docs/`-mappen).

Denne siden dekker kun ett tema: **hvorfor fotnotene/bibliografien ikke inneholdt riktig Chicago-informasjon, og hvordan det fikses.** For generell bruk av ZotFlow, se offisiell dok.

---

## Diagnose (sjekket mot faktisk `data.json` i dette hvelvet)

`.obsidian/plugins/zotflow/data.json` viste to separate problemer:

1. **`citationFootnoteTemplate: ""`** – tomt felt betyr at ZotFlow bruker sin innebygde fallback-mal for fotnotedefinisjonen:

   ```liquid
   {%- if item.creators.length > 1 -%}
   {{ item.creators[0].name }} et al.
   {%- elsif item.creators.length == 1 -%}
   {{ item.creators[0].name }}
   {%- else -%}
   Unknown Author
   {%- endif -%}, *{{ item.title }}* ({{ item.date | slice: 0, 4 }}).
   ```

   Dette er ren Liquid-tekst – **ikke** kjørt gjennom en CSL-stil/citeproc. Den gir kun `Forfatter, *Tittel* (År).` og dropper forlag, utgivelsessted, tidsskrift, volum/hefte, sidetall, redaktør/oversetter, DOI/URL osv., uansett hvilken CSL-stil som er installert.

2. **`cslDefaultStyleId: "chicago-notes-bibliography"`** – dette er den *versjonsløse* stil-iden i det offisielle [CSL style-repoet](https://github.com/citation-style-language/styles). Jeg sjekket `<title>`-taggen i selve filen direkte fra repoet: den er nå **"Chicago Manual of Style 18th edition (notes and bibliography)"** – ikke 17. utgave. (Samme gjelder `chicago-shortened-notes-bibliography.csl`, som også ligger i [Sitérstiler.md](../Sitérstiler.md) merket 18. utgave.)

   17.-utgave-varianten finnes som egen, stabil id: `chicago-notes-bibliography-17th-edition` (fullnote hver gang) og `chicago-shortened-notes-bibliography-17th-edition` (kortnote hver gang – gyldig etter Chicago 17 §13.3/14.28 *forutsatt* at en fullstendig bibliografi følger med).

`defaultCitationFormat: "footnote"` stemte allerede med ønsket standard siteringsform, og `cslDefaultFormat: "markdown"` er riktig valgt for Obsidian (kursiv med `*…*` fungerer direkte).

---

## Løsning

### 1. Legg til riktig CSL-stil

**Activity Center (ribbon-ikon) → CSL-fanen → "Add by id":**

```
chicago-notes-bibliography-17th-edition
chicago-shortened-notes-bibliography-17th-edition
```

ZotFlow henter parent-stil og nødvendig locale automatisk ved behov, og viser en live-forhåndsvisning før den legges til.

### 2. Sett riktig standardstil

**Settings → ZotFlow → CSL:**

| Felt | Ny verdi |
| --- | --- |
| Default Style | `chicago-notes-bibliography-17th-edition` |
| Default Output Format | `markdown` *(uendret – allerede riktig)* |

### 3. Erstatt Footnote Definition Template

**Settings → ZotFlow → Citation → Footnote Definition Template:**

```liquid
[^{{ item.citationKey | default: item.key }}]: {% if annotations.size > 0 %}{{ annotations | citation: "chicago-notes-bibliography-17th-edition", locale: "nb-NO" }}{% else %}{{ item | citation: "chicago-notes-bibliography-17th-edition", locale: "nb-NO" }}{% endif %}
```

> **Siden ZotFlow 1.2.1** må Footnote Definition Template selv produsere sin `[^marker]:`-prefiks, matchende Footnote Reference Template (standard: `[^{{ item.citationKey | default: item.key }}]`) – ellers vises varselet *"Your Footnote Definition Template is using the legacy format"*. Malen over eier prefikset selv (`[^…]: ` helt i starten), så den er trygg.

Dette kjører citeproc med den ekte 17.-utgave-stilen i stedet for den hardkodede Liquid-malen. Resultatet blir en fullstendig, korrekt formatert Chicago-fotnote for elementtypen (bok, artikkel, nettside osv. formateres automatisk ulikt), med sidetall (`annotations`-arrayet) automatisk lagt til når en annotasjon/markering var valgt ved innsetting.

> Bruk `"nn-NO"` i stedet for `"nb-NO"` dersom du skriver nynorsk. `locale` er et per-kall-parameter i ZotFlow – det finnes ingen global "standard språk"-innstilling, så den må stå eksplisitt i hver mal du vil ha på norsk (samme prinsipp gjelder om du senere bruker `citation`/`bibliography` i Pandoc- eller Wikilink-malen, eller i selve Source Note-malen).

### 4. Valgfritt: kortnote + egen litteraturliste

Chicago tillater kortform i *alle* fotnoter (også første gang) dersom dokumentet har en fullstendig bibliografi et sted. Siden ZotFlows `citation`-filter rendrer hvert kall uavhengig (ingen automatisk ibid./forkortelse-etter-første-gang – se [kjente begrensninger](https://duanxianpi.github.io/zotflow-doc/docs/template-filters#citation-csl)), er dette den praktiske måten å få kortere fotnoter uten å miste informasjon:

- Footnote Definition Template bruker `chicago-shortened-notes-bibliography-17th-edition` i stedet for fullnote-stilen over.
- Litteraturliste genereres separat med `bibliography`-filteret og fullnote-stilen, f.eks. som et eget avsnitt i Source Note-malen for hvert element:

  ```liquid
  ## Referanse (Chicago 17)
  {{ item | bibliography: "chicago-notes-bibliography-17th-edition", locale: "nb-NO" }}
  ```

  Dette har en ekstra fordel: rendres et felt tomt her (f.eks. manglende utgivelsessted), er det et konkret signal om at Zotero-metadataen for elementet mangler noe – altså en gratis kvalitetssjekk av biblioteket.

### 5. Test

Sett inn en fotnote (trigger `@@` eller dra fra Tree View) på et par ulike elementtyper (bok, tidsskriftartikkel, nettside) og sjekk at forlag/tidsskrift/sidetall faktisk vises. Jeg har ikke kunnet teste dette direkte i den kjørende Obsidian-appen (skrivebordsapp, ikke tilgjengelig via nettleserverktøyet) – gi beskjed om noe ser feil ut i praksis, så justerer vi malen.

---

## Norsk vs. eksisterende juridiske stiler

De norske stilene som allerede ligger i [Sitérstiler.md](../Sitérstiler.md) (`norsk-henvisningsstandard-for-rettsvitenskapelige-tekster*.csl`, `universitetet-i-oslo-rettsvitenskap.csl`) er en **egen norsk siteringsstandard for rettsvitenskap** – ikke Chicago. `locale: "nb-NO"` på en Chicago-stil gir *Chicago-strukturen* med norske termer (f.eks. "mfl." for "et al.", "red." for "editor", "s." for "p./pp.", "og" for "and") – det er to forskjellige ting, velg ut fra hva teksten faktisk skal siteres etter.

## Se også
- [Sitérstiler.md](../Sitérstiler.md) – alle 25 CSL-stilene i Zotero-profilen
- [zotflow-doc: Citation & Writing Flow](https://duanxianpi.github.io/zotflow-doc/docs/citation-guide)
- [zotflow-doc: CSL Citations](https://duanxianpi.github.io/zotflow-doc/docs/csl-citations)
- [zotflow-doc: Template Filters](https://duanxianpi.github.io/zotflow-doc/docs/template-filters)
