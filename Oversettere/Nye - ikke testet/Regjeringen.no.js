{
	"translatorID": "7a6c9b2e-d4f5-4789-abed-ef0123456789",
	"label": "Regjeringen.no",
	"creator": "Sondre Bogen-Straume",
	"target": "^https?://www\\.regjeringen\\.no/",
	"minVersion": "3.0",
	"maxVersion": "",
	"priority": 100,
	"inRepository": true,
	"translatorType": 4,
	"browserSupport": "gcsibv",
	"lastUpdated": "2026-07-21 15:44:42"
}

/*
	***** BEGIN LICENSE BLOCK *****

	Copyright © 2026 Sondre Bogen-Straume

	This file is part of Zotero.

	Zotero is free software: you can redistribute it and/or modify
	it under the terms of the GNU Affero General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.

	Zotero is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
	GNU Affero General Public License for more details.

	You should have received a copy of the GNU Affero General Public License
	along with Zotero. If not, see <http://www.gnu.org/licenses/>.

	***** END LICENSE BLOCK *****
*/

// ── Utilities ─────────────────────────────────────────────────────────────────

/** Read a <meta name="…"> or <meta property="…"> content value. */
function meta(doc, nameOrProp) {
	var el = doc.querySelector(
		'meta[name="' + nameOrProp + '"], meta[property="' + nameOrProp + '"]'
	);
	return el ? el.getAttribute('content') || '' : '';
}

// ── Document type classification ──────────────────────────────────────────────

/*
 * DC.Type values observed on regjeringen.no (mapped to Zotero item types):
 *
 *   Book (itemType = 'book'):
 *     NOU, Proposisjon, Melding til Stortinget, Stortingsmelding,
 *     Budsjettproposisjon
 *
 *   Statute (itemType = 'statute'):
 *     Rundskriv, Instruks, Kongelig resolusjon, Reglement, Forskrift
 *
 *   Document (itemType = 'document'):
 *     Tolkningsuttalelse, Retningslinjer, Veiledning, Rapport, Brev
 *
 *   Webpage (itemType = 'webpage'):
 *     Anything else — pages without one of the specific types above are
 *     saved as an ordinary webpage rather than mislabeled as 'document'.
 */
var DC_TYPE_MAP = {
	// → book
	nou: 'book',
	proposisjon: 'book',
	'melding til stortinget': 'book',
	stortingsmelding: 'book',
	budsjettproposisjon: 'book',
	// → statute
	rundskriv: 'statute',
	instruks: 'statute',
	'kongelig resolusjon': 'statute',
	kongeligresolusjon: 'statute', // actual value used on regjeringen.no (no space)
	reglement: 'statute',
	forskrift: 'statute',
	// → document
	tolkningsuttalelse: 'document',
	retningslinjer: 'document',
	retningslinje: 'document',
	veiledning: 'document',
	rapport: 'document',
	brev: 'document'
};

// Human-readable Norwegian labels for the Zotero `type` field (document items)
// and `code` field (statute items). Keyed by normalised DC.Type value.
var DC_TYPE_LABEL = {
	tolkningsuttalelse: 'Tolkningsuttalelse',
	retningslinjer: 'Retningslinje',
	retningslinje: 'Retningslinje',
	veiledning: 'Veiledning',
	rapport: 'Rapport',
	brev: 'Brev',
	rundskriv: 'Rundskriv',
	instruks: 'Instruks',
	'kongelig resolusjon': 'Kongelig resolusjon',
	kongeligresolusjon: 'Kongelig resolusjon',
	reglement: 'Reglement',
	forskrift: 'Forskrift'
};

function classifyByDCType(dcType) {
	if (!dcType) return null;
	return DC_TYPE_MAP[dcType.toLowerCase()] || null;
}

/**
 * Fallback classification based on URL and h1 when DC.Type is absent or
 * unrecognised.
 */
