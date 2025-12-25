import { execSync } from 'child_process';
import fs from 'fs';

const url = process.argv[2];
const mapPath = './formatsMap.json';

const formatsMapString = fs.readFileSync(mapPath, 'utf8') || '{}';
const formatsMap = JSON.parse(formatsMapString) || {};
const formats = formatsMap?.[url];

if (formats) {
  // Video formats exist already for URL
  console.log('Available resolutions:');
  console.log(`${formats}\n`);
  process.exit(0);
} // else fetch anew

let formatTable;

try {
  formatTable = execSync(
    `yt-dlp \
      --list-formats \
      --js-runtimes node \
      --remote-components ejs:github \
      --cookies /home/userland/yt/youtube-cookies.txt \
      ${url}`
  ).toString();
} catch (err) {
  console.log(err.stdout.toString());
  process.exit(1);
}

const x = formatTable.split('\n');

const x2 = x
  .map((line) => line.replace(/.*?(\d{3,4}p).*/g, '$1'))
  .filter((line) => /.*?\d{3,4}p/.test(line));

const x3 = [...new Set(x2)];

// Save new formats and log
fs.readFile(mapPath, 'utf8', (err, data) => {
  if (err) {
    // Maybe no such file yet; write to alternative file and investigate error.
    console.log(err);
    const initData = { [url]: x3 };
    fs.writeFileSync(`${mapPath}-error-alt`, JSON.stringify(initData));
  } else {
    // Append to data
    const formatsMap = JSON.parse(data || '{}') || {};
    formatsMap[url] = x3;
    fs.writeFileSync(mapPath, JSON.stringify(formatsMap));
  }
})
console.log('Available resolutions:');
console.log(`${x3}\n`);
// console.log(formatTable);

// --cookies /home/userland/yt/youtube-cookies.txt \
