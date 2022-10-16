/**
 * 
 * Package: 
 * Author: Ganesh B
 * Description: Nodejs npm module to traverse folder using code or cli or use glob patterns
 * Install: npm i traverse-fs, npm i fssys 
 * Github: https://github.com/ganeshkbhat/glob-traverse-fs
 * npmjs Link: 
 * File: test/test.traverse.folders.js
 * Test for File: traverse.js
 * File Description: Test file for Traversing and searching folders in a directory
 * 
*/

const expect = require('chai').expect;
const traverse = require("../src/traverse");

describe('test.traverse.folders.js::traverse:fssys:traverse-cli: Test Suite for Traverse Folders', function () {

    let resultSingleArray = [], resultSingleRecursiveArray = [], resultNestedArray = [], resultNestedRecursiveArray = [];
    before(async function () {
        resultSingleArray = await traverse.dir("./", false, traverse.callbacks.defaultFetch, false, traverse.callbacks.defaultErrorHandler, "flatarray");
        resultSingleRecursiveArray = await traverse.dir("./", true, traverse.callbacks.defaultFetch, false, traverse.callbacks.defaultErrorHandler, "flatarray")
        resultNestedArray = await traverse.dir("./", false, traverse.callbacks.defaultFetch, false, traverse.callbacks.defaultErrorHandler, "nestedarray");
        resultNestedRecursiveArray = await traverse.dir("./", true, traverse.callbacks.defaultFetch, false, traverse.callbacks.defaultErrorHandler, "nestedarray");
    });

    describe('test.traverse.folders.js::traverse:fssys:traverse-cli: [Test A] Test Suite for traversing folders in main repo directory', function () {
        // it('[Test A] package.json Present', function(done){
        //     expect(200).to.equal(200);
        //     done();
        // });

        it('[Test A] Traverse file LICENSE in main directory', function (done) {
            expect(resultSingleArray.includes("LICENSE")).to.equal(true);
            expect(resultSingleRecursiveArray.includes("LICENSE")).to.equal(true);
            expect(resultNestedArray.includes("LICENSE")).to.equal(true);
            expect(resultNestedRecursiveArray.includes("LICENSE")).to.equal(true);
            done();
        });

        it('[Test A] Traverse folder ./test in main directory', function (done) {
            expect(!!resultSingleArray.includes("test")).to.equal(true);
            expect(!!resultNestedArray.includes("test")).to.equal(true);

            expect(!!resultSingleArray.find(value => /test/.test(value))).to.equal(true);
            expect(resultSingleArray.filter(value => /test/.test(value)).length).to.greaterThan(0);

            expect(!!resultNestedArray.find(value => /test/.test(value))).to.equal(true);
            expect(resultNestedArray.filter(value => /test/.test(value)).length).to.greaterThan(0);

            expect(!!resultSingleRecursiveArray.find(value => /test/.test(value))).to.equal(true);
            expect(resultSingleRecursiveArray.filter(value => /test/.test(value)).length).to.greaterThan(0);

            // expect(!!resultNestedRecursiveArray.find(value => /src\\/.test(value))).to.equal(true);
            // expect(resultNestedRecursiveArray.filter(value => /src\\/.test(value)).length).to.equal(1);
            done();
        });

        it('[Test A] Traverse folder ./src in main directory', function (done) {
            expect(resultSingleArray.includes("src")).to.equal(true);
            expect(resultNestedArray.includes("src")).to.equal(true);

            expect(!!resultSingleArray.find(value => /src/.test(value))).to.equal(true);
            expect(resultSingleArray.filter(value => /src/.test(value)).length).to.greaterThan(0);

            expect(!!resultNestedArray.find(value => /src/.test(value))).to.equal(true);
            expect(resultNestedArray.filter(value => /src/.test(value)).length).to.greaterThan(0);

            expect(!!resultSingleRecursiveArray.find(value => /src/.test(value))).to.equal(true);
            expect(resultSingleRecursiveArray.filter(value => /src/.test(value)).length).to.greaterThan(0);

            // expect(!!resultNestedRecursiveArray.find(value => /src\\/.test(value))).to.equal(true);
            // expect(resultNestedRecursiveArray.filter(value => /src\\/.test(value)).length).to.equal(1);
            done();
        });
    });

    describe('test.traverse.folders.js::traverse:fssys:traverse-cli: [Test B] Test Suite Recursive for traversing folders in subfolders of repo directory', function () {
        // it('[Test C] status', function(done){
        //     expect(200).to.equal(200);
        //     done();
        // });

        it('[Test C] Traverse folder src in subfolders of repo directory', function (done) {
            for (let i = 0; i < resultNestedRecursiveArray.length; i++) {
                if (Array.isArray(resultNestedRecursiveArray[i]) && resultNestedRecursiveArray[i][0].includes("src")) {
                    expect(!!resultNestedRecursiveArray[i].find(value => /src\\/.test(value))).to.equal(true);
                    expect(resultNestedRecursiveArray[i].filter(value => /src\\/.test(value)).length).to.greaterThan(0);
                }
            }
            done();
        });

        it('[Test C] Traverse folder test in subfolders of repo directory', function (done) {
            for (let i = 0; i < resultNestedRecursiveArray.length; i++) {
                if (Array.isArray(resultNestedRecursiveArray[i]) && resultNestedRecursiveArray[i][0].includes("test")) {
                    expect(!!resultNestedRecursiveArray[i].find(value => /test\\/.test(value))).to.equal(true);
                    expect(resultNestedRecursiveArray[i].filter(value => /test\\/.test(value)).length).to.greaterThan(0);
                }
            }
            done();
        });

        it('[Test C] Traverse folder testmocks in test subfolders of repo directory', function (done) {
            for (let i = 0; i < resultNestedRecursiveArray.length; i++) {
                if (Array.isArray(resultNestedRecursiveArray[i])) {
                    for (let j = 0; j < resultNestedRecursiveArray[i].length; j++) {
                        if (Array.isArray(resultNestedRecursiveArray[i][j]) && resultNestedRecursiveArray[i][0].includes("testmocks")) {
                            expect(!!resultNestedRecursiveArray[i][j].find(value => /test\\testmocks/.test(value))).to.equal(true);
                            expect(resultNestedRecursiveArray[i][j].filter(value => /test\\testmocks/.test(value)).length).to.equal(1);
                        }
                    }
                }
            }
            done();
        });

    });

    // describe('test.traverse.folders.js::traverse:fssys:traverse-cli: [Test C] Test Suite Negatives for traversing folders in main repo directory', function () {
    //     // it('[Test E] status', function(done){
    //     //     expect(200).to.equal(200);
    //     //     done();
    //     // });

    //     it('[Test E] Traverse file LICENSES not in subfolders of repo directory', function (done) {
    //         expect(100).to.equal(100);
    //         done();
    //     });

    //     it('[Test E] Traverse file packages.json not in subfolders of repo directory', function (done) {
    //         expect(100).to.equal(100);
    //         done();
    //     });

    //     it('[Test E] Traverse file package-locks.json not in subfolders of repo directory', function (done) {
    //         expect(100).to.equal(100);
    //         done();
    //     });

    //     it('[Test E] Traverse folder ./node_modules/.someotherthing not in subfolders of repo directory', function (done) {
    //         expect(100).to.equal(100);
    //         done();
    //     });

    //     it('[Test E] Traverse folder ./node_modules/something not in subfolders of repo directory', function (done) {
    //         expect(100).to.equal(100);
    //         done();
    //     });
    // });

});

