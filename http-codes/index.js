import {
  getReasonPhrase,
} from 'http-status-codes';

const code = parseInt(process.argv[2]);

console.dir({
  code: code || 'no input code',
  reasonPhrase: getReasonPhrase(code),
});
