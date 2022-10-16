/**
 * 
 * Package: 
 * Author: Ganesh B
 * Description: Nodejs npm module to traverse folder using code or cli or use glob patterns
 * Install: npm i traverse-fs, npm i fssys
 * Github: https://github.com/ganeshkbhat/glob-traverse-fs
 * npmjs Link: 
 * File: mocha.test.config.js
 * File Description: Test config file for mocha for Traversing and searching files in a directory
 * 
*/
/* eslint no-console: 0 */

'use strict';

module.exports = {
    spec: [
        './test/*.test.js',
        './test/**/*.test.js',
        './test/**/**/*.test.js',
        './test/**/**/**/*.test.js',
        './test/test.*.js',
        './test/**/test.*.js',
        './test/**/**/test.*.js',
        './test/**/**/**/test.*.js',
    ],
};