/**
 * 
 * Package: 
 * Author: Ganesh B
 * Description: Nodejs npm module to traverse folder using code or cli or use glob patterns
 * Install: npm i traverse-cli, npm i traverse-fs, npm i fssys
 * Github: https://github.com/ganeshkbhat/glob-traverse-fs
 * npmjs Link: 
 * File: cli-traverse.js
 * File Description: CLI Command file
 * 
*/

// import arg from 'arg';

// function parseArgumentsIntoOptions(rawArgs) {
//  const args = arg(
//    {
//      '--git': Boolean,
//      '--yes': Boolean,
//      '--install': Boolean,
//      '-g': '--git',
//      '-y': '--yes',
//      '-i': '--install',
//    },
//    {
//      argv: rawArgs.slice(2),
//    }
//  );
//  return {
//    skipPrompts: args['--yes'] || false,
//    git: args['--git'] || false,
//    template: args._[0],
//    runInstall: args['--install'] || false,
//  };
// }

// export function cli(args) {
//  let options = parseArgumentsIntoOptions(args);
//  console.log(options);
// }

const traverse = require("./traverse");
const arg = require("./cli.args").cliArgs(process.argv);


function search(arg) {
    console.log("arg");
}

function traverser(arg) {
    console.log("arg");
}

if (arg.includes("-s") || arg.includes("-sf") || arg.includes("-sffd") || arg.includes("--search")) {
    // -s : Traverse and Search files and folders
    // --search : Traverse and Search files and folders
    // -sf
    // -sfd
    search(arg);
}

if (arg.includes("-t") || arg.includes("-tf") || arg.includes("-tfd") || arg.includes("--traverse")) {
    // -t : Traverse files and folders
    // --traverse : Traverse files and folders
    // -tf
    // -tfd
    traverser(arg);
}
