/**
 * Relate selected items
 * @author windingwind
 * @usage Set all selected items to be related to each other from a right-click on several items
 * @link https://github.com/windingwind/zotero-actions-tags/discussions/164
 * @see https://github.com/windingwind/zotero-actions-tags/discussions/164
 */
if (items?.length === 0 || item) {
	return;
}

// https://github.com/wshanks/Zutilo/blob/8d53047cf35c11490e0d82156d4ee12136c7fb31/addon/chrome/content/zutilo/zoteroOverlay.js#L710
const zitems = items.filter(_item => _item.isRegularItem() || _item.isNote() || _item.isAttachment());
if (zitems.length < 2) {
	return "Must select 2 or more items";
}

for (let zitem of zitems) {
	for (let addItem of zitems) {
		if (zitem != addItem) {
			zitem.addRelatedItem(addItem)
		}
	}
	zitem.saveTx();
}

return `Successfully relate ${zitems.length} items.`;