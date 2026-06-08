//will search the selection on google scholar


const PLUGIN_ID = "search-google-scholar-in-zotero@yourdomain.com";

// A global (module-level) variable to hold the last text selection

// 1. Listen to text-selection popups
let lastSelectedText = "";
let selectionTimeout = null;

// 1. Listen to text-selection popups
Zotero.Reader.registerEventListener("renderTextSelectionPopup", (event) => {
  const { params } = event;
  const sel = params.text || (params.annotation && params.annotation.text);

  if (typeof sel === "string" && sel.trim().length > 0) {
    lastSelectedText = sel.trim();

    // Clear previous timeout if it exists
    if (selectionTimeout) {
      clearTimeout(selectionTimeout);
    }

    // Auto-expire after few seconds
    selectionTimeout = setTimeout(() => {
      lastSelectedText = "";
      selectionTimeout = null;
    }, 5000);
  }
}, PLUGIN_ID);

// 2. Listen to the context menu event
Zotero.Reader.registerEventListener("createViewContextMenu", (event) => {
  const { append } = event;

  if (lastSelectedText && lastSelectedText.length > 0) {

    // --- Search Google Scholar ---
    append({
      label: `🔍 Search Google Scholar`,
      onCommand: () => {
        const query = encodeURIComponent(lastSelectedText);
        Zotero.launchURL(`https://scholar.google.com/scholar?q=${query}`);
      },
    });


  }
}, PLUGIN_ID);
