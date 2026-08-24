---
uid: kqdc8hQgIL
---
```js
/**
 * Creates a Zotero note containing only annotations (highlights) of a specific color
 * (#5fb236 - Green) from the selected item's attachments (PDFs, EPUBs).
 * Deletes previously generated generic annotation notes AND notes previously
 * created by THIS script for the SAME color first.
 *
 * Works in both your personal library and group libraries:
 *  - Permission is checked against the ACTUAL library of the item being
 *    processed (parentItem.libraryID), not just the pane's currently
 *    displayed library.
 *  - The new note's libraryID is explicitly set to parentItem.libraryID,
 *    since Zotero.Item('note') otherwise defaults to your personal library,
 *    which fails (or silently misfiles the note) when the parent item
 *    lives in a group library.
 *
 * @author Zotero Community (Original), Modified for Color Filtering,
 *         Improved Cleanup & Group Library Support
 * @usage Run on a Zotero item. Filters for color #5fb236.
 * @link https://github.com/windingwind/zotero-actions-tags/discussions/489
 */
  

const Zotero = require("Zotero");

const ZoteroPane = require("ZoteroPane");

const console = require("console");

  

// ****** TARGET COLOR IS SET HERE ******

const targetColor = '#5fb236'; // The specific green color

// *************************************

  

function isPotentialAnnotationAttachment(item) {

    return item.isPDFAttachment() || item.isEPUBAttachment() || item.isSnapshotAttachment();

}

  

// Builds a zotero://select/... deep link for personal or group libraries

function getZoteroSelectLink(item) {

    const library = item.library;

    if (library && library.libraryType === 'group') {

        return `zotero://select/groups/${library.id}/items/${item.key}`;

    }

    return `zotero://select/library/items/${item.key}`;

}

  

// Formats creators as "Firstname Lastname, Firstname Lastname"

function formatCreators(item) {

    return item.getCreators()

        .map(c => {

            if (c.fieldMode === 1) return c.lastName || '';

            return `${c.firstName || ''} ${c.lastName || ''}`.trim();

        })

        .filter(Boolean)

        .join(', ');

}

  

// Escapes a value for safe placement inside a double-quoted YAML string

