/**
 * 
 * Package: 
 * Author: Ganesh B
 * Description: Nodejs npm module to traverse folder using code or cli or use glob patterns
 * Install: npm i traverse-cli, npm i traverse-fs, npm i fssys
 * Github: https://github.com/ganeshkbhat/glob-traverse-fs
 * npmjs Link: 
 * File: index.js
 * File Description: Get CLI Arguments function
 * 
*/

const tfs = require("./src/traverse");
const search = require("./src/search");

const callbacks = {
    ...tfs.callbacks,
    ...search.callbacks
}


module.exports = {
    ...tfs,
    ...search,
    callbacks: callbacks
};

