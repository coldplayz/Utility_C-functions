import yargs from 'yargs';
import inquirer from 'inquirer';

const parser = yargs(process.argv.slice(2));

/*
const sing = () => console.log('🎵 Oy oy oy');

const askName = async () => {
  const answers = await inquirer.prompt([
    {
      message: 'What is your name?',
      name: 'name',
      type: 'string'
    },
    {
      message: 'What is your age?',
      name: 'age',
      type: 'number'
    },
  ]);

  console.log(`Hello, ${answers.name}!`);
  console.log(`You are ${answers.age} years old.`);
};

const argv = parser
  .command('ask', 'use inquirer to prompt for your name', () => {}, askName)
  .command('sing', 'a classic yargs command without prompting', () => {}, sing)
  .demandCommand(1, 1, 'choose a command: ask or sing')
  .strict()
  .help('h')
  .parse();
*/

const argv = parser
  .option('size', {
    alias: 's',
    describe: 'choose a size',
    choices: ['xs', 's', 'm', 'l', 'xl']
  })
  .completion()
  // .showCompletionScript()
  .parse()
