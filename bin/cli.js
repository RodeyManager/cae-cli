'use strict';

const program = require('commander');
const chalk = require('chalk');
const argv = require('yargs').argv;
const {
  create,
  gc,
  gs,
  gm
} = require('./create');


program
  .usage('[options] \n\r\t 欢迎使用Cae项目构建工具; \n\r\t ' + '将帮助您简化前端开发流程和提升开发效率。')
  .version('1.0.0')
  .option('-v', chalk.green('use JavaScript or NodeJS view template engine ( nunjucks, ejs, jade )'))
  .option('-q', chalk.green('use database engine ( mysql, mongodb... )'))
  .option('-o', chalk.green('use database orm framwork ( sequelize, knex )'))
  .option('-j', chalk.green('use JWT'))
  .option('-s', chalk.green('use NodeJS session'))
  .option('-r', chalk.green('use NodeJS redis'))
  .option('', '\n')

  // commands
  .option('gc', chalk.green(`<controller name> Create controller`), () => {
    gc();
  })
  .option('gs', chalk.green(`<service name> Create service`), () => {
    gs();
  })
  .option('gm', chalk.green(`<model name> Create model`), () => {
    gm();
  })
  .option('create', chalk.green(`<project name> [options] Create project`))
  .action((projectName) => {
    create(projectName);
  })

  .parse(process.argv);