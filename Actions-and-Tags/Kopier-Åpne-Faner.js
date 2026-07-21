/**
 * Copy the open tabs to Clipboard as a Markdown or HTML list; ready to paste in Zotero notes or Obisidian.
 * @author Samir Ouchene, Thanks to FeralFlora for their hints.
 * @usage plug and play
 * @link https://github.com/windingwind/zotero-actions-tags/discussions/206
 * @see https://github.com/windingwind/zotero-actions-tags/discussions/206
 */

const Zotero_Tabs = require("Zotero_Tabs");
//const window = require("window");
const clipboard = new Zotero.ActionsTags.api.utils.ClipboardHelper();

/** @type {'md' | 'html'} Change the type of the URL. */
URLType = 'html';

// For efficiency, only execute once for all selected items
if (item) return;
// Filter the tabs to include only the one with type 'reader' or 'reader-unloaded'
let tabs = Zotero_Tabs._tabs.filter(tab =>
['reader', 'reader-unloaded'].includes(tab.type)
);
let tabData_ = JSON.stringify(tabs);
tabData = JSON.parse(tabData_);
itemIDs = tabData.map(obj => obj.data.itemID);
itemTitles = tabData.map(obj => obj.title);

// get the item keys using the itemIDs
itemKeys = itemIDs.map(itemID => Zotero.Items['_objectCache'][itemID]['key']);
URIs = itemKeys.map(itemKey => `zotero://open-pdf/library/items/${itemKey}`);


if (URLType.toLowerCase() === 'md') {
    mimeStr = "text/unicode";
    listOfURIs = itemTitles.map((title,index) => `* [${title}](${URIs[index]})`).join('\n');
} else if (URLType.toLowerCase() === 'html') {
    mimeStr = "text/html";
    listOfURIs_ = itemTitles.map((title,index) => `<li><a href="${URIs[index]}"> ${title}</a></li>`).join('');
    listOfURIs = `<ul>${listOfURIs_}</ul>`;
}

clipboard.addText(listOfURIs, mimeStr);
clipboard.copy();
//window.alert("Successfully copied " + itemIDs.length + " tabs to clipboard");
return `[Copy Open Tabs] copied ${itemIDs.length} items to clipboard`;