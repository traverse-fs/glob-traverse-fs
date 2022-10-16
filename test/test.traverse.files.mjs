/**
 * 
 * Package: 
 * Author: Ganesh B
 * Description: Nodejs npm module to traverse folder using code or cli or use glob patterns
 * Install: npm i traverse-fs, npm i fssys 
 * Github: https://github.com/ganeshkbhat/glob-traverse-fs
 * npmjs Link: 
 * File: test/test.traverse.files.mjs
 * Test for File: traverse.js
 * File Description: Test file for Traversing and searching files in a directory
 * 
*/

const expect = require('chai').expect;
const traverse = require("../src/traverse");

describe('test.traverse.files.js::traverse:fssys:traverse-cli: Test Suite for Traverse Files', function () {

    let resultSingleArray = [], resultSingleRecursiveArray = [], resultNestedArray = [], resultNestedRecursiveArray = [];
    before(async function () {
        resultSingleArray = await traverse.dir("./", false, traverse.callbacks.defaultFetch, false, traverse.callbacks.defaultErrorHandler, "flatarray");
        resultSingleRecursiveArray = await traverse.dir("./", true, traverse.callbacks.defaultFetch, false, traverse.callbacks.defaultErrorHandler, "flatarray")
        resultNestedArray = await traverse.dir("./", false, traverse.callbacks.defaultFetch, false, traverse.callbacks.defaultErrorHandler, "nestedarray");
        resultNestedRecursiveArray = await traverse.dir("./", true, traverse.callbacks.defaultFetch, false, traverse.callbacks.defaultErrorHandler, "nestedarray");
    });

    describe('test.traverse.files.js::traverse:fssys:traverse-cli: [Test A] Test Suite for traversing file in main repo directory', function () {
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

        it('[Test A] Traverse file package.json in main directory', function (done) {
            expect(resultSingleArray.includes("package.json")).to.equal(true);
            expect(resultSingleRecursiveArray.includes("package.json")).to.equal(true);
            expect(resultNestedArray.includes("package.json")).to.equal(true);
            expect(resultNestedRecursiveArray.includes("package.json")).to.equal(true);
            done();
        });

        it('[Test A] Traverse file package-lock.json in main directory', function (done) {
            expect(resultSingleArray.includes("package-lock.json")).to.equal(true);
            expect(resultSingleRecursiveArray.includes("package-lock.json")).to.equal(true);
            expect(resultNestedArray.includes("package-lock.json")).to.equal(true);
            expect(resultNestedRecursiveArray.includes("package-lock.json")).to.equal(true);
            done();
        });

        it('[Test A] Traverse file README.md in main directory', function (done) {
            expect(resultSingleArray.includes("README.md")).to.equal(true);
            expect(resultSingleRecursiveArray.includes("README.md")).to.equal(true);
            expect(resultNestedArray.includes("README.md")).to.equal(true);
            expect(resultNestedRecursiveArray.includes("README.md")).to.equal(true);
            done();
        });

        it('[Test A] Traverse file index.js in main directory', function (done) {
            expect(resultSingleArray.includes("index.js")).to.equal(true);
            expect(resultSingleRecursiveArray.includes("index.js")).to.equal(true);
            expect(resultNestedArray.includes("index.js")).to.equal(true);
            expect(resultNestedRecursiveArray.includes("index.js")).to.equal(true);
            done();
        });

    });


    describe('test.traverse.files.js::traverse:fssys:traverse-cli: [Test B] Test Suite Recursive for traversing file in subfolders of repo directory', function () {
        // it('[Test B] status', function(done){
        //     expect(200).to.equal(200);
        //     done();
        // });

        it('[Test B] Traverse files [ "src\\cli.args.js", "src\\traverse.js" ] in src subfolders of repo directory', function (done) {
            expect(100).to.equal(100);
            // [ 'src\\cli.js', 'src\\cli.args.js', 'src\\traverse.js' ],

            for (let i = 0; i < resultNestedRecursiveArray.length; i++) {
                if (Array.isArray(resultNestedRecursiveArray[i]) && resultNestedRecursiveArray[i][0].includes("src")) {

                    expect(!!resultNestedRecursiveArray[i].find(value => /cli.args.js/.test(value))).to.equal(true);
                    expect(resultNestedRecursiveArray[i].filter(value => /cli.args.js/.test(value)).length).to.equal(1);

                    expect(!!resultNestedRecursiveArray[i].find(value => /traverse.js/.test(value))).to.equal(true);
                    expect(resultNestedRecursiveArray[i].filter(value => /traverse.js/.test(value)).length).to.equal(1);
                }
            }
            done();
        });

        it('[Test B] Traverse files [ "test\\.__.template.test.traverse.js" ] in test subfolders of repo directory', function (done) {
            // [ "test\\.__.template.test.traverse.js" ]

            for (let i = 0; i < resultNestedRecursiveArray.length; i++) {
                if (Array.isArray(resultNestedRecursiveArray[i]) && resultNestedRecursiveArray[i][0].includes("test")) {
                    expect(!!resultNestedRecursiveArray[i].find(value => /template.test.traverse.js/.test(value))).to.equal(true);
                    expect(resultNestedRecursiveArray[i].filter(value => /template.test.traverse.js/.test(value)).length).to.equal(1);

                    expect(resultNestedRecursiveArray[i].filter(value => /test./.test(value)).length).to.greaterThan(2);
                    expect(resultNestedRecursiveArray[i].filter(value => /.js/.test(value)).length).to.greaterThan(2);
                }
            }
            done();
        });

        it('[Test B] Traverse files [ "test\\test.args.js", "test\\test.search.files.js"] in test subfolders of repo directory', function (done) {
            // [ "test\\test.args.js", "test\\test.search.files.js"]

            for (let i = 0; i < resultNestedRecursiveArray.length; i++) {
                if (Array.isArray(resultNestedRecursiveArray[i]) && resultNestedRecursiveArray[i][0].includes("test")) {
                    expect(!!resultNestedRecursiveArray[i].find(value => /test.args.js/.test(value))).to.equal(true);
                    expect(resultNestedRecursiveArray[i].filter(value => /test.args.js/.test(value)).length).to.equal(1);

                    expect(!!resultNestedRecursiveArray[i].find(value => /test.search.files.js/.test(value))).to.equal(true);
                    expect(resultNestedRecursiveArray[i].filter(value => /test.search.files.js/.test(value)).length).to.equal(1);
                }
            }
            done();
        });

        it('[Test B] Traverse files ["test\\test.search.filesfolders.js", "test\\test.search.folders.js", "test\\test.traverse.files.js"] in test subfolders of repo directory', function (done) {
            // ["test\\test.search.filesfolders.js", "test\\test.search.folders.js", "test\\test.traverse.files.js"]

            for (let i = 0; i < resultNestedRecursiveArray.length; i++) {
                if (Array.isArray(resultNestedRecursiveArray[i]) && resultNestedRecursiveArray[i][0].includes("test")) {
                    expect(!!resultNestedRecursiveArray[i].find(value => /test.search.filesfolders.js/.test(value))).to.equal(true);
                    expect(resultNestedRecursiveArray[i].filter(value => /test.search.filesfolders.js/.test(value)).length).to.equal(1);

                    expect(!!resultNestedRecursiveArray[i].find(value => /test.search.folders.js/.test(value))).to.equal(true);
                    expect(resultNestedRecursiveArray[i].filter(value => /test.search.folders.js/.test(value)).length).to.equal(1);

                    expect(!!resultNestedRecursiveArray[i].find(value => /test.traverse.files.js/.test(value))).to.equal(true);
                    expect(resultNestedRecursiveArray[i].filter(value => /test.traverse.files.js/.test(value)).length).to.equal(1);
                }
            }
            done();
        });

        it('[Test B] Traverse files ["test\\test.traverse.filesfolders.js", "test\\test.traverse.folders.js" ] in test subfolders of repo directory', function (done) {
            // ["test\\test.traverse.filesfolders.js", "test\\test.traverse.folders.js" ]

            for (let i = 0; i < resultNestedRecursiveArray.length; i++) {
                if (Array.isArray(resultNestedRecursiveArray[i]) && resultNestedRecursiveArray[i][0].includes("test")) {
                    expect(!!resultNestedRecursiveArray[i].find(value => /test.traverse.filesfolders.js/.test(value))).to.equal(true);
                    expect(resultNestedRecursiveArray[i].filter(value => /test.traverse.filesfolders.js/.test(value)).length).to.equal(1);

                    expect(!!resultNestedRecursiveArray[i].find(value => /test.traverse.folders.js/.test(value))).to.equal(true);
                    expect(resultNestedRecursiveArray[i].filter(value => /test.traverse.folders.js/.test(value)).length).to.equal(1);
                }
            }
            done();
        });

        it('[Test B] Traverse files in src subfolders of repo directory', function (done) {
            expect(!!resultNestedRecursiveArray.find(value => /cli.js/.test(value))).to.equal(true);
            expect(resultNestedRecursiveArray.filter(value => /cli.js/.test(value)).length).to.greaterThan(0);
            expect(!!resultNestedRecursiveArray.find(value => /cli.args.js/.test(value))).to.equal(true);
            expect(resultNestedRecursiveArray.filter(value => /cli.args.js/.test(value)).length).to.greaterThan(0);
            expect(!!resultNestedRecursiveArray.find(value => /traverse.js/.test(value))).to.equal(true);
            expect(resultNestedRecursiveArray.filter(value => /traverse.js/.test(value)).length).to.greaterThan(0);
            done();
        });

        it('[Test B] Traverse files in test in subfolders of repo directory', function (done) {
            expect(!!resultNestedRecursiveArray.find(value => /template.test.traverse.js/.test(value))).to.equal(true);
            expect(resultNestedRecursiveArray.filter(value => /template.test.traverse.js/.test(value)).length).to.greaterThan(0);
            expect(!!resultNestedRecursiveArray.find(value => /test.args.js/.test(value))).to.equal(true);
            expect(resultNestedRecursiveArray.filter(value => /test.args.js/.test(value)).length).to.greaterThan(0);
            expect(!!resultNestedRecursiveArray.find(value => /test.traverse.folders.js/.test(value))).to.equal(true);
            expect(resultNestedRecursiveArray.filter(value => /test.traverse.folders.js/.test(value)).length).to.greaterThan(0);
            expect(!!resultNestedRecursiveArray.find(value => /test.traverse.filesfolders.js/.test(value))).to.equal(true);
            expect(resultNestedRecursiveArray.filter(value => /test.traverse.filesfolders.js/.test(value)).length).to.greaterThan(0);
            done();
        });

        it('[Test C] Traverse file mock.file.for.test.js in test/testmocks subfolders of repo directory', function (done) {
            for (let i = 0; i < resultNestedRecursiveArray.length; i++) {
                if (Array.isArray(resultNestedRecursiveArray[i])) {
                    for (let j = 0; j < resultNestedRecursiveArray[i].length; j++) {
                        if (Array.isArray(resultNestedRecursiveArray[i][j]) && resultNestedRecursiveArray[i][0].includes("testmocks")) {
                            expect(!!resultNestedRecursiveArray[i][j].find(value => /mock.file.for.test.js/.test(value))).to.equal(true);
                            expect(resultNestedRecursiveArray[i][j].filter(value => /mock.file.for.test.js/.test(value)).length).to.equal(1);
                        }
                    }
                }
            }
            done();
        });
    });

    // describe('test.traverse.files.js::traverse:fssys:traverse-cli: [Test C] Test Suite Negatives for traversing file in main repo directory', function () {
    //     // it('[Test C] status', function(done){
    //     //     expect(200).to.equal(200);
    //     //     done();
    //     // });

    //     it('[Test C] Traverse file LICENSES not in subfolders of repo directory', function (done) {
    //         expect(100).to.equal(100);
    //         done();
    //     });

    //     it('[Test C] Traverse file packages.json not in subfolders of repo directory', function (done) {
    //         expect(100).to.equal(100);
    //         done();
    //     });

    //     it('[Test C] Traverse file package-locks.json not in subfolders of repo directory', function (done) {
    //         expect(100).to.equal(100);
    //         done();
    //     });

    //     it('[Test C] Traverse folder ./node_modules/.someotherthing not in subfolders of repo directory', function (done) {
    //         expect(100).to.equal(100);
    //         done();
    //     });

    //     it('[Test C] Traverse folder ./node_modules/something not in subfolders of repo directory', function (done) {
    //         expect(100).to.equal(100);
    //         done();
    //     });
    // });

});


