/**
 * Copy's item metadata to the clipboard, similar to Zutilo
 * @author thalient-ai
 * @usage
 * @link https://github.com/windingwind/zotero-actions-tags/discussions/
 * @see https://github.com/windingwind/zotero-actions-tags/discussions/
 */

const Zotero = require("Zotero");

try {
    // Check if the item is a note or attachment and handle accordingly
    if (item.isNote()) {
        Zotero.debug(`Processing note with ID: ${item.id}`);
        copyNoteMetadata(item); // Function to handle notes
    } else if (item.isAttachment()) {
        Zotero.debug(`Skipping attachment with ID: ${item.id}`);
        return;
    } else {
        copyMetadata(item); // Continue to handle regular items
    }

} catch (error) {
    // Handle any other errors, but skip "item is null" errors
    if (error.message !== "item is null") {
        Zotero.logError(`Error occurred: ${error.message}`);
    }
}

// Function to copy metadata for regular items
function copyMetadata(item) {
    try {
        const itemId = item.id;
        const itemURI = Zotero.URI.getItemURI(item);  // Get the URI for the item using Zotero.URI.getItemURI()

        const itemData = {
            itemID: itemId,
            itemURI: itemURI,
            itemType: item.itemType,

            // Handling creators
            creators: item.getCreators().map(creator => {
                const creatorType = Zotero.CreatorTypes.getName(creator.creatorTypeID);
                return {
                    firstName: creator.firstName || "",
                    lastName: creator.lastName || "",
                    creatorType: creatorType
                };
            }),

            // Handling tags
            tags: item.getTags().map(tag => ({
                tag: tag.tag
            })),

            // Item metadata fields
            abstractNote: item.getField("abstractNote"),
            accessDate: item.getField("accessDate"),
            applicationNumber: item.getField("applicationNumber"),
            archive: item.getField("archive"),
            archiveID: item.getField("archiveID"),
            archiveLocation: item.getField("archiveLocation"),
            artworkMedium: item.getField("artworkMedium"),
            artworkSize: item.getField("artworkSize"),
            assignee: item.getField("assignee"),
            audioFileType: item.getField("audioFileType"),
            audioRecordingFormat: item.getField("audioRecordingFormat"),
            billNumber: item.getField("billNumber"),
            blogTitle: item.getField("blogTitle"),
            bookTitle: item.getField("bookTitle"),
            callNumber: item.getField("callNumber"),
            caseName: item.getField("caseName"),
            citationKey: item.getField("citationKey"),
            code: item.getField("code"),
            codeNumber: item.getField("codeNumber"),
            codePages: item.getField("codePages"),
            codeVolume: item.getField("codeVolume"),
            committee: item.getField("committee"),
            company: item.getField("company"),
            conferenceName: item.getField("conferenceName"),
            country: item.getField("country"),
            court: item.getField("court"),
            date: item.getField("date"),
            dateDecided: item.getField("dateDecided"),
            dateEnacted: item.getField("dateEnacted"),
            dictionaryTitle: item.getField("dictionaryTitle"),
            distributor: item.getField("distributor"),
            docketNumber: item.getField("docketNumber"),
            documentNumber: item.getField("documentNumber"),
            DOI: item.getField("DOI"),
            edition: item.getField("edition"),
            encyclopediaTitle: item.getField("encyclopediaTitle"),
            episodeNumber: item.getField("episodeNumber"),
            extra: item.getField("extra"),
            filingDate: item.getField("filingDate"),
            firstPage: item.getField("firstPage"),
            format: item.getField("format"),
            forumTitle: item.getField("forumTitle"),
            genre: item.getField("genre"),
            history: item.getField("history"),
            identifier: item.getField("identifier"),
            institution: item.getField("institution"),
            interviewMedium: item.getField("interviewMedium"),
            ISBN: item.getField("ISBN"),
            ISSN: item.getField("ISSN"),
            issue: item.getField("issue"),
            issueDate: item.getField("issueDate"),
            issuingAuthority: item.getField("issuingAuthority"),
            journalAbbreviation: item.getField("journalAbbreviation"),
            label: item.getField("label"),
            language: item.getField("language"),
            legalStatus: item.getField("legalStatus"),
            legislativeBody: item.getField("legislativeBody"),
            libraryCatalog: item.getField("libraryCatalog"),
            mapType: item.getField("mapType"),
            manuscriptType: item.getField("manuscriptType"),
            meetingName: item.getField("meetingName"),
            nameOfAct: item.getField("nameOfAct"),
            network: item.getField("network"),
            numPages: item.getField("numPages"),
            number: item.getField("number"),
            numberOfVolumes: item.getField("numberOfVolumes"),
            organization: item.getField("organization"),
            pages: item.getField("pages"),
            patentNumber: item.getField("patentNumber"),
            place: item.getField("place"),
            postType: item.getField("postType"),
            presentationType: item.getField("presentationType"),
            priorityNumbers: item.getField("priorityNumbers"),
            proceedingsTitle: item.getField("proceedingsTitle"),
            programmingLanguage: item.getField("programmingLanguage"),
            programTitle: item.getField("programTitle"),
            publicLawNumber: item.getField("publicLawNumber"),
            publicationTitle: item.getField("publicationTitle"),
            publisher: item.getField("publisher"),
            references: item.getField("references"),
            reportNumber: item.getField("reportNumber"),
            reportType: item.getField("reportType"),
            reporter: item.getField("reporter"),
            reporterVolume: item.getField("reporterVolume"),
            repository: item.getField("repository"),
            repositoryLocation: item.getField("repositoryLocation"),
            rights: item.getField("rights"),
            runningTime: item.getField("runningTime"),
            scale: item.getField("scale"),
            section: item.getField("section"),
            series: item.getField("series"),
            seriesNumber: item.getField("seriesNumber"),
            seriesText: item.getField("seriesText"),
            seriesTitle: item.getField("seriesTitle"),
            session: item.getField("session"),
            shortTitle: item.getField("shortTitle"),
            status: item.getField("status"),
            studio: item.getField("studio"),
            subject: item.getField("subject"),
            system: item.getField("system"),
            thesisType: item.getField("thesisType"),
            title: item.getField("title"),
            type: item.getField("type"),
            university: item.getField("university"),
            url: item.getField("url"),
            versionNumber: item.getField("versionNumber"),
            videoRecordingFormat: item.getField("videoRecordingFormat"),
            volume: item.getField("volume"),
            websiteTitle: item.getField("websiteTitle"),
            websiteType: item.getField("websiteType")
        };

        // Convert the object to a JSON string and copy to clipboard
        const clipboardData = JSON.stringify(itemData);
        Zotero.debug(`Copying metadata to clipboard for item with ID: ${itemId}`);

        // Use nsIClipboardHelper to copy the JSON to clipboard
        const gClipboardHelper = Components.classes["@mozilla.org/widget/clipboardhelper;1"].getService(Components.interfaces.nsIClipboardHelper);
        gClipboardHelper.copyString(clipboardData);

        Zotero.debug(`Successfully copied metadata for item with ID: ${itemId}`);
    } catch (error) {
        Zotero.logError(`Error occurred: ${error.message}`);
    }
}

// Function to copy metadata for notes
function copyNoteMetadata(note) {
    try {
        const noteId = note.id;
        const noteURI = Zotero.URI.getItemURI(note);  // Get the URI for the note using Zotero.URI.getItemURI()

        // Get the note content
        const noteContent = note.getNote();

        // Extract the tags using Zotero's built-in method (just like regular items)
        const tags = note.getTags().map(tag => ({
            tag: tag.tag
        }));

        const noteData = {
            noteID: noteId,
            noteURI: noteURI,
            noteContent: noteContent,
            tags: tags // Include extracted tags from the note
        };

        // Convert the object to a JSON string and copy to clipboard
        const clipboardData = JSON.stringify(noteData);
        Zotero.debug(`Copying metadata to clipboard for note with ID: ${noteId}`);

        // Use nsIClipboardHelper to copy the JSON to clipboard
        const gClipboardHelper = Components.classes["@mozilla.org/widget/clipboardhelper;1"].getService(Components.interfaces.nsIClipboardHelper);
        gClipboardHelper.copyString(clipboardData);

        Zotero.debug(`Successfully copied metadata for note with ID: ${noteId}`);
    } catch (error) {
        Zotero.logError(`Error occurred: ${error.message}`);
    }
}