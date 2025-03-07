// Copyright  Alexandre Díaz <dev@redneboa.es>
// License AGPL-3.0 or later (http://www.gnu.org/licenses/agpl).

import isEmpty from '@terminal/utils/is_empty';
import {getArgumentInfo} from '@trash/argument';
import {ARG} from '@trash/constants';

async function printHelpDetailed(screen, cmd, cmd_def) {
  screen.eprint('NAME');
  screen.print(
    `<div class="terminal-info-section">${cmd} - ${cmd_def.definition}</div>`,
  );
  screen.print(' ');
  screen.eprint('DESCRIPTION');
  screen.print(`<div class="terminal-info-section">${cmd_def.detail}</div>`);
  // Create arguments text
  screen.print(' ');
  screen.eprint('ARGUMENTS');
  const args = [];
  let arg_info_str = '';
  for (const arg of cmd_def.args) {
    const arg_info = getArgumentInfo(arg);
    const lnames = [`-${arg_info.names.short}`, `--${arg_info.names.long}`];
    const arg_symbols = arg_info.is_required ? ['<', '>'] : ['[', ']'];
    arg_info_str += `${arg_symbols[0]}${lnames.join(', ')} [${ARG.getHumanType(
      arg_info.type,
    )}`;
    if (isEmpty(arg_info.strict_values)) {
      arg_info_str += `]${arg_symbols[1]}`;
    } else {
      arg_info_str += `(${arg_info.strict_values.join('|')})]${arg_symbols[1]}`;
    }
    if (typeof arg_info.default_value !== 'undefined') {
      if (
        (arg_info.type & ARG.List) === ARG.List ||
        (arg_info.type & ARG.Dictionary) === ARG.Dictionary
      ) {
        arg_info_str += JSON.stringify(arg_info.default_value);
      } else {
        arg_info_str += arg_info.default_value;
      }
    }
    arg_info_str += `<div class="terminal-info-description">${arg_info.description}</div>`;
    arg_info_str += '<br/>';
  }
  screen.print(`<div class="terminal-info-section">${arg_info_str}</div>`);
  screen.print(args);
  if (cmd_def.example) {
    screen.eprint('EXAMPLE');
    screen.print(
      `<div class="terminal-info-section">${cmd} ${cmd_def.example}</div>`,
    );
  }
}

function cmdPrintHelp(kwargs, screen) {
  if (typeof kwargs.cmd === 'undefined') {
    const sorted_cmd_keys = Object.keys(this.registeredCmds).sort();
    const sorted_keys_len = sorted_cmd_keys.length;
    for (let x = 0; x < sorted_keys_len; ++x) {
      const _cmd = sorted_cmd_keys[x];
      screen.printHelpSimple(_cmd, this.registeredCmds[_cmd]);
    }
  } else if (Object.hasOwn(this.registeredCmds, kwargs.cmd)) {
    printHelpDetailed.call(
      this,
      screen,
      kwargs.cmd,
      this.registeredCmds[kwargs.cmd],
    );
  } else {
    throw new Error(`'${kwargs.cmd}' command doesn't exists`);
  }
}

export default {
  definition: 'Print this help or command detailed info',
  callback: cmdPrintHelp,
  detail:
    'Show commands and a quick definition.<br/>- ' +
    '<> ~> Required Parameter<br/>- [] ~> Optional Parameter',
  args: [[ARG.String, ['c', 'cmd'], false, 'The command to consult']],
  example: '-c search',
};
