/**
 * This script duplicates Zutilo's Paste functionality.
 * @author thalient-ai
 * @usage
 * @link https://github.com/windingwind/zotero-actions-tags/discussions/
 * @see https://github.com/windingwind/zotero-actions-tags/discussions/
 */

const Zotero = require("Zotero");

try {
    // Exit early if the script is already running
    if (Zotero.isRunning) {
        Zotero.debug("Paste operation already running. Exiting.");
        return;
    }

    // Set the flag to indicate the paste operation is running
    Zotero.isRunning = true;
    Zotero.debug("Starting paste operation...");

    // Process items[] if available, otherwise process item
    if (items && items.length > 0) {
        Zotero.debug(`Found ${items.length} items. Processing them.`);
        processItems(items); // Process multiple items
    } else if (item) {
        Zotero.debug(`Found single item with ID: ${item.id}. Processing it.`);
        processItems([item]); // Process a single item
    } else {
        Zotero.debug("No items or single item found. Exiting.");
        throw new Error("No item(s) found to paste metadata into.");
    }
} catch (error) {
    Zotero.logError(`Paste operation error: ${error.message}`);
} finally {
    // Reset the flag with a small delay to ensure all async operations are done
    setTimeout(() => {
        Zotero.isRunning = false;
        Zotero.debug("Paste operation complete and flag reset.");
    }, 500);
}

// Function to process an array of items
async function processItems(itemsToPaste) {
    Zotero.debug(`Processing ${itemsToPaste.length} item(s)`);

    // Define available paste options
    const options = ["Paste-into-empty", "Paste-non-empty", "Paste-all", "Paste-creator", "Paste-tags", "Paste-type"];
    let selectedOption = null;

    Zotero.debug("Displaying paste options prompt to user.");

    while (!selectedOption) {
        let input = Zotero.getMainWindow().prompt(
            `Choose paste option:\n1. ${options[0]}\n2. ${options[1]}\n3. ${options[2]}\n4. ${options[3]}\n5. ${options[4]}\n6. ${options[5]}`, "1"
        );
        if (!input) {
            Zotero.debug("User canceled the operation.");
            throw new Error("Operation cancelled.");
        }
        Zotero.debug(`User selected option: ${input}`);
        if (["1", "2", "3", "4", "5", "6"].includes(input)) {
            selectedOption = options[parseInt(input) - 1];
            Zotero.debug(`Parsed selected option: ${selectedOption}`);
        } else {
            Zotero.debug("Invalid selection made by user. Prompting again.");
            Zotero.getMainWindow().alert("Invalid selection. Please enter 1, 2, 3, 4, 5, or 6.");
        }
    }

    // Retrieve clipboard content using Zotero.Utilities.Internal.getClipboard
    let clipboardContent = Zotero.Utilities.Internal.getClipboard("text/plain").trim();
    Zotero.debug(`Clipboard content retrieved: ${clipboardContent ? "Valid content found" : "No content found"}`);

    if (!clipboardContent) {
        throw new Error("No clipboard data found.");
    }

    // Parse clipboard content and validate
    let clipboardData;
    try {
        clipboardData = JSON.parse(clipboardContent);
        Zotero.debug("Clipboard content successfully parsed.");
    } catch (error) {
        throw new Error(`Error parsing clipboard data: ${error.message}`);
    }

    // Validate clipboard data structure
    if (!clipboardData || typeof clipboardData !== 'object') {
        Zotero.debug("Invalid clipboard data structure.");
        throw new Error("Invalid clipboard data found.");
    }

    // Process each item in the array
    for (let currentItem of itemsToPaste) {
        Zotero.debug(`Pasting metadata into item with ID: ${currentItem.id} using option: ${selectedOption}`);
        if (selectedOption === "Paste-creator") {
            await pasteCreators(currentItem, clipboardData.creators || [], selectedOption); // Only handle creators
        } else if (selectedOption === "Paste-tags") {
            await pasteTags(currentItem, clipboardData.tags || []); // Handle only tags
        } else if (selectedOption === "Paste-type" && !currentItem.isNote()) {
            // Skip pasting item type for notes
            await pasteItemType(currentItem, clipboardData.itemType); // Handle item type
        } else {
            await pasteMetadata(currentItem, clipboardData, selectedOption); // Handle other fields
        }
    }
}

