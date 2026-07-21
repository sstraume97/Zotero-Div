{
	"translatorID": "c8f3e2d1-4b5a-4c6d-8e9f-0a1b2c3d4e5f",
	"label": "Stortinget",
	"creator": "Sondre Bogen-Straume",
	"target": "https?://www\\.stortinget\\.no/no/Saker-og-publikasjoner/(Publikasjoner/Innstillinger/(Stortinget|Odelstinget)|Vedtak/Beslutninger/(Lovvedtak|Odelstinget|Lovanmerkninger))/\\d{4}-\\d{4}/[a-z0-9-]+",
	"minVersion": "5.0",
	"maxVersion": "",
	"priority": 100,
	"inRepository": false,
	"translatorType": 4,
	"browserSupport": "gcsibv",
	"lastUpdated": "2026-06-22 00:00:00"
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

/**
 * Zotero translator for Norwegian parliamentary documents from stortinget.no.
 *
 * Supported document types:
 *   Innstillinger (Stortinget + Odelstinget) → bill
 *   Lovvedtak (Stortinget + Odelstinget)     → statute
 *   Lovanmerkninger                           → bill
 *
 * Metadata sourced from Dublin Core and custom MA.* meta tags in <head>:
 *   DC.Title      → long title
 *   DC.Publisher  → institutional author (committee)
 *   DC.Date       → date
 *   DC.Language   → language
 *   DC.Subject    → tags/subjects
 *   TITLE         → short document reference, e.g. "Innst. 462 S (2025-2026)"
 *   MA.Pdf-url    → main PDF path
 *   MA.Session    → session year range
 *
 * Citations (Chicago notes):
 *   bill:    Code (Session) → e.g. «Innst. 459 L (2025–2026)»
 *   statute: Code (Session) → e.g. «Lovvedtak 96 (2025–2026)»
 */

/** Read a single <meta name="…"> or <meta property="…"> content attribute. */
function getMeta(doc, name) {
	const el = doc.querySelector('meta[name="' + name + '"], meta[property="' + name + '"]');
	return el ? (el.getAttribute("content") || "").trim() : "";
}

/** Read all <meta name="…"> content values (for repeatable tags like DC.Subject). */
function getAllMeta(doc, name) {
	return Array.from(doc.querySelectorAll('meta[name="' + name + '"]'))
		.map(el => (el.getAttribute("content") || "").trim())
		.filter(Boolean);
}

function getDocType(url) {
	if (/\/Innstillinger\/Stortinget\//i.test(url))     return "innst-stortinget";
	if (/\/Innstillinger\/Odelstinget\//i.test(url))    return "innst-odelstinget";
	if (/\/Beslutninger\/Lovvedtak\//i.test(url))       return "lovvedtak";
	if (/\/Beslutninger\/Odelstinget\//i.test(url))     return "beso-odelstinget";
	if (/\/Beslutninger\/Lovanmerkninger\//i.test(url)) return "lovanmerkning";
	return null;
}

function detectWeb(doc, url) {
	const docType = getDocType(url);
	if (!docType) return false;
	return (docType === "lovvedtak" || docType === "beso-odelstinget") ? "statute" : "bill";
}

/** Parse "Innst. 462 S (2025-2026)" → { code: "Innst. 462 S", session: "2025–2026" }. */
function parseShortTitle(titleMeta) {
	const m = titleMeta.match(/^(.+?)\s*\((\d{4}[-–]\d{4})\)\s*$/);
	if (m) {
		return {
			code:    m[1].trim(),
			session: m[2].replace("-", "–") // hyphen → en dash
		};
	}
	return { code: titleMeta, session: "" };
}

/** Collect all PDF links from page anchors (/globalassets/…pdf). */
function scrapePdfLinks(doc) {
	const links = [];
	for (const a of doc.querySelectorAll("a[href]")) {
		const href = a.getAttribute("href");
		if (href && href.includes("/globalassets/") && /\.pdf$/i.test(href)) {
			const abs = href.startsWith("http") ? href : "https://www.stortinget.no" + href;
			if (!links.includes(abs)) links.push(abs);
		}
	}
	return links;
}

/**
 * Find the related case name under the "Tilhører sak" heading.
 * Used for lovanmerkninger where the linked case title goes in the Extra field.
 */
function getRelatedCase(doc) {
	for (const h2 of doc.querySelectorAll("h2")) {
		if (/tilhører sak/i.test(h2.textContent)) {
			const container = h2.closest(".column-content-wrapper-react") || h2.parentElement;
			if (!container) continue;
			// First standard link in the box (skip the "Gå til saker" block link)
			const link = container.querySelector("a.link-react__standard, a:not(.link-react__block)");
			if (link) return Zotero.Utilities.trimInternal(link.textContent);
		}
	}
	return "";
}

async function doWeb(doc, url) {
	const docType = getDocType(url);
	if (!docType) return;

	const isStatute      = (docType === "lovvedtak" || docType === "beso-odelstinget");
	const isLovanmerkning = (docType === "lovanmerkning");
	const item = new Zotero.Item(isStatute ? "statute" : "bill");

	// --- Core metadata from Dublin Core / MA meta tags in <head> ---
	const longTitle = getMeta(doc, "DC.Title") || getMeta(doc, "og:title");
	const titleMeta = getMeta(doc, "TITLE");    // e.g. "Innst. 462 S (2025-2026)"
	const publisher = getMeta(doc, "DC.Publisher");
	const dcDate    = getMeta(doc, "DC.Date");  // "2026-06-11 13:53:57"
	const language  = getMeta(doc, "DC.Language") || "nb";
	const subjects  = getAllMeta(doc, "DC.Subject");
	const pdfPath   = getMeta(doc, "MA.Pdf-url");

	// Parse short reference → { code: "Innst. 462 S", session: "2025–2026" }
	const { code, session: parsedSession } = parseShortTitle(titleMeta);
	const maSession    = (getMeta(doc, "MA.Session") || "").replace("-", "–");
	const finalSession = parsedSession || maSession;

	// Full reference with session in parens: "Innst. 462 S (2025–2026)"
	const codeWithSession = code + (finalSession ? " (" + finalSession + ")" : "");

	// ISO date
	const date = dcDate ? dcDate.slice(0, 10) : "";

	// --- Populate fields by document type ---

	if (isStatute) {
		// Lovvedtak / Besl. O. nr.
		// code = "Lovvedtak 96 (2025–2026)" — session embedded, no separate session field
		item.nameOfAct   = longTitle;
		item.code        = codeWithSession;
		item.dateEnacted = date;
		// item.session and item.section intentionally omitted

	} else if (isLovanmerkning) {
		// Lovanmerkning — no code/billNumber/session fields; related case in Extra
		item.title          = longTitle;
		item.shortTitle     = codeWithSession;
		item.date           = date;
		item.legislativeBody = "Stortinget";
		// billNumber, code, session intentionally omitted

		const relatedCase = getRelatedCase(doc);
		const extraLines  = [];
		if (relatedCase) extraLines.push("Tilhørende sak: " + relatedCase);
		if (extraLines.length) item.extra = extraLines.join("\n");

	} else {
		// Innstilling (Stortinget + Odelstinget)
		// code = "Innst. 462 S (2025–2026)" — session embedded, no separate session/billNumber
		item.title           = longTitle;
		item.shortTitle      = codeWithSession;
		item.code            = codeWithSession;
		item.date            = date;
		item.legislativeBody = docType.includes("odelstinget") ? "Odelstinget" : "Stortinget";
		// billNumber and session intentionally omitted
	}

	item.language = language;
	item.url      = getMeta(doc, "DC.Identifier") || url;

	// Committee / publisher as institutional author
	if (publisher) {
		item.creators.push({
			fieldMode:   1,
			lastName:    publisher,
			creatorType: "author"
		});
	}

	// Subjects as tags
	for (const subject of subjects) {
		item.tags.push({ tag: subject });
	}

	// --- PDF attachments ---
	const mainPdfUrls = [];
	if (pdfPath) {
		const abs = pdfPath.startsWith("http") ? pdfPath : "https://www.stortinget.no" + pdfPath;
		mainPdfUrls.push(abs);
		item.attachments.push({
			url:      abs,
			title:    "Fulltekst (PDF)",
			mimeType: "application/pdf"
		});
	}

	// Additional PDFs scraped from page (e.g. vedlegg)
	for (const pdfUrl of scrapePdfLinks(doc)) {
		if (!mainPdfUrls.includes(pdfUrl)) {
			item.attachments.push({
				url:      pdfUrl,
				title:    pdfUrl.includes("-vedlegg") ? "Vedlegg (PDF)" : "PDF",
				mimeType: "application/pdf"
			});
		}
	}

	item.complete();
}