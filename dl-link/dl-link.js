const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

readline.question('Enter movie title: ', name => {
  const link = `http://mp44.dlmania.com/Hollywood/${name}/${name} (Mp4Mania).mp4`;
  const parsedLink = link.replaceAll(' ', '%20');
  console.log(parsedLink);

  readline.close();
});
