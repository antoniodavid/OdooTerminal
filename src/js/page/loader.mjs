// Copyright  Alexandre Díaz <dev@redneboa.es>
// License AGPL-3.0 or later (http://www.gnu.org/licenses/agpl).

import '@css/terminal.css';
import postMessage from '@common/utils/post_message';
import registerBackofficeFuncs from '@odoo/commands/backoffice/__all__';
import registerCommonFuncs from '@odoo/commands/common/__all__';
import OdooTerminal from '@odoo/terminal';
import getOdooVersion from '@odoo/utils/get_odoo_version';
import getUID from '@odoo/utils/get_uid';
import getUsername from '@odoo/utils/get_username';
import isBackOffice from '@odoo/utils/is_backoffice';
import registerCoreFuncs from '@terminal/commands/__all__';
import OdooTerminalTests from '@tests/terminal';

let terminal = null;
function getTerminalObj() {
  if (terminal) {
    return terminal;
  }

  const load_tests = window.__OdooTerminal.load_tests || navigator.webdriver;
  if (load_tests) {
    console.info('[OdooTerminal] Tests Enabled');
  }
  try {
    const TerminalClass = load_tests ? OdooTerminalTests : OdooTerminal;
    terminal = new TerminalClass();
    registerCoreFuncs(terminal);
    registerCommonFuncs(terminal);
  } catch (err) {
    console.warn("[OdooTerminal] Can't initilize terminal", err);
  }
  return terminal;
}

window.addEventListener('toggle_terminal', () => {
  if (typeof window.__OdooTerminal !== 'undefined') {
    getTerminalObj().doToggle();
  }
});
window.addEventListener(
  'message',
  ev => {
    if (ev.source !== window) {
      return;
    }
    if (ev.data.type === 'ODOO_TERM_CONFIG') {
      window.__OdooTerminal = {
        raw_server_info: ev.data.info,
        load_tests: ev.data.config.devmode_tests,
      };
      const term_obj = getTerminalObj();
      if (term_obj) {
        if (isBackOffice()) {
          registerBackofficeFuncs(term_obj);
        }
        term_obj.init(ev.data.config);
        const vals = {
          version: getOdooVersion(),
        };
        const username = getUsername();
        const uid = getUID();
        if (uid && uid !== -1) {
          vals.username = username ? username : `uid: ${uid}`;
        }
        term_obj.screen.updateInputInfo(vals);
      }
    }
  },
  true,
);
// This is used to communicate to the extension that the widget
// was initialized successfully.
postMessage('ODOO_TERM_START');
