#!/usr/bin/env node

const argv = process.argv;

if (argv[2] === '-h') {
  console.log(`
A collection of utility functions and commands.
Each command must be preceeded by 'gbel-util'

Usage:
-----
cpb --r value --b value --g value
  Returns th perceived brightness value of the defined colour.
  `);
  process.exit(0);
}

// console.log(process.argv);

class UtilityFunctions {
  static args = {};

  /**
   * Parses the user-supplied args into the `args` object.
   */
  static setArgs() {
    // ensure the right command format is used.
    if (argv[2].startsWith('--')) {
      this.incorrectFormatError();
    }

    // likely right format; parse
    const commandArgsList = argv.slice(3);
    while (commandArgsList.length > 0) {
      let prop = commandArgsList.shift(); // remove prop item at idx 0
      if (prop.startsWith('--')) {
        // a parameter name
        prop = prop.replace('--', ''); // replace only first
        // get the property value
        const val = commandArgsList.shift();

        // set property and value in args object
        this.args[prop] = val;

        // console.log(this.args); // SCAFF
      } else {
        // improper format
        this.incorrectFormatError();
      }
    }
  }

  /**
   * Show format message on incorrect command format.
   */
  static incorrectFormatError() {
    // on wrong format...
    console.log(`
    Incorrect command format.

    General usage:
      gbel-util command [--arg value]...
      `);

    process.exit(1);
  }

  /**
   * Ensures the arguments are strictly numeric strings; otherwise throw.
   *
   * @param {Array} stringArgs - an array of strings to test.
   * @return {undefined} - on success, does nothing; throws on failure.
   */
  static ensureNumericString(...stringArgs) {
    for (const arg of stringArgs) {
      if (!(arg.match(/^[0-9]*$/))) {
        throw new Error(`${arg} is not numeric`);
      }
    }
  }

  /**
   * Calculates the perceived brightness of a color.
   *
   * @param {String} r - red value.
   * @param {String} g - green value.
   * @param {String} b - blue value.
   * @return {Number} - the percieved brightness value.
   */
  static calcColorPercievedBrightness(r, g, b) {
    // ensure args are numeric
    this.ensureNumericString(r, g, b);

    // test passed
    const r2 = parseInt(r) ** 2;
    const g2 = parseInt(g) ** 2;
    const b2 = parseInt(b) ** 2;

    const numerator = ((0.299 * r2) + (0.587 * g2) + (0.114 * b2)) ** 0.5;
    return (numerator / 255);
  }
}

// handle different commands
UtilityFunctions.setArgs();
const command = argv[2];

switch (command) {
  case 'cpb':
    const args = UtilityFunctions.args;
    console.log(UtilityFunctions.calcColorPercievedBrightness(args.r, args.g, args.b));
    break;
  default:
    throw new Error(`invalid command '${command}'`);
}
