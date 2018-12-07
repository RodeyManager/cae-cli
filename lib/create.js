const chalk = require('chalk');
const ora = require('ora');
const fs = require('fs');
const path = require('path');
const prompts = require('prompts');
const argv = require('yargs').argv;
const downloadGitRepo = require('download-git-repo');
const fse = require('fs-extra');

const mds = {};

exports.create = async (name) => {
  if (argv._[0] !== 'create') process.exit(0);

  mds.name = name;

  // await checkViewEngine();
  // await checkSQL();
  // await checkORM();

  mds.cwd = process.cwd();
  await createProject();

};

async function createProject() {
  const dir = path.resolve(mds.cwd, mds.name);
  console.log(dir);
  if (fs.existsSync(dir)) {
    const response = await prompts({
      type: 'text',
      name: 'value',
      message: `This directory is Existing, Are you need cover? (Y/n)`
    });
    if (!/^y(es)?$/i.test(response.value))
      process.exit(0);
    else
      await _create(dir);
  } else {
    await _create(dir);
  }
}

async function _create(dir) {

  const spinner = ora({
    text: 'Creating, please wait a moment...',
    spinner: require('cli-spinners').dots
  }).start();
  downloadGitRepo('RodeyManager/cae-demo', './tmp', (err) => {
    if (err) {
      spinner.fail('Created fail');
      console.log(chalk.red(err));
      return console.log(chalk.cyan('you can git clone https://github.com/RodeyManager/cae-demo.git'));
    } else {
      spinner.succeed('Created succeffuly');
      fse.copySync('./tmp', dir);
    }
  });

}

async function checkViewEngine() {
  if (argv.v) return mds.v = argv.v;
  const response = await prompts({
    type: 'text',
    name: 'value',
    message: 'Please enter the template engine (exp: ejs, nunjucks ...) ?'
  });

  if (response.value) mds.v = value;
}

async function checkSQL() {
  if (argv.q) return mds.q = argv.q;
  const response = await prompts({
    type: 'text',
    name: 'value',
    message: 'Please enter the database engine (exp: mysql, mongodb ...) ?'
  });

  if (response.value) mds.q = value;
}

async function checkORM() {
  if (argv.o) return mds.o = argv.o;
  const response = await prompts({
    type: 'text',
    name: 'value',
    message: 'Please enter the database orm framwork (exp: knex, sequelize ...) ?'
  });

  if (response.value) mds.o = value;
}


function firstUpper(s) {
  return s.replace(/^([a-z])(\w*)$/i, (matchMedia, $1, $2) => {
    return $1.toUpperCase() + ($2 || '');
  });
}

const useStrict = `'use strict';\n`;

const gnHeader = (name, type) => {
  const className = `${firstUpper(name)}${firstUpper(type)}`;
  return `
const { Base${firstUpper(type)} } = require('cae');\n
class ${className} extends Base${firstUpper(type)} {\n
  async index () {}\n
`;
};
const gnFooter = (name, type) => {
  const className = `${firstUpper(name)}${firstUpper(type)}`;
  return `\n}\n\nmodule.exports = ${className};`;
};

const _gn = (name, type) => {
  type = type.toLowerCase();
  const filePath = path.resolve(process.cwd(), `app/${type}/${name}.js`);
  const content = [useStrict, gnHeader(name, type)];

  argv._.splice(0, 2);
  argv._.length > 0 && argv._.forEach(m => {
    if (m !== 'index')
      content.push(`  async ${m} (){}\n`);
  });
  content.push(gnFooter(name, type));

  try {
    const writed = fs.writeFileSync(filePath, content.join(''));
    if (!writed) {
      console.log(chalk.green(`${filePath} Created successfully`));
    } else {
      console.log(chalk.red(`${filePath} Created failed`));
    }
  } catch (e) {
    console.log(chalk.red(e.message));
  }

}

exports.gc = () => {
  _gn(argv._[1], 'controller');
};

exports.gs = () => {
  _gn(argv._[1], 'service');
};

exports.gm = () => {
  _gn(argv._[1], 'model');
};