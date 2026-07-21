/**
 * Unrelate selected items
 * @author windingwind
 * @usage
 * @link https://github.com/windingwind/zotero-actions-tags/discussions/173
 * @see https://github.com/windingwind/zotero-actions-tags/discussions/173
 */

// https://github.com/wshanks/Zutilo/blob/8d53047cf35c11490e0d82156d4ee12136c7fb31/addon/chrome/content/zutilo/zoteroOverlay.js#L710
if (items?.length === 0 || item) {
	return;
}

const zitems = items.filter(_item => _item.isRegularItem() || _item.isNote() || _item.isAttachment());
if (zitems.length < 2) {
	return "Must select 2 or more items";
}

for (let zitem of zitems) {
	for (let addItem of zitems) {
		if (zitem != addItem) {
			zitem.removeRelatedItem(addItem)
		}
	}
	zitem.saveTx();
}

return `Successfully unrelate ${zitems.length} items.`;