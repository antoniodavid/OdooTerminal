// Copyright  Alexandre Díaz <dev@redneboa.es>
// License AGPL-3.0 or later (http://www.gnu.org/licenses/agpl).

import {COMPATIBLE_VERSIONS, IGNORED_KEYS} from "./globals.mjs";

/**
 * @param {Object} e
 * @returns {Array}
 */
export function process_keybind(e) {
  const keybind = [];
  if (e.altKey) {
    keybind.push("Alt");
  }
  if (e.ctrlKey) {
    keybind.push("Ctrl");
  }
  if (e.shiftKey) {
    keybind.push("Shift");
  }
  if (e.metaKey) {
    keybind.push("Meta");
  }
  if (IGNORED_KEYS.indexOf(e.key) === -1 && e.key) {
    keybind.push(e.key === " " ? "Space" : e.key);
  }
  return keybind;
}

export function isCompatibleOdooVersion(version) {
  return COMPATIBLE_VERSIONS.some((item) => version.startsWith(item));
}
