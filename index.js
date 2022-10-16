/**
 * 
 * Package: 
 * Author: Ganesh B
 * Description: Nodejs npm module to traverse folder using code or cli or use glob patterns
 * Install: npm i traverse-fs, npm i fssys
 * Github: https://github.com/ganeshkbhat/glob-traverse-fs
 * npmjs Link: 
 * File: index.js
 * File Description: Traverse and search files and folders in a directory - core file
 * 
*/
/* eslint no-console: 0 */

'use strict';
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

