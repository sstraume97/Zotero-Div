/**
 * Customize color labels of reader
 * @author windingwind
 * @usage Set the `Event` to `Program Startup`; Edit the action script below to replace the labels.
 * @link https://github.com/windingwind/zotero-actions-tags/discussions/211
 * @see https://github.com/windingwind/zotero-actions-tags/discussions/211
 */

// Edit labels below
const replaceLabelMap = {
  "#ffd400": "Gul: Generelle uthevinger",
  "#ff6666": "Rød",
  "#5fb236": "Grønn: Ord og forkortelser",
  "#2ea8e5": "Custom Blue",
  "#a28ae5": "Custom Purple",
  "#e56eee": "Custom Magenta",
  "#f19837": "Custom Orange",
  "#aaaaaa": "Custom Grey",
};

function hackContextMenuLabel(event) {
  setTimeout(() => {
    event.reader._iframeWindow?.document
      .querySelectorAll(".context-menu .row")
      .forEach((e) => {
        const color = e.querySelector("path[fill]")?.getAttribute("fill");
        if (!color) {
          return;
        }
        if (color in replaceLabelMap) {
          e.innerHTML =
            e.querySelector("svg")?.outerHTML + replaceLabelMap[color];
        }
      });
  }, 10);
}

Zotero.Reader.registerEventListener(
  "createAnnotationContextMenu",
  hackContextMenuLabel,
  "zoterotag@euclpts.com"
);

Zotero.Reader.registerEventListener(
  "createColorContextMenu",
  hackContextMenuLabel,
  "zoterotag@euclpts.com"
);