function classifyByUrlAndH1(doc, url) {
	// URL patterns for numbered parliamentary docs
	if (/\/nou-\d{4}-\d+\//i.test(url)) return 'book';
	if (/\/prop\.-\d+/i.test(url)) return 'book';
	if (/\/meld\.-st\.-\d+/i.test(url)) return 'book';
	if (/\/st\.-meld\.-/i.test(url)) return 'book';
	if (/\/st\.-prp\.-/i.test(url)) return 'book';

	var h1 = doc.querySelector('h1');
	var h1Text = h1 ? h1.textContent.trim() : '';

	if (/^NOU\s+\d{4}:/i.test(h1Text)) return 'book';
	if (/^Prop\.\s+\d+/i.test(h1Text)) return 'book';
	if (/^Meld\.\s+St\.\s+\d+/i.test(h1Text)) return 'book';
	if (/^St\.meld\./i.test(h1Text)) return 'book';
	if (/^St\.prp\./i.test(h1Text)) return 'book';
	if (/^Rundskriv\s/i.test(h1Text)) return 'statute';
	if (/^[A-ZÆØÅ]-\d+\/\d{4}/i.test(h1Text)) return 'statute';
	if (/^Instruks\s/i.test(h1Text)) return 'statute';

	return 'webpage';
}

function classifyDocument(doc, url) {
	var dcType = meta(doc, 'DC.Type');
	return classifyByDCType(dcType) || classifyByUrlAndH1(doc, url);
}

// ── Main translator functions ─────────────────────────────────────────────────

function detectWeb(doc, url) {
	// Only fire on document pages that have DC.Type or a recognisable h1
	var dcType = meta(doc, 'DC.Type');
	var dcTitle = meta(doc, 'DC.Title');
	if (!dcType && !dcTitle) return false;
	return classifyDocument(doc, url);
}

function doWeb(doc, url) {
	scrape(doc, url);
}

function scrape(doc, url) {
	var itemType = classifyDocument(doc, url);
	var dcType = meta(doc, 'DC.Type'); // e.g. "NOU", "Rundskriv", …
	var item = new Zotero.Item(itemType);

	// ── Title ──────────────────────────────────────────────────────────────
	// DC.Title format: "NOU 2026: 6 - Den nye velferdskommunen"
	// og:title format: "NOU 2026: 6"  (document number only)
	var dcTitle = meta(doc, 'DC.Title'); // full title with " - " separator
	var ogTitle = meta(doc, 'og:title'); // short document number

	if (dcTitle) {
		// Replace the first " - " separator with a space to get Zotero title
		item.title = dcTitle.replace(/\s+-\s+/, ' ');
	}
	else if (ogTitle) {
		item.title = ogTitle;
	}

	// shortTitle = document number (og:title when there is a subtitle)
	if (ogTitle && dcTitle && dcTitle.includes(' - ')) {
		item.shortTitle = ogTitle;
	}

	// ── Series, series number, code, and type ────────────────────────────
	var dcTypeNorm = (dcType || '').toLowerCase();

	if (dcTypeNorm === 'nou') {
		item.series = 'Norges offentlige utredninger';
		if (ogTitle) {
			var snMatch = ogTitle.match(/^NOU\s+(\d{4}:\s*\d+)/i);
			if (snMatch) item.seriesNumber = snMatch[1];
		}
	}
	else if (dcTypeNorm === 'proposisjon' || dcTypeNorm === 'budsjettproposisjon') {
		item.series = 'Proposisjon';
		if (ogTitle) item.seriesNumber = ogTitle;
	}
	else if (dcTypeNorm === 'stortingsmelding' || dcTypeNorm === 'melding til stortinget') {
		item.series = 'Melding til Stortinget';
		if (ogTitle) item.seriesNumber = ogTitle;
	}

	if (itemType === 'statute') {
		item.code = DC_TYPE_LABEL[dcTypeNorm] || dcType || '';
		if (item.title) {
			var numMatch = item.title.match(/^([A-ZÆØÅ]-\d+\/\d{4}|\d+\/\d{2,4})/i);
			if (numMatch) item.codeNumber = numMatch[1];
		}
	}

	if (itemType === 'document' && DC_TYPE_LABEL[dcTypeNorm]) {
		item.type = DC_TYPE_LABEL[dcTypeNorm];
	}

	// ── Author: committee name for NOUs ───────────────────────────────────
	if (dcTypeNorm === 'nou') {
		var committee = extractCommitteeFromDescription(
			meta(doc, 'DC.Description') || meta(doc, 'description')
		);
		if (committee) {
			item.creators.push({
				lastName: committee,
				creatorType: 'author',
				fieldMode: 1 // institutional author
			});
		}
	}

	// ── Publisher / author: DC.Creator holds the responsible department ────
	// statute items have no native publisher field → add as institutional author
	// DC.Creator is preferred; fall back to 'author'. Both may contain the
	// generic value "regjeringen.no" on some pages – skip that non-value.
	var dcCreator = meta(doc, 'DC.Creator');
	if (!dcCreator || /^regjeringen\.no$/i.test(dcCreator)) {
		dcCreator = meta(doc, 'author');
	}
	if (/^regjeringen\.no$/i.test(dcCreator)) dcCreator = '';
	if (dcCreator) {
		if (itemType === 'statute') {
			item.creators.push({
				lastName: dcCreator,
				creatorType: 'author',
				fieldMode: 1
			});
		}
		else {
			item.publisher = dcCreator;
		}
	}

	// ── Place, date, language ─────────────────────────────────────────────
	item.place = 'Oslo';
	item.date = meta(doc, 'DC.Date') || null; // already ISO: "2026-05-28"
	item.language = (meta(doc, 'DC.Language') || 'nb').replace(/-.*$/, ''); // "nb-NO" → "nb"
	item.url = url;

	// ── Abstract ──────────────────────────────────────────────────────────
	var desc = meta(doc, 'DC.Description') || meta(doc, 'description');
	if (desc) item.abstractNote = desc;

	// ── Subject tags ──────────────────────────────────────────────────────
	// DC.Subject is a comma-separated list: "Arbeidsliv, Forskning, …"
	var subjects = meta(doc, 'DC.Subject');
	if (subjects) {
		subjects.split(',').forEach(function (s) {
			var tag = s.trim();
			if (tag) item.tags.push(tag);
		});
	}

	// ── Attachments (PDF / Word / EPUB from page body) ────────────────────
	attachFiles(doc, item, dcType, url);

	item.complete();
}

// ── Helper: committee name from description text ──────────────────────────────

function extractCommitteeFromDescription(desc) {
	if (!desc) return null;
	// Matches e.g. "Innovasjons- og samskapingsutvalget ble oppnevnt …"
	var m = desc.match(
		/([A-ZÆØÅ][a-zæøåA-ZÆØÅ\s-]+(?:utvalget|kommisjonen|komiteen|komitéen|rådet|gruppen|arbeidsgruppen))/
	);
	if (m && m[1].length > 8 && m[1].length < 120) return m[1].trim();
	return null;
}

// ── Helper: attach PDF / Word / EPUB ─────────────────────────────────────────

function attachFiles(doc, item, dcType, pageUrl) {
	var origin = pageUrl.match(/^https?:\/\/[^/]+/)[0];
	var seen = {};
	var counts = { pdf: 0, docx: 0, epub: 0 };
	var isNOU = dcType && /^NOU$/i.test(dcType);

	function absHref(href) {
		if (!href) return null;
		if (/^https?:\/\//i.test(href)) return href;
		if (href.startsWith('/')) return origin + href;
		return null;
	}

	var links = Array.from(doc.querySelectorAll('a[href]'));

	for (var link of links) {
		var href = absHref(link.getAttribute('href'));
		if (!href || !href.includes('/contentassets/')) continue;
		if (seen[href]) continue;

		var label = link.textContent.trim();

		if (/\.pdf$/i.test(href)) {
			// For all types: always attach first PDF; for NOUs also attach appendices
			if (counts.pdf === 0 || isNOU) {
				item.attachments.push({
					url: href,
					title: label || (counts.pdf === 0 ? 'Fulltekst PDF' : 'Vedlegg PDF'),
					mimeType: 'application/pdf'
				});
				seen[href] = true;
				counts.pdf++;
			}
		}
		else if (/\.docx$/i.test(href) && counts.docx === 0) {
			item.attachments.push({
				url: href,
				title: label || 'Word-dokument',
				mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
			});
			seen[href] = true;
			counts.docx++;
		}
		else if (/\.epub$/i.test(href) && counts.epub === 0) {
			item.attachments.push({
				url: href,
				title: label || 'EPUB',
				mimeType: 'application/epub+zip'
			});
			seen[href] = true;
			counts.epub++;
		}
	}

	// Always include a webpage snapshot
	item.attachments.push({
		url: pageUrl,
		title: 'Regjeringen.no – nettside',
		mimeType: 'text/html',
		snapshot: true
	});
}

/** BEGIN TEST CASES **/
var testCases = [
	{
		"type": "web",
		"url": "https://www.regjeringen.no/no/dokumenter/nou-2026-6/id3162501/",
		"items": [
			{
				"itemType": "book",
				"creators": [
					{
						"lastName": "Innovasjons- og samskapingsutvalget",
						"creatorType": "author",
						"fieldMode": 1
					}
				],
				"notes": [],
				"tags": [
					{
						"tag": "Arbeidsliv"
					},
					{
						"tag": "Arbeidsmarked og sysselsetting"
					},
					{
						"tag": "Boligpolitikk"
					},
					{
						"tag": "By- og stedsutvikling"
					},
					{
						"tag": "Forskning"
					},
					{
						"tag": "Frivillighet"
					},
					{
						"tag": "Helse og omsorg"
					},
					{
						"tag": "Kommunale helse- og omsorgstjenester"
					},
					{
						"tag": "Kommuner og regioner"
					},
					{
						"tag": "Kultur"
					},
					{
						"tag": "Næringsliv"
					},
					{
						"tag": "Offentlige anskaffelser"
					},
					{
						"tag": "Plan"
					},
					{
						"tag": "bygg og eiendom"
					},
					{
						"tag": "idrett og frivillighet"
					}
				],
				"seeAlso": [],
				"attachments": [
					{
						"title": "Dokumentet i PDF format (9,1 MB)",
						"mimeType": "application/pdf"
					},
					{
						"title": "Dokumentet i Word format (2,1 MB)",
						"mimeType": "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
					},
					{
						"title": "Vedlegg 1: Forskernotat (Rønning): Omsorg på randen? Om regulatoriske hemmere og fremmere for innovasjon og samskaping",
						"mimeType": "application/pdf"
					},
					{
						"title": "Vedlegg 2: Forskernotat (Aastvedt og Western): Samskaping i norske kommuner – Hva vet vi om effekten?",
						"mimeType": "application/pdf"
					},
					{
						"title": "Vedlegg 3: Forskernotat (Andfossen): Hva vet vi om sivilsamfunnets bidrag til gode omsorgsfellesskap i lokalsamfunn?",
						"mimeType": "application/pdf"
					},
					{
						"title": "Vedlegg 4: Forskernotat (Radlick, Sveinsdottir og Fyhn): Effekter av tverrsektorielle tiltak for å motvirke utenforskap",
						"mimeType": "application/pdf"
					},
					{
						"title": "Vedlegg 5: Forskernotat (Førland og Tuntland): Hvordan går det egentlig med hverdagsrehabiliteringen – egentlig?",
						"mimeType": "application/pdf"
					},
					{
						"title": "Vedlegg 6: Forskernotat (Haldar): Hvordan få til et mer mangfoldig samskapingslag i arbeidet med utvikling av omsorgstjenestene?",
						"mimeType": "application/pdf"
					},
					{
						"title": "Vedlegg 7: Menon Economics - Samfunnsøkonomiske drøftinger av Innovasjons- og samskapingsutvalgets tiltak",
						"mimeType": "application/pdf"
					},
					{
						"title": "Vedlegg 8: Framtidsbilder",
						"mimeType": "application/pdf"
					},
					{
						"title": "Vedlegg 9: Oppsummering av framtidsverksted",
						"mimeType": "application/pdf"
					},
					{
						"title": "Regjeringen.no – nettside",
						"mimeType": "text/html",
						"snapshot": true
					}
				],
				"title": "NOU 2026: 6 Den nye velferdskommunen",
				"shortTitle": "NOU 2026: 6",
				"series": "Norges offentlige utredninger",
				"seriesNumber": "2026: 6",
				"publisher": "Helse- og omsorgsdepartementet",
				"place": "Oslo",
				"date": "2026-05-28",
				"language": "nb",
				"url": "https://www.regjeringen.no/no/dokumenter/nou-2026-6/id3162501/",
				"abstractNote": "Innovasjons- og samskapingsutvalget ble oppnevnt i oktober 2024. Utvalget har utredet hvordan samskaping og innovasjon kan benyttes i utviklingen av nye og bærekraftige løsninger i framtidas helse-, omsorgs- og velferdstjenester, med kommunen som omdre...",
				"libraryCatalog": "Regjeringen.no"
			}
		]
	},
	{
		"type": "web",
		"url": "https://www.regjeringen.no/no/dokumenter/prop.-108-l-20252026/id3166575/",
		"items": [
			{
				"itemType": "book",
				"creators": [],
				"notes": [],
				"tags": [
					{
						"tag": "Innvandring og integrering"
					}
				],
				"seeAlso": [],
				"attachments": [
					{
						"title": "Dokumentet i PDF format (571,2 kB)",
						"mimeType": "application/pdf"
					},
					{
						"title": "Dokumentet i Word format (108,7 kB)",
						"mimeType": "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
					},
					{
						"title": "Regjeringen.no – nettside",
						"mimeType": "text/html",
						"snapshot": true
					}
				],
				"title": "Prop. 108 L (2025–2026) Endringer i utlendingsloven (familiegjenforening med barn m.m.)",
				"shortTitle": "Prop. 108 L (2025–2026)",
				"series": "Proposisjon",
				"seriesNumber": "Prop. 108 L (2025–2026)",
				"publisher": "Justis- og beredskapsdepartementet",
				"place": "Oslo",
				"date": "2026-06-19",
				"language": "nb",
				"url": "https://www.regjeringen.no/no/dokumenter/prop.-108-l-20252026/id3166575/",
				"abstractNote": "Lovproposisjonen inneholder forslag til endringer i utlendingslovens regler som gir foreldre og søsken rett oppholdstillatelse i familiegjenforening med barn i Norge. Endringene skal blant annet forhindre at det gis oppholdstillatelse til foreldre og s...",
				"libraryCatalog": "Regjeringen.no"
			}
		]
	},
	{
		"type": "web",
		"url": "https://www.regjeringen.no/no/dokumenter/meld.-st.-12-20252026/id3166605/",
		"items": [
			{
				"itemType": "book",
				"creators": [],
				"notes": [],
				"tags": [
					{
						"tag": "Eksportkontroll"
					},
					{
						"tag": "Forsvarsindustri"
					},
					{
						"tag": "Handel"
					},
					{
						"tag": "Ukraina"
					}
				],
				"seeAlso": [],
				"attachments": [
					{
						"title": "Dokumentet i PDF format (9 MB)",
						"mimeType": "application/pdf"
					},
					{
						"title": "Dokumentet i Word format (2,4 MB)",
						"mimeType": "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
					},
					{
						"title": "Regjeringen.no – nettside",
						"mimeType": "text/html",
						"snapshot": true
					}
				],
				"title": "Meld. St. 12 (2025–2026) Eksport av forsvarsmateriell fra Norge og eksportkontroll i 2025",
				"shortTitle": "Meld. St. 12 (2025–2026)",
				"series": "Melding til Stortinget",
				"seriesNumber": "Meld. St. 12 (2025–2026)",
				"publisher": "Utenriksdepartementet",
				"place": "Oslo",
				"date": "2026-06-19",
				"language": "nb",
				"url": "https://www.regjeringen.no/no/dokumenter/meld.-st.-12-20252026/id3166605/",
				"abstractNote": "Med denne meldingen til Stortinget legger Regjeringen frem informasjon om eksporten av våpen, ammunisjon og annet militært materiell fra Norge i 2025, samt eksporten av flerbruksvarer til militær sluttbruk i utlandet. Det er Regjeringens mål å bidra ti...",
				"libraryCatalog": "Regjeringen.no"
			}
		]
	},
	{
		"type": "web",
		"url": "https://www.regjeringen.no/no/dokumenter/rundskriv-0126-tilskuddssatser-for-tilskuddsberettigede-anleggstyper-for-soknadsaret-2027/id3166007/",
		"items": [
			{
				"itemType": "statute",
				"creators": [
					{
						"lastName": "Kultur- og likestillingsdepartementet",
						"creatorType": "author",
						"fieldMode": 1
					}
				],
				"notes": [],
				"tags": [
					{
						"tag": "Kultur"
					},
					{
						"tag": "idrett og frivillighet"
					}
				],
				"seeAlso": [],
				"attachments": [
					{
						"title": "Dokumentet som pdf-fil",
						"mimeType": "application/pdf"
					},
					{
						"title": "Regjeringen.no – nettside",
						"mimeType": "text/html",
						"snapshot": true
					}
				],
				"code": "Rundskriv",
				"language": "nb",
				"url": "https://www.regjeringen.no/no/dokumenter/rundskriv-0126-tilskuddssatser-for-tilskuddsberettigede-anleggstyper-for-soknadsaret-2027/id3166007/",
				"abstractNote": "Kultur- og likestillingsdepartementet har fastsatt søknadsberettigede aktører til særskilte ordinære anleggskategorier, samt følgende tilskuddssatser og tilskuddsberettigede anleggstyper, jf. Forskrift om tilskudd til bygging og rehabilitering av anleg...",
				"nameOfAct": "Rundskriv 01/26 Tilskuddssatser for tilskuddsberettigede anleggstyper for søknadsåret 2027",
				"dateEnacted": "2026-06-15"
			}
		]
	},
	{
		"type": "web",
		"url": "https://www.regjeringen.no/no/aktuelt/felling-av-ulv-i-innlandet/id3169214/",
		"items": [
			{
				"itemType": "webpage",
				"creators": [],
				"notes": [],
				"tags": [
					{
						"tag": "Klima og miljø"
					},
					{
						"tag": "Naturmangfold"
					}
				],
				"seeAlso": [],
				"attachments": [
					{
						"title": "Regjeringen.no – nettside",
						"mimeType": "text/html",
						"snapshot": true
					}
				],
				"title": "Felling av ulv i Innlandet",
				"date": "2026-07-20",
				"language": "nb",
				"url": "https://www.regjeringen.no/no/aktuelt/felling-av-ulv-i-innlandet/id3169214/",
				"abstractNote": "En ulv som ble felt i Sør-Fron kommune mandag ettermiddag, er med stor sannsynlighet den genetisk verdifulle ulven som har forårsaket stor skade på sau og lam i Gausdal."
			}
		]
	}
]
/** END TEST CASES **/
