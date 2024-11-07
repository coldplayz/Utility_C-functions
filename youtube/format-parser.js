import { execSync } from 'child_process';

const url = process.argv[2];

const formatTable = execSync(`yt-dlp --list-formats --cookies /home/userland/yt/youtube-cookies.txt ${url}`).toString();

const x = formatTable.split('\n');

const x2 = x
  .map((line) => line.replace(/.*?(\d{3,4}p).*/g, '$1'))
  .filter((line) => /.*?\d{3,4}p/.test(line));

const x3 = [...new Set(x2)];

/*
const x2 = x.map((line) => {
  return line.replace(/\b\s+\b/g, '+');
});
*/

/*
for (const line of x) {
  console.log(`line===>>>> ${line}`);
}
*/

// x2.forEach(console.log);

console.log('Available formats:');
console.log(`${x3}\n`);
// console.log(formatTable);
