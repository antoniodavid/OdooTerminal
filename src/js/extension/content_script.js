// Copyright  Alexandre Díaz <dev@redneboa.es>
// License AGPL-3.0 or later (http://www.gnu.org/licenses/agpl).

(async () => {
    const BrowserObj = typeof chrome === "undefined" ? browser : chrome;
    await import(
        BrowserObj.extension.getURL("src/js/extension/content_main.mjs")
    );
})();
