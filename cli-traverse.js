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

const traverse = require("./traverse");
const arg = require("./cli.args").cliArgs(process.argv);

function search(arg) {

}

function traverser(arg) {

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