function yamlEscape(value) {

    return String(value || '').replace(/\\/g, '\\\\').replace(/"/g, '\\"');

}

  

let selectedItem = item;

let parentItem;

let attachments = [];

let itemIDsToSelect = [];

  

if (selectedItem.isRegularItem()) {

    parentItem = selectedItem;

    attachments.push(

        ...Zotero.Items.get(parentItem.getAttachments())

            .filter(att => isPotentialAnnotationAttachment(att))

    );

} else if (selectedItem.isFileAttachment() && !selectedItem.isTopLevelItem()) {

    parentItem = Zotero.Items.get(selectedItem.parentID);

    if (isPotentialAnnotationAttachment(selectedItem)) {

        attachments.push(selectedItem);

    }

}

  

if (!parentItem || attachments.length === 0) {

    console.log("No suitable parent item or attachments found.");

    return;

}

  

// --- Permission check based on the ITEM'S actual library ---

// ZoteroPane.canEdit() alone is not reliable here: it reflects the pane's

// currently displayed collection/library, which can differ from the

// library the selected item actually belongs to (e.g. when running from

// a cross-library search, "My Publications", or a saved search).

const targetLibrary = Zotero.Libraries.get(parentItem.libraryID);

if (!targetLibrary || !targetLibrary.editable) {

    console.log(`Library "${targetLibrary ? targetLibrary.name : parentItem.libraryID}" is not editable. Aborting.`);

    return;

}

  

// --- Cleanup Old Notes ---

// Looks for BOTH standard Zotero auto-generated annotation notes AND notes

// previously created by this script (matching the targetColor).

console.log(`Looking for old notes to remove (Standard Zotero or matching color ${targetColor})...`);

const noteIDs = parentItem.getNotes();

const noteTitlePattern = `<h1>Ord og forkortelser (${targetColor})`; // Pattern for notes created by this script

  

for (let id of noteIDs) {

    let note = Zotero.Items.get(id);

    if (note) {

        let noteHTML = note.getNote();

        if (noteHTML) {

            // Check condition 1: Is it a standard Zotero auto-generated annotation note?

            let isStandardNote = noteHTML.startsWith('<div data-citation-items') && noteHTML.includes('Annotations');

  

            // Check condition 2: Does it look like a note previously created by THIS script for THIS color?

            let isThisScriptNote = noteHTML.startsWith(noteTitlePattern);

  

            if (isStandardNote || isThisScriptNote) {

                console.log(`Removing old note (ID: ${id}, Type: ${isStandardNote ? 'Standard' : 'This Script'})`);

                await Zotero.Items.trashTx(id);

            }

        }

    }

}

console.log("Finished cleanup check.");

  

// --- Build metadata YAML frontmatter block (shared across all notes for this item) ---

const metadataYAML =

`title: "${yamlEscape(parentItem.getField('title'))}"

authors: "${yamlEscape(formatCreators(parentItem))}"

date: "${yamlEscape(parentItem.getField('date'))}"

itemType: "${yamlEscape(Zotero.ItemTypes.getName(parentItem.itemTypeID))}"

zotero: "${getZoteroSelectLink(parentItem)}"`;

  

// Plain --- delimiters (no code-block class) so it renders as real

// Obsidian frontmatter, not a visible/highlighted code block.

const metadataBlockHTML = `<pre>---\n${metadataYAML}\n---</pre>`;

  

// --- Process Attachments and Create New Note(s) ---

for (let attachment of attachments) {

    console.log("Processing attachment:", attachment.getField('title'));

  

    let allAnnotations = await attachment.getAnnotations();

    if (!allAnnotations || allAnnotations.length === 0) {

        console.log(" -> No annotations found in this attachment.");

        continue;

    }

  

    let filteredAnnotations = allAnnotations.filter(anno => {

        return (anno.annotationType === 'highlight' || anno.annotationType === 'underline') &&

               anno.annotationColor &&

               anno.annotationColor.toUpperCase() === targetColor.toUpperCase();

    });

  

    if (filteredAnnotations.length === 0) {

        console.log(` -> No annotations found with color ${targetColor} in this attachment.`);

        continue;

    }

  

    console.log(` -> Found ${filteredAnnotations.length} annotations with color ${targetColor}.`);

  

    let noteHTMLContent = `<h1>Ord og forkortelser (${targetColor}) from ${parentItem.getField('title') || 'item'}</h1>`;

    noteHTMLContent += metadataBlockHTML;

    noteHTMLContent += `

  <table border="1" cellspacing="0" cellpadding="8" style="border-collapse: collapse; width: 100%;">

    <thead>

      <tr>

        <th>Uthevet tekst</th>

        <th>Notat</th>

        <th>Side</th>

      </tr>

    </thead>

    <tbody>

`;

  

    for (let anno of filteredAnnotations) {

        let text = anno.annotationText ? anno.annotationText.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') : '';

        let comment = anno.annotationComment ? anno.annotationComment.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') : '';

  

        let pageNumber = '';

        if (anno.annotationPosition) {

            try {

                let position = JSON.parse(anno.annotationPosition);

                if (position.pageIndex !== undefined) {

                    pageNumber = position.pageIndex + 1;

                }

            } catch (e) {

                console.log("Could not parse annotation position:", anno.annotationPosition);

            }

        }

  

        let itemURI = Zotero.URI.getItemURI(anno);

  

        noteHTMLContent += `

      <tr>

        <td>${text}</td>

        <td>${comment}</td>

        <td><a href="${itemURI}">${pageNumber}</a></td>

      </tr>

    `;

    }

  

    noteHTMLContent += `

    </tbody>

  </table>

`;

  

    try {

        let newNote = new Zotero.Item('note');

        // CRITICAL for group library support: without this, the note

        // defaults to your personal library instead of parentItem's

        // library, which breaks (or misplaces) the note.

        newNote.libraryID = parentItem.libraryID;

        newNote.parentID = parentItem.id;

        newNote.setNote(noteHTMLContent);

        let noteID = await newNote.saveTx();

        if (noteID) {

            itemIDsToSelect.push(noteID);

            console.log(` -> Successfully created note ${noteID} for color ${targetColor}.`);

        } else {

            console.log(` -> Failed to save the new note for color ${targetColor}.`);

        }

    } catch (e) {

        console.error("Error creating or saving note:", e);

    }

}

  

// Optional: select the created notes

// if (itemIDsToSelect.length > 0) {

//     await ZoteroPane.selectItems(itemIDsToSelect);

// }

  

console.log("Script finished.");
```