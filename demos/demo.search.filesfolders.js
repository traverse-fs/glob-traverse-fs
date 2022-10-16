// /**
//  * 
//  * Package: 
//  * Author: Ganesh B
//  * Description: Nodejs npm module to traverse folder using code or cli or use glob patterns
//  * Install: npm i traverse-fs, npm i fssys
//  * Github: https://github.com/ganeshkbhat/glob-traverse-fs
//  * npmjs Link: 
//  * File: demos/demo.search.filesfolders.js
//  * Test for File: traverse.js
//  * File Description: Demo file for Traversing and searching files and folders in a directory
//  * 
// */


let resultSingleArray, resultNestedArray;

async function resultSingleArray(){
    resultSingleArray = await traverse.dir("./", true, (d, f) => { return path.join(d, f.name); }, false, (e) => { console.log(e) }, "flatarray");
}

async function resultNestedArray(){
    resultNestedArray = await traverse.dir("./", true, (d, f) => { return path.join(d, f.name); }, false, (e) => { console.log(e) }, "nestedarray");
}

