import { execSync } from 'child_process';

const url = process.argv[2];

const formatTable = execSync(`yt-dlp --list-formats --cookies /home/userland/yt/youtube-cookies.txt ${url}`).toString();

const x = formatTable.split('\n');
const x2 = x.map((line) => {
  return line.replace(/\b\s+\b/g, '+');
});

/*
for (const line of x) {
  console.log(`line===>>>> ${line}`);
}
*/

x2.forEach(console.log);

console.log('Format inp:');
// console.log(formatTable);
