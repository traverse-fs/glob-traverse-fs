// /**
//  * 
//  * Package: 
//  * Author: Ganesh B
//  * Description: Nodejs npm module to traverse folder using code or cli or use glob patterns
//  * Install: npm i traverse-fs, npm i fssys 
//  * Github: https://github.com/ganeshkbhat/glob-traverse-fs
//  * npmjs Link: 
//  * File: test/test.traverse.filesfolders.mjs
//  * Test for File: traverse.js
//  * File Description: Test file for Traversing and searching files and folders in a directory
//  * 
// */

// const expect = require('chai').expect;
// const traverse = require("../src/traverse");

// describe('test.traverse.filesfolders.js::traverse:fssys:traverse-cli: Test Suite for Traverse Files and Folders', function() {

//     let resultSingleArray, resultNestedArray;
//     before(async function(){
//         resultSingleArray = await traverse.dir("./", true, (d, f) => { return path.join(d, f.name); }, false, (e) => { console.log(e) }, "flatarray");
//         resultNestedArray = await traverse.dir("./", true, (d, f) => { return path.join(d, f.name); }, false, (e) => { console.log(e) }, "nestedarray");
//     });

//     describe ('traverse:fssys:traverse-cli: [Test A] Test Suite for traversing folders in main repo directory', function() {
//         // it('[Test A] package.json Present', function(done){
//         //     expect(200).to.equal(200);
//         //     done();
//         // });

//         it('[Test A] Traverse file LICENSE in main directory', function(done) {
//             expect(100).to.equal(100);
//             done();
//         });

//         it('[Test A] Traverse file package.json in main directory', function(done) {
//             expect(100).to.equal(100);
//             done();
//         });

//         it('[Test A] Traverse file package-lock.json in main directory', function(done) {
//             expect(100).to.equal(100);
//             done();
//         });

//         it('[Test A] Traverse folder ./node_modules in main directory', function(done) {
//             expect(100).to.equal(100);
//             done();
//         });

//         it('[Test A] Traverse folder ./test in main directory', function(done) {
//             expect(100).to.equal(100);
//             done();
//         });
//     });

//     describe ('test.traverse.filesfolders.js::traverse:fssys:traverse-cli: [Test B] Test Suite Recursive for traversing folders in subfolders of repo directory', function() {
//         // it('[Test C] status', function(done){
//         //     expect(200).to.equal(200);
//         //     done();
//         // });

//         it('[Test C] Traverse file LICENSE in subfolders of repo directory', function(done) {
//             expect(100).to.equal(100);
//             done();
//         });

//         it('[Test C] Traverse file package.json in subfolders of repo directory', function(done) {
//             expect(100).to.equal(100);
//             done();
//         });

//         it('[Test C] Traverse file package-lock.json in subfolders of repo directory', function(done) {
//             expect(100).to.equal(100);
//             done();
//         });

//         it('[Test C] Traverse folder ./node_modules/.bin in subfolders of repo directory', function(done) {
//             expect(100).to.equal(100);
//             done();
//         });

//         it('[Test C] Traverse folder ./node_modules/chai in subfolders of repo directory', function(done) {
//             expect(100).to.equal(100);
//             done();
//         });
//     });

//     describe ('test.traverse.filesfolders.js::traverse:fssys:traverse-cli: [Test C] Test Suite Negatives for traversing folders in main repo directory', function() {
//         // it('[Test E] status', function(done){
//         //     expect(200).to.equal(200);
//         //     done();
//         // });

//         it('[Test E] Traverse file LICENSES not in subfolders of repo directory', function(done) {
//             expect(100).to.equal(100);
//             done();
//         });

//         it('[Test E] Traverse file packages.json not in subfolders of repo directory', function(done) {
//             expect(100).to.equal(100);
//             done();
//         });

//         it('[Test E] Traverse file package-locks.json not in subfolders of repo directory', function(done) {
//             expect(100).to.equal(100);
//             done();
//         });

//         it('[Test E] Traverse folder ./node_modules/.someotherthing not in subfolders of repo directory', function(done) {
//             expect(100).to.equal(100);
//             done();
//         });

//         it('[Test E] Traverse folder ./node_modules/something not in subfolders of repo directory', function(done) {
//             expect(100).to.equal(100);
//             done();
//         });
//     });

// });


