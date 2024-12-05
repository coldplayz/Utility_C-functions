import status from 'http-status';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

const argv = yargs(hideBin(process.argv))
  .option('c', {
    alias: 'code',
    type: 'number',
    desc: 'a status code like 200',
    requiresArg: true,
  })
  .option('n', {
    alias: 'name',
    type: 'string',
    desc: 'name of the code to get',
    requiresArg: true,
  })
  .option('s', {
    alias: 'class',
    type: 'string',
    desc: 'class to get info on',
    requiresArg: true,
    choices: ['1xx', '2xx', '3xx', '4xx', '5xx'],
  })
  // .completion('completion', completionCb)
  .completion()
  .help()
  .parse();

function main() {
  switch (true) {
    case !!argv.c:
      return console.log({
        code: argv.c,
        name: status[prefixNameWith(argv.c)],
        message: status[prefixMessageWith(argv.c)],
      });
    case !!argv.n:
      return console.log(`${argv.n}: ${status[parseCodeName(argv.n)]}`);
    case !!argv.s:
      return console.log({
        name: status.classes[prefixNameWith(argv.s)],
        message: status.classes[prefixMessageWith(argv.s)],
      });
    default:
      console.error('unknown option');
  }
}

function prefixNameWith(prefix) {
  return `${prefix}_NAME`;
}

function prefixMessageWith(prefix) {
  return `${prefix}_MESSAGE`;
}

function parseCodeName(name='') {
  return name
    .toUpperCase()
    .replace(/ /g, '_');
}

function completionCb(_current, _argv) {
  const codeNames = Object.keys(status)
    .filter((k) => /^\d{3}$/.test(k))
    .map((code) => status[code]) // get spaced name
    .map(parseCodeName); // to underscore name

  return [
    ...codeNames,
  ];
}

main();
