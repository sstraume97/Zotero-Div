
// @author yaolimumu
// @link https://github.com/windingwind/zotero-actions-tags/discussions/296
// @usage Add a Hyperlink to an annotation and jump to the target annotation
// @update
// @note This is Goto Link code
// @note This is Goto Link code
// @note This is Goto Link code

if(item) return;
item = items[0];

const Zotero = require("Zotero");

function extractZoteroInfo(inputString) {
    let startIndex = inputString.indexOf("zotero://open-pdf/library/items/") + "zotero://open-pdf/library/items/".length;
    let endIndex1 = inputString.indexOf("?page=");
    let endIndex2 = inputString.lastIndexOf("&annotation=");
    let endIndex3 = inputString.length;
    let zoteroId = inputString.substring(startIndex, endIndex1);
    let page = inputString.substring(endIndex1 + "?page=".length, endIndex2);
    let annotation = inputString.substring(endIndex2 + "&annotation=".length, endIndex3);
    return [zoteroId, page, annotation];
}

let copytext = item.getRelations()["dc:relation"][0];
let referInfo = extractZoteroInfo(copytext);

const userLibraryID = Zotero.Libraries.userLibraryID;
let getitem = Zotero.Items.getByLibraryAndKey(userLibraryID, referInfo[0]);
Zotero.FileHandlers.open(getitem, {
    location: {
        annotationID: referInfo[2],
        pageIndex: referInfo[1]
    }});