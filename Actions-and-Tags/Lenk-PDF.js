// @author yaolimumu
// @link https://github.com/windingwind/zotero-actions-tags/discussions/296
// @usage Add a Hyperlink to an annotation and jump to the target annotation
// @update
// @note This is Add Link code
// @note This is Add Link code
// @note This is Add Link code

// Only execute once for all selected items
if (item) return;
item = items[0];
// EDIT THESE SETTINGS

const Zotero = require("Zotero");
const navigator = require("navigator");

function extractZoteroInfo(inputString) {
    let startIndex = inputString.indexOf("zotero://open-pdf/library/items/");
    let endIndex3 = inputString.lastIndexOf("))");
    let zoterolink = inputString.substring(startIndex, endIndex3);
    return zoterolink;
}

let oldlink = item.getRelations();
try {
  if (oldlink["dc:relation"][0] !== undefined) {
	item.removeRelation("dc:relation", oldlink["dc:relation"][0]);
}
} catch (error) { };

let copytext = await navigator.clipboard.readText();
let referInfo = extractZoteroInfo(copytext);

item.addRelation("dc:relation", referInfo);
await item.saveTx();