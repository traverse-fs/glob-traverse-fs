/**
 * 
 * Package: 
 * Author: Ganesh B
 * Description: Nodejs npm module to traverse folder using code or cli or use glob patterns
 * Install: npm i traverse-fs, npm i fssys 
 * Github: https://github.com/ganeshkbhat/glob-traverse-fs
 * npmjs Link: 
 * File: demos/demo.traverse.files.js
 * Test for File: traverse.js
 * File Description: Demo file for Traversing files in a directory
 * 
*/


let resultSingleArray = [], resultSingleRecursiveArray = [], resultNestedArray = [], resultNestedRecursiveArray = [];


async function resultSingleArray() {
    resultSingleArray = await traverse.dir("./", false, traverse.callbacks.defaultFetch, false, traverse.callbacks.defaultErrorHandler, "flatarray");
}

async function resultSingleRecursiveArray() {
    resultSingleRecursiveArray = await traverse.dir("./", true, traverse.callbacks.defaultFetch, false, traverse.callbacks.defaultErrorHandler, "flatarray")
}
async function resultNestedArray() {
    resultNestedArray = await traverse.dir("./", false, traverse.callbacks.defaultFetch, false, traverse.callbacks.defaultErrorHandler, "nestedarray");
}
async function resultNestedRecursiveArray() {
    resultNestedRecursiveArray = await traverse.dir("./", true, traverse.callbacks.defaultFetch, false, traverse.callbacks.defaultErrorHandler, "nestedarray");
}