// Function to paste metadata into a single item (excluding creators and tags)
async function pasteMetadata(item, data, option) {
    try {
        Zotero.debug(`Pasting metadata into item with ID: ${item.id}`);

        // Apply the fields from clipboard data to the item based on the selected option
        for (const [field, value] of Object.entries(data)) {
            // Skip system fields like itemID, itemURI, creators, tags, and itemType that are handled separately
            if (["itemID", "itemURI", "creators", "tags", "itemType"].includes(field)) {
                Zotero.debug(`Skipping field: ${field}, handled by separate functions or cannot be modified.`);
                continue;
            }

            switch (option) {
                case "Paste-into-empty":
                    const targetValue = item.getField(field);
                    if (targetValue === null || targetValue === "") {
                        Zotero.debug(`Pasting into truly empty field: ${field}`);
                        item.setField(field, value);
                    } else {
                        Zotero.debug(`Skipping field: ${field}, as it is not empty.`);
                    }
                    break;

                case "Paste-non-empty":
                    const currentFieldValue = item.getField(field); // Get the current value of the field in the Zotero item
                    if (currentFieldValue && value) {  // Check if both the current field value in the Zotero item and the clipboard value are non-empty
                        Zotero.debug(`Pasting non-empty value into field: ${field}`);
                        item.setField(field, value);  // Paste the new value from clipboard if the field is already filled
                    } else {
                        Zotero.debug(`Skipping field: ${field}, because it is empty or has no value in the Zotero item.`);
                    }
                    break;

                case "Paste-all":
                    Zotero.debug(`Overwriting field: ${field} with value: ${value}`);
                    item.setField(field, value);  // Always overwrite, even with empty or null values
                    break;
            }
        }
        await item.saveTx(); // Save the changes to the item
        Zotero.debug(`Successfully pasted metadata into item with ID: ${item.id}`);
    } catch (error) {
        Zotero.logError(`Error pasting metadata into item with ID: ${item.id}: ${error.message}`);
    }
}

// Function to handle pasting creators (for Paste-creator option only)
async function pasteCreators(item, creatorsData, option) {
    try {
        if (option === "Paste-creator") {
            Zotero.debug("Processing creators with the Paste-creator option");

            const newCreators = creatorsData.map(creatorData => ({
                firstName: creatorData.firstName || "",
                lastName: creatorData.lastName || "",
                creatorType: creatorData.creatorType || "author"
            }));

            Zotero.debug(`Overwriting creators with ${newCreators.length} new creators.`);
            item.setCreators(newCreators);  // Overwrite all creators with new ones
        }
    } catch (error) {
        Zotero.logError(`Error pasting creators: ${error.message}`);
    }
}

// Updated function to handle pasting tags (for Paste-tags option only)
async function pasteTags(item, tagsData) {
    try {
        // Ensure we have tags to paste
        if (!tagsData || tagsData.length === 0) {
            Zotero.debug("No tags in clipboard to paste.");
            return;
        }

        // Prompt the user to choose how to handle the tags
        let userChoice = Zotero.getMainWindow().prompt(
            "Choose tag handling option:\n1. Overwrite existing tags\n2. Add new tags to existing\n3. Remove matching tags",
            "1"
        );

        // If the user cancels the prompt
        if (!userChoice) {
            Zotero.debug("User canceled the tag operation.");
            throw new Error("Tag operation cancelled.");
        }

        Zotero.debug(`User selected option: ${userChoice}`);

        // Validate user input
        if (!["1", "2", "3"].includes(userChoice)) {
            Zotero.debug("Invalid selection. Operation canceled.");
            throw new Error("Invalid selection. Please choose 1, 2, or 3.");
        }

        const newTags = tagsData.map(tag => tag.tag); // Extract the new tags from clipboard data

        if (userChoice === "1") {
            // Option 1: Overwrite existing tags
            Zotero.debug(`Overwriting existing tags with ${newTags.length} new tags.`);
            const tagObjects = newTags.map(tag => ({ tag }));
            item.setTags(tagObjects); // Overwrite tags with new ones

        } else if (userChoice === "2") {
            // Option 2: Add new tags to existing ones
            Zotero.debug(`Adding ${newTags.length} new tags to existing tags.`);
            const existingTags = item.getTags().map(tag => tag.tag); // Get the current tags
            const combinedTags = [...new Set([...existingTags, ...newTags])]; // Merge without duplicates

            const tagObjects = combinedTags.map(tag => ({ tag }));
            item.setTags(tagObjects); // Apply the combined tags

        } else if (userChoice === "3") {
            // Option 3: Remove matching tags from the item
            Zotero.debug(`Removing matching tags from the item.`);
            const existingTags = item.getTags().map(tag => tag.tag); // Get the current tags

            // Filter out the tags that are in both existing tags and newTags (i.e., the clipboard tags)
            const filteredTags = existingTags.filter(tag => !newTags.includes(tag));

            const tagObjects = filteredTags.map(tag => ({ tag }));
            item.setTags(tagObjects); // Apply the filtered list, effectively removing the matching tags
        }

        // Save changes to the item
        await item.saveTx();
        Zotero.debug(`Successfully updated tags for item with ID: ${item.id}`);

    } catch (error) {
        Zotero.logError(`Error pasting tags: ${error.message}`);
    }
}

// Function to handle pasting item type (for Paste-type option)
async function pasteItemType(item, itemType) {
    try {
        if (!itemType) {
            Zotero.debug("No item type found in clipboard data.");
            return;
        }

        // Convert itemType string to Zotero's internal itemTypeID
        const itemTypeID = Zotero.ItemTypes.getID(itemType);
        if (!itemTypeID) {
            throw new Error(`Invalid item type '${itemType}'`);
        }

        Zotero.debug(`Pasting item type: ${itemType} (ID: ${itemTypeID}) into item with ID: ${item.id}`);
        item.setType(itemTypeID); // Set the item type using itemTypeID
        await item.saveTx(); // Save the changes to the item
        Zotero.debug(`Successfully pasted item type: ${itemType} into item with ID: ${item.id}`);
    } catch (error) {
        Zotero.logError(`Error pasting item type: ${error.message}`);
    }
}