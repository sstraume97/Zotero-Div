/**
 * Extract Abstract Keywords
 * @author Polygon
 * @link https://github.com/windingwind/zotero-actions-tags/discussions/136
 */
const ZoteroPane = require("ZoteroPane")
const window = require("window")
const console = window.console
let n = 0
await Promise.all(ZoteroPane.getSelectedItems()
	.map(async (item) => {
	if ((await item.getBestAttachmentState()).exists == false) { return }
	const pdfItem = await item.getBestAttachment()
	if (!pdfItem) { return }
	const text = (await Zotero.PDFWorker.getFullText(pdfItem.id, 2, true)).text
	const res = text.match(/\n(Abstract[\s\S]+?)\nKeywords(.+)/i)
	if (res && res.length == 3) {
		const data = {
			abstract: res[1].replace(/^abstract:?\s*/i, "").replace("\n", " ").replace(/\s+/, " "),
			keywords: res[2].replace(/^\s*:\s*/, "").trim().split(/[;,]\s*/).map(i=>i.trim())
		}
		console.log(data)
		await Promise.all(data.keywords.map(async(tag)=>{
			item.addTag(tag)
		}))
		item.setField("abstractNote", data.abstract)
		await item.saveTx();
		n += 1;
	}
}))
return `Completed ${n}`