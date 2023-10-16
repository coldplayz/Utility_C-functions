#!/usr/bin/env node

const arg = process.argv[2];

if (!arg || arg === '--help' || arg === '-h') {
  // log help message
  const help = `
search - a tool to search for program names by keyword.

Usage:
  search keyword
  `;
  console.log(help);
  process.exit();
}

interface ProgramType {
  [index: string]: string[];
}

const programs: ProgramType = {
  ncdu: ['disk', 'memory', 'management'],
};

// Returns program name where their tag array matches keyword
function search(keyword: string): string[] {
  const programNames: string[] = [];

  for (const key in programs) {
    if (programs[key].includes(keyword.toLowerCase())) {
      programNames.push(key);
    }
  }

  return programNames;
}

console.log(search(arg));
