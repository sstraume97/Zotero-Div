// Fra https://github.com/windingwind/zotero-actions-tags/discussions/132#discussioncomment-10471260

if(item) return;

const window = require("window");
const ZoteroPane = require("ZoteroPane");

async function getPDFAttachmentPath(item) {
    // If it is PDF, get the path directly
    if (item.isAttachment() && item.attachmentContentType === 'application/pdf') {
        return await item.getFilePathAsync();
    }
    // If it is a parent item, find its PDF attachment
    else if (item.isRegularItem() && !item.isAttachment()) {
        let attachments = await item.getAttachments();
        for (let attachmentID of attachments) {
            let attachment = await Zotero.Items.getAsync(attachmentID);
            if (attachment.attachmentContentType === 'application/pdf') {
                return await attachment.getFilePathAsync();
            }
			//break;
        }
    }
    return null;
}

async function openPDF(item) {
    let filePath = await getPDFAttachmentPath(item);
    if (!filePath) {
        Zotero.alert(window, "Open failed", "PDF attachment not found");
        return "PDF attachment not found";
    }
    let exePath = "C:\\Program Files (x86)\\Kofax\\Power PDF 40\\bin\\PowerPDF.exe";
    // Example: exe path string in windows, C:\\Program Files\\Mozilla Firefox\\firefox.exe
    Zotero.launchFileWithApplication(filePath, exePath);
}

// Open the currently selected item
return await openPDF(items[0]);
// Reduce prompt interference
// return "Opened successfully";