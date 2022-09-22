#!/usr/bin/env node
/**
 * 
 * Package: 
 * Author: Ganesh B
 * Description: Nodejs npm module to traverse folder using code or cli or use glob patterns
 * Install: npm i traverse-cli, npm i traverse-fs, npm i fssys
 * Github: https://github.com/ganeshkbhat/glob-traverse-fs
 * npmjs Link: 
 * File: cli.js
 * File Description: CLI Command file
 * 
*/

const yargs = require("yargs");
const sYargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const config = require("./config.js");


let options = [];
let k = Object.keys(config.options);
for (let i = 0; i < k.length; i++) {
    let o = {
        "name": k[i],
        ...config.options[k[i]]
    };
    options.push(o);
}

var argv = sYargs(hideBin(process.argv));


for (let j = 0; j < k.length; j++) {
    argv.command(
        k[j],
        options[j].describe,
        function (yargs) {
            for (let l = 0; l < opts.positional.length; l++) {
                let o = opts.positional[l];
                argv.positional(o.name, { ...o.properties })
            }
            return yargs;
        }.bind(null, opts = options[j]),
        (!options[j].file["function"]) ? require(options[j].file.path) : require(options[j].file.path)[options[j].file.function])
}

argv.option('verbose', {
    alias: 'v',
    type: 'boolean',
    description: 'Run with verbose'
})
    .usage("Usage: \n fst dir [dirname] \n fst search [dirname] [searchtext]")
    .help('h')
    .alias('h', 'help')
    .epilog('traverse-cli: MIT License')
    .showHelpOnFail(true)
    .demandCommand(1, '')
    .strict()
    .parse()
