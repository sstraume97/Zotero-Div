/**
 * Creates a Zotero note containing only annotations (highlights) of a specific color
 * (#5fb236 - Green) from the selected item's attachments (PDFs, EPUBs).
 * Deletes previously generated generic annotation notes AND notes previously
 * created by THIS script for the SAME color first.
 * @author Zotero Community (Original), Modified for Color Filtering & Improved Cleanup
 * @usage Run on a Zotero item. Filters for color #5fb236.
 * @link https://github.com/windingwind/zotero-actions-tags/discussions/
 * @see https://github.com/windingwind/zotero-actions-tags/discussions/
 */

const Zotero = require("Zotero");
const ZoteroPane = require("ZoteroPane");
const console = require("console");

// ****** TARGET COLOR IS SET HERE ******
const targetColor = '#5fb236'; // The specific green color
// *************************************

if (!ZoteroPane.canEdit()) {
    return;
}

function isPotentialAnnotationAttachment(item) {
    return item.isPDFAttachment() || item.isEPUBAttachment() || item.isSnapshotAttachment();
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

// --- Cleanup Old Notes ---
// MODIFIED SECTION: Now looks for BOTH standard Zotero notes AND notes
// previously created by this script (matching the targetColor).
console.log(`Looking for old notes to remove (Standard Zotero or matching color ${targetColor})...`);
const noteIDs = parentItem.getNotes();
const noteTitlePattern = `<h2>Ord og forkortelser (${targetColor})`; // Pattern for notes created by this script

for (let id of noteIDs) {
    let note = Zotero.Items.get(id);
    if (note) {
        let noteHTML = note.getNote();
        if (noteHTML) {
            // Check condition 1: Is it a standard Zotero auto-generated annotation note?
            let isStandardNote = noteHTML.startsWith('<div data-citation-items') && noteHTML.includes('Annotations');

            // Check condition 2: Does it look like a note previously created by THIS script for THIS color?
            // We check if the HTML starts with the specific H2 title we generate.
            let isThisScriptNote = noteHTML.startsWith(noteTitlePattern);

            // If EITHER condition is true, delete the note.
            if (isStandardNote || isThisScriptNote) {
                console.log(`Removing old note (ID: ${id}, Type: ${isStandardNote ? 'Standard' : 'This Script'})`);
                await Zotero.Items.trashTx(id);
            }
        }
    }
}
console.log("Finished cleanup check.");
// --- End of Modified Section ---


// --- Process Attachments and Create New Note(s) ---
// (This part remains the same as the previous version)
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

    let noteHTMLContent = `<h2>Ord og forkortelser (${targetColor}) from ${attachment.getField('title') || 'attachment'}</h2>`;
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
//     await ZoteroPane.selectItems(itemIDsToSelect);
// }

console.log("Script finished.");
